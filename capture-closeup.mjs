import { chromium } from 'playwright'

const base = process.env.BASE_URL ?? 'http://localhost:4173'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 900, height: 900 } })
await page.goto(base + '/', { waitUntil: 'domcontentloaded' })
await page.waitForSelector('[data-testid="brand-intro"]')
await page.waitForTimeout(1600)
const el = page.locator('.brand-intro-bh')
await el.screenshot({ path: 'bh-closeup.png' })
// sample vertical + horizontal brightness profiles via readPixels
const profile = await page.evaluate(() => {
  const c = document.querySelector('.brand-intro-bh-canvas')
  const gl = c.getContext('webgl2')
  const w = c.width, h = c.height
  const px = new Uint8Array(4)
  const cx = Math.floor(w / 2), cy = Math.floor(h / 2)
  const horiz = [], vert = []
  for (let f = 0.1; f <= 0.95; f += 0.05) {
    gl.readPixels(Math.floor(w * f), cy, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px)
    horiz.push([f.toFixed(2), px[0], px[1], px[2]])
  }
  for (let f = 0.1; f <= 0.95; f += 0.05) {
    gl.readPixels(cx, Math.floor(h * f), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px)
    vert.push([f.toFixed(2), px[0], px[1], px[2]])
  }
  return { w, h, horiz, vert }
})
console.log(JSON.stringify(profile, null, 1))
await browser.close()
