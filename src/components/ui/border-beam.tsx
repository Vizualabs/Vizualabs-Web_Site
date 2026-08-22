import { motion, type Transition } from 'motion/react'
import { cn } from '#/lib/cn'

type BorderBeamProps = {
  className?: string
  size?: number
  duration?: number
  delay?: number
  colorFrom?: string
  colorTo?: string
  reverse?: boolean
  initialOffset?: number
  borderWidth?: number
  transition?: Transition
}

/**
 * Light beam that travels along the parent’s border (Magic UI Border Beam).
 * Parent must be `relative overflow-hidden`. CSS-only motion — fine on mobile.
 */
export function BorderBeam({
  className,
  size = 60,
  duration = 8,
  delay = 0,
  colorFrom = '#FF5E4D',
  colorTo = '#FF8A6B',
  reverse = false,
  initialOffset = 0,
  borderWidth = 1.5,
  transition,
}: BorderBeamProps) {
  return (
    <div
      className="pointer-events-none absolute inset-0 rounded-[inherit] border-(length:--border-beam-width) border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]"
      style={
        {
          '--border-beam-width': `${borderWidth}px`,
        } as React.CSSProperties
      }
    >
      <motion.div
        className={cn(
          'absolute aspect-square',
          'bg-gradient-to-l from-[var(--color-from)] via-[var(--color-to)] to-transparent',
          'motion-reduce:hidden',
          className,
        )}
        style={
          {
            width: size,
            offsetPath: `rect(0 auto auto 0 round ${size}px)`,
            '--color-from': colorFrom,
            '--color-to': colorTo,
          } as React.CSSProperties
        }
        initial={{ offsetDistance: `${initialOffset}%` }}
        animate={{
          offsetDistance: reverse
            ? [`${100 - initialOffset}%`, `${-initialOffset}%`]
            : [`${initialOffset}%`, `${100 + initialOffset}%`],
        }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration,
          delay: -delay,
          ...transition,
        }}
      />
    </div>
  )
}
