import { useEffect } from 'react'

const PROJECT_ID = (import.meta.env.VITE_CLARITY_PROJECT_ID as string | undefined)?.trim()

declare global {
  interface Window {
    clarity?: ((...args: unknown[]) => void) & { q?: unknown[] }
  }
}

/** Official Clarity bootstrap — safe to call once; no-ops if already present. */
export function injectClarity(projectId: string) {
  if (typeof window === 'undefined' || !projectId) return
  if (document.getElementById('microsoft-clarity')) return

  window.clarity =
    window.clarity ||
    function (...args: unknown[]) {
      ;(window.clarity!.q = window.clarity!.q || []).push(args)
    }

  const script = document.createElement('script')
  script.id = 'microsoft-clarity'
  script.async = true
  script.src = `https://www.clarity.ms/tag/${projectId}`
  // Always append to <head> — the stock snippet can no-op when no <script>
  // tags exist yet (common right after a SPA shell mounts).
  document.head.appendChild(script)
}

/**
 * Loads Microsoft Clarity after first paint so heatmaps / session recordings
 * never compete with hero decode. No-op when VITE_CLARITY_PROJECT_ID is unset.
 */
export function ClarityInit() {
  useEffect(() => {
    if (!PROJECT_ID) return

    // Next frame: hydration finished, still early enough for Clarity to
    // capture the visit. Avoid requestIdleCallback — Strict Mode cleanup
    // can cancel it before the tag ever runs.
    const handle = window.setTimeout(() => injectClarity(PROJECT_ID), 0)
    return () => window.clearTimeout(handle)
  }, [])

  return null
}

export const CLARITY_PROJECT_ID = PROJECT_ID
