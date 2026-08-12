import { forwardRef } from 'react'

/**
 * Hero heading, rendered UNDERNEATH the image-sequence canvas.
 *
 * The canvas is masked to the subject's silhouette (see hero-subject-mask.png),
 * so the boy occludes the middle of these lines exactly the way he does in the
 * reference composition, while the outer words stay fully legible against the
 * black backdrop.
 *
 * Each line reveals from behind its own overflow mask; the accent line follows
 * a beat later so the eye lands on it last.
 */
export const HeroTitle = forwardRef<HTMLDivElement, { start: boolean }>(
  function HeroTitle({ start }, ref) {
    return (
      <div
        ref={ref}
        data-testid="hero-title"
        aria-hidden={!start}
        className="pointer-events-none absolute inset-x-0 top-[10vh] flex flex-col items-center px-4 text-center sm:top-[15vh]"
        style={{ willChange: 'opacity' }}
      >
        <h1 className="hero-title-type m-0 font-black leading-[0.92] tracking-[-0.02em]">
          <span className="hero-title-line">
            <span
              className={`hero-title-inner text-white ${start ? 'is-in' : ''}`}
              style={{ animationDelay: '0ms' }}
            >
              Vizualise
            </span>
          </span>

          <span className="hero-title-line">
            <span
              className={`hero-title-inner ${start ? 'is-in' : ''}`}
              style={{ animationDelay: '130ms' }}
            >
              <span className="text-white">Your </span>
              <span className={`hero-title-accent ${start ? 'is-in' : ''}`}>
                Digital Success
              </span>
            </span>
          </span>
        </h1>
      </div>
    )
  }
)
