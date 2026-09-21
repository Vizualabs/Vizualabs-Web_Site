import { chromium } from 'playwright'

const base = process.env.BASE_URL ?? 'http://localhost:4173'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 900, height: 900 } })
const logs = []
page.on('console', (m) => logs.push(m.type() + ': ' + m.text()))
page.on('pageerror', (e) => logs.push('PAGEERROR: ' + e.message))
await page.goto(base + '/', { waitUntil: 'domcontentloaded' })
await page.waitForSelector('[data-testid="brand-intro"]')
await page.waitForTimeout(1200)
const frames = await page.evaluate(() => window.__blackHoleFrames ?? -1)
console.log('blackHoleFrames:', frames)
console.log('console output:', logs.length ? logs.join('\n') : '(clean)')
await browser.close()
