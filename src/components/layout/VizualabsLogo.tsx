import { cn } from '#/lib/cn'

type VizualabsLogoProps = {
  className?: string
}

/**
 * Typed Vizualabs wordmark — Poppins for the brand’s single-story “a”,
 * capital V + tight geometric tracking.
 */
export function VizualabsLogo({ className }: VizualabsLogoProps) {
  return (
    <span
      className={cn(
        'inline-flex items-start font-sans font-black tracking-[-0.04em] leading-none select-none normal-case text-white',
        className,
      )}
      aria-hidden="true"
    >
      <span className="uppercase">V</span>
      izualabs
    </span>
  )
}
