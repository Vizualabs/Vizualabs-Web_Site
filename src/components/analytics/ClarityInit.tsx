import { useEffect } from 'react'

const PROJECT_ID = import.meta.env.VITE_CLARITY_PROJECT_ID as string | undefined

declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void
  }
}

/**
 * Loads Microsoft Clarity after first paint so heatmaps / session recordings
 * never compete with hero decode or hydration. No-op when the project ID
 * env var is unset (local/CI without analytics).
 */
export function ClarityInit() {
  useEffect(() => {
    const id = PROJECT_ID?.trim()
    if (!id || typeof window === 'undefined') return
    if (document.getElementById('microsoft-clarity')) return

    const load = () => {
      ;(function (
        c: Window,
        l: Document,
        a: string,
        r: string,
        i: string,
        t?: HTMLScriptElement,
        y?: Element
      ) {
        const w = c as Window & Record<string, { q?: unknown[] } & ((...args: unknown[]) => void)>
        w[a] =
          w[a] ||
          function (...args: unknown[]) {
            ;(w[a].q = w[a].q || []).push(args)
          }
        t = l.createElement(r) as HTMLScriptElement
        t.async = true
        t.src = 'https://www.clarity.ms/tag/' + i
        t.id = 'microsoft-clarity'
        y = l.getElementsByTagName(r)[0]
        y?.parentNode?.insertBefore(t, y)
      })(window, document, 'clarity', 'script', id)
    }

    const idleWindow = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
      cancelIdleCallback?: (handle: number) => void
    }

    if (idleWindow.requestIdleCallback) {
      const handle = idleWindow.requestIdleCallback(load, { timeout: 2500 })
      return () => idleWindow.cancelIdleCallback?.(handle)
    }

    const timeout = window.setTimeout(load, 1200)
    return () => window.clearTimeout(timeout)
  }, [])

  return null
}
