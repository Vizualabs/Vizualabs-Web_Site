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

    // Branded: the coral core orb and the wordmark are both on screen.
    await expect(intro.locator('.brand-intro-core')).toBeAttached()
    await expect(intro.locator('.brand-intro-wordmark')).toHaveText('VIZUALABS')

    // It animates rather than sitting static — the accretion rings spin continuously.
    const rotateEarly = await intro
      .locator('.brand-intro-ring-1')
      .evaluate((el) => getComputedStyle(el).transform)
    await page.waitForTimeout(400)
    const rotateLater = await intro
      .locator('.brand-intro-ring-1')
      .evaluate((el) => getComputedStyle(el).transform)
    expect(rotateEarly).not.toBe(rotateLater)

    await waitForIntroComplete(page)

    // The loader stays opaque for warmup, then disappears directly. A third
    // reveal phase would reintroduce the unwanted black transition layer.
    const phases = await page.evaluate(() => window.__introPhases ?? [])
    expect(phases[0]).toBe('intro')
    expect(phases).toContain('warmup')
    expect(phases).not.toContain('revealing')

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

    // The lock is applied synchronously on hydration (useLayoutEffect); poll
    // until it engages since hydration can lag behind DOMContentLoaded.
    await expect
      .poll(() =>
        page.evaluate(() => getComputedStyle(document.body).overflowY)
      )
      .toBe('hidden')

    await waitForIntroComplete(page)

    await expect
      .poll(() =>
        page.evaluate(() => getComputedStyle(document.body).overflowY)
      )
      .not.toBe('hidden')

    await scrollBurst(page, 4, 200)
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0)
  })

  test('hands off directly to a clean hero without a black reveal layer', async ({
    page,
  }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    await waitForIntroComplete(page)

    const phases = await page.evaluate(() => window.__introPhases ?? [])
    expect(phases).toContain('warmup')
    expect(phases).not.toContain('revealing')
    await expect(page.locator('.brand-intro-wipe')).toHaveCount(0)
    await expect(page.getByTestId('hero-canvas')).toBeVisible()

    const fire = page.getByTestId('blaze-effect-canvas')
    await expect(fire).toHaveCSS('opacity', '1')
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

    // Only the four opening-frame preload hints may use the image path;
    // every other frame must arrive as a fetch.
    expect(imageElementRequests.length).toBeLessThanOrEqual(4)
  })

  test('moves hero pixel cleanup into a dedicated worker', async ({ page }) => {
    const workerUrls: string[] = []
    page.on('worker', (worker) => workerUrls.push(worker.url()))

    await page.addInitScript(() => {
      window.__mainThreadCanvasReadbacks = 0
      const original = CanvasRenderingContext2D.prototype.getImageData
      CanvasRenderingContext2D.prototype.getImageData = function (
        this: CanvasRenderingContext2D,
        ...args: Parameters<typeof original>
      ) {
        window.__mainThreadCanvasReadbacks!++
        return original.apply(this, args)
      }
    })

    await bootLanding(page, { withoutFire: true })

    await expect
      .poll(() => workerUrls.some((url) => url.includes('heroFrameWorker')))
      .toBe(true)
    expect(await page.evaluate(() => window.__mainThreadCanvasReadbacks)).toBe(0)
  })
})

test.describe('hero scroll effect (regression)', () => {
  test('keeps its scroll track and sticky pinning', async ({ page }) => {
    await bootLanding(page, { withoutFire: true })

    const container = page.getByTestId('hero-scroll-container')
    const { containerHeight, viewportHeight, stickyPosition } =
      await container.evaluate((el) => ({
        containerHeight: el.getBoundingClientRect().height,
        viewportHeight: window.innerHeight,
        stickyPosition: getComputedStyle(el.firstElementChild as Element)
          .position,
      }))

    // Desktop track is 105dvh (a touch past one viewport for the turn) and
    // mobile is 220dvh; this suite runs at 1280x800, so the desktop value wins.
    expect(containerHeight).toBeCloseTo(viewportHeight * 1.05, -1)
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

test.describe('hero heading', () => {
  test('renders both lines with the accent word intact', async ({ page }) => {
    await bootLanding(page, { withoutFire: true })

    const title = page.getByTestId('hero-title')
    await expect(title.locator('.hero-title-accent').first()).toHaveText('Digital')
    await expect(title.locator('.hero-title-accent')).toHaveCount(12)

    // Exactly two lines — a third would fall entirely behind the subject.
    await expect(title.locator('.hero-title-line')).toHaveCount(2)
  })

  test('keeps the long line unwrapped at every breakpoint', async ({ page }) => {
    for (const [w, h] of [
      [390, 844],
      [768, 1024],
      [1280, 800],
      [1440, 900],
      [1920, 1080],
    ] as const) {
      await page.setViewportSize({ width: w, height: h })
      await bootLanding(page, { withoutFire: true })

      const lineHeights = await page
        .getByTestId('hero-title')
        .locator('.hero-title-line')
        .evaluateAll((els) => els.map((el) => el.getBoundingClientRect().height))

      // If "Your Digital Success" wrapped, its box would be ~2x line one's.
      expect(lineHeights).toHaveLength(2)
      expect(lineHeights[1]).toBeLessThan(lineHeights[0] * 1.6)
    }
  })

  test('is layered underneath the image sequence', async ({ page }) => {
    await bootLanding(page, { withoutFire: true })

    const layering = await page.evaluate(() => {
      const title = document.querySelector('[data-testid="hero-title"]')!
      const canvas = document.querySelector('[data-testid="hero-canvas"]')!
      return {
        // Node.DOCUMENT_POSITION_FOLLOWING === 4
        titleBeforeCanvas: !!(
          title.compareDocumentPosition(canvas) & 4
        ),
        sameParent: title.parentElement === canvas.parentElement,
        titleZ: getComputedStyle(title).zIndex,
        canvasZ: getComputedStyle(canvas).zIndex,
      }
    })

    // Paint order is DOM order here: the canvas follows the heading, and
    // neither sets a z-index, which is what keeps the Blaze fire on top.
    expect(layering.sameParent).toBe(true)
    expect(layering.titleBeforeCanvas).toBe(true)
    expect(layering.titleZ).toBe('auto')
    expect(layering.canvasZ).toBe('auto')
  })

  test('cuts the subject out in canvas space, not via a CSS mask', async ({
    page,
  }) => {
    // The silhouette used to be a CSS mask-image layer; it is now composited
    // in-canvas with destination-in so the matte cannot drift on mobile. The
    // canvas must carry no CSS mask, and the mask asset must still be fetched.
    const maskRequests: string[] = []
    page.on('request', (req) => {
      if (req.url().includes('hero-subject-mask')) maskRequests.push(req.url())
    })

    await bootLanding(page, { withoutFire: true })

    const cssMask = await page.evaluate(() => {
      const canvas = document.querySelector(
        '[data-testid="hero-canvas"]'
      ) as HTMLCanvasElement
      const cs = getComputedStyle(canvas)
      return cs.maskImage || cs.webkitMaskImage
    })
    expect(cssMask).toBe('none')

    await expect.poll(() => maskRequests.length).toBeGreaterThan(0)
  })

  test('does not paint a black smudge over the hair', async ({ page }) => {
    await bootLanding(page, { withoutFire: true })

    const sample = async () =>
      page.evaluate(() => {
        const canvas = document.querySelector(
          '[data-testid="hero-canvas"]'
        ) as HTMLCanvasElement
        const ctx = canvas.getContext('2d')
        if (!ctx || canvas.width < 8 || canvas.height < 8) {
          return { ready: false, opaqueBlack: 0, opaqueLit: 0, hoodieBlack: 0 }
        }

        const dpr = canvas.width / window.innerWidth
        const SOURCE_WIDTH = 1280
        const CROPPED_SOURCE_HEIGHT = 1813
        const width = window.innerWidth
        const height = window.innerHeight
        const isMobile = width < 768
        let scale =
          (isMobile ? height * 0.7 : height * 0.86) / CROPPED_SOURCE_HEIGHT
        if (isMobile) scale = Math.max(scale, (width * 0.84) / SOURCE_WIDTH)
        const renderW = SOURCE_WIDTH * scale
        const renderH = CROPPED_SOURCE_HEIGHT * scale
        const offsetX = (width - renderW) / 2
        const offsetY = height - renderH

        const count = (
          x0css: number,
          y0css: number,
          x1css: number,
          y1css: number
        ) => {
          const x0 = Math.max(0, Math.round(x0css * dpr))
          const y0 = Math.max(0, Math.round(y0css * dpr))
          const x1 = Math.min(canvas.width, Math.round(x1css * dpr))
          const y1 = Math.min(canvas.height, Math.round(y1css * dpr))
          const w = Math.max(1, x1 - x0)
          const h = Math.max(1, y1 - y0)
          const data = ctx.getImageData(x0, y0, w, h).data
          let opaqueBlack = 0
          let opaqueLit = 0
          for (let i = 0; i < data.length; i += 4) {
            if (data[i + 3] < 24) continue
            const r = data[i]
            const g = data[i + 1]
            const b = data[i + 2]
            const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
            const chroma = Math.max(r, g, b) - Math.min(r, g, b)
            if (lum <= 14 && chroma <= 8) opaqueBlack++
            else opaqueLit++
          }
          return { opaqueBlack, opaqueLit }
        }

        const aboveHair = count(
          offsetX + renderW * 0.38,
          offsetY + renderH * 0.2,
          offsetX + renderW * 0.62,
          offsetY + renderH * 0.255
        )
        const hair = count(
          offsetX + renderW * 0.32,
          offsetY + renderH * 0.28,
          offsetX + renderW * 0.68,
          offsetY + renderH * 0.38
        )
        const hoodie = count(
          offsetX + renderW * 0.35,
          offsetY + renderH * 0.72,
          offsetX + renderW * 0.65,
          offsetY + renderH * 0.88
        )

        return {
          ready: hair.opaqueLit + hair.opaqueBlack + hoodie.opaqueLit > 0,
          aboveHairOpaque: aboveHair.opaqueBlack + aboveHair.opaqueLit,
          hairOpaque: hair.opaqueLit + hair.opaqueBlack,
          hoodieBlack: hoodie.opaqueBlack,
        }
      })

    await expect.poll(sample, { timeout: 15_000 }).toMatchObject({ ready: true })

    const pixels = await sample()
    // Sky just above the crown used to be opaque black from the union mask.
    expect(pixels.aboveHairOpaque).toBe(0)
    expect(pixels.hairOpaque).toBeGreaterThan(200)
    // Hoodie is also near-black and must remain painted.
    expect(pixels.hoodieBlack).toBeGreaterThan(200)
  })

  test('plays its entrance animation and settles', async ({ page }) => {
    await bootLanding(page, { withoutFire: true })

    const inner = page.getByTestId('hero-title').locator('.hero-title-inner')
    await expect(inner.first()).toHaveClass(/is-in/)

    // Lines rise from behind an overflow mask, so the wrapper must clip.
    const overflow = await page
      .getByTestId('hero-title')
      .locator('.hero-title-line')
      .first()
      .evaluate((el) => getComputedStyle(el).overflow)
    expect(overflow).toBe('hidden')

    // Settled state: fully in place and opaque.
    const settled = await inner.evaluateAll((els) =>
      els.map((el) => {
        const cs = getComputedStyle(el)
        return { opacity: cs.opacity, transform: cs.transform }
      })
    )
    for (const s of settled) {
      expect(Number(s.opacity)).toBeGreaterThan(0.99)
      expect(['none', 'matrix(1, 0, 0, 1, 0, 0)']).toContain(s.transform)
    }
  })

  test('stays pinned and visible while the sequence plays', async ({ page }) => {
    await bootLanding(page, { withoutFire: true })
    const title = page.getByTestId('hero-title')

    // The line-two loop is a pure-CSS marquee running on its own track.
    const track = title.locator('.hero-marquee-track')
    await expect(track).toHaveCount(1)
    expect(
      await track.evaluate((el) => getComputedStyle(el).animationName)
    ).toBe('hero-marquee-scroll')

    // Fully visible at rest...
    expect(
      Number(await title.evaluate((el) => getComputedStyle(el).opacity))
    ).toBeGreaterThan(0.95)

    // ...and it never fades: still fully visible mid-scroll and at the very
    // end of the scroll container, while the frame sequence plays over it.
    const scrollStops = await page.evaluate(() => {
      const container = document.querySelector(
        '[data-testid="hero-scroll-container"]'
      )!
      const rect = container.getBoundingClientRect()
      const top = rect.top + window.scrollY
      const bottom = top + rect.height - window.innerHeight
      return [window.innerHeight * 0.3, window.innerHeight * 0.8, bottom]
    })

    for (const y of scrollStops) {
      await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y)
      await page.waitForTimeout(300)
      const { opacity, visibility } = await title.evaluate((el) => {
        const cs = getComputedStyle(el)
        return { opacity: cs.opacity, visibility: cs.visibility }
      })
      expect(Number(opacity)).toBe(1)
      expect(visibility).toBe('visible')
    }
  })

  test('keeps every marquee group at least viewport wide for a seamless loop', async ({
    page,
  }) => {
    for (const [w, h] of [
      [390, 844],
      [768, 1024],
      [1280, 800],
      [1440, 900],
      [1920, 1080],
    ] as const) {
      await page.setViewportSize({ width: w, height: h })
      await bootLanding(page, { withoutFire: true })

      const groupWidths = await page
        .getByTestId('hero-title')
        .locator('.hero-marquee-group')
        .evaluateAll((els) => els.map((el) => el.getBoundingClientRect().width))

      // translateX(-50%) loops seamlessly only while one group covers the
      // viewport — a narrower group would open a gap at the wrap point.
      expect(groupWidths.length).toBeGreaterThan(0)
      for (const width of groupWidths) {
        expect(width).toBeGreaterThanOrEqual(w)
      }
    }
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

  test('self-hosts fonts instead of loading Google Fonts', async ({ page }) => {
    const googleFonts: string[] = []
    page.on('request', (req) => {
      if (req.url().includes('fonts.googleapis.com')) googleFonts.push(req.url())
    })

    await bootLanding(page)

    // Fonts are self-hosted (@font-face in styles.css) — no render-blocking
    // third-party stylesheet round trip.
    expect(googleFonts).toEqual([])

    // The families actually painted are declared as local @font-face rules.
    const fontFaces = await page.evaluate(() =>
      [...document.styleSheets].flatMap((sheet) => {
        try {
          return [...sheet.cssRules].filter((r) => r.type === 5).map((r) =>
            (r as CSSFontFaceRule).cssText
          )
        } catch {
          return []
        }
      })
    )
    const joined = fontFaces.join(' ')
    expect(joined).toContain('Poppins')
    expect(joined).toContain('Hanken Grotesk')
  })

  test('preloads the opening hero frames from the document head', async ({
    page,
  }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    // Frames are preloaded as fetch (Blob -> createImageBitmap, off the main
    // thread) rather than as image elements, so they warm the HTTP cache
    // without re-decoding into an <img>.
    const preloads = await page.evaluate(() =>
      [...document.querySelectorAll('link[rel="preload"]')]
        .filter((l) => l.getAttribute('href')?.includes('/Frist-opt/'))
        .map((l) => l.getAttribute('href'))
    )

    expect(preloads.length).toBeGreaterThanOrEqual(4)
    expect(preloads[0]).toContain('ezgif-frame-001.webp')
  })
})
