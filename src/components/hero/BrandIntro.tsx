/**
 * Branded intro overlay — an X-style "logo opens into the app" reveal.
 *
 * Deliberately has NO percentage or progress bar: the mark draws itself while
 * the hero frames decode in the background, then an iris keyed to the mark's
 * own centre opens the landing page behind it.
 *
 * Phases are driven by the parent so the WebGL fire can warm up behind the
 * opaque plane before the reveal ever starts.
 */
export type IntroPhase = 'intro' | 'warmup' | 'revealing'

const WORDMARK = 'VIZUALABS'

export function BrandIntro({ phase }: { phase: IntroPhase }) {
  const revealing = phase === 'revealing'

  return (
    <div
      className="fixed inset-0 z-[100] overflow-hidden"
      data-testid="brand-intro"
      data-phase={phase}
      role="status"
      aria-live="polite"
      aria-label={revealing ? 'Loading complete' : 'Loading Vizualabs'}
    >
      {/*
        The black plane. During the intro it is a plain fill; at reveal it is
        swapped for the iris variant whose mask hole opens from the mark's
        centre. Both are pure black so the swap itself is invisible.
      */}
      <div className={revealing ? 'brand-intro-iris' : 'absolute inset-0 bg-black'} />

      {/* Ambient brand glow breathing behind the mark */}
      <div
        className={`pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF5E4D]/20 blur-[90px] sm:h-[420px] sm:w-[420px] ${
          revealing ? 'brand-intro-glow-exit' : 'animate-pulse-slow'
        }`}
      />

      {/* Mark + wordmark stack, centred so the iris opens straight out of it */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className={revealing ? 'brand-intro-mark-exit' : undefined}>
          <svg
            viewBox="0 0 100 100"
            className="h-20 w-20 sm:h-24 sm:w-24"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="brand-intro-stroke" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="55%" stopColor="#FF8A6B" />
                <stop offset="100%" stopColor="#FF5E4D" />
              </linearGradient>
            </defs>
            <path
              d="M22 26 L50 74 L78 26"
              className="brand-intro-v"
              stroke="url(#brand-intro-stroke)"
              strokeWidth="13"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>

        <div className={revealing ? 'brand-intro-text-exit' : undefined}>
          <div className="mt-7 flex items-center justify-center px-4 sm:mt-9">
            {WORDMARK.split('').map((letter, i) => (
              <span
                key={i}
                className="brand-intro-letter text-2xl font-black tracking-[0.16em] sm:text-4xl"
                style={{ animationDelay: `${500 + i * 55}ms, 0ms` }}
              >
                {letter}
              </span>
            ))}
            <span className="brand-intro-dot ml-2 h-2 w-2 rounded-full bg-[#FF5E4D] sm:ml-2.5 sm:h-2.5 sm:w-2.5" />
          </div>

          <p className="brand-intro-tagline mt-4 text-center text-[9px] font-semibold uppercase tracking-[0.42em] text-gray-500 sm:text-[11px]">
            Precision in Engineering
          </p>
        </div>
      </div>
    </div>
  )
}
