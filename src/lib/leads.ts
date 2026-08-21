import '@tanstack/react-start/server-only'
import { Resend } from 'resend'

// Not a secret — shown on the contact page itself. Kept as an env var so it
// can be changed without a code deploy.
const DEFAULT_TO_EMAIL = 'info.vizualabs@gmail.com'

// Resend's sandbox sender works immediately with just an API key — no
// domain verification needed. Swap for a verified-domain address once one
// exists (RESEND_FROM_EMAIL).
const DEFAULT_FROM_EMAIL = 'Vizualabs <onboarding@resend.dev>'

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

/** Shared by the contact form and the chat assistant's capture_lead tool —
 *  one pipeline, one inbox, regardless of where a lead comes from. */
export async function sendLeadEmail(lead: LeadDetails): Promise<SendLeadResult> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return { ok: false, reason: 'not_configured' }
  }

  const toEmail = process.env.LEAD_NOTIFICATION_EMAIL || DEFAULT_TO_EMAIL
  const fromEmail = process.env.RESEND_FROM_EMAIL || DEFAULT_FROM_EMAIL
  const sourceLabel =
    lead.source === 'chat_assistant'
      ? 'AI chat assistant'
      : lead.source === 'estimator'
        ? 'AI project estimator'
        : 'Contact form'

  const extraHtml = lead.extra?.length
    ? `<p><strong>Signals from chat:</strong></p><ul>${lead.extra
        .map((item) => `<li>${escapeHtml(item.label)}: ${escapeHtml(item.value)}</li>`)
        .join('')}</ul>`
    : ''

  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send({
    from: fromEmail,
    to: toEmail,
    replyTo: lead.email,
    subject: `New inquiry (${sourceLabel}): ${lead.subject} — ${lead.name}`,
    html: `
      <p><strong>Source:</strong> ${sourceLabel}</p>
      <p><strong>Name:</strong> ${escapeHtml(lead.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(lead.email)}</p>
      <p><strong>Subject:</strong> ${escapeHtml(lead.subject)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(lead.message).replace(/\n/g, '<br />')}</p>
      ${extraHtml}
    `,
  })

  if (error) {
    return { ok: false, reason: 'send_failed' }
  }
  return { ok: true }
}
