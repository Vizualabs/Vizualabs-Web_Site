import { chromium } from 'playwright'

const base = process.env.BASE_URL ?? 'http://localhost:4173'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 900, height: 900 } })
await page.goto(base + '/', { waitUntil: 'domcontentloaded' })
await page.waitForSelector('[data-testid="brand-intro"]')
await page.waitForTimeout(1200)
const diag = await page.evaluate(() => {
  const c = document.querySelector('.brand-intro-bh-canvas')
  const box = document.querySelector('.brand-intro-bh')
  const cs = getComputedStyle(box)
  return {
    buffer: { w: c.width, h: c.height },
    client: { w: c.clientWidth, h: c.clientHeight },
    boxClient: { w: box.clientWidth, h: box.clientHeight },
    boxComputed: { width: cs.width, height: cs.height, aspectRatio: cs.aspectRatio },
    dpr: window.devicePixelRatio,
    canvasCss: {
      position: getComputedStyle(c).position,
      width: getComputedStyle(c).width,
      height: getComputedStyle(c).height,
    },
  }
})
console.log(JSON.stringify(diag, null, 1))
await browser.close()
