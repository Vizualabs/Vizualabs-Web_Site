export const SITE_URL = 'https://vizualabs.com'
export const SITE_NAME = 'Vizualabs'

/** Public routes included in sitemap.xml (excludes redirects and placeholders). */
export const SITEMAP_PATHS = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/products', priority: '0.9', changefreq: 'monthly' },
  { path: '/services', priority: '0.9', changefreq: 'monthly' },
  { path: '/case-study', priority: '0.8', changefreq: 'monthly' },
  { path: '/contact', priority: '0.8', changefreq: 'monthly' },
  { path: '/about', priority: '0.7', changefreq: 'monthly' },
  { path: '/process', priority: '0.7', changefreq: 'monthly' },
  { path: '/book', priority: '0.6', changefreq: 'monthly' },
  { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { path: '/terms', priority: '0.3', changefreq: 'yearly' },
] as const
