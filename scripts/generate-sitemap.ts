import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { SITE_URL, SITEMAP_PATHS } from '../src/lib/site.ts'

const lastmod = new Date().toISOString().slice(0, 10)

const urlEntries = SITEMAP_PATHS.map(({ path, priority, changefreq }) => {
  const loc = path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
}).join('\n')

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`

const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`

writeFileSync(join('public', 'sitemap.xml'), sitemap, 'utf8')
writeFileSync(join('public', 'robots.txt'), robots, 'utf8')

console.log(`Generated public/sitemap.xml (${SITEMAP_PATHS.length} URLs)`)
console.log(`Generated public/robots.txt → ${SITE_URL}/sitemap.xml`)
