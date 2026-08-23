import { useEffect, useRef } from 'react'
import { animate, useInView, useReducedMotion } from 'motion/react'

export interface NumberTickerProps {
  /** Final numeric value to count up to. */
  value: number
  /** Text rendered immediately before the number, e.g. "$". */
  prefix?: string
  /** Text rendered immediately after the number, e.g. "+", "%". */
  suffix?: string
  /** Decimal places to keep (0 for whole numbers). */
  decimals?: number
  /** Count-up duration in seconds. */
  duration?: number
  /** Delay before the count-up starts, in seconds. */
  delay?: number
  className?: string
}

/**
 * Counts up from 0 to `value` once it scrolls into view. Jumps straight to
 * the final value under prefers-reduced-motion, matching the
 * reducedMotion="user" convention used elsewhere in this codebase (see
 * AboutPillars).
 */
export function NumberTicker({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  duration = 1.4,
  delay = 0,
  className,
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const prefersReducedMotion = useReducedMotion()

  // Count-up writes straight to the text node on every tick instead of going
  // through React state — at 60 updates/sec this used to trigger a component
  // re-render for every frame of every ticker (3 run concurrently in the
  // hero, right as the scroll-driven canvas is also painting).
  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (!isInView) return

    if (prefersReducedMotion) {
      node.textContent = `${prefix}${value.toFixed(decimals)}${suffix}`
      return
    }

    const controls = animate(0, value, {
      duration,
      delay,
      ease: 'easeOut',
      onUpdate: (latest) => {
        node.textContent = `${prefix}${latest.toFixed(decimals)}${suffix}`
      },
    })

    return () => controls.stop()
  }, [isInView, prefersReducedMotion, value, duration, delay, prefix, suffix, decimals])

  return (
    <span
      ref={ref}
      className={className}
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {prefix}
      {(prefersReducedMotion ? value : 0).toFixed(decimals)}
      {suffix}
    </span>
  )
}
