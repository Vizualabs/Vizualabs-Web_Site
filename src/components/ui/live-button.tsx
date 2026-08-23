import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '#/lib/cn'

type LiveButtonProps = {
  children: ReactNode
  className?: string
  /** Optional href — renders as a link when set. */
  href?: string
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'>

/**
 * Eldora-style live CTA — ripple ring + coral fill.
 * Primary booking / CTA actions across the site.
 */
export function LiveButton({
  children,
  className,
  href,
  type = 'button',
  ...props
}: LiveButtonProps) {
  const classes = cn(
    'live-button group relative inline-flex min-h-12 items-center justify-center overflow-hidden rounded-full',
    'bg-[#FF5540] px-7 sm:px-9 py-3 text-sm sm:text-base font-semibold text-[#5C0000]',
    'shadow-[0_0_0_0_rgba(255,85,64,0.45)] transition-[transform,box-shadow,background-color] duration-300',
    'hover:-translate-y-0.5 hover:bg-[#ff422a] hover:shadow-[0_12px_40px_-12px_rgba(255,85,64,0.65)]',
    'active:translate-y-0 active:scale-[0.98]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8A6B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#2A2A2A]',
    'disabled:pointer-events-none disabled:opacity-50',
    'motion-reduce:transition-none motion-reduce:hover:translate-y-0',
    className,
  )

  const inner = (
    <>
      <span
        aria-hidden
        className="live-button-ripple pointer-events-none absolute inset-0 rounded-full"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.35), transparent 45%)',
        }}
      />
      <span className="relative z-10">{children}</span>
    </>
  )

  if (href) {
    return (
      <a href={href} className={classes}>
        {inner}
      </a>
    )
  }

  return (
    <button type={type} className={classes} {...props}>
      {inner}
    </button>
  )
}
