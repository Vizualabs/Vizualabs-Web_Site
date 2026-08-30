import type { LeadPayload } from './lead'

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const SOURCE_LABELS = {
  contact_form: 'Contact form',
  chat_assistant: 'AI chat assistant',
  estimator: 'AI project estimator',
} as const

/** Compact HTML for Resend — mirrors the site lead notification template. */
export function renderLeadEmailHtml(lead: LeadPayload): string {
  const source = lead.source ?? 'contact_form'
  const sourceLabel = SOURCE_LABELS[source]
  const name = escapeHtml(lead.name)
  const email = escapeHtml(lead.email)
  const subject = escapeHtml(lead.subject)
  const message = escapeHtml(lead.message).replace(/\n/g, '<br />')
  const replyHref = `mailto:${encodeURIComponent(lead.email)}?subject=${encodeURIComponent(`Re: ${lead.subject}`)}`

  const extraRows =
    lead.extra
      ?.map(
        (item) =>
          `<tr><td style="padding:8px 0;color:#9a938a;font-size:12px;width:120px;">${escapeHtml(item.label)}</td><td style="padding:8px 0;color:#221f1c;font-size:14px;">${escapeHtml(item.value)}</td></tr>`,
      )
      .join('') ?? ''

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8" /><title>New lead — Vizualabs</title></head>
<body style="margin:0;padding:0;background:#f4f3f1;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f3f1;">
    <tr><td align="center" style="padding:40px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:16px;border:1px solid #ececea;">
        <tr><td style="padding:28px 40px 8px;">
          <p style="margin:0;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#9a938a;">New inquiry · ${sourceLabel}</p>
          <h1 style="margin:8px 0 0;font-size:21px;color:#171412;">${name} wants to talk about ${subject}</h1>
        </td></tr>
        <tr><td style="padding:16px 40px;">
          <p style="margin:0 0 8px;font-size:14px;"><strong>Email:</strong> <a href="mailto:${email}" style="color:#FF5E4D;">${email}</a></p>
          <p style="margin:0 0 8px;font-size:14px;"><strong>Subject:</strong> ${subject}</p>
          <div style="margin-top:16px;padding:16px 18px;background:#faf9f7;border-left:3px solid #FF5E4D;border-radius:8px;font-size:14px;line-height:1.65;color:#3a352f;">${message}</div>
          ${extraRows ? `<table role="presentation" width="100%" style="margin-top:16px;">${extraRows}</table>` : ''}
        </td></tr>
        <tr><td style="padding:8px 40px 28px;">
          <a href="${replyHref}" style="display:inline-block;padding:12px 26px;background:#FF5540;color:#4a0d05;font-weight:700;text-decoration:none;border-radius:999px;">Reply to ${name}</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}

export async function sendLeadEmail(
  env: {
    RESEND_API_KEY?: string
    LEAD_NOTIFICATION_EMAIL?: string
    RESEND_FROM_EMAIL?: string
  },
  lead: LeadPayload,
): Promise<{ ok: true } | { ok: false; reason: 'not_configured' | 'send_failed' }> {
  const apiKey = env.RESEND_API_KEY?.trim()
  if (!apiKey) return { ok: false, reason: 'not_configured' }

  const toEmail = env.LEAD_NOTIFICATION_EMAIL?.trim() || 'info@vizualabs.com'
  const fromEmail = env.RESEND_FROM_EMAIL?.trim() || 'Vizualabs <onboarding@resend.dev>'
  const sourceLabel = SOURCE_LABELS[lead.source ?? 'contact_form']

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: lead.email,
      subject: `New inquiry (${sourceLabel}): ${lead.subject} — ${lead.name}`,
      html: renderLeadEmailHtml(lead),
    }),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    console.error('[Resend] send failed:', res.status, body.slice(0, 500))
    return { ok: false, reason: 'send_failed' }
  }

  return { ok: true }
}
