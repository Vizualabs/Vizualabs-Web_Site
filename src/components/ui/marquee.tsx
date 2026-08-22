import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '#/lib/cn'

interface MarqueeProps extends ComponentPropsWithoutRef<'div'> {
  /** Reverse animation direction. */
  reverse?: boolean
  /** Pause while hovered / focused (desktop). */
  pauseOnHover?: boolean
  /** Vertical instead of horizontal. */
  vertical?: boolean
  /** How many times to duplicate children for a seamless loop. */
  repeat?: number
}

/**
 * Magic UI–style infinite marquee.
 * Mobile: shorter gaps via className; respects prefers-reduced-motion via CSS.
 */
export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      className={cn(
        'group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]',
        vertical ? 'flex-col' : 'flex-row',
        className,
      )}
    >
      {Array.from({ length: repeat }, (_, i) => (
        <div
          key={i}
          className={cn(
            'flex shrink-0 justify-around [gap:var(--gap)]',
            vertical ? 'animate-marquee-vertical flex-col' : 'animate-marquee flex-row',
            pauseOnHover && 'group-hover:[animation-play-state:paused]',
            reverse && '[animation-direction:reverse]',
          )}
          aria-hidden={i > 0 ? true : undefined}
        >
          {children}
        </div>
      ))}
    </div>
  )
}
