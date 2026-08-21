import { createServerFn } from '@tanstack/react-start'

const MAX_FIELD_LENGTH = 200
const MAX_MESSAGE_LENGTH = 4000
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type LeadFormData = {
  name: string
  email: string
  subject: string
  message: string
}

function validate(data: LeadFormData): string | null {
  if (!data.name?.trim() || !data.email?.trim() || !data.message?.trim()) {
    return 'Name, email, and message are required.'
  }
  if (!EMAIL_RE.test(data.email.trim())) {
    return 'That email address doesn\'t look right.'
  }
  if (data.name.length > MAX_FIELD_LENGTH || data.email.length > MAX_FIELD_LENGTH || data.subject.length > MAX_FIELD_LENGTH) {
    return 'One of the fields is too long.'
  }
  if (data.message.length > MAX_MESSAGE_LENGTH) {
    return `Message is too long (max ${MAX_MESSAGE_LENGTH} characters).`
  }
  return null
}

export const submitLead = createServerFn({ method: 'POST' })
  .validator((data: LeadFormData) => data)
  .handler(async ({ data }) => {
    const validationError = validate(data)
    if (validationError) {
      return { ok: false as const, error: validationError }
    }

    const { sendLeadEmail } = await import('./leads')
    const result = await sendLeadEmail({
      name: data.name.trim().slice(0, MAX_FIELD_LENGTH),
      email: data.email.trim().slice(0, MAX_FIELD_LENGTH),
      subject: data.subject.trim().slice(0, MAX_FIELD_LENGTH),
      message: data.message.trim().slice(0, MAX_MESSAGE_LENGTH),
      source: 'contact_form',
    })

    if (!result.ok) {
      return {
        ok: false as const,
        error:
          result.reason === 'not_configured'
            ? "The contact form isn't fully configured yet. Please email us directly instead — the addresses are listed on this page."
            : 'Something went wrong sending your message. Please try emailing us directly instead.',
      }
    }

    return { ok: true as const }
  })
