/**
 * Premium agency loader — deep-space universe.
 * A twinkling starfield and coral nebula drift behind a rim-lit planet with
 * an orbiting satellite; the wordmark ignites, then hands directly to the
 * hero. All space motion lives on one budget-capped 2D canvas (see
 * universeCanvas.ts); the DOM carries only the planet, orbits, and copy.
 */
import { useEffect, useLayoutEffect, useRef } from 'react'
import { startUniverse, type UniverseHandle } from './universeCanvas'

export type IntroPhase = 'intro' | 'warmup'

/** First-visit beat: stars settle in, wordmark ignites, hold for decode. */
export const BRAND_INTRO_CHOREOGRAPHY_MS = 2000

export function BrandIntro({
  phase,
  fast = false,
}: {
  phase: IntroPhase
  /** Returning session visitor — short branded fade, no full choreography. */
  fast?: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const universeRef = useRef<UniverseHandle | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const universe = startUniverse(canvas, {
      staticFrame: fast || reducedMotion,
      // Fast/reduced sessions skip the starfield fade — instant static frame.
      fadeIn: !fast && !reducedMotion,
    })
    universeRef.current = universe
    return () => {
      universe.stop()
      if (universeRef.current === universe) universeRef.current = null
    }
  }, [fast])

  // WebGL shader compilation and any remaining hero preparation happen during
  // warmup. Freeze the universe's final frame before passive effects run, so
  // those one-time GPU costs cannot steal frames from the visible loader.
  // The planet, orbit, wordmark and progress sweep keep animating in CSS.
  useLayoutEffect(() => {
    if (phase === 'warmup') universeRef.current?.freeze()
  }, [phase])

  return (
    <div
      className={`fixed inset-0 z-[100] overflow-hidden${fast ? ' brand-intro-fast' : ''}`}
      data-testid="brand-intro"
      data-phase={phase}
      role="status"
      aria-live="polite"
      aria-label="Loading Vizualabs"
    >
      {/* Base plane — pure black void */}
      <div className="brand-intro-base absolute inset-0 bg-[#050505]" />

      {/* Universe — starfield, coral nebula, shooting stars */}
      <canvas
        ref={canvasRef}
        className="brand-intro-universe absolute inset-0 block h-full w-full"
        aria-hidden="true"
      />

      {/* Vignette — edges fall to absolute black */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, #050505 85%)',
        }}
        aria-hidden="true"
      />

      {/* Film grain — keeps the gradients from banding */}
      <div className="brand-intro-grain pointer-events-none absolute inset-0 opacity-25" aria-hidden="true" />

      {/* ─── Planet Stage ─── */}
      <div className="absolute inset-0 z-[2] flex flex-col items-center justify-center px-6">
        {/* Planet container — .brand-intro-core kept for test compat */}
        <div className="brand-intro-core brand-intro-planet relative flex h-36 w-36 items-center justify-center sm:h-44 sm:w-44">
          {/* Coral atmosphere — backlit halo from behind the planet */}
          <span className="brand-intro-atmosphere" aria-hidden="true" />

          {/* Outer orbit path — faint, reverse drift */}
          <span className="brand-intro-orbit brand-intro-orbit-b" aria-hidden="true">
            <span className="brand-intro-ring brand-intro-ring-2" />
          </span>

          {/* The planet — dark sphere, starlight sheen */}
          <span className="brand-intro-planet-sphere" aria-hidden="true" />

          {/* Hot crescent on the lit limb */}
          <span className="brand-intro-crescent" aria-hidden="true" />

          {/* Inner orbit path — glowing satellite circling the planet */}
          <span className="brand-intro-orbit brand-intro-orbit-a" aria-hidden="true">
            <span className="brand-intro-ring brand-intro-ring-1">
              <i className="brand-intro-satellite" />
            </span>
          </span>
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

    </div>
  )
}
