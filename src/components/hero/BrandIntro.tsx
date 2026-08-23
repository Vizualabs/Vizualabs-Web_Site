/**
 * Premium agency loader — red singularity / black hole vortex.
 * A swirling accretion disk of coral light spirals into a pulsing core,
 * then the wordmark ignites and panels peel open to the hero.
 */
export type IntroPhase = 'intro' | 'warmup' | 'revealing'

/** First-visit beat: vortex spins up, wordmark ignites, hold for decode. */
export const BRAND_INTRO_CHOREOGRAPHY_MS = 2000

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
      {/* Base plane — pure black void */}
      <div className="brand-intro-base absolute inset-0 bg-[#050505]" />

      {/* Vignette — edges fall to absolute black */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, #050505 85%)',
        }}
        aria-hidden="true"
      />

      {/* Atmosphere layers */}
      <div className="brand-intro-wash pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="brand-intro-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="brand-intro-grain pointer-events-none absolute inset-0 opacity-25" aria-hidden="true" />

      {/* ─── Singularity Stage ─── */}
      <div
        className={`absolute inset-0 z-[2] flex flex-col items-center justify-center px-6 ${
          revealing ? 'brand-intro-stage-exit' : ''
        }`}
      >
        {/* Vortex container — .brand-intro-core kept for test compat */}
        <div className="brand-intro-core brand-intro-vortex relative flex h-36 w-36 items-center justify-center sm:h-44 sm:w-44">
          {/* Accretion rings — spiral inward */}
          <span className="brand-intro-ring brand-intro-ring-1" aria-hidden="true" />
          <span className="brand-intro-ring brand-intro-ring-2" aria-hidden="true" />
          <span className="brand-intro-ring brand-intro-ring-3" aria-hidden="true" />
          <span className="brand-intro-ring brand-intro-ring-4" aria-hidden="true" />

          {/* Spiral arms — light streaks */}
          <span className="brand-intro-arm brand-intro-arm-1" aria-hidden="true" />
          <span className="brand-intro-arm brand-intro-arm-2" aria-hidden="true" />
          <span className="brand-intro-arm brand-intro-arm-3" aria-hidden="true" />
          <span className="brand-intro-arm brand-intro-arm-4" aria-hidden="true" />

          {/* Singularity glow layers */}
          <span className="brand-intro-singularity-glow-outer" aria-hidden="true" />
          <span className="brand-intro-singularity-glow-mid" aria-hidden="true" />
          <span className="brand-intro-singularity-glow-inner" aria-hidden="true" />

          {/* The core — bright white-hot center */}
          <span className="brand-intro-singularity-core" aria-hidden="true" />
        </div>

        {/* Wordmark + tagline */}
        <div className="brand-intro-copy mt-10 text-center sm:mt-12">
          <p className="brand-intro-wordmark font-hanken text-3xl font-black tracking-[0.22em] text-white sm:text-4xl">
            VIZUALABS
          </p>
          <p className="brand-intro-tagline mt-3 text-[10px] font-medium uppercase tracking-[0.34em] text-white/35 sm:text-[11px]">
            Visualize your digital success
          </p>
        </div>

        {/* Cinematic progress sweep */}
        <div className="brand-intro-bar mt-10 h-[1.5px] w-28 overflow-hidden rounded-full bg-white/[0.08] sm:w-36">
          <span className="brand-intro-bar-fill block h-full w-full origin-left rounded-full bg-gradient-to-r from-[#FF5E4D] via-[#FF8A6B] to-[#FF5E4D]" />
        </div>
      </div>

      {/* Exit wipe — panels peel open */}
      {revealing ? (
        <>
          <div className="brand-intro-wipe brand-intro-wipe-top" aria-hidden="true" />
          <div className="brand-intro-wipe brand-intro-wipe-bottom" aria-hidden="true" />
        </>
      ) : null}
    </div>
  )
}
