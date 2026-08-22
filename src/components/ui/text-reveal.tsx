import { useRef, type ReactNode } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { cn } from '#/lib/cn'

type TextRevealProps = {
  children: string
  className?: string
  /** Stagger delay between words (seconds). */
  delay?: number
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
}

const MOTION_TAGS = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  span: motion.span,
} as const

/**
 * React Bits–inspired word reveal — blur + rise per word on scroll into view.
 */
export function TextReveal({
  children,
  className,
  delay = 0,
  as = 'h2',
}: TextRevealProps) {
  const ref = useRef<HTMLHeadingElement | HTMLParagraphElement | HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reduceMotion = useReducedMotion()
  const words = children.split(' ')
  const MotionTag = MOTION_TAGS[as]

  return (
    <MotionTag
      ref={ref as never}
      className={cn('flex flex-wrap gap-x-[0.28em] gap-y-1', className)}
      aria-label={children}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="relative inline-block overflow-hidden pb-[0.08em]">
          <motion.span
            className="inline-block"
            initial={reduceMotion ? false : { y: '110%', opacity: 0, filter: 'blur(8px)' }}
            animate={
              reduceMotion || inView
                ? { y: 0, opacity: 1, filter: 'blur(0px)' }
                : { y: '110%', opacity: 0, filter: 'blur(8px)' }
            }
            transition={{
              duration: reduceMotion ? 0 : 0.55,
              delay: reduceMotion ? 0 : delay + i * 0.045,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  )
}

type FadeLineProps = {
  children: ReactNode
  className?: string
  delay?: number
}

export function FadeLine({ children, className, delay = 0 }: FadeLineProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={
        reduceMotion || inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }
      }
      transition={{
        duration: reduceMotion ? 0 : 0.5,
        delay: reduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
