import { escapeHtml, type LeadDetails, type LeadSource } from '../leadTypes'

const FONT_STACK =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

const SOURCE_LABELS: Record<LeadSource, string> = {
  contact_form: 'Contact form',
  chat_assistant: 'AI chat assistant',
  estimator: 'AI project estimator',
}

function renderExtraRows(extra: LeadDetails['extra']): string {
  if (!extra?.length) return ''
  const rows = extra
    .map(
      (item) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f0ede9;font-family:${FONT_STACK};font-size:12px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;color:#9a938a;width:130px;vertical-align:top;">
            ${escapeHtml(item.label)}
          </td>
          <td style="padding:10px 0;border-bottom:1px solid #f0ede9;font-family:${FONT_STACK};font-size:14px;line-height:1.5;color:#221f1c;vertical-align:top;">
            ${escapeHtml(item.value)}
          </td>
        </tr>`
    )
    .join('')

  return `
    <tr>
      <td class="stack-padding" style="padding:22px 40px 4px 40px;">
        <p style="margin:0 0 4px 0;font-family:${FONT_STACK};font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#9a938a;">
          Signals from the conversation
        </p>
        <table role="presentation" class="field-table" width="100%" cellpadding="0" cellspacing="0">
          ${rows}
        </table>
      </td>
    </tr>`
}

/**
 * Table-based, fully inline-styled HTML for the internal "new lead" email —
 * built to survive Gmail/Outlook/Apple Mail's CSS stripping, not just
 * modern browsers. Every value is escaped; nothing here trusts the sender.
 */
export function renderLeadEmailHtml(lead: LeadDetails): string {
  const sourceLabel = SOURCE_LABELS[lead.source]
  const name = escapeHtml(lead.name)
  const email = escapeHtml(lead.email)
  const subject = escapeHtml(lead.subject)
  const message = escapeHtml(lead.message).replace(/\n/g, '<br />')
  const replyHref = `mailto:${encodeURIComponent(lead.email)}?subject=${encodeURIComponent(`Re: ${lead.subject}`)}`

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<title>New lead — Vizualabs</title>
<!--[if mso]>
<style>table {border-collapse:collapse;} .fallback-font {font-family: Arial, sans-serif !important;}</style>
<![endif]-->
<style>
  body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
  table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
  body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; }
  @media screen and (max-width: 600px) {
    .email-container { width: 100% !important; }
    .stack-padding { padding-left: 24px !important; padding-right: 24px !important; }
    .field-table td { display: block !important; width: 100% !important; padding-bottom: 2px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background-color:#f4f3f1;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;font-size:1px;line-height:1px;color:#f4f3f1;">
    New inquiry from ${name} via the Vizualabs ${sourceLabel.toLowerCase()}.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f3f1;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" class="email-container" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background-color:#ffffff;border-radius:16px;border:1px solid #ececea;">

          <!-- Header -->
          <tr>
            <td class="stack-padding" style="padding:32px 40px 24px 40px;border-bottom:1px solid #f0ede9;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-family:${FONT_STACK};font-size:18px;font-weight:800;color:#171412;letter-spacing:-0.02em;">
                    Vizualabs
                  </td>
                  <td align="right">
                    <span style="display:inline-block;font-family:${FONT_STACK};font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#FF5E4D;background-color:#fdece9;padding:6px 12px;border-radius:20px;">
                      New Lead
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Title -->
          <tr>
            <td class="stack-padding" style="padding:28px 40px 4px 40px;">
              <p style="margin:0;font-family:${FONT_STACK};font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#9a938a;">
                New inquiry &middot; ${sourceLabel}
              </p>
              <h1 style="margin:8px 0 0 0;font-family:${FONT_STACK};font-size:21px;font-weight:700;line-height:1.3;color:#171412;">
                ${name} wants to talk about ${subject}
              </h1>
            </td>
          </tr>

          <!-- Fields -->
          <tr>
            <td class="stack-padding" style="padding:20px 40px 4px 40px;">
              <table role="presentation" class="field-table" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid #f0ede9;font-family:${FONT_STACK};font-size:12px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;color:#9a938a;width:130px;vertical-align:top;">
                    Name
                  </td>
                  <td style="padding:12px 0;border-bottom:1px solid #f0ede9;font-family:${FONT_STACK};font-size:14px;color:#171412;vertical-align:top;">
                    ${name}
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid #f0ede9;font-family:${FONT_STACK};font-size:12px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;color:#9a938a;width:130px;vertical-align:top;">
                    Email
                  </td>
                  <td style="padding:12px 0;border-bottom:1px solid #f0ede9;font-family:${FONT_STACK};font-size:14px;vertical-align:top;">
                    <a href="mailto:${email}" style="color:#FF5E4D;text-decoration:none;font-weight:600;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0;font-family:${FONT_STACK};font-size:12px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;color:#9a938a;width:130px;vertical-align:top;">
                    Subject
                  </td>
                  <td style="padding:12px 0;font-family:${FONT_STACK};font-size:14px;color:#171412;vertical-align:top;">
                    ${subject}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td class="stack-padding" style="padding:24px 40px 4px 40px;">
              <p style="margin:0 0 10px 0;font-family:${FONT_STACK};font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#9a938a;">
                Message
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#faf9f7;border-radius:8px;">
                <tr>
                  <td style="padding:18px 20px;border-left:3px solid #FF5E4D;border-radius:8px;font-family:${FONT_STACK};font-size:14px;line-height:1.65;color:#3a352f;">
                    ${message}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          ${renderExtraRows(lead.extra)}

          <!-- CTA -->
          <tr>
            <td class="stack-padding" style="padding:28px 40px 8px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-radius:999px;background-color:#FF5540;">
                    <a href="${replyHref}" style="display:inline-block;padding:12px 26px;font-family:${FONT_STACK};font-size:14px;font-weight:700;color:#4a0d05;text-decoration:none;border-radius:999px;">
                      Reply to ${name}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="stack-padding" style="padding:24px 40px 32px 40px;border-top:1px solid #f0ede9;margin-top:8px;">
              <p style="margin:0;font-family:${FONT_STACK};font-size:12px;line-height:1.6;color:#a39c93;">
                Sent automatically by the Vizualabs lead pipeline. This inbox is reply-to'd directly to ${email} — replying here reaches ${name}.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
