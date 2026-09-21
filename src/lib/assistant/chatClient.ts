import { getApiBaseUrl } from '../apiBase'
import { sendChatMessage, type ChatMessage } from './chat'

export type { ChatMessage }

export async function sendChatMessageClient(messages: ChatMessage[]): Promise<{ reply: string }> {
  const base = getApiBaseUrl()

  if (base) {
    const res = await fetch(`${base}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    })

    try {
      const payload = (await res.json()) as { reply?: string }
      if (typeof payload.reply === 'string') {
        return { reply: payload.reply }
      }
    } catch {
      // fall through
    }

    return {
      reply:
        'Something went wrong reaching the assistant. Please try again, or email us at info@vizualabs.com.',
    }
  }

  return sendChatMessage({ data: { messages } })
}
