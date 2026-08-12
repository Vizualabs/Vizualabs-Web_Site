import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false)

  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  const dotX = useSpring(cursorX, { stiffness: 900, damping: 45, mass: 0.4 })
  const dotY = useSpring(cursorY, { stiffness: 900, damping: 45, mass: 0.4 })
  const ringX = useSpring(cursorX, { stiffness: 240, damping: 26, mass: 0.7 })
  const ringY = useSpring(cursorY, { stiffness: 240, damping: 26, mass: 0.7 })

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    if (!mq.matches) return

    setEnabled(true)

    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [cursorX, cursorY])

  if (!enabled) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden md:block" aria-hidden="true">
      <motion.div className="absolute left-0 top-0" style={{ x: dotX, y: dotY }}>
        <div className="-translate-x-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-[#FF5E4D]" />
      </motion.div>
      <motion.div className="absolute left-0 top-0" style={{ x: ringX, y: ringY }}>
        <div className="-translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full border border-white/40" />
      </motion.div>
    </div>
  )
}
