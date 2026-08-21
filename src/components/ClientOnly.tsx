import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

type ClientOnlyProps = {
  fallback?: ReactNode
  children: ReactNode
}

/**
 * Renders `children` only after hydration on the client. The server and the
 * first client render both output `fallback`, so server/client markup stays
 * identical and hydration mismatches are avoided. Use for components whose
 * output is nondeterministic between renders (e.g. `Math.random()`-driven).
 */
export function ClientOnly({ fallback = null, children }: ClientOnlyProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return fallback
  return children
}