import { useEffect, useRef, useState } from 'react'
import { Blaze } from '../canvasui/Blaze'

const TOTAL_FRAMES = 121

// Optimized source frames (1280x2276 WebP; subject ends at Y = 1813 which is
// the same 3060/3840 crop ratio as the original 2160x3840 masters).
const SOURCE_WIDTH = 1280
const CROPPED_SOURCE_HEIGHT = 1813

// Performance budget: retina beyond 2x is imperceptible for a photo sequence,
// and 1600px-tall bitmaps stay crisp up to ~1440p native displays.
const MAX_DPR = 2
const MAX_BITMAP_HEIGHT = 1600

// The first frames (before the preloader lifts) load at full speed. With the
// WebGL fire not mounting until the reveal, we can afford more workers.
const LOAD_CONCURRENCY = 8

// Frames streaming in after the reveal use low concurrency + yielded tasks
// so background decoding never stutters the initial scroll movement.
const STREAM_CONCURRENCY = 2

// Lift the preloader as soon as the first frames are ready — the user starts
// scrolling at frame 1 anyway, and the rest streams in behind the scenes.
const REVEAL_THRESHOLD = 10

export function ScrollHeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)

  // Pre-cropped, pre-scaled GPU bitmaps — the ONLY thing kept in memory.
  const bitmapsRef = useRef<(ImageBitmap | undefined)[]>([])

  const [isLoading, setIsLoading] = useState(true)
  const [overlayGone, setOverlayGone] = useState(false)
  const [readyPercent, setReadyPercent] = useState(0)

  // Track last rendered frame index to avoid unnecessary redrawing
  const currentFrameRef = useRef(1)

  // Highest frame index that has been successfully decoded (used for fast
  // fallback during initial scroll before the full sequence is ready).
  const maxLoadedRef = useRef(0)

  // Cached container geometry so scroll handler never forces layout.
  const geometryRef = useRef({ top: 0, height: 0 })

  // RAF id for coalescing scroll updates to one calculation + draw per frame.
  const scrollRafRef = useRef<number | null>(null)

  // Helper to resolve frame image URL (ezgif-frame-001.webp through 121.webp)
  const getFrameUrl = (frameIndex: number) => {
    const padded = String(frameIndex).padStart(3, '0')
    return `/Frist-opt/ezgif-frame-${padded}.webp`
  }

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

  // Opaque + desynchronized context: no alpha compositing, lowest draw latency.
  const ensureContext = () => {
    if (!ctxRef.current && canvasRef.current) {
      ctxRef.current = canvasRef.current.getContext('2d', {
        alpha: false,
        desynchronized: true,
      })
    }
    return ctxRef.current
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
    // Opaque fill covers previous frame in letterboxed areas.
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, width, height)

    const bmpW = bitmap.width
    const bmpH = bitmap.height

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
    const offsetX = (width - renderW) / 2
    const offsetY = height - renderH

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

    const loadImage = (src: string) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = () => reject(new Error(`Failed to load ${src}`))
        img.src = src
      })

    // Count frames 1..n that are decoded and ready, in scroll order.
    const countConsecutiveReady = () => {
      let n = 0
      while (n < TOTAL_FRAMES && bitmaps[n]) n++
      return n
    }

    const prepareFrame = async (frameIndex: number) => {
      try {
        const img = await loadImage(getFrameUrl(frameIndex))
        let bitmap: ImageBitmap
        try {
          // Crop (0,0,1280,1813) and resize to display resolution in one step.
          // 'medium' filtering: this is only a ~0.9x downscale, so it looks
          // identical to 'high' but costs a fraction of the CPU — that keeps
          // background streaming from fighting the first scrolls.
          bitmap = await createImageBitmap(
            img,
            0,
            0,
            SOURCE_WIDTH,
            CROPPED_SOURCE_HEIGHT,
            { resizeWidth: bmpW, resizeHeight: bmpH, resizeQuality: 'medium' }
          )
        } catch {
          // Older engines without resize options: full-size bitmap still works.
          bitmap = await createImageBitmap(img)
        }
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

      // Source image element goes out of scope here and is garbage collected —
      // only the small scaled bitmap stays alive.
      completed++
      if (cancelled) return

      const allDone = completed === TOTAL_FRAMES

      // Paint frame 1 as soon as it exists so the hero is never blank.
      // Defer to the next animation frame so the decode callback doesn't
      // steal main-thread time from the scroll handler.
      if (frameIndex === 1) {
        requestAnimationFrame(() => drawFrame(1))
      }

      // After the reveal, skip all further React state updates — re-rendering
      // during the user's first scrolls would steal main-thread time from
      // the canvas draws.
      if (!revealed) {
        const consecutive = countConsecutiveReady()

        // Progress is measured against the reveal threshold so the loader
        // always completes at exactly 100% right before it lifts.
        const basis = allDone ? REVEAL_THRESHOLD : Math.min(consecutive, REVEAL_THRESHOLD)
        setReadyPercent(Math.round((basis / REVEAL_THRESHOLD) * 100))

        // Lift the preloader early — remaining frames stream in behind it.
        if (consecutive >= REVEAL_THRESHOLD || allDone) {
          revealed = true
          setIsLoading(false)
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

    // Phase 1: the frames needed for the reveal load at full speed, so the
    // preloader lifts just as fast as before.
    // Phase 2: the rest stream in gently — low concurrency, yielded tasks —
    // so background decoding can't jank the initial scroll movement.
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

  // Unmount the preloader overlay after its exit transition finishes.
  useEffect(() => {
    if (isLoading) return
    const timer = window.setTimeout(() => setOverlayGone(true), 700)
    return () => window.clearTimeout(timer)
  }, [isLoading])

  // The hero canvas only exists after Blaze mounts (post-reveal), so once
  // loading completes we paint the current frame and re-attach the scroll
  // mapping so the hero is never blank behind the lifting preloader.
  useEffect(() => {
    if (isLoading) return
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
  }, [isLoading])

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

  // Preloader ring geometry
  const RING_RADIUS = 56
  const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS

  return (
    <div ref={containerRef} className="relative w-full bg-black" style={{ height: '350vh' }}>
      {/* Sticky Hero Container pinned during scroll sequence */}
      <div
        className="sticky top-0 left-0 w-full h-screen overflow-hidden bg-black flex items-center justify-center select-none"
        style={{ willChange: 'transform' }}
      >

        {/* Blaze fire — only on the hero, burning from the bottom to the
            middle of the screen (height = 0.5 of the viewport). Mounted only
            after the preloader lifts so the heavy WebGL effect never competes
            with the initial frame decoding. */}
        {!isLoading && (
        <Blaze
          height={0.5}
          distortion={0.6}
          distortionScale={0.5}
          speed={1}
          sparks={1.5}
          sparkDensity={1.8}
          sparkSize={1}
          layers={4}
          smoke={1.1}
          glow={2.8}
          sparkColor={[1, 0.4, 0.051]}
          smokeColor={[1, 0.4314, 0.102]}
          style={{ position: 'absolute', inset: 0 }}
        >
          <div className="relative w-full h-full">

        {/* HTML5 Canvas for ultra-smooth image sequence rendering */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block"
          style={{ willChange: 'transform', transform: 'translateZ(0)' }}
        />

        {/* Subtle Radial Edge Vignette Falloff */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.85)_100%)] z-10" />

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
                <div className="text-lg sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                  15 +
                </div>
                <div className="text-[8px] sm:text-xs text-gray-300/80 font-semibold mt-0.5 tracking-wider whitespace-nowrap uppercase">
                  Projects Completed
                </div>
              </div>
            </div>

            <div className="hidden sm:block h-8 sm:h-12 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent" />

            <div className="relative flex flex-1 sm:flex-none items-center justify-center sm:justify-start gap-2 sm:gap-4 group/stat cursor-default">
              <div className="text-left">
                <div className="text-lg sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
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
                <div className="text-lg sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
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

        {/* Preloader Overlay — sits ABOVE the fire effect (rendered outside
            Blaze) so the load screen stays a clean, static black canvas with
            no heat distortion or lag. Lifts after the first frames, exits
            with a fade/scale. */}
        {!overlayGone && (
          <div
            className={`absolute inset-0 z-50 bg-black flex flex-col items-center justify-center transition-all duration-700 ease-out ${isLoading ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
              }`}
          >
            {/* Breathing ambient glow */}
            <div className="absolute w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] rounded-full bg-[#FF5E4D]/15 blur-[100px] animate-pulse-slow" />

            {/* Progress ring with orbiting dashed accent */}
            <div className="relative w-32 h-32 sm:w-40 sm:h-40">
              <svg
                viewBox="0 0 144 144"
                className="absolute inset-0 w-full h-full -rotate-90"
              >
                <circle
                  cx="72" cy="72" r={RING_RADIUS}
                  fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3"
                />
                <circle
                  cx="72" cy="72" r={RING_RADIUS}
                  fill="none" stroke="#FF5E4D" strokeWidth="3" strokeLinecap="round"
                  strokeDasharray={RING_CIRCUMFERENCE}
                  strokeDashoffset={RING_CIRCUMFERENCE * (1 - readyPercent / 100)}
                  className="transition-[stroke-dashoffset] duration-300 ease-out drop-shadow-[0_0_10px_rgba(255,94,77,0.8)]"
                />
              </svg>
              <svg
                viewBox="0 0 144 144"
                className="absolute inset-0 w-full h-full hero-loader-orbit"
              >
                <circle
                  cx="72" cy="72" r="66"
                  fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="1"
                  strokeDasharray="2 8"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl sm:text-4xl font-black text-white tabular-nums">
                  {readyPercent}
                  <span className="text-sm sm:text-lg font-bold text-[#FF5E4D]">%</span>
                </span>
              </div>
            </div>

            {/* Brand wordmark — staggered letter reveal with shimmer sweep */}
            <div className="relative mt-8 sm:mt-10 flex justify-center px-4" aria-label="Vizualabs">
              {'VIZUALABS'.split('').map((letter, i) => (
                <span
                  key={i}
                  className="hero-loader-letter text-3xl sm:text-5xl font-black tracking-[0.14em] sm:tracking-[0.16em]"
                  style={{ animationDelay: `${i * 70}ms, 0ms` }}
                >
                  {letter}
                </span>
              ))}
            </div>

            <p className="relative mt-4 text-[10px] sm:text-xs tracking-[0.45em] uppercase text-gray-500 font-semibold animate-pulse">
              Crafting the Experience
            </p>

            {/* Hairline progress bar pinned to the bottom edge */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5">
              <div
                className="h-full origin-left bg-[#FF5E4D] shadow-[0_0_12px_#FF5E4D] transition-transform duration-300 ease-out"
                style={{ transform: `scaleX(${readyPercent / 100})` }}
              />
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
