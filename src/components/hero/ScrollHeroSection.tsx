import { useEffect, useRef, useState } from 'react'
import { FolderCheck, Users, HeartHandshake } from 'lucide-react'

const TOTAL_FRAMES = 121

// Optimized source frames (1280x2276 WebP; subject ends at Y = 1813 which is
// the same 3060/3840 crop ratio as the original 2160x3840 masters).
const SOURCE_WIDTH = 1280
const CROPPED_SOURCE_HEIGHT = 1813

// Performance budget: retina beyond 2x is imperceptible for a photo sequence,
// and 1600px-tall bitmaps stay crisp up to ~1440p native displays.
const MAX_DPR = 2
const MAX_BITMAP_HEIGHT = 1600

// The first frames (before the preloader lifts) load at full speed.
const LOAD_CONCURRENCY = 6

// Frames streaming in after the reveal use low concurrency + yielded tasks
// so background decoding never stutters the initial scroll movement.
const STREAM_CONCURRENCY = 2

// Lift the preloader as soon as the first frames are ready — the user starts
// scrolling at frame 1 anyway, and the rest streams in behind the scenes.
const REVEAL_THRESHOLD = 15

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
  const rafIdRef = useRef<number | null>(null)

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
   */
  const findReadyFrame = (target: number) => {
    const bitmaps = bitmapsRef.current
    if (bitmaps[target - 1]) return target
    for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
      const prev = target - offset
      if (prev >= 1 && bitmaps[prev - 1]) return prev
      const next = target + offset
      if (next <= TOTAL_FRAMES && bitmaps[next - 1]) return next
    }
    return 0
  }

  /**
   * SCROLL-TO-FRAME MAPPING LOGIC
   * 1. Get current scroll rect of sticky wrapper (350vh total height).
   * 2. Calculate scroll distance relative to viewport.
   * 3. Normalize scroll progress in range [0, 1].
   * 4. Map [0, 1] linearly to frame index [1, 121].
   * 5. Coalesce redraws through requestAnimationFrame, only when the frame changes.
   */
  const updateFrameFromScroll = () => {
    const container = containerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    const scrollableDistance = rect.height - window.innerHeight

    if (scrollableDistance <= 0) return

    // rect.top is 0 when container top hits viewport top.
    // Progress goes from 0 (start of sticky container) to 1 (end of scroll).
    const scrollProgress = Math.min(1, Math.max(0, -rect.top / scrollableDistance))

    // Map progress linearly to 1-based frame index
    const targetFrame = Math.min(
      TOTAL_FRAMES,
      Math.max(1, Math.floor(scrollProgress * (TOTAL_FRAMES - 1)) + 1)
    )

    // During streaming, draw the closest frame that is already decoded
    const readyFrame = findReadyFrame(targetFrame)
    if (readyFrame === 0) return

    // Redraw only if target frame index actually changes
    if (readyFrame !== currentFrameRef.current) {
      currentFrameRef.current = readyFrame
      if (!rafIdRef.current) {
        rafIdRef.current = requestAnimationFrame(() => {
          drawFrame(currentFrameRef.current)
          rafIdRef.current = null
        })
      }
    }
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
      if (frameIndex === 1) drawFrame(1)

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
        // Paint the exact frame in case the user scrolled during preload.
        requestAnimationFrame(() => updateFrameFromScroll())
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
    }
  }, [])

  // Unmount the preloader overlay after its exit transition finishes.
  useEffect(() => {
    if (isLoading) return
    const timer = window.setTimeout(() => setOverlayGone(true), 700)
    return () => window.clearTimeout(timer)
  }, [isLoading])

  // Attach scroll & resize listeners
  useEffect(() => {
    const handleScroll = () => {
      updateFrameFromScroll()
    }

    const handleResize = () => {
      drawFrame(currentFrameRef.current)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)

    // Initial check in case user loaded page mid-scroll
    updateFrameFromScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [])

  // Preloader ring geometry
  const RING_RADIUS = 56
  const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS

  return (
    <div ref={containerRef} className="relative w-full bg-black" style={{ height: '350vh' }}>
      {/* Sticky Hero Container pinned during scroll sequence */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden bg-black flex items-center justify-center select-none">

        {/* Preloader Overlay — lifts after the first frames, exits with a fade/scale */}
        {!overlayGone && (
          <div
            className={`absolute inset-0 z-50 bg-black flex flex-col items-center justify-center transition-all duration-700 ease-out ${isLoading ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
              }`}
          >
            {/* Breathing ambient glow */}
            <div className="absolute w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] rounded-full bg-[#FF5E4D]/15 blur-[100px] animate-pulse-slow" />

            {/* Progress ring with orbiting dashed accent */}
            <div className="relative w-36 h-36 sm:w-40 sm:h-40">
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
                <span className="text-3xl sm:text-4xl font-black text-white tabular-nums">
                  {readyPercent}
                  <span className="text-base sm:text-lg font-bold text-[#FF5E4D]">%</span>
                </span>
              </div>
            </div>

            {/* Brand wordmark — staggered letter reveal with shimmer sweep */}
            <div className="relative mt-10 flex justify-center" aria-label="Vizualabs">
              {'VIZUALABS'.split('').map((letter, i) => (
                <span
                  key={i}
                  className="hero-loader-letter text-4xl sm:text-5xl font-black tracking-[0.16em]"
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

        {/* HTML5 Canvas for ultra-smooth image sequence rendering */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block"
        />

        {/* Subtle Radial Edge Vignette Falloff */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.85)_100%)] z-10" />

        {/* Top Center Pill Badge */}
        <div className="absolute top-6 sm:top-10 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#FF5E4D]/40 bg-black/60 backdrop-blur-md shadow-lg shadow-[#FF5E4D]/10">
            <span className="w-2 h-2 rounded-full bg-[#FF5E4D] animate-pulse shadow-[0_0_8px_#FF5E4D]" />
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-[#FF5E4D] uppercase">
              ENGINEERING STRATEGIC MOMENTUM
            </span>
          </div>
        </div>


        {/* Bottom Left Navigation Title */}
        <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 z-20 pointer-events-none">
          <span className="text-sm sm:text-base font-semibold text-gray-200 tracking-wider">
            Our Approach
          </span>
        </div>

        {/* Bottom Right Premium Glassmorphic Stats Card */}
        <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 z-20 pointer-events-auto">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl px-4 py-4 sm:px-8 sm:py-6 flex items-center gap-5 sm:gap-10 bg-gradient-to-br from-white/[0.14] via-white/[0.07] to-white/[0.03] backdrop-blur-2xl backdrop-saturate-150 border border-white/[0.18] shadow-[0_24px_60px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.25)]">
            {/* Top edge light sheen */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            {/* Soft accent corner glow */}
            <div className="pointer-events-none absolute -top-14 -right-14 h-36 w-36 rounded-full bg-[#FF5E4D]/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-10 h-36 w-36 rounded-full bg-white/10 blur-3xl" />

            <div className="relative flex items-center gap-3 sm:gap-4 group/stat cursor-default">
              <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-300 group-hover/stat:bg-[#FF5E4D]/20 group-hover/stat:border-[#FF5E4D]/40 group-hover/stat:scale-105">
                <FolderCheck className="h-4 w-4 sm:h-5 sm:w-5 text-[#FF5E4D]" />
              </div>
              <div className="text-left">
                <div className="text-xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                  15 +
                </div>
                <div className="text-[9px] sm:text-xs text-gray-300/80 font-semibold mt-0.5 tracking-wider whitespace-nowrap uppercase">
                  Projects Completed
                </div>
              </div>
            </div>

            <div className="h-8 sm:h-12 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent" />

            <div className="relative flex items-center gap-3 sm:gap-4 group/stat cursor-default">
              <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-300 group-hover/stat:bg-[#FF5E4D]/20 group-hover/stat:border-[#FF5E4D]/40 group-hover/stat:scale-105">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-[#FF5E4D]" />
              </div>
              <div className="text-left">
                <div className="text-xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                  300+
                </div>
                <div className="text-[9px] sm:text-xs text-gray-300/80 font-semibold mt-0.5 tracking-wider whitespace-nowrap uppercase">
                  People Reach
                </div>
              </div>
            </div>

            <div className="h-8 sm:h-12 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent" />

            <div className="relative flex items-center gap-3 sm:gap-4 group/stat cursor-default">
              <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-300 group-hover/stat:bg-[#FF5E4D]/20 group-hover/stat:border-[#FF5E4D]/40 group-hover/stat:scale-105">
                <HeartHandshake className="h-4 w-4 sm:h-5 sm:w-5 text-[#FF5E4D]" />
              </div>
              <div className="text-left">
                <div className="text-xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                  100%
                </div>
                <div className="text-[9px] sm:text-xs text-gray-300/80 font-semibold mt-0.5 tracking-wider whitespace-nowrap uppercase">
                  Clients' Satisfaction
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
