/**
 * Premium agency loader — a cinematic black hole rendered in WebGL, then a
 * panel wipe into the hero. The singularity collapses as the reveal begins.
 */
import { BlackHoleCanvas } from './BlackHoleCanvas'

export type IntroPhase = 'intro' | 'warmup' | 'revealing'

/** First-visit beat: the hole forms, the wordmark settles, hold for decode. */
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
      {/* Base plane — deep void that blends into the hole */}
      <div className="brand-intro-base absolute inset-0 bg-[#050505]" />

      {/* Atmosphere */}
      <div className="brand-intro-grain pointer-events-none absolute inset-0 opacity-20" aria-hidden="true" />

      {/* Center stage */}
      <div
        className={`absolute inset-0 z-[2] flex flex-col items-center justify-center px-6 ${
          revealing ? 'brand-intro-stage-exit' : ''
        }`}
      >
        {/* Black hole — .brand-intro-core kept for test compat */}
        <div className="brand-intro-core brand-intro-bh relative">
          {/* Static underlay: first paint before the shader compiles, and the
              whole visual when WebGL2 is unavailable or motion is reduced. */}
          <span className="brand-intro-bh-under" aria-hidden="true" />
          <BlackHoleCanvas revealing={revealing} className="brand-intro-bh-canvas" />
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

        {/* Loading sweep */}
        <div className="brand-intro-bar mt-10 h-[1.5px] w-28 overflow-hidden rounded-full bg-white/[0.08] sm:w-36">
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
