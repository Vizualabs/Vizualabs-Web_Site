/**
 * Deep-space universe renderer for the brand intro.
 *
 * One 2D canvas: a layered, twinkling starfield with slow parallax drift, a
 * pre-rendered nebula in the brand's coral palette, and the occasional
 * shooting star. Budget-first by design:
 *  - DPR capped (1.5 on phones / 2 desktop) — matches the hero's own budget.
 *  - The nebula is painted ONCE into a low-res offscreen canvas; per frame it
 *    is a single drawImage (soft gradients upscale for free).
 *  - Stars are batched by color so the per-frame state changes stay minimal.
 *  - The loop pauses when the tab is hidden, freezes the moment the reveal
 *    starts, and reduced-motion / returning-visitor ("fast") sessions get a
 *    single static frame with no rAF loop at all.
 */

type Star = {
  x: number
  y: number
  r: number
  baseAlpha: number
  /** Twinkle frequency in Hz. */
  twinkleHz: number
  twinklePhase: number
  /** Leftward drift in css px/s — near layers drift faster (parallax). */
  drift: number
  /** Bright stars get a subtle 4-point cross flare. */
  flare: boolean
}

type Meteor = {
  x: number
  y: number
  dirX: number
  dirY: number
  speed: number
  born: number
  life: number
  length: number
}

export type UniverseHandle = {
  /** Stop animating, keep the last painted frame (used when the reveal starts). */
  freeze: () => void
  /** Stop animating and release all listeners. */
  stop: () => void
}

/** Realistic star-temperature spread, biased warm to sit with the nebula. */
const STAR_COLORS = [
  { rgb: '255, 255, 255', weight: 0.68 }, // white
  { rgb: '255, 220, 200', weight: 0.17 }, // warm coral-white
  { rgb: '201, 219, 255', weight: 0.15 }, // cool blue-white
]

const TAU = Math.PI * 2

const rand = (min: number, max: number) => min + Math.random() * (max - min)

/** Touch phone heuristic — mirrors ScrollHeroSection's own device gate. */
const isPhoneDevice = () =>
  typeof window !== 'undefined' &&
  window.innerWidth < 768 &&
  window.matchMedia('(pointer: coarse)').matches

export function startUniverse(
  canvas: HTMLCanvasElement,
  { staticFrame = false, fadeIn = true }: { staticFrame?: boolean; fadeIn?: boolean } = {},
): UniverseHandle {
  const maybeCtx = canvas.getContext('2d')
  const noop: UniverseHandle = { freeze: () => {}, stop: () => {} }
  if (!maybeCtx) return noop
  // Non-null alias — TS narrowing does not reach hoisted function declarations.
  const ctx = maybeCtx

  const phone = isPhoneDevice()

  let raf = 0
  let resizeTimer = 0
  let running = false
  let stopped = false

  let width = 0
  let height = 0
  let nebula: HTMLCanvasElement | null = null
  /** Stars grouped by STAR_COLORS index — one fillStyle switch per group. */
  let starGroups: Star[][] = STAR_COLORS.map(() => [])
  let meteor: Meteor | null = null
  let nextMeteorAt = 0
  let lastT = 0
  let lastPaintAt = 0

  // The background moves slowly, so 30fps remains visually continuous while
  // leaving every other browser frame free for hydration and hero decoding.
  const minFrameInterval = 1000 / 30

  function buildNebula() {
    // Low-res offscreen: the nebula is pure soft gradient, so a 0.32x buffer
    // upscaled on draw is indistinguishable from full-res and far cheaper.
    const scale = 0.32
    const w = Math.max(2, Math.round(width * scale))
    const h = Math.max(2, Math.round(height * scale))
    const buf = document.createElement('canvas')
    buf.width = w
    buf.height = h
    const nctx = buf.getContext('2d')
    if (!nctx) return

    const minDim = Math.min(w, h)
    const glow = (
      cx: number,
      cy: number,
      r: number,
      stops: [number, string][],
    ) => {
      const g = nctx.createRadialGradient(cx, cy, 0, cx, cy, r)
      for (const [at, color] of stops) g.addColorStop(at, color)
      nctx.fillStyle = g
      nctx.fillRect(cx - r, cy - r, r * 2, r * 2)
    }

    // Coral heart — sits right behind the planet, slightly below center.
    glow(w * 0.5, h * 0.54, minDim * 0.58, [
      [0, 'rgba(255, 94, 77, 0.17)'],
      [0.42, 'rgba(184, 58, 46, 0.08)'],
      [0.78, 'rgba(184, 58, 46, 0)'],
    ])
    // Deep ember, lower right.
    glow(w * 0.82, h * 0.86, minDim * 0.5, [
      [0, 'rgba(184, 58, 46, 0.09)'],
      [0.7, 'rgba(184, 58, 46, 0)'],
    ])
    // Warm kiss, upper left.
    glow(w * 0.2, h * 0.16, minDim * 0.44, [
      [0, 'rgba(255, 138, 107, 0.05)'],
      [0.72, 'rgba(255, 138, 107, 0)'],
    ])
    // Faint cool counterweight on top — keeps the black from reading flat.
    glow(w * 0.52, -h * 0.08, minDim * 0.62, [
      [0, 'rgba(148, 176, 255, 0.04)'],
      [0.7, 'rgba(148, 176, 255, 0)'],
    ])

    nebula = buf
  }

  function buildStars() {
    starGroups = STAR_COLORS.map(() => [])
    // Density scales with area, clamped per device class.
    const base = (width * height) / 9000
    const count = Math.round(Math.min(Math.max(base, 80), phone ? 130 : 240))

    for (let i = 0; i < count; i++) {
      const layer = Math.random()
      const star: Star = {
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.3,
        baseAlpha: 0.4,
        twinkleHz: rand(0.25, 1.05),
        twinklePhase: Math.random() * TAU,
        drift: 0,
        flare: false,
      }
      if (layer < 0.55) {
        // Far: small, dim, almost still.
        star.r = rand(0.3, 0.8)
        star.baseAlpha = rand(0.22, 0.5)
        star.drift = rand(0.15, 0.6)
      } else if (layer < 0.87) {
        // Mid.
        star.r = rand(0.6, 1.2)
        star.baseAlpha = rand(0.38, 0.72)
        star.drift = rand(0.5, 1.3)
      } else {
        // Near: brighter, fastest drift, some get cross flares.
        star.r = rand(0.9, 1.7)
        star.baseAlpha = rand(0.55, 0.95)
        star.drift = rand(1.1, 2.4)
        star.flare = Math.random() < 0.3
      }

      // Weighted color pick.
      let roll = Math.random()
      let colorIndex = 0
      for (let c = 0; c < STAR_COLORS.length; c++) {
        roll -= STAR_COLORS[c].weight
        if (roll <= 0) {
          colorIndex = c
          break
        }
      }
      starGroups[colorIndex].push(star)
    }
  }

  function resize() {
    const rect = canvas.getBoundingClientRect()
    width = Math.max(1, rect.width)
    height = Math.max(1, rect.height)
    // Tiny stars do not benefit from a full retina backing store. This removes
    // millions of invisible pixels while preserving the same CSS-size scene.
    const dpr = Math.min(window.devicePixelRatio || 1, phone ? 1.25 : 1.5)
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    buildNebula()
    buildStars()
  }

  function scheduleMeteor(t: number) {
    nextMeteorAt = t + rand(phone ? 2400 : 1500, phone ? 4600 : 3200)
  }

  function spawnMeteor(t: number) {
    // Down-left travel across the upper sky.
    const angle = rand((200 * Math.PI) / 180, (238 * Math.PI) / 180)
    meteor = {
      x: rand(width * 0.25, width * 1.05),
      y: rand(-height * 0.05, height * 0.35),
      dirX: Math.cos(angle),
      dirY: -Math.sin(angle), // canvas y is down; angle sweeps downward-left
      speed: rand(420, 640),
      born: t,
      life: rand(700, 1000),
      length: rand(90, 150),
    }
  }

  function draw(t: number) {
    const dt = lastT ? Math.min((t - lastT) / 1000, 0.05) : 0
    lastT = t

    ctx.clearRect(0, 0, width, height)
    if (nebula) ctx.drawImage(nebula, 0, 0, width, height)

    // Stars — one fillStyle per color group, alpha per star.
    for (let g = 0; g < starGroups.length; g++) {
      const stars = starGroups[g]
      if (!stars.length) continue
      ctx.fillStyle = `rgb(${STAR_COLORS[g].rgb})`
      for (const star of stars) {
        const twinkle =
          0.62 + 0.38 * Math.sin(t * 0.001 * TAU * star.twinkleHz + star.twinklePhase)
        const alpha = star.baseAlpha * twinkle
        if (alpha <= 0.02) continue

        ctx.globalAlpha = alpha
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.r, 0, TAU)
        ctx.fill()

        if (star.flare && alpha > 0.55) {
          const len = star.r * 5
          ctx.globalAlpha = (alpha - 0.5) * 0.7
          ctx.strokeStyle = `rgb(${STAR_COLORS[g].rgb})`
          ctx.lineWidth = 0.6
          ctx.beginPath()
          ctx.moveTo(star.x - len, star.y)
          ctx.lineTo(star.x + len, star.y)
          ctx.moveTo(star.x, star.y - len)
          ctx.lineTo(star.x, star.y + len)
          ctx.stroke()
        }

        // Slow parallax drift with wraparound.
        star.x -= star.drift * dt
        if (star.x < -4) {
          star.x = width + 4
          star.y = Math.random() * height
        }
      }
    }

    // Shooting star — at most one at a time, on a randomized schedule.
    if (!meteor && t >= nextMeteorAt) spawnMeteor(t)
    if (meteor) {
      const age = t - meteor.born
      if (age > meteor.life) {
        meteor = null
        scheduleMeteor(t)
      } else {
        const p = age / meteor.life
        const fade = Math.sin(Math.PI * p) // in/out
        const dist = meteor.speed * (age / 1000)
        const headX = meteor.x + meteor.dirX * dist
        const headY = meteor.y + meteor.dirY * dist
        const tailX = headX - meteor.dirX * meteor.length * Math.min(1, p * 2)
        const tailY = headY - meteor.dirY * meteor.length * Math.min(1, p * 2)

        const grad = ctx.createLinearGradient(tailX, tailY, headX, headY)
        grad.addColorStop(0, 'rgba(255, 94, 77, 0)')
        grad.addColorStop(0.7, `rgba(255, 138, 107, ${0.5 * fade})`)
        grad.addColorStop(1, `rgba(255, 228, 216, ${0.95 * fade})`)
        ctx.globalAlpha = 1
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.4
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(tailX, tailY)
        ctx.lineTo(headX, headY)
        ctx.stroke()

        // Hot head.
        ctx.fillStyle = `rgba(255, 240, 232, ${0.95 * fade})`
        ctx.beginPath()
        ctx.arc(headX, headY, 1.5, 0, TAU)
        ctx.fill()
      }
    }

    ctx.globalAlpha = 1
  }

  /**
   * Fade the canvas in ONLY after its first real frame has been painted.
   * A CSS-driven fade starts ticking at page paint while the canvas is still
   * blank (pre-hydration), so the stars and nebula pop in mid-fade like a
   * switch. Driving the fade from here keeps content and fade in lockstep.
   */
  let revealed = false
  function revealCanvas() {
    if (revealed) return
    revealed = true
    if (fadeIn) {
      canvas.style.transition = 'opacity 1.05s cubic-bezier(0.22, 1, 0.36, 1)'
    }
    canvas.style.opacity = '1'
  }

  function tick(t: number) {
    if (!lastPaintAt || t - lastPaintAt >= minFrameInterval) {
      lastPaintAt = t
      draw(t)
      revealCanvas()
    }
    if (running) raf = requestAnimationFrame(tick)
  }

  function startLoop() {
    if (running || stopped) return
    running = true
    raf = requestAnimationFrame(tick)
  }

  function haltLoop() {
    running = false
    if (raf) cancelAnimationFrame(raf)
    raf = 0
  }

  function onVisibility() {
    if (document.hidden) {
      haltLoop()
    } else {
      lastT = 0
      lastPaintAt = 0
      startLoop()
    }
  }

  function onResize() {
    clearTimeout(resizeTimer)
    resizeTimer = window.setTimeout(() => {
      resize()
      if (!running) draw(937)
    }, 120)
  }

  resize()
  scheduleMeteor(900)

  if (staticFrame) {
    // Reduced motion / returning visitor: one painted frame, zero loop.
    draw(937)
    revealCanvas()
  } else {
    startLoop()
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('resize', onResize)
  }

  return {
    freeze() {
      // Halt the loop only — the last painted frame stays up until the loader
      // unmounts, so the stars never vanish in a hard cut before the handoff.
      haltLoop()
    },
    stop() {
      stopped = true
      haltLoop()
      clearTimeout(resizeTimer)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('resize', onResize)
    },
  }
}
