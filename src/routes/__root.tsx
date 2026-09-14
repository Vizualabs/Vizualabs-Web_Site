import { HeadContent, Scripts, createRootRouteWithContext } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'

import appCss from '../styles.css?url'
import { ClarityInit, CLARITY_PROJECT_ID } from '../components/analytics/ClarityInit'
import { CustomCursor } from '../components/ui/CustomCursor'
import { HERO_PRELOAD_FRAMES, heroFrameUrl } from '../components/hero/heroFrames'
import { SITE_NAME, SITE_URL } from '../lib/site'

interface RouterContext {
  queryClient: QueryClient
}
const DEFAULT_DESCRIPTION =
  'Vizualabs engineers custom software, product development, and AI solutions with the same precision from first idea to launch.'

const OG_IMAGE_URL = `${SITE_URL}/images/og-share.jpg`

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Vizualabs — Visualize Your Digital Success',
      },
      {
        name: 'description',
        content: DEFAULT_DESCRIPTION,
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:site_name',
        content: SITE_NAME,
      },
      {
        property: 'og:title',
        content: 'Vizualabs — Visualize Your Digital Success',
      },
      {
        property: 'og:description',
        content: DEFAULT_DESCRIPTION,
      },
      {
        property: 'og:url',
        content: SITE_URL,
      },
      {
        property: 'og:image',
        content: OG_IMAGE_URL,
      },
      {
        property: 'og:image:type',
        content: 'image/jpeg',
      },
      {
        property: 'og:image:width',
        content: '1024',
      },
      {
        property: 'og:image:height',
        content: '1024',
      },
      {
        property: 'og:image:alt',
        content: 'Vizualabs logo',
      },
      {
        name: 'twitter:card',
        content: 'summary',
      },
      {
        name: 'twitter:image',
        content: OG_IMAGE_URL,
      },
    ],
    links: [
      {
        rel: 'sitemap',
        type: 'application/xml',
        href: '/sitemap.xml',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '48x48',
        href: '/favicon-48.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'shortcut icon',
        type: 'image/jpeg',
        href: '/favicon.jpg',
      },
      // Fonts are self-hosted (src/styles.css) — no more third-party
      // fonts.googleapis.com round trip blocking first paint. Only the two
      // weights that matter for above-the-fold content are preloaded: the
      // body default and the hero/heading weight everything else can wait
      // for font-display: swap to pick up once idle.
      {
        rel: 'preload',
        as: 'font',
        type: 'font/woff2',
        href: '/fonts/poppins-400.woff2',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'preload',
        as: 'font',
        type: 'font/woff2',
        href: '/fonts/poppins-900.woff2',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: appCss,
      },
      // The hero cannot paint until these decode, and they are only discovered
      // once the route JS runs. Preloading lets the fetch overlap script
      // evaluation instead of queueing behind it.
      ...HERO_PRELOAD_FRAMES.map((frame) => ({
        rel: 'preload' as const,
        as: 'fetch' as const,
        type: 'image/webp',
        crossOrigin: 'anonymous' as const,
        href: heroFrameUrl(frame),
        fetchPriority: 'high' as const,
      })),
    ],
    // Inline Clarity bootstrap in <head> so static Hostinger HTML records
    // visits even before React hydrates. Guarded: only when the build has an ID.
    scripts: CLARITY_PROJECT_ID
      ? [
          {
            id: 'microsoft-clarity-bootstrap',
            children: `(function(c,l,a,r,i,t){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;t.id="microsoft-clarity";(l.head||l.documentElement).appendChild(t);})(window,document,"clarity","script",${JSON.stringify(CLARITY_PROJECT_ID)});`,
          },
        ]
      : [],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        {children}
        <ClarityInit />
        <CustomCursor />
        <Scripts />
      </body>
    </html>
  )
}
