import { useMemo } from 'react'
import { cn } from '#/lib/cn'

type MeteorsProps = {
  /** Keep sparse — CTA atmospheres want ~8–14, not 30+. */
  number?: number
  minDelay?: number
  maxDelay?: number
  minDuration?: number
  maxDuration?: number
  angle?: number
  className?: string
}

/**
 * Magic UI Meteors — sparse coral streaks for dark section atmospheres.
 * Do not use on ScrollHeroSection (GPU budget).
 */
export function Meteors({
  number = 12,
  minDelay = 0.3,
  maxDelay = 2.8,
  minDuration = 3,
  maxDuration = 8,
  angle = 215,
  className,
}: MeteorsProps) {
  const meteors = useMemo(
    () =>
      Array.from({ length: number }, (_, i) => ({
        id: i,
        top: -5 + Math.random() * 30,
        left: Math.random() * 100,
        delay: minDelay + Math.random() * (maxDelay - minDelay),
        duration: minDuration + Math.random() * (maxDuration - minDuration),
      })),
    [number, minDelay, maxDelay, minDuration, maxDuration],
  )

  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden',
        className,
      )}
    >
      {meteors.map((m) => (
        <span
          key={m.id}
          className="meteor absolute h-0.5 w-0.5 rounded-full bg-[#FF8A6B]"
          style={
            {
              top: `${m.top}%`,
              left: `${m.left}%`,
              '--meteor-angle': `${angle}deg`,
              '--meteor-delay': `${m.delay}s`,
              '--meteor-duration': `${m.duration}s`,
              boxShadow:
                '0 0 0 1px rgba(255,138,107,0.08), 0 0 8px 1px rgba(255,94,77,0.35)',
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}
