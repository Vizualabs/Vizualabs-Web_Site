/**
 * Premium agency loader — abstract coral core + wordmark, then a panel wipe
 * into the hero. No letter-mark / V-stroke choreography.
 */
export type IntroPhase = 'intro' | 'warmup' | 'revealing'

/** First-visit beat: core forms, wordmark settles, hold for frame decode. */
export const BRAND_INTRO_CHOREOGRAPHY_MS = 1680

export function BrandIntro({
  phase,
  fast = false,
}: {
  phase: IntroPhase
  /** Returning session visitor — short branded fade, no full choreography. */
  fast?: boolean
}) {
  const revealing = phase === 'revealing'

  return (
    <div
      className={`fixed inset-0 z-[100] overflow-hidden${fast ? ' brand-intro-fast' : ''}${revealing ? ' brand-intro-revealing' : ''}`}
      data-testid="brand-intro"
      data-phase={phase}
      role="status"
      aria-live="polite"
      aria-label={revealing ? 'Loading complete' : 'Loading Vizualabs'}
    >
      {/* Base plane — hides the instant wipe panels take over */}
      <div className="brand-intro-base absolute inset-0 bg-[#0a0a0a]" />

      {/* Atmosphere */}
      <div className="brand-intro-wash pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="brand-intro-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="brand-intro-grain pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />

      {/* Center stage */}
      <div
        className={`absolute inset-0 z-[2] flex flex-col items-center justify-center px-6 ${
          revealing ? 'brand-intro-stage-exit' : ''
        }`}
      >
        <div className="brand-intro-core relative flex h-28 w-28 items-center justify-center sm:h-32 sm:w-32">
          <span className="brand-intro-orbit brand-intro-orbit-a" aria-hidden="true" />
          <span className="brand-intro-orbit brand-intro-orbit-b" aria-hidden="true" />
          <span className="brand-intro-core-glow" aria-hidden="true" />
          <span className="brand-intro-core-orb" aria-hidden="true" />
        </div>

        <div className="brand-intro-copy mt-10 text-center sm:mt-12">
          <p className="brand-intro-wordmark font-hanken text-3xl font-black tracking-[0.2em] text-white sm:text-4xl">
            VIZUALABS
          </p>
          <p className="brand-intro-tagline mt-3 text-[10px] font-medium uppercase tracking-[0.32em] text-white/40 sm:text-[11px]">
            Visualize your digital success
          </p>
        </div>

        <div className="brand-intro-bar mt-10 h-[2px] w-24 overflow-hidden rounded-full bg-white/10 sm:w-32">
          <span className="brand-intro-bar-fill block h-full w-full origin-left rounded-full bg-gradient-to-r from-[#FF5E4D] via-[#FF8A6B] to-[#FF5E4D]" />
        </div>
      </div>

      {/* Exit wipe — panels peel open to the hero */}
      {revealing ? (
        <>
          <div className="brand-intro-wipe brand-intro-wipe-top" aria-hidden="true" />
          <div className="brand-intro-wipe brand-intro-wipe-bottom" aria-hidden="true" />
        </>
      ) : null}
    </div>
  )
}
