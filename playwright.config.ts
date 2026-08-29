import { defineConfig, devices } from '@playwright/test'

const PORT = 4173
const BASE_URL = `http://localhost:${PORT}`

/**
 * Perf assertions run against the production build, not the dev server —
 * unminified modules and the HMR client would make timings meaningless.
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI
    ? [['list'], ['github'], ['html', { open: 'never' }]]
    : [['list']],
  timeout: 60_000,
  expect: { timeout: 15_000 },

  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 800 },
        launchOptions: {
          // Deterministic frame timing so scroll-jank measurements are not at
          // the mercy of the host compositor's vsync.
          args: ['--disable-frame-rate-limit', '--force-device-scale-factor=1'],
        },
      },
    },
  ],

  webServer: {
    // Build first, then serve: `vite preview` runs the SSR handler via the
    // TanStack Start plugin, but it does NOT rebuild — without the build step
    // the suite silently tests whatever dist/ happens to be lying around.
    command: `bun run build && bunx --bun vite preview --port ${PORT} --strictPort`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
})
