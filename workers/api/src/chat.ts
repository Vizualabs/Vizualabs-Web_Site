import { sendLeadEmail } from './email'
import {
  extractFunctionCalls,
  extractText,
  generateContent,
  type GeminiContent,
} from './gemini'
import type { Env } from './lead'
import { toPlainReply } from './plainText'
import { VIZUALABS_SYSTEM_PROMPT } from './prompts'

export type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

const MAX_HISTORY = 20
const MAX_MESSAGE_LENGTH = 2000
const MAX_OUTPUT_TOKENS = 512

const FUNCTION_DECLARATIONS = [
  {
    name: 'capture_lead',
    description:
      "Record a visitor's contact details once you have both their name and email, so the Vizualabs team can follow up. Call this as soon as you have both — don't wait for the rest of the conversation to finish. Safe to call more than once if new details come up later.",
    parameters: {
      type: 'object',
      properties: {
        name: { type: 'string', description: "Visitor's name" },
        email: { type: 'string', description: "Visitor's email address" },
        project_type: {
          type: 'string',
          description: 'What kind of project or service they are interested in, in a few words',
        },
        urgency: {
          type: 'string',
          description: 'How urgent or time-sensitive their need seems, in a few words',
        },
        notes: {
          type: 'string',
          description: 'A short summary of what they need and any other context useful for the team',
        },
      },
      required: ['name', 'email'],
    },
  },
  {
    name: 'offer_booking_link',
    description:
      'Get the real scheduling link to share with the visitor when they want to book a call or strategy session, or when their intent to move forward seems high.',
    parameters: {
      type: 'object',
      properties: {},
    },
  },
]

function sanitizeHistory(messages: ChatMessage[]): ChatMessage[] {
  return messages
    .filter(
      (m) =>
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string' &&
        m.content.trim().length > 0,
    )
    .slice(-MAX_HISTORY)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_LENGTH) }))
}

function toGeminiContents(messages: ChatMessage[]): GeminiContent[] {
  return messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))
}

async function runCaptureLead(env: Env, input: Record<string, unknown>): Promise<string> {
  const name = typeof input.name === 'string' ? input.name : ''
  const email = typeof input.email === 'string' ? input.email : ''
  const projectType = typeof input.project_type === 'string' ? input.project_type : ''
  const urgency = typeof input.urgency === 'string' ? input.urgency : ''
  const notes = typeof input.notes === 'string' ? input.notes : ''

  if (!name.trim() || !email.trim()) {
    return 'Missing name or email — ask the visitor for both, then call capture_lead again.'
  }

  const extra = [
    projectType ? { label: 'Project type', value: projectType } : null,
    urgency ? { label: 'Urgency', value: urgency } : null,
  ].filter((item): item is { label: string; value: string } => item !== null)

  const result = await sendLeadEmail(env, {
    name: name.trim().slice(0, 200),
    email: email.trim().slice(0, 200),
    subject: projectType.slice(0, 200) || 'Chat inquiry',
    message: notes.slice(0, 4000) || 'No additional notes provided.',
    source: 'chat_assistant',
    extra,
  })

  return result.ok
    ? 'Lead captured and the team has been notified. Thank the visitor and let them know a founder will follow up by email.'
    : "Lead capture isn't fully wired up yet on the backend — apologize briefly and point the visitor to info@vizualabs.com so they aren't lost."
}

function runOfferBookingLink(): string {
  return 'Booking link: /book (full URL: https://vizualabs.com/book) — share this with the visitor so they can pick a time on our scheduling page.'
}

async function runTool(env: Env, name: string, args: Record<string, unknown>): Promise<string> {
  if (name === 'capture_lead') return runCaptureLead(env, args)
  if (name === 'offer_booking_link') return runOfferBookingLink()
  return 'Unknown tool.'
}

export async function handleChat(
  env: Env,
  messages: ChatMessage[],
): Promise<{ reply: string }> {
  const apiKey = env.GEMINI_API_KEY?.trim()
  if (!apiKey) {
    return {
      reply:
        "The chat assistant isn't fully configured yet. Please reach out to us directly at info@vizualabs.com and our team will get back to you.",
    }
  }

  const sanitized = sanitizeHistory(messages)
  if (sanitized.length === 0) {
    return { reply: 'How can I help you today?' }
  }

  const contents = toGeminiContents(sanitized)
  const tools = [{ functionDeclarations: FUNCTION_DECLARATIONS }]

  try {
    let response = await generateContent({
      apiKey,
      contents,
      systemInstruction: VIZUALABS_SYSTEM_PROMPT,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
      tools,
    })

    const functionCalls = extractFunctionCalls(response)
    if (functionCalls.length > 0) {
      const modelContent = response.candidates?.[0]?.content
      const functionResponseParts = []

      for (const call of functionCalls) {
        const result = await runTool(env, call.name, call.args)
        functionResponseParts.push({
          functionResponse: {
            name: call.name,
            response: { result },
          },
        })
      }

      if (modelContent && functionResponseParts.length > 0) {
        response = await generateContent({
          apiKey,
          contents: [
            ...contents,
            modelContent,
            { role: 'user', parts: functionResponseParts },
          ],
          systemInstruction: VIZUALABS_SYSTEM_PROMPT,
          maxOutputTokens: MAX_OUTPUT_TOKENS,
          tools,
        })
      }
    }

    const reply = toPlainReply(extractText(response))
    return {
      reply:
        reply ||
        "I'm not sure how to answer that — please email us at info@vizualabs.com and we'll follow up.",
    }
  } catch (error) {
    console.error('[chat] Gemini request failed:', error)
    return {
      reply:
        'Something went wrong reaching the assistant. Please try again, or email us at info@vizualabs.com.',
    }
  }
}
