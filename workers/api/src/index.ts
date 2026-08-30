import { handleChat, type ChatMessage } from './chat'
import { corsHeaders, jsonResponse, resolveAllowedOrigin } from './cors'
import { sendLeadEmail } from './email'
import { handleEstimate, handleRequestBrief } from './estimate'
import { normalizeLead, validateLead, type Env, type LeadPayload } from './lead'

export type { Env }

function requireOrigin(origin: string | null) {
  if (!origin) {
    return jsonResponse({ ok: false, error: 'Origin not allowed.' }, 403, null)
  }
  return null
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const origin = resolveAllowedOrigin(request, env)

    if (request.method === 'OPTIONS') {
      if (!origin) return new Response(null, { status: 403 })
      return new Response(null, { status: 204, headers: corsHeaders(origin) })
    }

    if (url.pathname === '/health' && request.method === 'GET') {
      return jsonResponse(
        {
          ok: true,
          service: 'vizualabs-api',
          gemini: Boolean(env.GEMINI_API_KEY?.trim()),
          resend: Boolean(env.RESEND_API_KEY?.trim()),
        },
        200,
        origin,
      )
    }

    if (url.pathname === '/submit-lead' && request.method === 'POST') {
      const blocked = requireOrigin(origin)
      if (blocked) return blocked

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

    if (url.pathname === '/chat' && request.method === 'POST') {
      const blocked = requireOrigin(origin)
      if (blocked) return blocked

      let body: { messages?: ChatMessage[] }
      try {
        body = (await request.json()) as { messages?: ChatMessage[] }
      } catch {
        return jsonResponse({ reply: 'Invalid request.' }, 400, origin)
      }

      const result = await handleChat(env, Array.isArray(body.messages) ? body.messages : [])
      return jsonResponse(result, 200, origin)
    }

    if (url.pathname === '/estimate' && request.method === 'POST') {
      const blocked = requireOrigin(origin)
      if (blocked) return blocked

      let body: { description?: string }
      try {
        body = (await request.json()) as { description?: string }
      } catch {
        return jsonResponse({ ok: false, error: 'Invalid JSON body.' }, 400, origin)
      }

      const result = await handleEstimate(env, body.description ?? '')
      return jsonResponse(result, result.ok ? 200 : 400, origin)
    }

    if (url.pathname === '/request-brief' && request.method === 'POST') {
      const blocked = requireOrigin(origin)
      if (blocked) return blocked

      let body: {
        name?: string
        email?: string
        description?: string
        estimate?: string
      }
      try {
        body = (await request.json()) as typeof body
      } catch {
        return jsonResponse({ ok: false, error: 'Invalid JSON body.' }, 400, origin)
      }

      const result = await handleRequestBrief(env, body)
      return jsonResponse(result, result.ok ? 200 : 400, origin)
    }

    return jsonResponse({ ok: false, error: 'Not found.' }, 404, origin)
  },
}
