import { useState, type ReactNode } from 'react'
import { cn } from '#/lib/cn'

type SafariProps = {
  /** Address-bar hostname / path (no protocol required). */
  url?: string
  imageSrc?: string
  imageAlt?: string
  /** Optional screen content when no image (UI mock, etc.). */
  children?: ReactNode
  className?: string
  /** `simple` = traffic lights + address only (lighter). */
  mode?: 'default' | 'simple'
}

/**
 * Safari-style browser chrome — Magic/Eldora-inspired, CSS-only.
 * Parent controls width; aspect stays ~16/10 for product shots.
 */
export function Safari({
  url = 'vizualabs.com',
  imageSrc,
  imageAlt = '',
  children,
  className,
  mode = 'simple',
}: SafariProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const displayUrl = url.replace(/^https?:\/\//, '')
  const showImage = Boolean(imageSrc) && !imageFailed

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-xl border border-white/12 bg-[#1a1a1c]',
        'shadow-[0_24px_60px_-28px_rgba(0,0,0,0.85)]',
        className,
      )}
    >
      <div className="relative flex h-10 items-center gap-3 border-b border-white/8 bg-[#222225] px-3 sm:h-11 sm:px-3.5">
        <div className="flex shrink-0 items-center gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-[#FF5F57] sm:size-3" />
          <span className="size-2.5 rounded-full bg-[#FEBC2E] sm:size-3" />
          <span className="size-2.5 rounded-full bg-[#28C840] sm:size-3" />
        </div>

        <div className="mx-auto flex min-w-0 max-w-[min(100%,22rem)] flex-1 items-center justify-center">
          <div className="flex w-full items-center gap-1.5 rounded-md border border-white/8 bg-[#141416] px-2.5 py-1 text-[10px] sm:text-[11px] text-white/45">
            <svg
              aria-hidden
              viewBox="0 0 16 16"
              className="size-3 shrink-0 text-white/35"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 1a3.5 3.5 0 0 0-3.5 3.5V6H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-.5V4.5A3.5 3.5 0 0 0 8 1Zm2 5V4.5a2 2 0 1 0-4 0V6h4Z"
                clipRule="evenodd"
              />
            </svg>
            <span className="truncate font-medium tracking-tight">{displayUrl}</span>
          </div>
        </div>

        {mode === 'default' ? (
          <div className="hidden w-12 shrink-0 sm:block" aria-hidden />
        ) : null}
      </div>

      <div className="relative aspect-[16/10] w-full bg-[#0e0e10]">
        {showImage ? (
          <img
            src={imageSrc}
            alt={imageAlt}
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
        ) : (
          children ?? (
            <div
              className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,94,77,0.18),transparent_55%),linear-gradient(180deg,#161618,#0e0e10)]"
              aria-hidden
            />
          )
        )}
      </div>
    </div>
  )
}
