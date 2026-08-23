import { expect, type Page } from '@playwright/test'

declare global {
  interface Window {
    __longTasks?: { start: number; dur: number }[]
    __lcp?: number
    __introPhases?: string[]
    __introTexts?: string[]
    __blackHoleFrames?: number
  }
}

/**
 * Install observers before any page script runs.
 *
 * The intro sampler records every phase and every string the overlay ever
 * displays, so assertions about a transient overlay never have to race it or
 * touch a detached element.
 */
export async function instrument(page: Page) {
  await page.addInitScript(() => {
    window.__longTasks = []
    window.__lcp = 0
    window.__introPhases = []
    window.__introTexts = []

    try {
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          window.__longTasks!.push({ start: e.startTime, dur: e.duration })
        }
      }).observe({ type: 'longtask', buffered: true })
    } catch {
      /* longtask unsupported */
    }

    try {
      new PerformanceObserver((list) => {
        const last = list.getEntries().at(-1)
        if (last) window.__lcp = last.startTime
      }).observe({ type: 'largest-contentful-paint', buffered: true })
    } catch {
      /* LCP unsupported */
    }

    const sample = () => {
      const el = document.querySelector('[data-testid="brand-intro"]')
      if (!el) return
      const phase = el.getAttribute('data-phase') ?? ''
      if (window.__introPhases!.at(-1) !== phase) {
        window.__introPhases!.push(phase)
      }
      const text = el.textContent ?? ''
      if (window.__introTexts!.at(-1) !== text) {
        window.__introTexts!.push(text)
      }
    }
    sample()
    const timer = setInterval(sample, 40)
    setTimeout(() => clearInterval(timer), 30_000)
  })
}

/** Wait until the branded intro has fully unmounted and the hero is live. */
export async function waitForIntroComplete(page: Page) {
  await page.waitForFunction(
    () => !document.querySelector('[data-testid="brand-intro"]'),
    undefined,
    { timeout: 30_000 }
  )
}

/**
 * Remove the Blaze fire's canvases, leaving the hero image-sequence canvas.
 *
 * The fire is an unconditionally-animating WebGL layer that does a synchronous
 * GPU readback every frame. Under headless software GL that alone pins the main
 * thread (~570ms blocked per second while completely idle), which would swamp
 * any measurement of the scroll pipeline. Blaze renders its children as normal
 * DOM here (html-in-canvas is unsupported in this engine), so the hero canvas
 * is an independent sibling and keeps rendering and advancing without it.
 */
export async function isolateFire(page: Page) {
  await page.evaluate(() => {
    document.querySelectorAll('canvas').forEach((c) => {
      if ((c as HTMLCanvasElement).dataset.testid !== 'hero-canvas') c.remove()
    })
  })
  await page.waitForTimeout(400)
}

/** Load the landing page and wait for the intro to hand off to the hero. */
export async function bootLanding(
  page: Page,
  { withoutFire = false }: { withoutFire?: boolean } = {}
) {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await waitForIntroComplete(page)
  await expect(page.getByTestId('hero-canvas')).toBeVisible()
  if (withoutFire) await isolateFire(page)
}

export const nowInPage = (page: Page) => page.evaluate(() => performance.now())

export async function longTasksBetween(page: Page, from: number, to: number) {
  const all = await page.evaluate(() => window.__longTasks ?? [])
  const tasks = all.filter((t) => t.start >= from && t.start <= to)
  const totalBlocking = tasks.reduce((s, t) => s + Math.max(0, t.dur - 50), 0)
  return {
    count: tasks.length,
    worst: tasks.length ? Math.max(...tasks.map((t) => t.dur)) : 0,
    totalBlocking,
    blockingPerSecond: (totalBlocking / Math.max(1, to - from)) * 1000,
  }
}

/** Drive a realistic scroll burst, letting each step settle into its own frame. */
export async function scrollBurst(page: Page, steps = 16, deltaY = 180) {
  await page.mouse.move(640, 400)
  for (let i = 0; i < steps; i++) {
    await page.mouse.wheel(0, deltaY)
    await page.waitForTimeout(90)
  }
}
