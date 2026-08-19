import { lazy, Suspense, useEffect, useState } from 'react'

// `motion` never enters the eager bundle: it's only fetched for desktop,
// fine-pointer visitors who can actually see the cursor ring. The matchMedia
// check below runs before the import, so touch/mobile visitors — the
// majority of fresh traffic — never download it.
const CustomCursorInner = lazy(() =>
  import('./CustomCursorInner').then((m) => ({ default: m.CustomCursorInner }))
)

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    setEnabled(mq.matches)
  }, [])

  if (!enabled) return null

  return (
    <Suspense fallback={null}>
      <CustomCursorInner />
    </Suspense>
  )
}
