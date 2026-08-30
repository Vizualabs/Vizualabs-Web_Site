import { getApiBaseUrl } from './apiBase'
import { submitLead, type LeadFormData } from './submitLead'

export type SubmitLeadResult =
  | { ok: true }
  | { ok: false; error: string }

/**
 * Contact form entry point:
 * - With `VITE_API_BASE_URL` → Cloudflare Worker `/submit-lead` (Hostinger static)
 * - Without → TanStack `createServerFn` (local `bun run dev`)
 */
export async function submitLeadClient(data: LeadFormData): Promise<SubmitLeadResult> {
  const base = getApiBaseUrl()

  if (base) {
    const res = await fetch(`${base}/submit-lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    let payload: SubmitLeadResult | null = null
    try {
      payload = (await res.json()) as SubmitLeadResult
    } catch {
      payload = null
    }

    if (payload && typeof payload === 'object' && 'ok' in payload) {
      return payload
    }

    return {
      ok: false,
      error: 'Something went wrong sending your message. Please try emailing us directly instead.',
    }
  }

  return submitLead({ data })
}
