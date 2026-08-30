import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import netlify from '@netlify/vite-plugin-tanstack-start'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const config = defineConfig({
  // Keep dependency optimization isolated from stale pre-patch dev caches.
  cacheDir: 'node_modules/.vite-vizualabs',
  resolve: {
    tsconfigPaths: true,
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // Keep TanStack Start's createClientRpc working in the browser after HMR —
  // that stub reads process.env.TSS_SERVER_FN_BASE at module init.
  define: {
    'process.env.TSS_SERVER_FN_BASE': JSON.stringify('/_serverFn/'),
    'import.meta.env.TSS_SERVER_FN_BASE': JSON.stringify('/_serverFn/'),
  },
  // Server-only SDKs get pulled into the client graph via createServerFn
  // modules. Excluding them stops Vite's client optimizer from trying (and
  // failing) to pre-bundle Node packages for the browser.
  optimizeDeps: {
    exclude: ['resend', '@google/genai'],
    // Avoid racing concurrent pre-bundles that surface as
    // "error while updating dependencies: undefined".
    holdUntilCrawlEnd: true,
  },
  plugins: [
    devtools(),
    tailwindcss(),
    tanstackStart({
      // Hostinger FTP deploys dist/client/ as static files — prerender
      // generates index.html and per-route HTML so Apache doesn't 403.
      prerender: {
        enabled: true,
        crawlLinks: true,
        concurrency: 8,
      },
    }),
    netlify(),
    viteReact(),
  ],
})

export default config
