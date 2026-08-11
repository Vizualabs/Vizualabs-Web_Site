import { useEffect, useRef, useState } from 'react'

const TOTAL_FRAMES = 121

// Source frame geometry (ezgif frames are 2160x3840; subject ends at Y = 3060,
// the rest is black border that we crop away once at load time).
const SOURCE_WIDTH = 2160
const CROPPED_SOURCE_HEIGHT = 3060

// Performance budget: retina beyond 2x is imperceptible for a photo sequence,
// and 1600px-tall bitmaps stay crisp up to ~1440p native displays.
const MAX_DPR = 2
const MAX_BITMAP_HEIGHT = 1600

// How many frames are decoded/resized in parallel during preload.
// 6 keeps peak transient memory (~33MB per full-size decode) reasonable.
const LOAD_CONCURRENCY = 6

export function ScrollHeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)

  // Pre-cropped, pre-scaled GPU bitmaps — the ONLY thing kept in memory.
  const bitmapsRef = useRef<(ImageBitmap | undefined)[]>([])

  const [isLoading, setIsLoading] = useState(true)
  const [loadProgress, setLoadProgress] = useState(0)

  // Track last rendered frame index to avoid unnecessary redrawing
  const currentFrameRef = useRef(1)
  const rafIdRef = useRef<number | null>(null)

  // Helper to resolve frame image URL (ezgif-frame-001.jpg through 121.jpg)
  const getFrameUrl = (frameIndex: number) => {
    const padded = String(frameIndex).padStart(3, '0')
    return `/Frist/ezgif-frame-${padded}.jpg`
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

    // Redraw only if target frame index actually changes
    if (targetFrame !== currentFrameRef.current) {
      currentFrameRef.current = targetFrame
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
   * Each frame is decoded from its 2160x3840 JPEG exactly ONCE, cropped to the
   * subject area and downscaled to display resolution via createImageBitmap
   * (runs off the main thread in modern browsers). The giant source images are
   * discarded immediately. This is what eliminates scroll-time decode thrash:
   * 121 raw frames would need ~4GB decoded; pre-scaled bitmaps need ~400MB
   * and every scroll draw is a same-size GPU blit.
   */
  useEffect(() => {
    let cancelled = false
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

    const prepareFrame = async (frameIndex: number) => {
      try {
        const img = await loadImage(getFrameUrl(frameIndex))
        let bitmap: ImageBitmap
        try {
          // Crop (0,0,2160,3060) and resize to display resolution in one step.
          bitmap = await createImageBitmap(
            img,
            0,
            0,
            SOURCE_WIDTH,
            CROPPED_SOURCE_HEIGHT,
            { resizeWidth: bmpW, resizeHeight: bmpH, resizeQuality: 'high' }
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

      setLoadProgress(Math.round((completed / TOTAL_FRAMES) * 100))

      // Paint frame 1 as soon as it exists so the hero is never blank.
      if (frameIndex === 1) drawFrame(1)

      if (completed === TOTAL_FRAMES) {
        // Patch any failed frames with frame 1 so playback never stalls.
        for (let i = 0; i < TOTAL_FRAMES; i++) {
          if (!bitmaps[i]) bitmaps[i] = bitmaps[0]
        }
        setIsLoading(false)
        // Paint the correct frame in case the user scrolled during preload.
        requestAnimationFrame(() => updateFrameFromScroll())
      }
    }

    // Frame 1 is queued first for an instant first paint; the rest run
    // through a small concurrency pool to bound peak decode memory.
    const queue = Array.from({ length: TOTAL_FRAMES }, (_, i) => i + 1)
    const workers = Array.from({ length: LOAD_CONCURRENCY }, async () => {
      while (queue.length > 0) {
        if (cancelled) return
        const next = queue.shift()
        if (next === undefined) return
        await prepareFrame(next)
      }
    })
    void Promise.all(workers)

    return () => {
      cancelled = true
      // Release GPU textures on unmount.
      for (const bitmap of bitmaps) bitmap?.close()
      bitmapsRef.current = []
    }
  }, [])

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

  return (
    <div ref={containerRef} className="relative w-full bg-black" style={{ height: '350vh' }}>
      {/* Sticky Hero Container pinned during scroll sequence */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden bg-black flex items-center justify-center select-none">

        {/* Preloader Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center transition-opacity duration-500">
            <div className="relative flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-full border-2 border-red-500/20 border-t-[#FF5E4D] animate-spin" />
              <span className="absolute text-[11px] font-mono text-[#FF5E4D] font-bold">{loadProgress}%</span>
            </div>
            <p className="text-xs tracking-[0.3em] uppercase text-gray-400 font-semibold">
              Loading Pre-rendered Experience
            </p>
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

        {/* Hero Central Overlay Headline */}
        <div className="absolute inset-0 z-20 pointer-events-none flex flex-col items-center justify-start pt-20 sm:pt-24 md:pt-28 text-center px-4">
          <h1 className="text-6xl sm:text-8xl md:text-[110px] lg:text-[130px] font-black tracking-tight leading-[0.92] text-white select-none">
            <span className="block drop-shadow-[0_12px_40px_rgba(0,0,0,0.9)]">Vizualise</span>
            <span className="block mt-1 sm:mt-2 text-5xl sm:text-7xl md:text-[95px] lg:text-[110px] font-black tracking-tight drop-shadow-[0_12px_40px_rgba(0,0,0,0.9)]">
              <span className="text-white">Your </span>
              <span className="font-serif-italic font-normal text-[#FF5E4D] tracking-normal pr-3 sm:pr-4">Digital</span>
              <span className="text-[#FF5E4D]">Success</span>
            </span>
          </h1>
        </div>

        {/* Bottom Left Navigation Title */}
        <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 z-20 pointer-events-none">
          <span className="text-sm sm:text-base font-semibold text-gray-200 tracking-wider">
            Our Approach
          </span>
        </div>

        {/* Bottom Right Glassmorphic Stats Card */}
        <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 z-20 pointer-events-auto bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl px-6 py-4 sm:px-8 sm:py-5 flex items-center gap-6 sm:gap-10 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          <div className="text-left">
            <div className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">15 +</div>
            <div className="text-[10px] sm:text-xs text-gray-400 font-medium mt-0.5 whitespace-nowrap">Projects Completed</div>
          </div>
          <div className="w-[1px] h-8 sm:h-10 bg-white/15" />
          <div className="text-left">
            <div className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">300+</div>
            <div className="text-[10px] sm:text-xs text-gray-400 font-medium mt-0.5 whitespace-nowrap">People reach</div>
          </div>
          <div className="w-[1px] h-8 sm:h-10 bg-white/15" />
          <div className="text-left">
            <div className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">100%</div>
            <div className="text-[10px] sm:text-xs text-gray-400 font-medium mt-0.5 whitespace-nowrap">Clients' Satisfaction</div>
          </div>
        </div>

      </div>
    </div>
  )
}
