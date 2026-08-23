import { Suspense, lazy, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { BrandIntro, BRAND_INTRO_CHOREOGRAPHY_MS, type IntroPhase } from './BrandIntro'
import { HeroTitle } from './HeroTitle'
import { TOTAL_FRAMES, heroFrameUrl } from './heroFrames'
import { keyHairBackdrop } from './keyHairBackdrop'
import { NumberTicker } from '../ui/number-ticker'
import { ErrorBoundary } from '../ErrorBoundary'

// Code-split out of the homepage bundle: this is an ~800-line WebGL engine
// that never renders before the 'warmup' phase anyway. The prefetch effect
// below starts fetching it the moment the hero mounts (during the still-
// opaque 'intro' phase), so by the time 'warmup' needs it the chunk is
// already resolved — same visible timing, smaller initial bundle.
const Blaze = lazy(() =>
  import('../canvasui/Blaze').then((m) => ({ default: m.Blaze }))
)

// Optimized source frames (1280x2276 WebP; subject ends at Y = 1813 which is
// the same 3060/3840 crop ratio as the original 2160x3840 masters).
const SOURCE_WIDTH = 1280
const CROPPED_SOURCE_HEIGHT = 1813

// Performance budget: retina beyond 2x is imperceptible for a photo sequence,
// and 1600px-tall bitmaps stay crisp up to ~1440p native displays. Phones get
// a tighter cap — their smaller screens make 1.5x indistinguishable from 2x,
// but it cuts the per-frame canvas fill (the VR-boy turn) by ~44% on 3x-DPR
// handsets, which is the difference between a fluid turn and a stutter.
const MAX_DPR = 2
const MAX_DPR_PHONE = 1.5
const MAX_BITMAP_HEIGHT = 1600

// How many frames the horizontal mouse position can steer the subject by.
// Left edge = -MOUSE_TURN_RANGE, right edge = +MOUSE_TURN_RANGE, added on top
// of the scroll-driven base frame. Set to the full sequence span so the mouse
// can drive a complete turn (edge to edge), matching a full scroll.
const MOUSE_TURN_RANGE = TOTAL_FRAMES - 1

const MOBILE_MAX_WIDTH = 768
const DESKTOP_SUBJECT_RATIO = 0.86
const MOBILE_SUBJECT_RATIO = 0.64

// Desktop keeps the original 0.1 lerp. Mobile uses a shorter time constant so
// the turn tracks the finger instead of swimming behind the scroll.
const DESKTOP_FRAME_EASE = 0.1
const MOBILE_SMOOTH_SEC = 0.08

const isMobileView = (width: number) => width < MOBILE_MAX_WIDTH

/**
 * Touch phone, not just a narrow desktop window — width alone would
 * misclassify a resized desktop browser as mobile and needlessly downgrade
 * its (perfectly capable) GPU.
 */
const isPhoneDevice = () =>
  typeof window !== 'undefined' &&
  window.innerWidth < MOBILE_MAX_WIDTH &&
  window.matchMedia('(pointer: coarse)').matches

const prefersReducedData = () => {
  if (typeof navigator === 'undefined') return false
  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string }
  }
  const conn = nav.connection
  return Boolean(
    conn?.saveData ||
      conn?.effectiveType === 'slow-2g' ||
      conn?.effectiveType === '2g' ||
      conn?.effectiveType === '3g'
  )
}

// Keep the reveal work below the main-thread budget on slower devices.
const LOAD_CONCURRENCY = 4

// Frames streaming in after the reveal. Decoding is off the main thread now
// (fetch -> Blob -> createImageBitmap), so this no longer competes with the
// user's first scroll and can run wider than the old serialized pipeline.
const STREAM_CONCURRENCY = 2

// Only gate the intro on the first few frames. The rest can stream while the
// visitor is already on the page; findReadyFrame() supplies a nearby fallback.
const REVEAL_THRESHOLD = 4

// Let the first-paint path settle before decoding the rest of the sequence.
const TAIL_START_DELAY_MS = 2500

// The branded intro runs for at least this long so it reads as an intentional
// animation rather than a flash. Frame decoding happens underneath it, so on
// a warm cache this is the only thing gating the reveal. Floored to the
// wordmark's own choreography length (plus a small settle beat) so the phase
// change can never fire before the last letter finishes fading in — that
// mismatch used to cut the trailing letters off mid-animation.
const MIN_INTRO_MS = BRAND_INTRO_CHOREOGRAPHY_MS + 100

// A visitor who has already seen the full intro once this session gets this
// instead — just enough for a clean branded fade, not the whole choreography.
const RETURN_INTRO_MS = 480

const INTRO_SEEN_KEY = 'vlabs_intro_seen'

// Beat between mounting the WebGL fire and starting the reveal. Shader compile
// and texture allocation are synchronous main-thread work; paying that cost
// here — while the plane is still fully opaque — keeps it off the first scroll.
const WARMUP_MS = 240

// Must match the wipe animation duration in styles.css.
const REVEAL_MS = 900

export function ScrollHeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const maskBitmapRef = useRef<ImageBitmap | null>(null)

  // Pre-cropped, pre-scaled GPU bitmaps — the ONLY thing kept in memory.
  const bitmapsRef = useRef<(ImageBitmap | undefined)[]>([])

  // 'intro'     — opaque plane, core + wordmark, fire not yet mounted, scroll locked
  // 'warmup'    — still opaque, fire mounting behind it, scroll locked
  // 'revealing' — panel wipe opening, scroll unlocked
  // 'done'      — overlay unmounted
  const [phase, setPhase] = useState<IntroPhase | 'done'>('intro')

  // Starts false to match SSR; flipped in an effect (client-only) so a
  // returning visitor never renders a mismatched first frame during
  // hydration.
  const [fastIntro, setFastIntro] = useState(false)
  useEffect(() => {
    if (sessionStorage.getItem(INTRO_SEEN_KEY) === '1') {
      setFastIntro(true)
    }
  }, [])

  // Scroll stays locked while the plane is still opaque.
  const isLoading = phase === 'intro' || phase === 'warmup'

  // The per-pixel noise loops in Blaze are the single most expensive thing on
  // this page. Phones keep the scroll-driven hero but skip the decorative
  // WebGL layer entirely so the image sequence remains responsive.
  const [lowPowerFire, setLowPowerFire] = useState(false)
  const [skipFire, setSkipFire] = useState(false)
  // Resolved once on mount; the canvas size and the decoded bitmap size must
  // agree, so the DPR cap is a stable ref rather than a per-frame read.
  const dprCapRef = useRef(MAX_DPR)
  useEffect(() => {
    const phone = isPhoneDevice()
    dprCapRef.current = phone ? MAX_DPR_PHONE : MAX_DPR
    setLowPowerFire(phone)
    setSkipFire(phone)
  }, [])

  // Start fetching the Blaze chunk immediately, in parallel with the frame
  // decode pipeline, so the lazy import resolves well before 'warmup' asks
  // for it. Phones never mount Blaze, so prefetching it would waste bandwidth.
  useEffect(() => {
    if (isPhoneDevice()) return
    void import('../canvasui/Blaze')
  }, [])

  // Communicate loading state so the navbar is completely hidden during intro.
  // useLayoutEffect so data-intro-loading is set before paint — avoids the
  // navbar's 150ms "assume done" race on cold mount.
  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-intro-loading', 'true')
    window.dispatchEvent(new CustomEvent('intro-loading-state', { detail: { loading: true } }))
    return () => {
      document.documentElement.removeAttribute('data-intro-loading')
      window.dispatchEvent(new CustomEvent('intro-loading-state', { detail: { loading: false } }))
    }
  }, [])

  useEffect(() => {
    if (isLoading) {
      document.documentElement.setAttribute('data-intro-loading', 'true')
      window.dispatchEvent(new CustomEvent('intro-loading-state', { detail: { loading: true } }))
    } else {
      document.documentElement.removeAttribute('data-intro-loading')
      window.dispatchEvent(new CustomEvent('intro-loading-state', { detail: { loading: false } }))
    }
  }, [isLoading])
  // The canvas lives inside Blaze, so it only exists from 'warmup' onward.
  const fireMounted = phase !== 'intro'

  // Track last rendered frame index to avoid unnecessary redrawing
  const currentFrameRef = useRef(1)

  // Fractional frame the canvas is currently easing through, so scroll and
  // mouse steering glide between frames instead of snapping.
  const displayFrameRef = useRef(1)
  const lastEaseAtRef = useRef(0)

  // Normalized horizontal mouse position, -1 (left) .. +1 (right).
  const mouseXRef = useRef(0)

  // Highest frame index that has been successfully decoded (used for fast
  // fallback during initial scroll before the full sequence is ready).
  const maxLoadedRef = useRef(0)

  // Cached container geometry so scroll handler never forces layout.
  const geometryRef = useRef({ top: 0, height: 0 })

  // Cached CSS view size of the canvas. clientWidth/clientHeight force layout,
  // so we read them once per resize — never in the per-frame draw path.
  const viewSizeRef = useRef({ width: 0, height: 0 })

  // RAF id for coalescing scroll updates to one calculation + draw per frame.
  const scrollRafRef = useRef<number | null>(null)

  /**
   * Target bitmap resolution: match the physical pixels the sequence can ever
   * be rendered at (screen height is the upper bound for window height), so
   * scroll-time draws are a same-size blit with zero resampling cost.
   */
  const getBitmapSize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, dprCapRef.current)
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
   * CSS box of the canvas — not window.innerHeight. On mobile, 100vh / h-screen
   * and the visual viewport disagree, and stretching a smaller bitmap into a
   * taller CSS box is what sliced the face with the silhouette mask.
   *
   * Reads from the cache populated by syncCanvasSize()/handleResize(); the
   * raw read is only forced on resize, never inside the scroll-driven draw.
   */
  const getViewSize = () => {
    if (viewSizeRef.current.width > 0 && viewSizeRef.current.height > 0) {
      return viewSizeRef.current
    }
    const canvas = canvasRef.current
    const width = canvas?.clientWidth || window.innerWidth
    const height = canvas?.clientHeight || window.innerHeight
    viewSizeRef.current = { width, height }
    return { width, height }
  }

  /**
   * Where the frame lands inside the canvas, in CSS pixels.
   * Desktop keeps the original 86% height; mobile is a step smaller so the
   * heading and stats stay readable.
   */
  const computeImageRect = (bmpW: number, bmpH: number) => {
    const { width, height } = getViewSize()
    const ratio = isMobileView(width) ? MOBILE_SUBJECT_RATIO : DESKTOP_SUBJECT_RATIO
    const scale = (height * ratio) / bmpH
    const renderW = bmpW * scale
    const renderH = bmpH * scale

    return {
      renderW,
      renderH,
      offsetX: (width - renderW) / 2,
      offsetY: height - renderH,
      width,
      height,
    }
  }

  // Keep canvas bitmap size in sync with the CSS box (call on resize).
  const syncCanvasSize = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = ensureContext()
    if (!ctx) return
    const dpr = Math.min(window.devicePixelRatio || 1, dprCapRef.current)
    // Force a fresh CSS-box read here (resize path) and cache it for the
    // per-frame draw path.
    viewSizeRef.current = {
      width: canvas.clientWidth || window.innerWidth,
      height: canvas.clientHeight || window.innerHeight,
    }
    const { width, height } = viewSizeRef.current
    const targetW = Math.round(width * dpr)
    const targetH = Math.round(height * dpr)
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

    const dpr = Math.min(window.devicePixelRatio || 1, dprCapRef.current)
    const { width, height } = getViewSize()

    // Ensure physical canvas resolution matches the CSS box — never stretch.
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

    // Punch the silhouette in canvas space. CSS mask-image + GPU layers on
    // mobile was shifting the matte and cutting horizontal holes through the
    // face; destination-in stays locked to the same rect as the frame.
    const mask = maskBitmapRef.current
    if (mask) {
      ctx.globalCompositeOperation = 'destination-in'
      ctx.drawImage(mask, offsetX, offsetY, renderW, renderH)
      ctx.globalCompositeOperation = 'source-over'
    }
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
    const wanted = Math.round(target)
    if (bitmaps[wanted - 1]) return wanted
    const max = maxLoadedRef.current
    if (wanted > max && max > 0) return max
    for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
      const prev = wanted - offset
      if (prev >= 1 && bitmaps[prev - 1]) return prev
      const next = wanted + offset
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
      Math.max(1, 1 + scrollProgress * (TOTAL_FRAMES - 1))
    )
  }

  /**
   * Combine the scroll-driven base frame with the horizontal mouse position so
   * moving the pointer left-to-right nudges the subject forward and right-to-
   * left nudges it back, synced on top of the existing scroll turn.
   */
  const readCombinedFrame = () => {
    const scrollFrame = readScrollFrame()
    const base = scrollFrame > 0 ? scrollFrame : 1
    const combined = base + mouseXRef.current * MOUSE_TURN_RANGE
    return Math.min(TOTAL_FRAMES, Math.max(1, combined))
  }

  /**
   * PRELOAD PIPELINE
   * Each frame is decoded exactly ONCE, cropped to the subject area and
   * downscaled to display resolution via createImageBitmap (runs off the main
   * thread in modern browsers). The first few frames start immediately; the
   * remaining sequence streams in after the intro so startup stays responsive.
   */
  useEffect(() => {
    let cancelled = false
    const { width: bmpW, height: bmpH } = getBitmapSize()
    const bitmaps: (ImageBitmap | undefined)[] = new Array(TOTAL_FRAMES)
    bitmapsRef.current = bitmaps
    let completed = 0
    let tailTimer: number | undefined

    // On a slow or data-saver connection, the reveal-gating frames still
    // load in full (the sequence can't unlock without them), but the long
    // background tail — the bulk of the payload — is fetched at half
    // density. findReadyFrame() already falls back to the nearest decoded
    // neighbour for any frame that isn't ready, so the skipped slots are
    // simply never filled rather than treated as failures.
    const reduceData = prefersReducedData() || isPhoneDevice()

    const phase1Indices = Array.from(
      { length: REVEAL_THRESHOLD },
      (_, i) => i + 1
    )
    const tailIndices: number[] = []
    for (let i = REVEAL_THRESHOLD + 1; i <= TOTAL_FRAMES; i++) {
      if (!reduceData || (i - REVEAL_THRESHOLD) % 2 === 1) tailIndices.push(i)
    }
    const totalToLoad = phase1Indices.length + tailIndices.length

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
        const bitmap = await createImageBitmap(
          blob,
          0,
          0,
          SOURCE_WIDTH,
          CROPPED_SOURCE_HEIGHT,
          { resizeWidth: bmpW, resizeHeight: bmpH, resizeQuality: 'medium' }
        )
        try {
          return await keyHairBackdrop(bitmap)
        } catch {
          return bitmap
        }
      } catch {
        // Engines without crop/resize options still give us a usable bitmap.
        const bitmap = await createImageBitmap(blob)
        try {
          return await keyHairBackdrop(bitmap)
        } catch {
          return bitmap
        }
      }
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

      const allDone = completed === totalToLoad

      // Paint frame 1 as soon as it exists so the hero is never blank.
      // Defer to the next animation frame so the decode callback doesn't
      // steal main-thread time from the scroll handler.
      if (frameIndex === 1) {
        requestAnimationFrame(() => drawFrame(1))
      }

      if (allDone) {
        // Patch any failed frames with frame 1 so playback never stalls.
        // Skipped on the reduced-data path: those gaps are intentional, and
        // findReadyFrame()'s nearest-neighbour fallback already handles them.
        if (!reduceData) {
          for (let i = 0; i < TOTAL_FRAMES; i++) {
            if (!bitmaps[i]) bitmaps[i] = bitmaps[0]
          }
          maxLoadedRef.current = TOTAL_FRAMES
        }
        // Paint the exact frame in case the user scrolled during preload.
        requestAnimationFrame(() => {
          syncCanvasSize()
          const target = readScrollFrame()
          const ready = target > 0 ? findReadyFrame(target) : currentFrameRef.current
          if (ready !== 0 && ready !== currentFrameRef.current) {
            currentFrameRef.current = ready
          }
          displayFrameRef.current = currentFrameRef.current
          drawFrame(currentFrameRef.current)
        })
      }
    }

    const runPhase = async (
      indices: number[],
      concurrency: number,
      yieldBetweenFrames: boolean
    ) => {
      const queue: number[] = [...indices]
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
      await runPhase(phase1Indices, LOAD_CONCURRENCY, false)
      if (cancelled) return
      tailTimer = window.setTimeout(() => {
        if (!cancelled) void runPhase(tailIndices, STREAM_CONCURRENCY, true)
      }, TAIL_START_DELAY_MS)
    })()

    return () => {
      cancelled = true
      if (tailTimer !== undefined) window.clearTimeout(tailTimer)
      // Release GPU textures on unmount.
      for (const bitmap of bitmaps) bitmap?.close()
      bitmapsRef.current = []
      maxLoadedRef.current = 0
    }
  }, [])

  /**
   * Intro choreography.
   *
   * The intro has a fixed visual duration. Frame decoding continues in the
   * background and paints the first available frame as soon as the hero mounts.
   */
  /*
   * One effect per hop, each owning exactly one timer.
   *
   * Chaining the hops inside a single effect deadlocks: setting the next phase
   * re-runs the effect, and its cleanup cancels the timer the previous tick had
   * just scheduled in the same closure.
   */

  // intro -> warmup after the branded animation beat has played.
  useEffect(() => {
    if (phase !== 'intro') return
    const minMs = fastIntro ? RETURN_INTRO_MS : MIN_INTRO_MS
    const timer = window.setTimeout(() => {
      sessionStorage.setItem(INTRO_SEEN_KEY, '1')
      setPhase('warmup')
    }, minMs)
    return () => window.clearTimeout(timer)
  }, [phase, fastIntro])

  // warmup -> revealing, giving the fire a beat to compile behind the plane.
  useEffect(() => {
    if (phase !== 'warmup') return
    const timer = window.setTimeout(() => setPhase('revealing'), WARMUP_MS)
    return () => window.clearTimeout(timer)
  }, [phase])

  // revealing -> done, unmounting the overlay after the wipe finishes.
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
  // useLayoutEffect (not useEffect) so the lock is applied synchronously with
  // the DOM commit — before the browser ever paints the intro. With a deferred
  // effect the page is briefly scrollable on a cold load, and the overlay's
  // first frame can be scrolled away under the visitor.
  useLayoutEffect(() => {
    if (!isLoading) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [isLoading])

  // Silhouette matte: decoded once, then composited in drawFrame so the cut
  // cannot drift from the subject on mobile viewports.
  useEffect(() => {
    let cancelled = false
    void fetch('/hero-subject-mask.png')
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return response.blob()
      })
      .then((blob) => createImageBitmap(blob))
      .then((bitmap) => {
        if (cancelled) {
          bitmap.close()
          return
        }
        maskBitmapRef.current = bitmap
        drawFrame(currentFrameRef.current)
      })
      .catch(() => {
        // Frames still paint; without the matte the heading stays covered.
      })

    return () => {
      cancelled = true
      maskBitmapRef.current?.close()
      maskBitmapRef.current = null
    }
  }, [])

  // The hero canvas only exists once Blaze mounts, so paint the current frame
  // as soon as it does — during 'warmup', while the plane is still opaque —
  // guaranteeing a fully drawn hero the instant the wipe opens.
  useEffect(() => {
    if (!fireMounted) return
    const raf = requestAnimationFrame(() => {
      syncCanvasSize()
      const target = readScrollFrame()
      const ready = target > 0 ? findReadyFrame(target) : currentFrameRef.current
      if (ready !== 0 && ready !== currentFrameRef.current) {
        currentFrameRef.current = ready
      }
      displayFrameRef.current = currentFrameRef.current
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
    const runFrameLoop = (now: number) => {
      scrollRafRef.current = null
      const targetFrame = readCombinedFrame()
      if (targetFrame === 0) return
      const readyFrame = findReadyFrame(targetFrame)
      if (readyFrame === 0) return

      let next: number
      if (isMobileView(window.innerWidth)) {
        const last = lastEaseAtRef.current || now
        const dt = Math.min(0.05, Math.max(0, (now - last) / 1000))
        lastEaseAtRef.current = now
        const alpha = 1 - Math.exp(-dt / MOBILE_SMOOTH_SEC)
        next =
          displayFrameRef.current + (readyFrame - displayFrameRef.current) * alpha
      } else {
        next =
          displayFrameRef.current +
          (readyFrame - displayFrameRef.current) * DESKTOP_FRAME_EASE
      }
      displayFrameRef.current = next
      const rounded = Math.round(next)
      if (rounded !== currentFrameRef.current) {
        currentFrameRef.current = rounded
        drawFrame(rounded)
      }

      if (Math.abs(readyFrame - next) > 0.02) {
        scrollRafRef.current = requestAnimationFrame(runFrameLoop)
      }
    }

    const scheduleDraw = () => {
      if (scrollRafRef.current) return
      scrollRafRef.current = requestAnimationFrame(runFrameLoop)
    }

    const handleScroll = () => scheduleDraw()

    const handleMouseMove = (e: MouseEvent) => {
      const normalized = (e.clientX / window.innerWidth) * 2 - 1
      // Saturate the steering: the outer half of each side already drives a
      // full turn, so the pointer reaches the complete rotation well before the
      // screen edge instead of only at the last pixel.
      mouseXRef.current = Math.max(-1, Math.min(1, normalized * 2))
      scheduleDraw()
    }

    const handleResize = () => {
      updateGeometry()
      syncCanvasSize()
      displayFrameRef.current = currentFrameRef.current
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
    displayFrameRef.current = currentFrameRef.current
    drawFrame(currentFrameRef.current)

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)
    window.visualViewport?.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      window.visualViewport?.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      if (scrollRafRef.current) {
        cancelAnimationFrame(scrollRafRef.current)
        scrollRafRef.current = null
      }
    }
  }, [])

  // Pulled out so it can render either wrapped in the WebGL fire (desktop /
  // capable mobile) or bare (phone + reduced-data, where Blaze is skipped
  // entirely) without duplicating the ~100 lines of hero overlay markup.
  const heroOverlayContent = (
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
                className="absolute inset-0 w-full h-full block"
              />

              {/* Subtle Radial Edge Vignette Falloff */}
              {/* Widened the clear centre so the heading's outer words keep their
            contrast — at 30% the vignette was greying out "Your". Kept as an
            ellipse so the corner falloff survives without reaching into the
            headline band. */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_82%_92%_at_50%_52%,transparent_52%,rgba(0,0,0,0.72)_100%)] z-10" />

              {/* Top Center Pill Badge — sits below the fixed navbar (h-20) so it
                  no longer collides with the nav links / logo. */}
              <div className="absolute top-24 md:top-28 left-1/2 -translate-x-1/2 z-20 pointer-events-none w-full flex justify-center px-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-1 rounded-full border border-[#FF5E4D]/40 bg-black/60 backdrop-blur-md shadow-md shadow-[#FF5E4D]/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF5E4D] animate-pulse shadow-[0_0_6px_#FF5E4D]" />
                  <span className="text-[8.5px] sm:text-[11px] font-semibold tracking-[0.14em] sm:tracking-[0.2em] text-[#FF5E4D] uppercase">
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

              {/* Bottom Right Premium Glassmorphic Stats Card — true full-width row
                  on mobile. The chat launcher used to force a reserved gutter here
                  (right-20); it now lifts itself above this card on mobile instead,
                  so the row can run edge to edge and read as a balanced 3-up bar. */}
              <div className="absolute left-3 right-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom,0px))] sm:inset-x-auto sm:bottom-10 sm:right-10 z-20 pointer-events-auto">
                <div className="liquid-glass relative overflow-hidden px-3 py-3 sm:px-8 sm:py-5 flex items-center justify-between gap-2 sm:justify-start sm:gap-8 shadow-2xl">
                  <div className="relative flex flex-1 sm:flex-none items-center justify-center sm:justify-start group/stat cursor-default">
                    <div className="text-center sm:text-left">
                      <NumberTicker
                        value={15}
                        suffix=" +"
                        delay={0}
                        className="font-sans text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight"
                      />
                      <div className="text-[clamp(0.5rem,2.35vw,0.75rem)] sm:text-xs text-gray-300 font-normal mt-1 whitespace-nowrap">
                        Projects Completed
                      </div>
                    </div>
                  </div>

                  <div className="h-8 sm:h-10 w-px shrink-0 bg-white/15" />

                  <div className="relative flex flex-1 sm:flex-none items-center justify-center sm:justify-start group/stat cursor-default">
                    <div className="text-center sm:text-left">
                      <NumberTicker
                        value={300}
                        suffix="+"
                        delay={0.15}
                        className="font-sans text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight"
                      />
                      <div className="text-[clamp(0.5rem,2.35vw,0.75rem)] sm:text-xs text-gray-300 font-normal mt-1 whitespace-nowrap">
                        People Reached
                      </div>
                    </div>
                  </div>

                  <div className="h-8 sm:h-10 w-px shrink-0 bg-white/15" />

                  <div className="relative flex flex-1 sm:flex-none items-center justify-center sm:justify-start group/stat cursor-default">
                    <div className="text-center sm:text-left">
                      <NumberTicker
                        value={100}
                        suffix="%"
                        delay={0.3}
                        className="font-sans text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight"
                      />
                      <div className="text-[clamp(0.5rem,2.35vw,0.75rem)] sm:text-xs text-gray-300 font-normal mt-1 whitespace-nowrap">
                        Clients' Satisfaction
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
  )

  return (
    <div
      ref={containerRef}
      data-testid="hero-scroll-container"
      className="relative w-full bg-black h-[220dvh] md:h-[105dvh]"
    >
      {/* Sticky Hero Container pinned during scroll sequence */}
      <div
        className="sticky top-0 left-0 w-full h-screen h-dvh overflow-hidden bg-black flex items-center justify-center select-none"
        style={{ willChange: 'transform' }}
      >

        {/* Blaze fire — only on the hero, burning from the bottom to the
            middle of the screen (height = 0.5 of the viewport). Mounts at the
            'warmup' beat: late enough that its WebGL setup never competes with
            decoding the first frames, early enough that the shader compile is
            paid behind the still-opaque intro plane rather than on the user's
            first scroll.

             Desktop gets the full fire treatment. Phones skip the shader's
             per-pixel noise work entirely — the scroll-driven hero still
             renders in full underneath. */}
        {fireMounted && (
          skipFire ? (
            heroOverlayContent
          ) : (
          <ErrorBoundary fallback={null}>
          <Suspense fallback={null}>
          <Blaze
            height={0.5}
            distortion={0.6}
            distortionScale={0.5}
            speed={1}
            sparks={lowPowerFire ? 1 : 1.7}
            sparkDensity={lowPowerFire ? 1.2 : 1.8}
            sparkSize={1}
            layers={lowPowerFire ? 2 : 4}
            smoke={lowPowerFire ? 0.8 : 1.3}
            glow={lowPowerFire ? 2.2 : 3.2}
            maxDpr={lowPowerFire ? 1 : 2}
            sparkColor={[1, 0, 0]}
            smokeColor={[0.6, 0, 0]}
            style={{ position: 'absolute', inset: 0 }}
          >
            {heroOverlayContent}
          </Blaze>
          </Suspense>
          </ErrorBoundary>
          )
        )}

        {/* Branded intro — rendered outside Blaze so the plane stays a clean
            flat black with no heat distortion, and sits above it so the fire
            can warm up hidden underneath. */}
        {phase !== 'done' && <BrandIntro phase={phase} fast={fastIntro} />}

      </div>
    </div>
  )
}
