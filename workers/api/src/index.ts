import { corsHeaders, jsonResponse, resolveAllowedOrigin } from './cors'
import { sendLeadEmail } from './email'
import { normalizeLead, validateLead, type Env, type LeadPayload } from './lead'

export type { Env }

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const origin = resolveAllowedOrigin(request, env)

    if (request.method === 'OPTIONS') {
      // Preflight: only answer for allowed origins
      if (!origin) return new Response(null, { status: 403 })
      return new Response(null, { status: 204, headers: corsHeaders(origin) })
    }

    if (url.pathname === '/health' && request.method === 'GET') {
      return jsonResponse({ ok: true, service: 'vizualabs-api' }, 200, origin)
    }

    if (url.pathname === '/submit-lead' && request.method === 'POST') {
      // Same-origin browser calls always send Origin; block unknown sites.
      if (!origin) {
        return jsonResponse({ ok: false, error: 'Origin not allowed.' }, 403, null)
      }

      let body: Partial<LeadPayload>
      try {
        body = (await request.json()) as Partial<LeadPayload>
      } catch {
        return jsonResponse({ ok: false, error: 'Invalid JSON body.' }, 400, origin)
      }

      const validationError = validateLead(body)
      if (validationError) {
        return jsonResponse({ ok: false, error: validationError }, 400, origin)
      }

      const lead = normalizeLead(body as LeadPayload)
      const result = await sendLeadEmail(env, lead)

      if (!result.ok) {
        return jsonResponse(
          {
            ok: false,
            error:
              result.reason === 'not_configured'
                ? "The contact form isn't fully configured yet. Please email us directly instead — the addresses are listed on this page."
                : 'Something went wrong sending your message. Please try emailing us directly instead.',
          },
          result.reason === 'not_configured' ? 503 : 502,
          origin,
        )
      }

      return jsonResponse({ ok: true }, 200, origin)
    }

    // Chat / estimate routes land here later.
    return jsonResponse({ ok: false, error: 'Not found.' }, 404, origin)
  },
}
