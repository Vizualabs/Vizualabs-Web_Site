import { createServerFn } from '@tanstack/react-start'

const MAX_DESCRIPTION_LENGTH = 1500
const MODEL = 'gemini-3.6-flash'

export type EstimateRead = {
  kind: 'read'
  complexity: 'Simple' | 'Moderate' | 'Complex' | 'Enterprise'
  complexityWhy: string
  timeline: string
  considerations: string[]
  nextStep: string
}

export type EstimateClarify = {
  kind: 'clarify'
  question: string
}

export type EstimatePayload = EstimateRead | EstimateClarify

const ESTIMATE_SYSTEM_PROMPT = `You are Vizualabs' project scope assistant. Visitors describe a software idea; you return a useful instant scope read.

Respond with ONLY valid JSON (no markdown fences, no preamble). Use one of these shapes:

When the description has enough detail:
{
  "kind": "read",
  "complexity": "Simple" | "Moderate" | "Complex" | "Enterprise",
  "complexityWhy": "one clear sentence referencing what they described",
  "timeline": "realistic range like 6-10 weeks — never a single exact number",
  "considerations": ["2 to 4 short bullets on what would actually shape the build"],
  "nextStep": "one concrete small next action"
}

When the description is too vague to scope:
{
  "kind": "clarify",
  "question": "ONE specific clarifying question"
}

Rules:
- Never quote an exact price or dollar figure.
- Be specific to what they described — no generic boilerplate.
- complexityWhy, timeline, considerations, and nextStep must all feel complete and useful on their own.
- Prefer "read" whenever they named a product type plus at least one real feature or constraint.`

function parseEstimatePayload(raw: string): EstimatePayload | null {
  const trimmed = raw.trim()
  const jsonText = trimmed.startsWith('```')
    ? trimmed.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
    : trimmed

  try {
    const data = JSON.parse(jsonText) as Record<string, unknown>
    if (data.kind === 'clarify' && typeof data.question === 'string' && data.question.trim()) {
      return { kind: 'clarify', question: data.question.trim() }
    }

    if (data.kind === 'read') {
      const complexity = data.complexity
      const levels = ['Simple', 'Moderate', 'Complex', 'Enterprise'] as const
      if (!levels.includes(complexity as (typeof levels)[number])) return null

      const considerations = Array.isArray(data.considerations)
        ? data.considerations
            .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
            .map((item) => item.trim())
            .slice(0, 4)
        : []

      const complexityWhy = typeof data.complexityWhy === 'string' ? data.complexityWhy.trim() : ''
      const timeline = typeof data.timeline === 'string' ? data.timeline.trim() : ''
      const nextStep = typeof data.nextStep === 'string' ? data.nextStep.trim() : ''

      if (!complexityWhy || !timeline || !nextStep || considerations.length < 2) return null

      return {
        kind: 'read',
        complexity: complexity as EstimateRead['complexity'],
        complexityWhy,
        timeline,
        considerations,
        nextStep,
      }
    }
  } catch {
    return null
  }

  return null
}

/** Plain-text version for lead emails / follow-up payloads. */
export function formatEstimateForEmail(estimate: EstimatePayload): string {
  if (estimate.kind === 'clarify') {
    return `Clarifying question: ${estimate.question}`
  }

  return [
    `Complexity: ${estimate.complexity} — ${estimate.complexityWhy}`,
    `Timeline: ${estimate.timeline}`,
    'Key considerations:',
    ...estimate.considerations.map((item) => `- ${item}`),
    `Suggested first step: ${estimate.nextStep}`,
  ].join('\n')
}

export const estimateProject = createServerFn({ method: 'POST' })
  .validator((data: { description: string }) => data)
  .handler(async ({ data }) => {
    const description = data.description?.trim().slice(0, MAX_DESCRIPTION_LENGTH)
    if (!description) {
      return { ok: false as const, error: 'Describe your project first.' }
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return {
        ok: false as const,
        error:
          "The instant estimator isn't fully configured yet. Send us the details through the contact form instead and we'll get back to you.",
      }
    }

    const { GoogleGenAI, ThinkingLevel } = await import('@google/genai')
    const ai = new GoogleGenAI({ apiKey })

    try {
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: description,
        config: {
          systemInstruction: ESTIMATE_SYSTEM_PROMPT,
          // Gemini 3 thinking can eat the output budget and leave a truncated
          // reply — keep thinking minimal and give the JSON enough room.
          maxOutputTokens: 1024,
          thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
          responseMimeType: 'application/json',
        },
      })

      const text = response.text?.trim()
      if (!text) {
        return { ok: false as const, error: 'Something went wrong generating that read. Please try again.' }
      }

      const estimate = parseEstimatePayload(text)
      if (!estimate) {
        console.error('[assistant/estimate] Unexpected Gemini payload:', text.slice(0, 500))
        return { ok: false as const, error: 'Something went wrong generating that read. Please try again.' }
      }

      return { ok: true as const, estimate }
    } catch (error) {
      console.error('[assistant/estimate] Gemini request failed:', error)
      return {
        ok: false as const,
        error: 'Something went wrong generating that read. Please try again.',
      }
    }
  })

export const requestWrittenBrief = createServerFn({ method: 'POST' })
  .validator((data: { name: string; email: string; description: string; estimate: string }) => data)
  .handler(async ({ data }) => {
    const name = data.name?.trim()
    const email = data.email?.trim()

    if (!name) {
      return { ok: false as const, error: 'Please add your name.' }
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { ok: false as const, error: "That email address doesn't look right." }
    }

    const { sendLeadEmail } = await import('../leads')
    const result = await sendLeadEmail({
      name: name.slice(0, 200),
      email,
      subject: 'Instant estimate follow-up',
      message: data.description?.slice(0, 1500) || '',
      source: 'estimator',
      extra: [{ label: 'AI read given', value: data.estimate?.slice(0, 1500) || '' }],
    })

    if (!result.ok) {
      return {
        ok: false as const,
        error:
          result.reason === 'not_configured'
            ? "That isn't wired up yet — please email us directly instead."
            : 'Something went wrong sending that. Please try emailing us directly instead.',
      }
    }

    return { ok: true as const }
  })
