import { chromium } from 'playwright-core';
import path from 'node:path';

const routes = [
  '/', '/about', '/services', '/service', '/products', '/process',
  '/work'.replace('/work',''), // placeholder removed below
];

const PAGES = ['/', '/about', '/services', '/products', '/process', '/contact', '/book', '/case-study'];

const browser = await chromium.launch({ headless: true, executablePath: undefined });
const results = [];

for (const route of PAGES) {
  const context = await browser.newContext();
  const page = await context.newPage();
  const consoleMsgs = [];
  const pageErrors = [];
  const failedRequests = [];

  page.on('console', (msg) => {
    const type = msg.type();
    if (type === 'error' || type === 'warning') {
      consoleMsgs.push(`[${type}] ${msg.text()}`);
    }
  });
  page.on('pageerror', (err) => {
    pageErrors.push(err.message);
  });
  page.on('requestfailed', (req) => {
    failedRequests.push(`${req.method()} ${req.url()} -> ${req.failure()?.errorText}`);
  });
  page.on('response', (res) => {
    if (res.status() >= 400) {
      failedRequests.push(`${res.status()} ${res.url()}`);
    }
  });

  let navError = null;
  try {
    await page.goto(`http://localhost:3000${route}`, { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForTimeout(1500);
  } catch (e) {
    navError = e.message;
  }

  results.push({
    route,
    navError,
    consoleMsgs,
    pageErrors,
    failedRequests,
  });

  await context.close();
}

await browser.close();

for (const r of results) {
  console.log('==================================================');
  console.log('ROUTE:', r.route);
  if (r.navError) console.log('NAV ERROR:', r.navError);
  if (r.consoleMsgs.length) {
    console.log('-- Console --');
    r.consoleMsgs.forEach((m) => console.log(m));
  }
  if (r.pageErrors.length) {
    console.log('-- Page Errors (uncaught exceptions) --');
    r.pageErrors.forEach((m) => console.log(m));
  }
  if (r.failedRequests.length) {
    console.log('-- Failed/4xx/5xx Requests --');
    r.failedRequests.forEach((m) => console.log(m));
  }
  if (!r.consoleMsgs.length && !r.pageErrors.length && !r.failedRequests.length && !r.navError) {
    console.log('CLEAN');
  }
}
