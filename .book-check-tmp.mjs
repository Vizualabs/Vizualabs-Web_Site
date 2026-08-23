import { chromium } from 'playwright-core';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto('http://localhost:3000/book', { waitUntil: 'load', timeout: 20000 });
await page.waitForTimeout(3000);
const frames = page.frames();
console.log('Frame count:', frames.length);
for (const f of frames) {
  console.log('Frame URL:', f.url());
}
await page.screenshot({ path: 'C:\\Users\\chanu\\AppData\\Local\\Temp\\claude\\d--Vizualabs-Projects-Vizualabs-Web-Site\\3f42663e-1f20-47ea-aa2f-3618aa3cb6a8\\scratchpad\\book.png', fullPage: false });
await browser.close();
