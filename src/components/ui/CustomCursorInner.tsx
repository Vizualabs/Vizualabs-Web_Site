import { useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

export function CustomCursorInner() {
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  const ringX = useSpring(cursorX, { stiffness: 240, damping: 26, mass: 0.7 })
  const ringY = useSpring(cursorY, { stiffness: 240, damping: 26, mass: 0.7 })

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }
    window.addEventListener('mousemove', move, { passive: true })
    return () => window.removeEventListener('mousemove', move)
  }, [cursorX, cursorY])

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden md:block" aria-hidden="true">
      <motion.div className="absolute left-0 top-0" style={{ x: ringX, y: ringY }}>
        <div className="-translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full border border-white/40" />
      </motion.div>
    </div>
  )
}
