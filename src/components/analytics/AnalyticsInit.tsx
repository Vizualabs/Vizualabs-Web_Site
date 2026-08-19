import { useEffect } from 'react'
import { initAnalytics } from '#/lib/analytics'

/**
 * Kicks off PostHog once the browser is idle (or after a short timeout on
 * engines without requestIdleCallback) so it never competes with the hero's
 * first paint. Renders nothing.
 */
export function AnalyticsInit() {
  useEffect(() => {
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void) => number
      cancelIdleCallback?: (id: number) => void
    }
    const schedule = w.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200))
    const cancel = w.cancelIdleCallback ?? window.clearTimeout
    const id = schedule(initAnalytics)
    return () => cancel(id as number)
  }, [])

  return null
}
