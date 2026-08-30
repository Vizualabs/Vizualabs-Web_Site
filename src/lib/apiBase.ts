/**
 * Production API base for Hostinger static deploys (Cloudflare Worker).
 * Local `bun run dev` leaves this unset and uses createServerFn + .env instead.
 */
export function getApiBaseUrl(): string | undefined {
  const raw = import.meta.env.VITE_API_BASE_URL as string | undefined
  const base = raw?.trim()
  if (!base) return undefined
  return base.replace(/\/+$/, '')
}
