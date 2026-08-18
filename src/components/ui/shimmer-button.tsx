import React, { type ComponentPropsWithoutRef, type CSSProperties } from 'react'

export interface ShimmerButtonProps extends ComponentPropsWithoutRef<'button'> {
  shimmerColor?: string
  shimmerSize?: string
  borderRadius?: string
  shimmerDuration?: string
  background?: string
  hoverBackground?: string
  borderColor?: string
  textColor?: string
  className?: string
  children?: React.ReactNode
}

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ')
}

export const ShimmerButton = React.forwardRef<
  HTMLButtonElement,
  ShimmerButtonProps
>(
  (
    {
      shimmerColor = '#ffffff',
      shimmerSize = '0.15em',
      shimmerDuration = '3s',
      borderRadius = '100px',
      background = '#FF5540',
      hoverBackground,
      borderColor,
      textColor,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        style={
          {
            '--spread': '90deg',
            '--shimmer-color': shimmerColor,
            '--radius': borderRadius,
            '--speed': shimmerDuration,
            '--cut': shimmerSize,
            '--bg': background,
            '--bg-hover': hoverBackground || background,
            ...(borderColor ? { borderColor } : {}),
          } as CSSProperties
        }
        className={cn(
          'group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden [border-radius:var(--radius)] px-6 sm:px-8 py-2.5 sm:py-3 whitespace-nowrap font-semibold [background:var(--bg)] hover:[background:var(--bg-hover)] shadow-lg shadow-[#FF5540]/30',
          textColor ?? 'text-[#FFFFFF]',
          'transform-gpu transition-all duration-300 ease-in-out active:translate-y-px',
          className
        )}
        ref={ref}
        {...props}
      >
        {/* spark container */}
        <div
          className={cn(
            '-z-30 blur-[2px]',
            '@container-[size] absolute inset-0 overflow-visible'
          )}
        >
          {/* spark */}
          <div className="animate-shimmer-slide absolute inset-0 aspect-[1] h-[100cqh] rounded-none [mask:none]">
            {/* spark before */}
            <div className="animate-spin-around absolute -inset-full w-auto [translate:0_0] rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]" />
          </div>
        </div>
        {children}

        {/* backdrop */}
        <div
          className={cn(
            'absolute inset-[var(--cut)] -z-20 [border-radius:var(--radius)] [background:var(--bg)] group-hover:[background:var(--bg-hover)] transition-colors duration-300'
          )}
        />
      </button>
    )
  }
)

ShimmerButton.displayName = 'ShimmerButton'
