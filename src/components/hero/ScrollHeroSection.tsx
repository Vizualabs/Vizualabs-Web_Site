import { useEffect, useRef, useState } from 'react'

const TOTAL_FRAMES = 121

export function ScrollHeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  
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

  // Draw specific frame onto canvas with devicePixelRatio scaling & aspect cover centering
  const drawFrame = (frameIndex: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = imagesRef.current[frameIndex - 1]
    if (!img || !img.complete) return

    const dpr = window.devicePixelRatio || 1
    const width = window.innerWidth
    const height = window.innerHeight

    // Ensure physical canvas resolution accounts for retina screens
    const targetW = Math.floor(width * dpr)
    const targetH = Math.floor(height * dpr)
    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW
      canvas.height = targetH
    }

    ctx.save()
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, width, height)

    const imgW = img.naturalWidth || 2160
    const imgH = img.naturalHeight || 3840

    // Scaled down subject framing logic:
    // Scale image relative to viewport height so the entire head, VR visor, neck and shoulders fit comfortably.
    const isMobile = width < 768
    const heightTarget = isMobile ? height * 0.82 : height * 0.88
    const widthTarget = isMobile ? width * 1.1 : width * 0.65

    const scale = Math.max(heightTarget / imgH, widthTarget / imgW)
    const renderW = imgW * scale
    const renderH = imgH * scale

    // Center horizontally, align bottom of subject to viewport bottom
    const offsetX = (width - renderW) / 2
    const offsetY = height - renderH

    ctx.drawImage(img, offsetX, offsetY, renderW, renderH)
    ctx.restore()
  }

  /**
   * SCROLL-TO-FRAME MAPPING LOGIC
   * 1. Get current scroll rect of sticky wrapper (350vh total height).
   * 2. Calculate scroll distance relative to viewport.
   * 3. Normalize scroll progress in range [0, 1].
   * 4. Map [0, 1] linearly to frame index [1, 121].
   * 5. Use requestAnimationFrame to throttle canvas redraws only when frame index changes.
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

  // Preload all 121 frames into memory before enabling interactive scroll
  useEffect(() => {
    let loadedCount = 0
    const loadedImages: HTMLImageElement[] = new Array(TOTAL_FRAMES)

    // Preload frame 1 first so we can draw it immediately
    const firstImg = new Image()
    firstImg.src = getFrameUrl(1)
    firstImg.onload = () => {
      loadedImages[0] = firstImg
      drawFrame(1)
    }

    // Preload all frames
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image()
      img.src = getFrameUrl(i)
      
      const onSingleImageComplete = () => {
        loadedCount++
        setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100))

        if (loadedCount === TOTAL_FRAMES) {
          imagesRef.current = loadedImages
          setIsLoading(false)
          // Initial canvas render once preloading completes
          drawFrame(currentFrameRef.current)
        }
      }

      img.onload = () => {
        loadedImages[i - 1] = img
        onSingleImageComplete()
      }

      img.onerror = () => {
        // Fallback for missing frame to prevent preloader lockup
        loadedImages[i - 1] = firstImg
        onSingleImageComplete()
      }
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
  }, [isLoading])

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
          className="absolute inset-0 w-full h-full object-cover block"
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
