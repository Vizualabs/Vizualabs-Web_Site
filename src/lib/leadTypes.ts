export function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export type LeadSource = 'contact_form' | 'chat_assistant' | 'estimator'

export type LeadDetails = {
  name: string
  email: string
  subject: string
  message: string
  source: LeadSource
  /** Extra structured signal pulled out of a chat conversation (project
   *  type, urgency, etc.) — rendered as a short list under the message. */
  extra?: { label: string; value: string }[]
}

export type SendLeadResult = { ok: true } | { ok: false; reason: 'not_configured' | 'send_failed' }
