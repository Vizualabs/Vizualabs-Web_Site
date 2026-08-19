import { HeadContent, Scripts, createRootRouteWithContext } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'

import appCss from '../styles.css?url'
import { CustomCursor } from '../components/ui/CustomCursor'
import { AnalyticsInit } from '../components/analytics/AnalyticsInit'
import { HERO_PRELOAD_FRAMES, heroFrameUrl } from '../components/hero/heroFrames'

interface RouterContext {
  queryClient: QueryClient
}

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
    ],
    links: [
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
        rel: 'preload',
        as: 'image',
        type: 'image/webp',
        href: heroFrameUrl(frame),
        fetchPriority: 'high',
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
        <AnalyticsInit />
        <Scripts />
      </body>
    </html>
  )
}
