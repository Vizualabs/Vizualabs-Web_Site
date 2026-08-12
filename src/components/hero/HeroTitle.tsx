/**
 * Hero heading, rendered UNDERNEATH the image-sequence canvas.
 *
 * The canvas is masked to the subject's silhouette (see hero-subject-mask.png),
 * so the boy occludes the middle of these lines exactly the way he does in the
 * reference composition, while the outer words stay fully legible against the
 * black backdrop.
 *
 * Line one ("Vizualise") is static. Line two ("Your Digital Success") is an
 * infinite, pure-CSS marquee travelling right to left: because the line moves,
 * words pass behind the subject and re-emerge instead of staying trapped
 * behind the silhouette — motion is the legibility fix, the under-canvas
 * layering is intentional and preserved.
 *
 * Each line reveals from behind its own overflow mask; the accent line follows
 * a beat later so the eye lands on it last.
 */

/**
 * One phrase unit of the marquee loop. Only the very first copy in the
 * document is exposed to assistive tech; every duplicate is aria-hidden.
 */
function MarqueePhrase({
  start,
  hidden = false,
}: {
  start: boolean
  hidden?: boolean
}) {
  return (
    <span className="hero-marquee-phrase" aria-hidden={hidden || undefined}>
      <span className="text-white">Your </span>
      <span className={`hero-title-accent ${start ? 'is-in' : ''}`}>
        Digital Success
      </span>
    </span>
  )
}

export function HeroTitle({ start }: { start: boolean }) {
  return (
    <div
      data-testid="hero-title"
      aria-hidden={!start}
      className="pointer-events-none absolute inset-x-0 top-[10vh] flex flex-col items-center px-4 text-center sm:top-[15vh]"
    >
      <h1 className="hero-title-type font-hanken m-0 w-full font-black leading-[0.92] tracking-[-0.02em]">
        <span className="hero-title-line">
          <span
            className={`hero-title-inner text-white ${start ? 'is-in' : ''}`}
            style={{ animationDelay: '0ms' }}
          >
            Vizualise
          </span>
        </span>

        <span className="hero-title-line hero-title-marquee">
          {/* The rise reveal stays on the inner — the marquee transform lives
              on the track child, because the inner's fill-forwards animation
              would permanently override a transform set on the same element. */}
          <span
            className={`hero-title-inner ${start ? 'is-in' : ''}`}
            style={{ animationDelay: '130ms' }}
          >
            {/* Two identical groups: animating the track to translateX(-50%)
                shifts it by exactly one group, which makes the loop seamless.
                Each group must stay >= viewport width or a gap appears at the
                seam — verified by the heading e2e suite. */}
            <span className="hero-marquee-track">
              <span className="hero-marquee-group">
                <MarqueePhrase start={start} />
                <MarqueePhrase start={start} hidden />
              </span>
              <span className="hero-marquee-group" aria-hidden="true">
                <MarqueePhrase start={start} hidden />
                <MarqueePhrase start={start} hidden />
              </span>
            </span>
          </span>
        </span>
      </h1>
    </div>
  )
}
