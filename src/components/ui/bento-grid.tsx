import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cn } from '#/lib/cn'

type BentoGridProps = {
  children: ReactNode
  className?: string
} & ComponentPropsWithoutRef<'div'>

/**
 * Magic UI Bento Grid — asymmetric CSS grid shell.
 * Assign col/row spans on children (e.g. `lg:col-span-2`).
 */
export function BentoGrid({ children, className, ...props }: BentoGridProps) {
  return (
    <div
      className={cn(
        'grid w-full auto-rows-[minmax(280px,auto)] grid-cols-1 gap-4 sm:gap-5',
        'lg:grid-cols-4 lg:auto-rows-[minmax(300px,auto)] lg:gap-5',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
