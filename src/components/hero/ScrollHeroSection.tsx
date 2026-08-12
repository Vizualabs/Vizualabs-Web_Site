import { useEffect, useRef, useState } from 'react'
import { Blaze } from '../canvasui/Blaze'
import { BrandIntro, type IntroPhase } from './BrandIntro'
import { HeroTitle } from './HeroTitle'
import { TOTAL_FRAMES, heroFrameUrl } from './heroFrames'

// Optimized source frames (1280x2276 WebP; subject ends at Y = 1813 which is
// the same 3060/3840 crop ratio as the original 2160x3840 masters).
const SOURCE_WIDTH = 1280
const CROPPED_SOURCE_HEIGHT = 1813

// Performance budget: retina beyond 2x is imperceptible for a photo sequence,
// and 1600px-tall bitmaps stay crisp up to ~1440p native displays.
const MAX_DPR = 2
const MAX_BITMAP_HEIGHT = 1600

// The frames needed for the reveal load at full speed behind the intro.
const LOAD_CONCURRENCY = 8

// Frames streaming in after the reveal. Decoding is off the main thread now
// (fetch -> Blob -> createImageBitmap), so this no longer competes with the
// user's first scroll and can run wider than the old serialized pipeline.
const STREAM_CONCURRENCY = 4

// How many frames must be decoded before the intro is allowed to lift. This
// buys roughly the first fifth of the scroll distance as pre-buffered frames,
// so the sequence tracks the very first scroll instead of freezing on the last
// decoded frame — the main cause of the "lag" on initial load.
const REVEAL_THRESHOLD = 24

// The branded intro runs for at least this long so it reads as an intentional
// animation rather than a flash. Frame decoding happens underneath it, so on
// a warm cache this is the only thing gating the reveal.
const MIN_INTRO_MS = 1150

// Beat between mounting the WebGL fire and starting the reveal. Shader compile
// and texture allocation are synchronous main-thread work; paying that cost
// here — while the plane is still fully opaque — keeps it off the first scroll.
const WARMUP_MS = 240

// Must match the iris animation duration in styles.css.
const REVEAL_MS = 900

export function ScrollHeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)

  // Pre-cropped, pre-scaled GPU bitmaps — the ONLY thing kept in memory.
  const bitmapsRef = useRef<(ImageBitmap | undefined)[]>([])

  // 'intro'     — opaque plane, mark drawing, fire not yet mounted, scroll locked
  // 'warmup'    — still opaque, fire mounting behind it, scroll locked
  // 'revealing' — iris opening, scroll unlocked
  // 'done'      — overlay unmounted
  const [phase, setPhase] = useState<IntroPhase | 'done'>('intro')
  const [framesReady, setFramesReady] = useState(false)

  // Scroll stays locked while the plane is still opaque.
  const isLoading = phase === 'intro' || phase === 'warmup'
  // The canvas lives inside Blaze, so it only exists from 'warmup' onward.
  const fireMounted = phase !== 'intro'

  // Track last rendered frame index to avoid unnecessary redrawing
  const currentFrameRef = useRef(1)

  // Highest frame index that has been successfully decoded (used for fast
  // fallback during initial scroll before the full sequence is ready).
  const maxLoadedRef = useRef(0)

  // Cached container geometry so scroll handler never forces layout.
  const geometryRef = useRef({ top: 0, height: 0 })

  // Wall-clock mount time, used to give the intro animation its minimum beat.
  const mountedAtRef = useRef(
    typeof performance !== 'undefined' ? performance.now() : 0
  )

  // RAF id for coalescing scroll updates to one calculation + draw per frame.
  const scrollRafRef = useRef<number | null>(null)

  /**
   * Target bitmap resolution: match the physical pixels the sequence can ever
   * be rendered at (screen height is the upper bound for window height), so
   * scroll-time draws are a same-size blit with zero resampling cost.
   */
  const getBitmapSize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
    const upperBoundCssHeight = Math.max(
      window.innerHeight,
      window.screen?.height ?? 0
    )
    const height = Math.min(
      Math.ceil(upperBoundCssHeight * dpr * 1.05),
      MAX_BITMAP_HEIGHT
    )
    const width = Math.round((SOURCE_WIDTH / CROPPED_SOURCE_HEIGHT) * height)
    return { width, height }
  }

  /**
   * The canvas now needs an alpha channel: it is masked to the subject's
   * silhouette so the heading can sit underneath it. Without alpha the frame's
   * own black backdrop would paint an opaque rectangle over the text.
   */
  const ensureContext = () => {
    if (!ctxRef.current && canvasRef.current) {
      ctxRef.current = canvasRef.current.getContext('2d', {
        alpha: true,
        desynchronized: true,
      })
    }
    return ctxRef.current
  }

  /**
   * Where the frame lands inside the viewport, in CSS pixels.
   *
   * Single source of truth: drawFrame calls it with the real bitmap size, and
   * the silhouette mask calls it with the source aspect so the mask always
   * lines up with the pixels being drawn.
   */
  const computeImageRect = (bmpW: number, bmpH: number) => {
    const width = window.innerWidth
    const height = window.innerHeight
    const isMobile = width < 768

    // Scale image significantly larger while staying anchored flush at hero bottom
    const targetRenderHeight = isMobile ? height * 1.05 : height * 0.96
    let scale = targetRenderHeight / bmpH

    // Ensure minimum scale on very narrow screens so subject doesn't shrink too small
    if (isMobile) {
      const minWScale = (width * 0.92) / bmpW
      scale = Math.max(scale, minWScale)
    }

    const renderW = bmpW * scale
    const renderH = bmpH * scale

    // Center horizontally, anchor bottom flush to the hero bottom
    return {
      renderW,
      renderH,
      offsetX: (width - renderW) / 2,
      offsetY: height - renderH,
      width,
      height,
    }
  }

  // Point the CSS silhouette mask at exactly the rect the frame is drawn into.
  const syncMaskGeometry = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const { renderW, renderH, offsetX, offsetY } = computeImageRect(
      SOURCE_WIDTH,
      CROPPED_SOURCE_HEIGHT
    )
    canvas.style.setProperty('--hero-mask-size', `${renderW}px ${renderH}px`)
    canvas.style.setProperty('--hero-mask-pos', `${offsetX}px ${offsetY}px`)
  }

  // Keep canvas bitmap size in sync with the viewport (call on resize).
  const syncCanvasSize = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = ensureContext()
    if (!ctx) return
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
    const targetW = Math.round(window.innerWidth * dpr)
    const targetH = Math.round(window.innerHeight * dpr)
    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW
      canvas.height = targetH
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
    }
    syncMaskGeometry()
  }

  // Draw specific frame. Bitmaps are already cropped & scaled to display
  // resolution, so drawImage here is a cheap GPU blit — no decode, no resample.
  const drawFrame = (frameIndex: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = ensureContext()
    if (!ctx) return

    const bitmap = bitmapsRef.current[frameIndex - 1]
    if (!bitmap) return

    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
    const width = window.innerWidth
    const height = window.innerHeight

    // Ensure physical canvas resolution accounts for retina screens
    const targetW = Math.round(width * dpr)
    const targetH = Math.round(height * dpr)
    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW
      canvas.height = targetH
      // Resizing the canvas resets context state — reapply once.
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    // Clear rather than fill: the backdrop must stay transparent so the
    // heading underneath shows through everywhere the mask cuts away.
    ctx.clearRect(0, 0, width, height)

    const { renderW, renderH, offsetX, offsetY } = computeImageRect(
      bitmap.width,
      bitmap.height
    )

    ctx.drawImage(bitmap, offsetX, offsetY, renderW, renderH)
  }

  /**
   * While later frames are still streaming, fall back to the nearest decoded
   * frame so scrolling always stays fluid. Once everything is loaded the
   * exact frame is always available and this is a direct hit.
   *
   * Optimised path: if the target isn't ready yet and sits beyond the highest
   * loaded frame, we immediately clamp to that frame instead of scanning.
   * This turns the common initial-scroll case from O(n) into O(1).
   */
  const findReadyFrame = (target: number) => {
    const bitmaps = bitmapsRef.current
    if (bitmaps[target - 1]) return target
    const max = maxLoadedRef.current
    if (target > max && max > 0) return max
    for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
      const prev = target - offset
      if (prev >= 1 && bitmaps[prev - 1]) return prev
      const next = target + offset
      if (next <= TOTAL_FRAMES && bitmaps[next - 1]) return next
    }
    return 0
  }

  /**
   * Map current scroll position to a frame index using cached geometry.
   * This avoids a forced synchronous layout (getBoundingClientRect) on every
   * scroll event — the biggest single source of jank in the old handler.
   */
  const readScrollFrame = () => {
    const geom = geometryRef.current
    const scrollableDistance = geom.height - window.innerHeight
    if (scrollableDistance <= 0) return 0

    const scrollProgress = Math.min(
      1,
      Math.max(0, (window.scrollY - geom.top) / scrollableDistance)
    )

    return Math.min(
      TOTAL_FRAMES,
      Math.max(1, Math.floor(scrollProgress * (TOTAL_FRAMES - 1)) + 1)
    )
  }

  /**
   * PRELOAD PIPELINE
   * Each frame is decoded exactly ONCE, cropped to the subject area and
   * downscaled to display resolution via createImageBitmap (runs off the main
   * thread in modern browsers). Frames load in order 1..121, so the preloader
   * lifts after the first REVEAL_THRESHOLD frames and the rest streams in
   * while the user is already watching the hero.
   */
  useEffect(() => {
    let cancelled = false
    let revealed = false
    const { width: bmpW, height: bmpH } = getBitmapSize()
    const bitmaps: (ImageBitmap | undefined)[] = new Array(TOTAL_FRAMES)
    bitmapsRef.current = bitmaps
    let completed = 0

    /**
     * Decode a frame entirely OFF the main thread.
     *
     * The old pipeline went through an HTMLImageElement, whose decode is
     * charged to the main thread and lands in the middle of the user's first
     * scroll. Handing a Blob straight to createImageBitmap lets the browser
     * decode, crop and downscale on a worker thread, so streaming the tail of
     * the sequence can no longer stall scroll-driven canvas draws.
     */
    const decodeFrame = async (frameIndex: number): Promise<ImageBitmap> => {
      const response = await fetch(heroFrameUrl(frameIndex))
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const blob = await response.blob()

      try {
        // Crop (0,0,1280,1813) and resize to display resolution in one step.
        // 'medium' filtering: this is only a ~0.9x downscale, so it looks
        // identical to 'high' but costs a fraction of the CPU.
        return await createImageBitmap(
          blob,
          0,
          0,
          SOURCE_WIDTH,
          CROPPED_SOURCE_HEIGHT,
          { resizeWidth: bmpW, resizeHeight: bmpH, resizeQuality: 'medium' }
        )
      } catch {
        // Engines without crop/resize options still give us a usable bitmap.
        return await createImageBitmap(blob)
      }
    }

    // Count frames 1..n that are decoded and ready, in scroll order.
    const countConsecutiveReady = () => {
      let n = 0
      while (n < TOTAL_FRAMES && bitmaps[n]) n++
      return n
    }

    const prepareFrame = async (frameIndex: number) => {
      try {
        const bitmap = await decodeFrame(frameIndex)
        if (cancelled) {
          bitmap.close()
          return
        }
        bitmaps[frameIndex - 1] = bitmap
        if (frameIndex > maxLoadedRef.current) {
          maxLoadedRef.current = frameIndex
        }
      } catch {
        // Missing/broken frame: patched to frame 1 after the load completes.
        bitmaps[frameIndex - 1] = undefined
      }

      completed++
      if (cancelled) return

      const allDone = completed === TOTAL_FRAMES

      // Paint frame 1 as soon as it exists so the hero is never blank.
      // Defer to the next animation frame so the decode callback doesn't
      // steal main-thread time from the scroll handler.
      if (frameIndex === 1) {
        requestAnimationFrame(() => drawFrame(1))
      }

      // Exactly one state update during the whole load — re-rendering while
      // frames stream in would steal main-thread time from the canvas draws.
      if (!revealed) {
        const consecutive = countConsecutiveReady()
        if (consecutive >= REVEAL_THRESHOLD || allDone) {
          revealed = true
          setFramesReady(true)
        }
      }

      if (allDone) {
        // Patch any failed frames with frame 1 so playback never stalls.
        for (let i = 0; i < TOTAL_FRAMES; i++) {
          if (!bitmaps[i]) bitmaps[i] = bitmaps[0]
        }
        maxLoadedRef.current = TOTAL_FRAMES
        // Paint the exact frame in case the user scrolled during preload.
        requestAnimationFrame(() => {
          syncCanvasSize()
          const target = readScrollFrame()
          const ready = target > 0 ? findReadyFrame(target) : currentFrameRef.current
          if (ready !== 0 && ready !== currentFrameRef.current) {
            currentFrameRef.current = ready
          }
          drawFrame(currentFrameRef.current)
        })
      }
    }

    const runPhase = async (
      from: number,
      to: number,
      concurrency: number,
      yieldBetweenFrames: boolean
    ) => {
      const queue: number[] = []
      for (let i = from; i <= to; i++) queue.push(i)
      const workers = Array.from({ length: concurrency }, async () => {
        while (queue.length > 0) {
          if (cancelled) return
          const next = queue.shift()
          if (next === undefined) return
          await prepareFrame(next)
          // Yield a macrotask so scroll/rAF work always wins the main thread.
          if (yieldBetweenFrames) {
            await new Promise((resolve) => setTimeout(resolve, 0))
          }
        }
      })
      await Promise.all(workers)
    }

    // Phase 1: the frames gating the reveal load at full speed behind the
    // opaque intro plane.
    // Phase 2: the rest stream in while the user watches the hero. Decoding
    // is off-thread now, so the remaining main-thread cost is negligible; the
    // macrotask yield stays as a cheap guarantee that scroll/rAF work always
    // gets a turn between frames.
    void (async () => {
      await runPhase(1, REVEAL_THRESHOLD, LOAD_CONCURRENCY, false)
      await runPhase(REVEAL_THRESHOLD + 1, TOTAL_FRAMES, STREAM_CONCURRENCY, true)
    })()

    return () => {
      cancelled = true
      // Release GPU textures on unmount.
      for (const bitmap of bitmaps) bitmap?.close()
      bitmapsRef.current = []
      maxLoadedRef.current = 0
    }
  }, [])

  /**
   * Intro choreography.
   *
   * 'intro' holds until BOTH the minimum animation beat has played and enough
   * frames are decoded. Then the fire mounts behind the still-opaque plane
   * ('warmup') so its shader compile cannot land on the user's first scroll,
   * and only then does the iris open ('revealing').
   */
  /*
   * One effect per hop, each owning exactly one timer.
   *
   * Chaining the hops inside a single effect deadlocks: setting the next phase
   * re-runs the effect, and its cleanup cancels the timer the previous tick had
   * just scheduled in the same closure.
   */

  // intro -> warmup, once frames are decoded AND the animation beat has played.
  useEffect(() => {
    if (phase !== 'intro' || !framesReady) return
    const elapsed = performance.now() - mountedAtRef.current
    const remaining = Math.max(0, MIN_INTRO_MS - elapsed)
    const timer = window.setTimeout(() => setPhase('warmup'), remaining)
    return () => window.clearTimeout(timer)
  }, [phase, framesReady])

  // warmup -> revealing, giving the fire a beat to compile behind the plane.
  useEffect(() => {
    if (phase !== 'warmup') return
    const timer = window.setTimeout(() => setPhase('revealing'), WARMUP_MS)
    return () => window.clearTimeout(timer)
  }, [phase])

  // revealing -> done, unmounting the overlay after the iris finishes.
  useEffect(() => {
    if (phase !== 'revealing') return
    const timer = window.setTimeout(() => setPhase('done'), REVEAL_MS)
    return () => window.clearTimeout(timer)
  }, [phase])

  /**
   * Hold scroll while the intro is on screen. Without this the user can scroll
   * behind an opaque overlay into frames that have not been decoded yet, and
   * arrive at a hero that is frozen on the last available frame — which reads
   * as scroll lag. `scrollbar-gutter: stable` on <html> keeps the lock from
   * shifting layout.
   */
  useEffect(() => {
    if (!isLoading) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [isLoading])

  // The hero canvas only exists once Blaze mounts, so paint the current frame
  // as soon as it does — during 'warmup', while the plane is still opaque —
  // guaranteeing a fully drawn hero the instant the iris opens.
  useEffect(() => {
    if (!fireMounted) return
    const raf = requestAnimationFrame(() => {
      syncCanvasSize()
      const target = readScrollFrame()
      const ready = target > 0 ? findReadyFrame(target) : currentFrameRef.current
      if (ready !== 0 && ready !== currentFrameRef.current) {
        currentFrameRef.current = ready
      }
      drawFrame(currentFrameRef.current)
    })
    return () => cancelAnimationFrame(raf)
  }, [fireMounted])

  // Attach scroll & resize listeners
  useEffect(() => {
    const updateGeometry = () => {
      const container = containerRef.current
      if (!container) return
      const rect = container.getBoundingClientRect()
      geometryRef.current = {
        top: rect.top + window.scrollY,
        height: rect.height,
      }
    }

    /**
     * Coalesce all scroll calculations into a single RAF per frame.
     * The handler itself does ZERO work — it just schedules. This guarantees
     * that layout reads and canvas draws never run more than once per frame,
     * and never fight with the browser's own scroll thread.
     *
     * The heading is deliberately NOT touched here: it stays pinned (its
     * line-two marquee is a pure-CSS animation) so scroll work per frame is
     * exactly one canvas draw.
     */
    const handleScroll = () => {
      if (scrollRafRef.current) return
      scrollRafRef.current = requestAnimationFrame(() => {
        scrollRafRef.current = null
        const targetFrame = readScrollFrame()
        if (targetFrame === 0) return
        const readyFrame = findReadyFrame(targetFrame)
        if (readyFrame !== 0 && readyFrame !== currentFrameRef.current) {
          currentFrameRef.current = readyFrame
          drawFrame(readyFrame)
        }
      })
    }

    const handleResize = () => {
      updateGeometry()
      syncCanvasSize()
      drawFrame(currentFrameRef.current)
    }

    // One-time layout read, then keep geometry in sync on resize only.
    updateGeometry()
    syncCanvasSize()

    // Initial check in case user loaded page mid-scroll.
    const initialTarget = readScrollFrame()
    if (initialTarget > 0) {
      const ready = findReadyFrame(initialTarget)
      if (ready !== 0 && ready !== currentFrameRef.current) {
        currentFrameRef.current = ready
      }
    }
    drawFrame(currentFrameRef.current)

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      if (scrollRafRef.current) {
        cancelAnimationFrame(scrollRafRef.current)
        scrollRafRef.current = null
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      data-testid="hero-scroll-container"
      className="relative w-full bg-black"
      style={{ height: '350vh' }}
    >
      {/* Sticky Hero Container pinned during scroll sequence */}
      <div
        className="sticky top-0 left-0 w-full h-screen overflow-hidden bg-black flex items-center justify-center select-none"
        style={{ willChange: 'transform' }}
      >

        {/* Blaze fire — only on the hero, burning from the bottom to the
            middle of the screen (height = 0.5 of the viewport). Mounts at the
            'warmup' beat: late enough that its WebGL setup never competes with
            decoding the first frames, early enough that the shader compile is
            paid behind the still-opaque intro plane rather than on the user's
            first scroll. */}
        {fireMounted && (
          <Blaze
            height={0.5}
            distortion={0.6}
            distortionScale={0.5}
            speed={1}
            sparks={1.7}
            sparkDensity={1.8}
            sparkSize={1}
            layers={4}
            smoke={1.3}
            glow={3.2}
            sparkColor={[1, 0, 0]}
            smokeColor={[0.6, 0, 0]}
            style={{ position: 'absolute', inset: 0 }}
          >
            <div className="relative w-full h-full">

              {/* Heading, layered UNDER the canvas so the silhouette-masked subject
            overlaps it the way the reference composition does. It stays pinned
            for the whole sequence — no scroll fade — while its line-two
            marquee loops purely in CSS, decoupled from the frame draws. */}
              <HeroTitle start={phase === 'revealing' || phase === 'done'} />

              {/* HTML5 Canvas for ultra-smooth image sequence rendering */}
              <canvas
                ref={canvasRef}
                data-testid="hero-canvas"
                /* No z-index on purpose: painting order here comes from DOM order,
                   so the canvas sits above the heading that precedes it while the
                   Blaze fire — a later sibling of this wrapper — still paints over
                   the canvas exactly as it did before. */
                className="hero-sequence-canvas absolute inset-0 w-full h-full block"
                style={{ willChange: 'transform', transform: 'translateZ(0)' }}
              />

              {/* Subtle Radial Edge Vignette Falloff */}
              {/* Widened the clear centre so the heading's outer words keep their
            contrast — at 30% the vignette was greying out "Your". Kept as an
            ellipse so the corner falloff survives without reaching into the
            headline band. */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_82%_92%_at_50%_52%,transparent_52%,rgba(0,0,0,0.72)_100%)] z-10" />

              {/* Top Center Pill Badge — tight fit on small screens */}
              <div className="absolute top-6 sm:top-10 left-1/2 -translate-x-1/2 z-20 pointer-events-none w-full flex justify-center px-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 rounded-full border border-[#FF5E4D]/40 bg-black/60 backdrop-blur-md shadow-lg shadow-[#FF5E4D]/10">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#FF5E4D] animate-pulse shadow-[0_0_8px_#FF5E4D]" />
                  <span className="text-[9px] sm:text-xs font-bold tracking-[0.14em] sm:tracking-[0.25em] text-[#FF5E4D] uppercase">
                    ENGINEERING STRATEGIC MOMENTUM
                  </span>
                </div>
              </div>


              {/* Bottom Left Navigation Title — hidden on mobile to free the bottom bar */}
              <div className="hidden sm:block absolute bottom-6 left-6 sm:bottom-10 sm:left-10 z-20 pointer-events-none">
                <span className="text-sm sm:text-base font-semibold text-gray-200 tracking-wider">
                  Our Approach
                </span>
              </div>

              {/* Bottom Right Premium Glassmorphic Stats Card — full-width row on mobile */}
              <div className="absolute inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom,0px))] sm:inset-x-auto sm:bottom-10 sm:right-10 z-20 pointer-events-auto">
                <div className="liquid-glass relative overflow-hidden rounded-none px-2 py-3 sm:px-9 sm:py-6 flex items-center justify-between gap-2 sm:justify-start sm:gap-10">
                  {/* Soft accent corner glow — kept subtle for depth without a frame */}
                  <div className="pointer-events-none absolute -top-14 -right-14 h-36 w-36 rounded-full bg-[#FF5E4D]/15 blur-3xl" />

                  <div className="relative flex flex-1 sm:flex-none items-center justify-center sm:justify-start gap-2 sm:gap-4 group/stat cursor-default">
                    <div className="text-left">
                      <div className="font-sans text-2xl sm:text-4xl font-bold text-white tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                        15+
                      </div>
                      <div className="text-[8px] sm:text-xs text-gray-300/80 font-semibold mt-0.5 tracking-wider whitespace-nowrap uppercase">
                        Projects Completed
                      </div>
                    </div>
                  </div>

                  <div className="hidden sm:block h-8 sm:h-12 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent" />

                  <div className="relative flex flex-1 sm:flex-none items-center justify-center sm:justify-start gap-2 sm:gap-4 group/stat cursor-default">
                    <div className="text-left">
                      <div className="font-sans text-2xl sm:text-4xl font-bold text-white tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                        300+
                      </div>
                      <div className="text-[8px] sm:text-xs text-gray-300/80 font-semibold mt-0.5 tracking-wider whitespace-nowrap uppercase">
                        People Reach
                      </div>
                    </div>
                  </div>

                  <div className="hidden sm:block h-8 sm:h-12 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent" />

                  <div className="relative flex flex-1 sm:flex-none items-center justify-center sm:justify-start gap-2 sm:gap-4 group/stat cursor-default">
                    <div className="text-left">
                      <div className="font-sans text-2xl sm:text-4xl font-bold text-white tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                        100%
                      </div>
                      <div className="text-[8px] sm:text-xs text-gray-300/80 font-semibold mt-0.5 tracking-wider whitespace-nowrap uppercase">
                        Clients' Satisfaction
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </Blaze>
        )}

        {/* Branded intro — rendered outside Blaze so the plane stays a clean
            flat black with no heat distortion, and sits above it so the fire
            can warm up hidden underneath. */}
        {phase !== 'done' && <BrandIntro phase={phase} />}

      </div>
    </div>
  )
}
