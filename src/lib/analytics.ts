/**
 * Lightweight PostHog wrapper. `posthog-js` is imported dynamically and only
 * initialized on the client once the browser is idle, so analytics never
 * competes with the hero's critical rendering path and never runs during
 * SSR. When VITE_POSTHOG_KEY isn't set, trackEvent() falls back to a dev
 * console log instead of throwing — the same graceful-degradation pattern
 * the chat assistant uses when ANTHROPIC_API_KEY is missing.
 */
import type posthogType from 'posthog-js'

let posthog: typeof posthogType | null = null
let initStarted = false

export function initAnalytics() {
  if (typeof window === 'undefined' || initStarted) return
  initStarted = true

  const key = import.meta.env.VITE_POSTHOG_KEY as string | undefined
  if (!key) {
    if (import.meta.env.DEV) {
      console.info('[analytics] VITE_POSTHOG_KEY not set — tracking disabled.')
    }
    return
  }

  void import('posthog-js').then(({ default: ph }) => {
    ph.init(key, {
      api_host: (import.meta.env.VITE_POSTHOG_HOST as string | undefined) || 'https://us.i.posthog.com',
      capture_pageview: true,
      capture_pageleave: true,
      person_profiles: 'identified_only',
    })
    posthog = ph
  })
}

export function trackEvent(name: string, props?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  if (posthog) {
    posthog.capture(name, props)
  } else if (import.meta.env.DEV) {
    console.info('[analytics]', name, props ?? {})
  }
}
