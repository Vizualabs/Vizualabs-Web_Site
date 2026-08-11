import { HeadContent, Scripts, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import type { QueryClient } from '@tanstack/react-query'

import appCss from '../styles.css?url'

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
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

// Hoisted to module level: static config/JSX, avoids re-creation per render
// (vercel-react-best-practices: rendering-hoist-jsx)
const devtoolsConfig = {
  position: 'bottom-right',
} as const

const devtoolsPlugins = [
  {
    name: 'TanStack Query',
    render: <ReactQueryDevtoolsPanel />,
  },
  {
    name: 'Tanstack Router',
    render: <TanStackRouterDevtoolsPanel />,
  },
]

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackDevtools config={devtoolsConfig} plugins={devtoolsPlugins} />
        <Scripts />
      </body>
    </html>
  )
}
