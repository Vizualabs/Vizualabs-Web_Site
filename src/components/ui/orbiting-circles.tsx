import type { ReactNode } from 'react'
import { cn } from '#/lib/cn'

type OrbitingCirclesProps = {
  className?: string
  children?: ReactNode
  reverse?: boolean
  duration?: number
  delay?: number
  radius?: number
  path?: boolean
  iconSize?: number
  speed?: number
}

/**
 * Magic UI Orbiting Circles — decorative rings around a hub.
 */
export function OrbitingCircles({
  className,
  children,
  reverse,
  duration = 20,
  radius = 56,
  path = true,
  iconSize = 22,
  speed = 1,
}: OrbitingCirclesProps) {
  const calculatedDuration = duration / speed
  const childArray = Array.isArray(children) ? children : children ? [children] : []

  return (
    <>
      {path ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          className="pointer-events-none absolute inset-0 size-full"
        >
          <circle
            className="stroke-white/10 stroke-1"
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
          />
        </svg>
      ) : null}
      {childArray.map((child, index) => {
        const angle = (360 / childArray.length) * index
        return (
          <div
            key={index}
            style={
              {
                '--duration': calculatedDuration,
                '--radius': radius,
                '--angle': angle,
                '--icon-size': `${iconSize}px`,
              } as React.CSSProperties
            }
            className={cn(
              'animate-orbit absolute flex size-[var(--icon-size)] transform-gpu items-center justify-center rounded-full',
              reverse && '[animation-direction:reverse]',
              'motion-reduce:animate-none',
              className,
            )}
          >
            {child}
          </div>
        )
      })}
    </>
  )
}
