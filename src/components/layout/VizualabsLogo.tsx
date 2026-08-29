import { cn } from '#/lib/cn'

type VizualabsLogoProps = {
  className?: string
  /** When false, omit the ® mark (e.g. navbar). */
  showRegistered?: boolean
}

/**
 * Typed Vizualabs wordmark — Poppins for the brand’s single-story “a”,
 * capital V + tight geometric tracking. Optional ® at top-right.
 */
export function VizualabsLogo({
  className,
  showRegistered = true,
}: VizualabsLogoProps) {
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
      {showRegistered ? (
        <sup className="ml-[0.06em] mt-[0.02em] text-[0.72em] font-bold leading-none tracking-normal">
          ®
        </sup>
      ) : null}
    </span>
  )
}
