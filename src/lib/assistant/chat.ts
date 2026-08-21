import { createServerFn } from '@tanstack/react-start'
import type { MessageParam, Tool, ToolResultBlockParam } from '@anthropic-ai/sdk/resources/messages'
import { VIZUALABS_SYSTEM_PROMPT } from './system-prompt'

export type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

const MAX_HISTORY = 20
const MAX_MESSAGE_LENGTH = 2000
const MODEL = 'claude-sonnet-5'
const MAX_TOKENS = 512

function sanitizeHistory(messages: ChatMessage[]): ChatMessage[] {
  return messages
    .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim().length > 0)
    .slice(-MAX_HISTORY)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_LENGTH) }))
}

// Two tools: one closes the loop on lead capture (the system prompt already
// tells Claude to ask for name and email; this gives it somewhere real to put
// the answer), the other lets it hand over the actual booking link instead
// of the visitor hunting for the CTA themselves.
const TOOLS: Tool[] = [
  {
    name: 'capture_lead',
    description:
      "Record a visitor's contact details once you have both their name and email, so the Vizualabs team can follow up. Call this as soon as you have both — don't wait for the rest of the conversation to finish. Safe to call more than once if new details come up later.",
    input_schema: {
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
    input_schema: { type: 'object', properties: {} },
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
  const calLink = process.env.VITE_CAL_LINK
  return calLink
    ? `Booking link: https://cal.com/${calLink} — share this with the visitor so they can pick a time directly.`
    : 'No booking link is configured yet — suggest the contact form or email instead, do not invent a link.'
}

async function runTool(name: string, input: unknown): Promise<string> {
  if (name === 'capture_lead') return runCaptureLead(input)
  if (name === 'offer_booking_link') return runOfferBookingLink()
  return 'Unknown tool.'
}

export const sendChatMessage = createServerFn({ method: 'POST' })
  .validator((data: { messages: ChatMessage[] }) => data)
  .handler(async ({ data }) => {
    const apiKey = process.env.ANTHROPIC_API_KEY
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

    const { default: Anthropic } = await import('@anthropic-ai/sdk')
    const client = new Anthropic({ apiKey })
    let convo: MessageParam[] = messages

    let response = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: VIZUALABS_SYSTEM_PROMPT,
      tools: TOOLS,
      messages: convo,
    })

    // Tool-use loop, capped at one extra round-trip: run whatever Claude
    // asked for, hand the results back, and let it turn those into a
    // natural reply. A single round is enough for "capture the lead, then
    // say thanks" — no risk of an open-ended loop.
    if (response.stop_reason === 'tool_use') {
      const toolResults: ToolResultBlockParam[] = []

      for (const block of response.content) {
        if (block.type !== 'tool_use') continue
        const result = await runTool(block.name, block.input)
        toolResults.push({
          type: 'tool_result',
          tool_use_id: block.id,
          content: result,
        })
      }

      convo = [
        ...convo,
        { role: 'assistant', content: response.content },
        { role: 'user', content: toolResults },
      ]

      response = await client.messages.create({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: VIZUALABS_SYSTEM_PROMPT,
        tools: TOOLS,
        messages: convo,
      })
    }

    const reply = response.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n')
      .trim()

    return {
      reply: reply || "I'm not sure how to answer that — please email us at info@vizualabs.com and we'll follow up.",
    }
  })
