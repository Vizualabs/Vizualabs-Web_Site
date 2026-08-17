/**
 * Hero heading, rendered UNDERNEATH the image-sequence canvas.
 *
 * Line one ("Vizualise") is static centered text.
 * Line two ("Your Digital Success") is a smooth continuous animation loop,
 * with "Digital" styled in red-orange italic serif font matching the Figma design.
 */

function MarqueePhrase({
  start,
  hidden = false,
}: {
  start: boolean
  hidden?: boolean
}) {
  return (
    <span className="hero-marquee-phrase inline-flex items-center whitespace-nowrap py-2" aria-hidden={hidden || undefined}>
      <span className="text-white font-hanken">Your</span>
      <span className={`hero-title-accent text-[#FF5E4D] font-hanken italic mx-2 sm:mx-4 ${start ? 'is-in' : ''}`}>
        Digital
      </span>
      <span className={`hero-title-accent text-[#FF5E4D] font-hanken ${start ? 'is-in' : ''}`}>
        Success
      </span>
    </span>
  )
}

export function HeroTitle({ start }: { start: boolean }) {
  return (
    <div
      data-testid="hero-title"
      aria-hidden={!start}
      /* Mobile sits far lower than desktop because the sequence anchors the
         subject to the bottom at 70% height there, putting its head near 47vh —
         the heading has to start below that to run behind it. Breakpoint is md
         (768px) to match the isMobile threshold in computeImageRect. */
      className="pointer-events-none absolute inset-x-0 top-[42vh] flex flex-col items-center px-4 text-center md:top-[23vh] overflow-hidden"
    >
      <h1 className="hero-title-type font-hanken m-0 w-full font-black leading-[0.92] tracking-[-0.02em]">
        <span className="hero-title-line block overflow-hidden mt-0">
          <span
            className={`hero-title-inner inline-block text-white text-[1.15em] ${start ? 'is-in' : ''}`}
            style={{ animationDelay: '0ms' }}
          >
            Visualize
          </span>
        </span>

        <span className="hero-title-line hero-title-marquee block overflow-hidden">
          <span
            className={`hero-title-inner inline-block ${start ? 'is-in' : ''}`}
            style={{ animationDelay: '130ms' }}
          >
            <span className="hero-marquee-track">
              <span className="hero-marquee-group">
                <MarqueePhrase start={start} />
                <MarqueePhrase start={start} hidden />
                <MarqueePhrase start={start} hidden />
              </span>
              <span className="hero-marquee-group" aria-hidden="true">
                <MarqueePhrase start={start} hidden />
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
