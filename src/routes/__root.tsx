import { HeadContent, Scripts, createRootRouteWithContext } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'

import appCss from '../styles.css?url'
import { CustomCursor } from '../components/ui/CustomCursor'
import { HERO_PRELOAD_FRAMES, heroFrameUrl } from '../components/hero/heroFrames'

interface RouterContext {
  queryClient: QueryClient
}

// NOTE: the codebase uses both vizualabs.tech (ContactSection)
// and vizualabs.com (chat system prompt, AssistantWidget) inconsistently.
// This picks .tech since that's what's shown to visitors on the live
// contact page — flag if that's wrong and every OG/canonical URL below
// moves with it.
const SITE_URL = 'https://vizualabs.com'
const DEFAULT_DESCRIPTION =
  'Vizualabs engineers custom software, product development, and AI solutions with the same precision from first idea to launch.'

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
        content: 'Vizualabs',
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
        name: 'twitter:card',
        content: 'summary',
      },
    ],
    links: [
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/favicon.svg',
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
        <CustomCursor />
        <Scripts />
      </body>
    </html>
  )
}
