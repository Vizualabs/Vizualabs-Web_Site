import { createServerFn } from '@tanstack/react-start'
import Anthropic from '@anthropic-ai/sdk'
import { VIZUALABS_SYSTEM_PROMPT } from './system-prompt'

export type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

const MAX_HISTORY = 20
const MAX_MESSAGE_LENGTH = 2000

function sanitizeHistory(messages: ChatMessage[]): ChatMessage[] {
  return messages
    .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim().length > 0)
    .slice(-MAX_HISTORY)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_LENGTH) }))
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

    const client = new Anthropic({ apiKey })

    const response = await client.messages.create({
      model: 'claude-sonnet-5',
      max_tokens: 512,
      system: VIZUALABS_SYSTEM_PROMPT,
      messages,
    })

    const reply = response.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n')
      .trim()

    return {
      reply: reply || "I'm not sure how to answer that — please email us at info@vizualabs.com and we'll follow up.",
    }
  })
