import { useRef, type ReactNode } from 'react'
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  type UseInViewOptions,
  type Variants,
} from 'motion/react'
import { cn } from '#/lib/cn'

type BlurFadeProps = {
  children: ReactNode
  className?: string
  duration?: number
  delay?: number
  offset?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  inView?: boolean
  inViewMargin?: UseInViewOptions['margin']
  blur?: string
}

/**
 * Magic UI Blur Fade — scroll-triggered blur + fade for section copy.
 * Skip on ScrollHero (already motion-heavy).
 */
export function BlurFade({
  children,
  className,
  duration = 0.45,
  delay = 0,
  offset = 10,
  direction = 'up',
  inView = true,
  inViewMargin = '-60px',
  blur = '8px',
}: BlurFadeProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const inViewResult = useInView(ref, { once: true, margin: inViewMargin })
  const isInView = !inView || inViewResult

  const axis = direction === 'left' || direction === 'right' ? 'x' : 'y'
  const from =
    direction === 'right' || direction === 'down' ? -offset : offset

  const variants: Variants = reduceMotion
    ? {
        hidden: { opacity: 1 },
        visible: { opacity: 1 },
      }
    : {
        hidden: {
          [axis]: from,
          opacity: 0,
          filter: `blur(${blur})`,
        },
        visible: {
          [axis]: 0,
          opacity: 1,
          filter: 'blur(0px)',
        },
      }

  return (
    <AnimatePresence>
      <motion.div
        ref={ref}
        initial={reduceMotion ? 'visible' : 'hidden'}
        animate={isInView || reduceMotion ? 'visible' : 'hidden'}
        exit="hidden"
        variants={variants}
        transition={{
          delay: reduceMotion ? 0 : 0.04 + delay,
          duration: reduceMotion ? 0 : duration,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={cn(className)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
