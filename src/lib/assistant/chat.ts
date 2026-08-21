import { createServerFn } from '@tanstack/react-start'
import type { Content, FunctionDeclaration, Part } from '@google/genai'
import { VIZUALABS_SYSTEM_PROMPT } from './system-prompt'

export type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

const MAX_HISTORY = 20
const MAX_MESSAGE_LENGTH = 2000
const MODEL = 'gemini-3.6-flash'
const MAX_OUTPUT_TOKENS = 512

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

function toGeminiContents(messages: ChatMessage[]): Content[] {
  return messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))
}

// Two tools: one closes the loop on lead capture (the system prompt already
// asks for name and email; this gives the model somewhere real to put the
// answer), the other hands over the booking link instead of making the
// visitor hunt for the CTA themselves.
const FUNCTION_DECLARATIONS: FunctionDeclaration[] = [
  {
    name: 'capture_lead',
    description:
      "Record a visitor's contact details once you have both their name and email, so the Vizualabs team can follow up. Call this as soon as you have both — don't wait for the rest of the conversation to finish. Safe to call more than once if new details come up later.",
    parametersJsonSchema: {
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
    parametersJsonSchema: {
      type: 'object',
      properties: {},
    },
  },
]

async function runCaptureLead(input: unknown): Promise<string> {
  const args = input as {
    name?: string
    email?: string
    project_type?: string
    urgency?: string
    notes?: string
  }

  if (!args.name?.trim() || !args.email?.trim()) {
    return 'Missing name or email — ask the visitor for both, then call capture_lead again.'
  }

  const extra = [
    args.project_type ? { label: 'Project type', value: args.project_type } : null,
    args.urgency ? { label: 'Urgency', value: args.urgency } : null,
  ].filter((item): item is { label: string; value: string } => item !== null)

  const { sendLeadEmail } = await import('../leads')
  const result = await sendLeadEmail({
    name: args.name.trim().slice(0, 200),
    email: args.email.trim().slice(0, 200),
    subject: args.project_type?.slice(0, 200) || 'Chat inquiry',
    message: args.notes?.slice(0, 4000) || 'No additional notes provided.',
    source: 'chat_assistant',
    extra,
  })

  return result.ok
    ? 'Lead captured and the team has been notified. Thank the visitor and let them know a founder will follow up by email.'
    : "Lead capture isn't fully wired up yet on the backend — apologize briefly and point the visitor to info@vizualabs.com so they aren't lost."
}

function runOfferBookingLink(): string {
  // Prefer the on-site /book page (nav + footer, mobile-friendly) over a
  // raw cal.com URL so the visitor stays in the Vizualabs experience.
  return 'Booking link: /book (full URL: https://vizualabs.com/book) — share this with the visitor so they can pick a time on our scheduling page.'
}

async function runTool(name: string, input: unknown): Promise<string> {
  if (name === 'capture_lead') return runCaptureLead(input)
  if (name === 'offer_booking_link') return runOfferBookingLink()
  return 'Unknown tool.'
}

export const sendChatMessage = createServerFn({ method: 'POST' })
  .validator((data: { messages: ChatMessage[] }) => data)
  .handler(async ({ data }) => {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return {
        reply:
          "The chat assistant isn't fully configured yet. Please reach out to us directly at info@vizualabs.com and our team will get back to you.",
      }
    }

    const messages = sanitizeHistory(data.messages)
    if (messages.length === 0) {
      return { reply: 'How can I help you today?' }
    }

    const { GoogleGenAI } = await import('@google/genai')
    const ai = new GoogleGenAI({ apiKey })
    const contents = toGeminiContents(messages)

    const generate = (nextContents: Content[]) =>
      ai.models.generateContent({
        model: MODEL,
        contents: nextContents,
        config: {
          systemInstruction: VIZUALABS_SYSTEM_PROMPT,
          maxOutputTokens: MAX_OUTPUT_TOKENS,
          tools: [{ functionDeclarations: FUNCTION_DECLARATIONS }],
          // Handle tools ourselves so we keep the one-round cap (same behavior
          // as the previous Anthropic loop — no open-ended AFC).
          automaticFunctionCalling: { disable: true },
        },
      })

    try {
      let response = await generate(contents)

      const functionCalls = response.functionCalls
      if (functionCalls?.length) {
        const modelContent = response.candidates?.[0]?.content
        const functionResponseParts: Part[] = []

        for (const call of functionCalls) {
          if (!call.name) continue
          const result = await runTool(call.name, call.args ?? {})
          functionResponseParts.push({
            functionResponse: {
              id: call.id,
              name: call.name,
              response: { result },
            },
          })
        }

        if (modelContent && functionResponseParts.length > 0) {
          response = await generate([
            ...contents,
            modelContent,
            { role: 'user', parts: functionResponseParts },
          ])
        }
      }

      const reply = response.text?.trim()

      return {
        reply:
          reply ||
          "I'm not sure how to answer that — please email us at info@vizualabs.com and we'll follow up.",
      }
    } catch (error) {
      console.error('[assistant/chat] Gemini request failed:', error)
      return {
        reply:
          "Something went wrong reaching the assistant. Please try again, or email us at info@vizualabs.com.",
      }
    }
  })
