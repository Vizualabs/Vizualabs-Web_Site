import { chromium } from 'playwright'

const base = process.env.BASE_URL ?? 'http://localhost:4173'
const out = process.env.OUT_DIR ?? '.'

const sizes = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 834, height: 1112 },
  { name: 'mobile', width: 390, height: 844 },
]

const browser = await chromium.launch()
for (const s of sizes) {
  const page = await browser.newPage({
    viewport: { width: s.width, height: s.height },
  })
  await page.goto(base + '/', { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('[data-testid="brand-intro"]')
  await page.waitForTimeout(1300) // entrance done, disk fully spinning
  await page.screenshot({ path: `${out}/intro-${s.name}-mid.png` })
  await page.waitForTimeout(700) // wordmark settled
  await page.screenshot({ path: `${out}/intro-${s.name}-late.png` })
  await page.close()
  console.log('captured', s.name)
}
await browser.close()
