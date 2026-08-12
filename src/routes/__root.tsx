import { HeadContent, Scripts, createRootRouteWithContext } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'

import appCss from '../styles.css?url'
import { HERO_PRELOAD_FRAMES, heroFrameUrl } from '../components/hero/heroFrames'

const FONT_CSS_URL =
  'https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,100..900;1,100..900&family=Instrument+Serif:ital@1&family=Poppins:wght@300;400;500;600;700;800;900&display=swap'

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
        title: 'Vizualabs — Visualise Your Digital Success',
      },
    ],
    links: [
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      // Only the families actually rendered are requested. 'Plus Jakarta Sans'
      // and 'Space Grotesk' were being downloaded but never painted — Jakarta
      // sits behind Poppins in the --font-sans stack (so it can never win) and
      // --font-display had no consumers at all. Instrument Serif is only ever
      // used italic, so the roman axis is dropped too.
      {
        rel: 'stylesheet',
        href: FONT_CSS_URL,
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
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
