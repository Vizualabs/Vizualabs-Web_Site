import { cn } from '#/lib/cn'

type RetroGridProps = {
  className?: string
  /** Angle of the perspective grid in degrees. */
  angle?: number
}

/**
 * Magic UI–style animated perspective grid — atmospheric hero/section backdrop.
 * Pure CSS; respects prefers-reduced-motion via parent `motion-reduce:` utilities.
 */
export function RetroGrid({ className, angle = 65 }: RetroGridProps) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden [perspective:200px]',
        className,
      )}
      aria-hidden
    >
      <div
        className="absolute inset-0"
        style={{ transform: `rotateX(${angle}deg)` }}
      >
        <div
          className={cn(
            'absolute inset-[-200%] h-[300%] w-[600%] origin-[50%_0%]',
            'bg-[linear-gradient(to_right,rgba(255,255,255,0.07)_1px,transparent_0),linear-gradient(to_bottom,rgba(255,255,255,0.07)_1px,transparent_0)]',
            'bg-size-[56px_56px]',
            'animate-retro-grid motion-reduce:animate-none',
          )}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black" />
    </div>
  )
}
