import { chromium } from '@playwright/test'

const url = process.argv[2] || 'http://localhost:3000/book'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
const logs = []
const jsFiles = []

page.on('pageerror', (err) => {
  logs.push(`[pageerror] ${err.message.slice(0, 300)}`)
})
page.on('request', (req) => {
  if (req.url().includes('.js')) jsFiles.push(req.url().replace('http://localhost:3000', ''))
})

await page.goto(url, { waitUntil: 'networkidle' })
await page.waitForTimeout(2500)

console.log('JS FILES:')
console.log(jsFiles.join('\n'))
console.log('\nPAGE ERRORS:')
console.log(logs.join('\n') || '(none)')
await browser.close()