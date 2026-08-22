import '@tanstack/react-start/server-only'
import { Resend } from 'resend'
import { renderLeadEmailHtml } from './emailTemplates/leadNotification'
import type { LeadDetails, SendLeadResult } from './leadTypes'

export { escapeHtml, type LeadSource, type LeadDetails, type SendLeadResult } from './leadTypes'

// Not a secret — shown on the contact page itself. Kept as an env var so it
// can be changed without a code deploy.
// Inbox for lead notifications. With Resend sandbox (no domain verified),
// this MUST be the Resend account email. After domain verify, any inbox works.
const DEFAULT_TO_EMAIL = 'info@vizualabs.com'

// Resend's sandbox sender works immediately with just an API key — no
// domain verification needed. Swap for a verified-domain address once one
// exists (RESEND_FROM_EMAIL).
const DEFAULT_FROM_EMAIL = 'Vizualabs <onboarding@resend.dev>'

const SOURCE_LABELS: Record<LeadDetails['source'], string> = {
  contact_form: 'Contact form',
  chat_assistant: 'AI chat assistant',
  estimator: 'AI project estimator',
}

/** Shared by the contact form and the chat assistant's capture_lead tool —
 *  one pipeline, one inbox, regardless of where a lead comes from. */
export async function sendLeadEmail(lead: LeadDetails): Promise<SendLeadResult> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return { ok: false, reason: 'not_configured' }
  }

  const toEmail = process.env.LEAD_NOTIFICATION_EMAIL || DEFAULT_TO_EMAIL
  const fromEmail = process.env.RESEND_FROM_EMAIL || DEFAULT_FROM_EMAIL
  const sourceLabel = SOURCE_LABELS[lead.source]

  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send({
    from: fromEmail,
    to: toEmail,
    replyTo: lead.email,
    subject: `New inquiry (${sourceLabel}): ${lead.subject} — ${lead.name}`,
    html: renderLeadEmailHtml(lead),
  })

  if (error) {
    console.error('[Resend] sendLeadEmail failed:', error)
    return { ok: false, reason: 'send_failed' }
  }
  return { ok: true }
}
