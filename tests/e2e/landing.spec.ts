import { expect, test } from '@playwright/test'
import {
  bootLanding,
  instrument,
  longTasksBetween,
  nowInPage,
  scrollBurst,
  waitForIntroComplete,
} from './helpers'

/**
 * Budgets.
 *
 * Measured on the production build at 1280x800 in headless Chromium. The
 * scroll-path numbers are taken with the Blaze fire isolated out — see
 * `isolateFire` for why — and sit far under these limits (~8ms blocked per
 * second, worst task ~83ms), so the headroom absorbs host noise while still
 * catching a real regression in the decode/scroll pipeline.
 */
const BUDGET = {
  worstLongTaskMs: 250,
  blockingPerSecondMs: 150,
  lcpMs: 2500,
}

test.beforeEach(async ({ page }) => {
  await instrument(page)
})

test.describe('branded loading screen', () => {
  test('plays a branded intro that transitions into the landing page', async ({
    page,
  }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    const intro = page.getByTestId('brand-intro')
    await expect(intro).toBeVisible()

    // Branded: the drawn V mark and the wordmark are both on screen.
    await expect(intro.locator('.brand-intro-v')).toBeAttached()
    await expect(intro.locator('.brand-intro-letter')).toHaveCount(9)

    // It animates rather than sitting static — the mark draws itself in.
    const dashEarly = await intro
      .locator('.brand-intro-v')
      .evaluate((el) => getComputedStyle(el).strokeDashoffset)
    await page.waitForTimeout(400)
    const dashLater = await intro
      .locator('.brand-intro-v')
      .evaluate((el) => getComputedStyle(el).strokeDashoffset)
    expect(dashEarly).not.toBe(dashLater)

    await waitForIntroComplete(page)

    // The recorded phase sequence proves it went through the reveal rather
    // than simply disappearing.
    const phases = await page.evaluate(() => window.__introPhases ?? [])
    expect(phases[0]).toBe('intro')
    expect(phases).toContain('revealing')
    expect(phases.indexOf('revealing')).toBeGreaterThan(phases.indexOf('intro'))

    // ...and it handed off to a live hero.
    await expect(page.getByTestId('hero-canvas')).toBeVisible()
  })

  test('never shows a percentage readout or a progress bar', async ({
    page,
  }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await waitForIntroComplete(page)

    // Every distinct string the overlay displayed over its whole lifetime.
    const texts = await page.evaluate(() => window.__introTexts ?? [])
    expect(texts.length).toBeGreaterThan(0)
    for (const text of texts) {
      expect(text).not.toMatch(/%|\bpercent\b|\bloading\s*\d/i)
      expect(text).not.toMatch(/\b\d{1,3}\s*\/\s*\d{1,3}\b/)
    }

    // No progress semantics in the DOM at any point either.
    await expect(page.locator('progress')).toHaveCount(0)
    await expect(page.locator('[role="progressbar"]')).toHaveCount(0)
  })

  test('locks scroll while the overlay is opaque, then releases it', async ({
    page,
  }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await expect(page.getByTestId('brand-intro')).toBeVisible()

    expect(
      await page.evaluate(() => getComputedStyle(document.body).overflowY)
    ).toBe('hidden')

    await waitForIntroComplete(page)

    expect(
      await page.evaluate(() => getComputedStyle(document.body).overflowY)
    ).not.toBe('hidden')

    await scrollBurst(page, 4, 200)
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0)
  })
})

test.describe('initial-load scroll performance', () => {
  test('first scroll after load does not block the main thread', async ({
    page,
  }) => {
    await bootLanding(page, { withoutFire: true })

    // Let anything queued from load drain so the window measures scrolling only.
    await page.waitForTimeout(800)

    const from = await nowInPage(page)
    await scrollBurst(page, 16, 180)
    const to = await nowInPage(page)

    const stats = await longTasksBetween(page, from, to)
    // eslint-disable-next-line no-console
    console.log(
      `[first scroll] n=${stats.count} worst=${stats.worst.toFixed(0)}ms ` +
        `tbt=${stats.totalBlocking.toFixed(0)}ms (${stats.blockingPerSecond.toFixed(0)}ms/s)`
    )

    expect(stats.worst).toBeLessThan(BUDGET.worstLongTaskMs)
    expect(stats.blockingPerSecond).toBeLessThan(BUDGET.blockingPerSecondMs)
  })

  test('scroll position advances immediately on the first interaction', async ({
    page,
  }) => {
    await bootLanding(page, { withoutFire: true })

    const before = await page.evaluate(() => window.scrollY)
    await scrollBurst(page, 8, 200)
    const after = await page.evaluate(() => window.scrollY)

    // A stalled or locked first scroll is the user-visible symptom of the bug.
    expect(after).toBeGreaterThan(before + 500)
  })

  test('decodes hero frames off the main thread', async ({ page }) => {
    // The decode pipeline fetches Blobs and hands them to createImageBitmap;
    // it must never route frames through an HTMLImageElement, whose decode is
    // charged to the main thread and lands mid-scroll.
    const imageElementRequests: string[] = []
    page.on('request', (req) => {
      if (req.resourceType() === 'image' && req.url().includes('/Frist-opt/')) {
        imageElementRequests.push(req.url())
      }
    })

    await bootLanding(page)

    // Only the six <link rel=preload as=image> hints may use the image path;
    // every other frame must arrive as a fetch.
    expect(imageElementRequests.length).toBeLessThanOrEqual(6)
  })
})

test.describe('hero scroll effect (regression)', () => {
  test('keeps its 350vh scroll track and sticky pinning', async ({ page }) => {
    await bootLanding(page, { withoutFire: true })

    const container = page.getByTestId('hero-scroll-container')
    const { containerHeight, viewportHeight, stickyPosition } =
      await container.evaluate((el) => ({
        containerHeight: el.getBoundingClientRect().height,
        viewportHeight: window.innerHeight,
        stickyPosition: getComputedStyle(el.firstElementChild as Element)
          .position,
      }))

    expect(containerHeight).toBeCloseTo(viewportHeight * 3.5, -1)
    expect(stickyPosition).toBe('sticky')
  })

  test('advances the image sequence as the user scrolls', async ({ page }) => {
    await bootLanding(page, { withoutFire: true })

    const canvas = page.getByTestId('hero-canvas')
    await page.waitForTimeout(2500) // let the sequence finish streaming

    const frameAt = async (y: number) => {
      await page.evaluate((v) => window.scrollTo(0, v), y)
      await page.waitForTimeout(350)
      return canvas.screenshot()
    }

    const atStart = await frameAt(0)
    const atQuarter = await frameAt(700)
    const atHalf = await frameAt(1400)

    expect(Buffer.compare(atStart, atQuarter)).not.toBe(0)
    expect(Buffer.compare(atQuarter, atHalf)).not.toBe(0)
    expect(atStart.byteLength).toBeGreaterThan(5_000)
  })

  test('still mounts the Blaze fire over the hero', async ({ page }) => {
    // Guards the isolation the perf tests rely on: if the fire ever stopped
    // mounting, those tests would silently pass against a simpler page.
    await bootLanding(page)

    const canvasCount = await page.evaluate(
      () => document.querySelectorAll('canvas').length
    )
    expect(canvasCount).toBeGreaterThan(1)
  })
})

test.describe('load performance', () => {
  test('reaches Largest Contentful Paint within budget', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' })
    await waitForIntroComplete(page)

    const lcp = await page.evaluate(() => window.__lcp ?? 0)
    // eslint-disable-next-line no-console
    console.log(`[lcp] ${lcp.toFixed(0)}ms`)

    expect(lcp).toBeGreaterThan(0)
    expect(lcp).toBeLessThan(BUDGET.lcpMs)
  })

  test('never requests the retired full-size JPG masters', async ({ page }) => {
    const jpgRequests: string[] = []
    page.on('request', (req) => {
      if (/\/Frist\/|\.jpe?g(\?|$)/i.test(req.url())) jpgRequests.push(req.url())
    })

    await bootLanding(page)
    expect(jpgRequests).toEqual([])
  })

  test('requests only the font families the page actually paints', async ({
    page,
  }) => {
    const fontCss: string[] = []
    page.on('request', (req) => {
      if (req.url().includes('fonts.googleapis.com/css')) fontCss.push(req.url())
    })

    await bootLanding(page)

    const joined = fontCss.join(' ')
    expect(joined).not.toContain('Plus+Jakarta+Sans')
    expect(joined).not.toContain('Space+Grotesk')
    expect(joined).toContain('Poppins')
  })

  test('preloads the opening hero frames from the document head', async ({
    page,
  }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    const preloads = await page.evaluate(() =>
      [...document.querySelectorAll('link[rel="preload"][as="image"]')].map(
        (l) => l.getAttribute('href')
      )
    )

    expect(preloads.length).toBeGreaterThanOrEqual(4)
    expect(preloads[0]).toContain('ezgif-frame-001.webp')
  })
})
