import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import netlify from '@netlify/vite-plugin-tanstack-start'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const config = defineConfig({
  resolve: {
    tsconfigPaths: true,
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // Server-only SDKs get pulled into the client graph via createServerFn
  // modules. Excluding them stops Vite's client optimizer from trying (and
  // failing) to pre-bundle Node packages for the browser.
  optimizeDeps: {
    exclude: ['resend', '@anthropic-ai/sdk'],
    // Avoid racing concurrent pre-bundles that surface as
    // "error while updating dependencies: undefined".
    holdUntilCrawlEnd: true,
  },
  plugins: [
    devtools(),
    tailwindcss(),
    tanstackStart(),
    netlify(),
    viteReact(),
  ],
})

export default config
