export type Env = {
  RESEND_API_KEY?: string
  LEAD_NOTIFICATION_EMAIL?: string
  RESEND_FROM_EMAIL?: string
  ALLOWED_ORIGINS?: string
  GEMINI_API_KEY?: string
}

export type LeadPayload = {
  name: string
  email: string
  subject: string
  message: string
  source?: 'contact_form' | 'chat_assistant' | 'estimator'
  extra?: { label: string; value: string }[]
}

const MAX_FIELD_LENGTH = 200
const MAX_MESSAGE_LENGTH = 4000
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateLead(data: Partial<LeadPayload>): string | null {
  if (!data.name?.trim() || !data.email?.trim() || !data.message?.trim()) {
    return 'Name, email, and message are required.'
  }
  if (!EMAIL_RE.test(data.email.trim())) {
    return "That email address doesn't look right."
  }
  if (
    data.name.length > MAX_FIELD_LENGTH ||
    data.email.length > MAX_FIELD_LENGTH ||
    (data.subject?.length ?? 0) > MAX_FIELD_LENGTH
  ) {
    return 'One of the fields is too long.'
  }
  if (data.message.length > MAX_MESSAGE_LENGTH) {
    return `Message is too long (max ${MAX_MESSAGE_LENGTH} characters).`
  }
  return null
}

export function normalizeLead(data: LeadPayload): LeadPayload {
  return {
    name: data.name.trim().slice(0, MAX_FIELD_LENGTH),
    email: data.email.trim().slice(0, MAX_FIELD_LENGTH),
    subject: (data.subject ?? '').trim().slice(0, MAX_FIELD_LENGTH) || 'General inquiry',
    message: data.message.trim().slice(0, MAX_MESSAGE_LENGTH),
    source: data.source ?? 'contact_form',
    extra: data.extra,
  }
}
