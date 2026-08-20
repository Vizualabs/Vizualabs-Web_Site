import { useEffect, useRef, useState } from 'react'
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
  const [display, setDisplay] = useState(prefersReducedMotion ? value : 0)

  useEffect(() => {
    if (!isInView) return

    if (prefersReducedMotion) {
      setDisplay(value)
      return
    }

    const controls = animate(0, value, {
      duration,
      delay,
      ease: 'easeOut',
      onUpdate: (latest) => setDisplay(latest),
    })

    return () => controls.stop()
  }, [isInView, prefersReducedMotion, value, duration, delay])

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  )
}
