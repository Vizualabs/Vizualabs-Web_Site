import { getApiBaseUrl } from '../apiBase'
import {
  estimateProject,
  requestWrittenBrief,
  type EstimatePayload,
} from './estimate'

export type { EstimatePayload }

export type EstimateResult =
  | { ok: true; estimate: EstimatePayload }
  | { ok: false; error: string }

export type BriefResult = { ok: true } | { ok: false; error: string }

export async function estimateProjectClient(description: string): Promise<EstimateResult> {
  const base = getApiBaseUrl()

  if (base) {
    const res = await fetch(`${base}/estimate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description }),
    })

    try {
      return (await res.json()) as EstimateResult
    } catch {
      return { ok: false, error: 'Something went wrong generating that read. Please try again.' }
    }
  }

  return estimateProject({ data: { description } })
}

export async function requestWrittenBriefClient(data: {
  name: string
  email: string
  description: string
  estimate: string
}): Promise<BriefResult> {
  const base = getApiBaseUrl()

  if (base) {
    const res = await fetch(`${base}/request-brief`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    try {
      return (await res.json()) as BriefResult
    } catch {
      return {
        ok: false,
        error: 'Something went wrong sending that. Please try emailing us directly instead.',
      }
    }
  }

  return requestWrittenBrief({ data })
}
