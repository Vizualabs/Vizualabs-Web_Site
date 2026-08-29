import { useCallback, useEffect, useRef, type ReactNode } from 'react'
import { motion, useMotionTemplate, useMotionValue } from 'motion/react'
import { cn } from '#/lib/cn'

type MagicCardProps = {
  children: ReactNode
  className?: string
  /** Spotlight diameter in px (fine pointers only). */
  gradientSize?: number
  /** Fill color under the cursor spotlight. */
  gradientColor?: string
  /** Animated border gradient — coral brand defaults. */
  gradientFrom?: string
  gradientTo?: string
}

/**
 * Pointer-following spotlight card (Magic UI).
 * On coarse pointers / reduced motion: static coral edge glow, no tracking.
 */
export function MagicCard({
  children,
  className,
  gradientSize = 220,
  gradientColor = '#2a1512',
  gradientFrom = '#FF5E4D',
  gradientTo = '#FF8A6B',
}: MagicCardProps) {
  const mouseX = useMotionValue(-gradientSize)
  const mouseY = useMotionValue(-gradientSize)
  const finePointer = useRef(false)

  useEffect(() => {
    finePointer.current = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!finePointer.current || reduced) {
      mouseX.set(-gradientSize)
      mouseY.set(-gradientSize)
    }
  }, [gradientSize, mouseX, mouseY])

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!finePointer.current) return
      const rect = e.currentTarget.getBoundingClientRect()
      mouseX.set(e.clientX - rect.left)
      mouseY.set(e.clientY - rect.top)
    },
    [mouseX, mouseY],
  )

  const reset = useCallback(() => {
    mouseX.set(-gradientSize)
    mouseY.set(-gradientSize)
  }, [gradientSize, mouseX, mouseY])

  const borderBg = useMotionTemplate`linear-gradient(#121212 0 0) padding-box,
    radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px, ${gradientFrom}, ${gradientTo}, rgba(255,255,255,0.14) 100%) border-box`

  const spotlightBg = useMotionTemplate`radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px, ${gradientColor}, transparent 100%)`

  return (
    <motion.div
      className={cn(
        'group/magic relative isolate h-full overflow-hidden rounded-2xl',
        'border border-white/10 md:border-[1.5px] md:border-transparent',
        'max-md:shadow-[inset_0_0_0_1px_rgba(255,94,77,0.16)]',
        className,
      )}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      style={{ background: borderBg }}
    >
      <motion.div
        className="pointer-events-none absolute inset-px z-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/magic:opacity-80 max-md:hidden motion-reduce:hidden"
        style={{ background: spotlightBg }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] bg-[radial-gradient(ellipse_80%_55%_at_50%_0%,rgba(255,94,77,0.12),transparent_65%)] md:hidden"
      />
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  )
}
