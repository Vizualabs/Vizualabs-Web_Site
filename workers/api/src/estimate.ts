import { generateContent, extractText } from './gemini'
import type { Env } from './lead'
import { toPlainReply } from './plainText'
import { ESTIMATE_SYSTEM_PROMPT } from './prompts'
import { sendLeadEmail } from './email'

const MAX_DESCRIPTION_LENGTH = 1500

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

function parseEstimatePayload(raw: string): EstimatePayload | null {
  const trimmed = raw.trim()
  const jsonText = trimmed.startsWith('```')
    ? trimmed.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
    : trimmed

  try {
    const data = JSON.parse(jsonText) as Record<string, unknown>
    if (data.kind === 'clarify' && typeof data.question === 'string' && data.question.trim()) {
      return { kind: 'clarify', question: toPlainReply(data.question) }
    }

    if (data.kind === 'read') {
      const complexity = data.complexity
      const levels = ['Simple', 'Moderate', 'Complex', 'Enterprise'] as const
      if (!levels.includes(complexity as (typeof levels)[number])) return null

      const considerations = Array.isArray(data.considerations)
        ? data.considerations
            .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
            .map((item) => toPlainReply(item))
            .filter(Boolean)
            .slice(0, 4)
        : []

      const complexityWhy =
        typeof data.complexityWhy === 'string' ? toPlainReply(data.complexityWhy) : ''
      const timeline = typeof data.timeline === 'string' ? toPlainReply(data.timeline) : ''
      const nextStep = typeof data.nextStep === 'string' ? toPlainReply(data.nextStep) : ''

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

export async function handleEstimate(
  env: Env,
  descriptionRaw: string,
): Promise<{ ok: true; estimate: EstimatePayload } | { ok: false; error: string }> {
  const description = descriptionRaw?.trim().slice(0, MAX_DESCRIPTION_LENGTH)
  if (!description) {
    return { ok: false, error: 'Describe your project first.' }
  }

  const apiKey = env.GEMINI_API_KEY?.trim()
  if (!apiKey) {
    return {
      ok: false,
      error:
        "The instant estimator isn't fully configured yet. Send us the details through the contact form instead and we'll get back to you.",
    }
  }

  try {
    const response = await generateContent({
      apiKey,
      contents: [{ role: 'user', parts: [{ text: description }] }],
      systemInstruction: ESTIMATE_SYSTEM_PROMPT,
      maxOutputTokens: 1024,
      responseMimeType: 'application/json',
      thinkingMinimal: true,
    })

    const text = extractText(response)
    if (!text) {
      return { ok: false, error: 'Something went wrong generating that read. Please try again.' }
    }

    const estimate = parseEstimatePayload(text)
    if (!estimate) {
      console.error('[estimate] Unexpected Gemini payload:', text.slice(0, 500))
      return { ok: false, error: 'Something went wrong generating that read. Please try again.' }
    }

    return { ok: true, estimate }
  } catch (error) {
    console.error('[estimate] Gemini request failed:', error)
    return { ok: false, error: 'Something went wrong generating that read. Please try again.' }
  }
}

export async function handleRequestBrief(
  env: Env,
  data: { name?: string; email?: string; description?: string; estimate?: string },
): Promise<{ ok: true } | { ok: false; error: string }> {
  const name = data.name?.trim()
  const email = data.email?.trim()

  if (!name) {
    return { ok: false, error: 'Please add your name.' }
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "That email address doesn't look right." }
  }

  const result = await sendLeadEmail(env, {
    name: name.slice(0, 200),
    email,
    subject: 'Instant estimate follow-up',
    message: data.description?.slice(0, 1500) || '',
    source: 'estimator',
    extra: [{ label: 'AI read given', value: data.estimate?.slice(0, 1500) || '' }],
  })

  if (!result.ok) {
    return {
      ok: false,
      error:
        result.reason === 'not_configured'
          ? "That isn't wired up yet — please email us directly instead."
          : 'Something went wrong sending that. Please try emailing us directly instead.',
    }
  }

  return { ok: true }
}
