/**
 * Cinematic black hole — single-pass WebGL2 fragment shader on a quad.
 *
 * Visual model (all in-shader, no textures, no post passes):
 *  - Event horizon: a perfectly black disc; nothing inside the radius escapes.
 *  - Gravitational lensing: a 1/r^2 radial warp applied to every light sample
 *    (disk AND star field), so background light visibly bends around the hole.
 *  - Accretion disk: tilted plane with radius-dependent coordinate rotation
 *    (inner matter orbits faster — differential shear streaks the clumps
 *    tangentially, seamless, no polar-coordinate wrap artifacts).
 *  - Doppler beaming: the side of the disk rotating toward the viewer is
 *    brighter, giving the composition its organic asymmetry.
 *  - Bent halo: the disk's far side is re-sampled mirrored and concentrated
 *    near the photon sphere, the classic light-bending-over-the-top look.
 *  - Photon ring: a thin, crisp ring hugging the shadow edge.
 *  - Heat shimmer: subtle noise warp that grows near the horizon.
 *  - Palette is locked to the brand ramp: #FFFFFF -> #FFDDD6 -> #FF8A6B ->
 *    #FF5E4D -> #B83A2E, brightest at the horizon and fading outward.
 *
 * Performance: 30fps cap, internal render scale below device DPR (the effect
 * is soft by nature, so upscaling is invisible), single fullscreen-triangle
 * draw, pauses on tab hide, releases every GPU resource on destroy. Reduced
 * motion renders one static frame and stops.
 */
import { useEffect, useRef, useState } from 'react'

export interface BlackHoleInstance {
  /** Begin the collapse-to-a-point animation (called when the intro reveals). */
  collapse: () => void
  /** Stop the loop and release all GPU resources. */
  destroy: () => void
}

const VERT = `#version 300 es
precision highp float;
layout(location = 0) in vec2 aPos;
out vec2 vUv;
void main () {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`

const FRAG = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;

uniform vec2 uResolution;
uniform float uTime;
uniform float uCollapse;
uniform float uMotion;

#define HOLE_R 0.30
#define BG vec3(0.0196)

float hash31 (vec3 p) {
  p = fract(p * 0.3183099 + vec3(0.1, 0.17, 0.13));
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float vnoise3 (vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);
  float n000 = hash31(i);
  float n100 = hash31(i + vec3(1.0, 0.0, 0.0));
  float n010 = hash31(i + vec3(0.0, 1.0, 0.0));
  float n110 = hash31(i + vec3(1.0, 1.0, 0.0));
  float n001 = hash31(i + vec3(0.0, 0.0, 1.0));
  float n101 = hash31(i + vec3(1.0, 0.0, 1.0));
  float n011 = hash31(i + vec3(0.0, 1.0, 1.0));
  float n111 = hash31(i + vec3(1.0, 1.0, 1.0));
  return mix(
    mix(mix(n000, n100, u.x), mix(n010, n110, u.x), u.y),
    mix(mix(n001, n101, u.x), mix(n011, n111, u.x), u.y),
    u.z);
}

float fbm3 (vec3 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * vnoise3(p);
    p = p * 2.07 + vec3(13.1, 7.7, 5.3);
    a *= 0.55;
  }
  return v;
}

vec2 rot2 (vec2 v, float a) {
  float s = sin(a);
  float c = cos(a);
  return vec2(c * v.x - s * v.y, s * v.x + c * v.y);
}

/* Brand ramp: 0 = white-hot inner rim, 1 = deep ember at the disk edge. */
vec3 palette (float t) {
  vec3 c0 = vec3(1.0, 1.0, 1.0);        // #FFFFFF
  vec3 c1 = vec3(1.0, 0.867, 0.839);    // #FFDDD6
  vec3 c2 = vec3(1.0, 0.541, 0.420);    // #FF8A6B
  vec3 c3 = vec3(1.0, 0.369, 0.302);    // #FF5E4D
  vec3 c4 = vec3(0.722, 0.227, 0.180);  // #B83A2E
  vec3 col = mix(c0, c1, smoothstep(0.0, 0.16, t));
  col = mix(col, c2, smoothstep(0.12, 0.36, t));
  col = mix(col, c3, smoothstep(0.32, 0.60, t));
  col = mix(col, c4, smoothstep(0.56, 0.88, t));
  return col;
}

/* Clumpy disk texture: sample noise on a (cos, sin) circle — periodic, so
   there is no polar-wrap seam — with the angle advanced by a radius-dependent
   rotation. Inner matter orbits faster, shearing clumps into tangential
   filaments. Tangential and radial frequencies are independent: long streaks
   around the ring, sharp cut across it. */
float diskTexture (vec2 d, float t) {
  float dr = length(d);
  float a = atan(d.y, d.x);
  float aa = a + t * 0.55 / (dr * dr + 0.28);
  vec2 circ = vec2(cos(aa), sin(aa));
  float clumps = fbm3(vec3(circ * 2.2, dr * 5.0));
  float detail = fbm3(vec3(circ * 4.6, dr * 13.0 + 3.0));
  return clumps * 0.8 + detail * 0.45;
}

float diskDensity (vec2 d, float t, out float ct) {
  float dr = length(d);
  float inner = 0.35;
  float outer = 1.05;
  float radial = smoothstep(inner * 0.9, inner + 0.07, dr)
    * exp(-max(dr - inner, 0.0) * 1.8)
    * (1.0 - smoothstep(outer * 0.72, outer, dr));
  ct = clamp((dr - inner) / (outer - inner), 0.0, 1.0);
  float n = diskTexture(d, t);
  return radial * (0.15 + 1.7 * pow(max(n, 0.0), 1.3));
}

void main () {
  vec2 frag = vUv * uResolution;
  // Collapse: pull all coordinates toward the singularity as it implodes.
  float cz = 1.0 + uCollapse * uCollapse * 3.0;
  vec2 p = (2.0 * frag - uResolution) / min(uResolution.x, uResolution.y) / cz;
  float r = length(p);
  float t = uTime;

  // Gravitational lensing: 1/r^2 radial warp of every light sample.
  float lens = 0.55 * HOLE_R * HOLE_R / max(dot(p, p), 1e-4);
  lens = min(lens, 0.85);
  vec2 lp = p * (1.0 - lens);

  // Heat shimmer, strongest near the horizon, frozen under reduced motion.
  float shimAmt = 0.011 * uMotion * exp(-r * 1.7);
  lp += shimAmt * vec2(
    vnoise3(vec3(p * 8.0, t * 0.7)) - 0.5,
    vnoise3(vec3(p * 8.0 + 4.2, t * 0.6)) - 0.5);

  vec3 col = BG;

  // Star field — sparse, dim, and lensed by the same warp so the lensing
  // reads on background light too. Kept away from the disk's region.
  {
    vec2 sp = lp * 11.0;
    vec2 cell = floor(sp);
    float h = hash31(vec3(cell, 0.0));
    if (h > 0.93) {
      vec2 fp = fract(sp);
      vec2 spos = vec2(hash31(vec3(cell, 1.0)), hash31(vec3(cell, 2.0)));
      float sd = length(fp - spos);
      float tw = mix(0.85, 0.6 + 0.4 * sin(t * 1.3 + h * 47.0), uMotion);
      float star = smoothstep(0.09, 0.0, sd) * smoothstep(0.93, 1.0, h);
      col += vec3(0.85, 0.8, 0.8) * star * 0.20 * tw
        * smoothstep(0.55, 0.85, r);
    }
  }

  // Accretion disk: tilted plane. Front half (below center) is the near side.
  float tilt = 0.30;
  vec2 d1 = vec2(lp.x, lp.y / tilt);
  float ct1;
  float den1 = diskDensity(d1, t, ct1);
  float dr1 = length(d1);
  vec2 dopDir = normalize(vec2(0.85, -0.5));
  float dop1 = 1.0 + 0.85 * dot(d1 / max(dr1, 1e-3), dopDir);
  float frontness = smoothstep(0.15, -0.35, lp.y);
  col += palette(ct1) * den1 * dop1 * mix(0.35, 1.05, frontness) * 1.25;

  // Bent halo: the disk's far side, mirrored and concentrated near the
  // photon sphere — light from behind the hole curving over the top.
  vec2 d2 = vec2(lp.x, -lp.y / tilt);
  float ct2;
  float den2 = diskDensity(d2, t, ct2);
  float haloBand = exp(-abs(r - HOLE_R * 1.42) * 4.2);
  float dop2 = 1.0 + 0.55 * dot(d2 / max(length(d2), 1e-3), dopDir);
  col += palette(clamp(ct2 * 0.7, 0.0, 1.0)) * den2 * dop2 * haloBand * 1.1;

  // Photon ring — thin, crisp, slightly brighter on the approaching side.
  float pr = exp(-pow((r - HOLE_R * 1.2) / (HOLE_R * 0.045), 2.0));
  float prDop = 1.0 + 0.5 * (p.x / max(r, 1e-3));
  col += vec3(1.0, 0.9, 0.84) * pr * 0.7 * prDop;

  // White-hot rim: the brightest light lives right at the horizon and dies
  // outward — this is what sells the depth.
  col += palette(0.12) * exp(-max(r - HOLE_R, 0.0) * 7.0) * 0.7;

  // Broad ambient bloom, kept deep red so the void stays void.
  col += palette(0.55) * exp(-r * 3.1) * 0.08;

  // Event horizon: nothing escapes. Pure black, hairline-soft edge.
  col = mix(vec3(0.0), col, smoothstep(HOLE_R * 0.99, HOLE_R * 1.04, r));

  // Collapse flash then fade — the singularity takes everything with it.
  col *= 1.0 - uCollapse;
  col += vec3(1.0, 0.95, 0.9) * exp(-r * 4.0)
    * uCollapse * (1.0 - uCollapse) * 2.4;

  // Filmic-ish rolloff, then an explicit fade to the EXACT page background
  // well before the canvas edge — a tonemapped background would otherwise
  // sit a few levels above #050505 and show the canvas rectangle.
  col = 1.0 - exp(-col * 1.5);
  col = mix(col, BG, smoothstep(0.82, 1.18, r));
  col += (hash31(vec3(frag, 1.0)) - 0.5) * 0.008;

  outColor = vec4(col, 1.0);
}`

/** Cap the loop at 30fps — cinematic, and halves GPU cost vs 60. */
const MIN_FRAME_INTERVAL_MS = 1000 / 30

/**
 * The shader is soft by nature, so it renders below device DPR and lets CSS
 * upscale — invisible for glow, big savings in per-pixel cost. Phones go
 * lower still; their GPUs are the constraint, never their screen density.
 */
const RENDER_SCALE_DESKTOP = 0.8
const RENDER_SCALE_PHONE = 0.6
const MAX_DPR = 1.5

/** Frozen-frame timestamp for reduced motion (a nice disk angle). */
const STILL_TIME = 1.35

const isPhoneDevice = () =>
  typeof window !== 'undefined' &&
  window.innerWidth < 768 &&
  window.matchMedia('(pointer: coarse)').matches

export function createBlackHole(
  canvas: HTMLCanvasElement,
): BlackHoleInstance | null {
  const gl = canvas.getContext('webgl2', {
    alpha: false,
    depth: false,
    stencil: false,
    antialias: false,
    powerPreference: 'high-performance',
  })
  if (!gl || gl.isContextLost()) return null

  function compile(type: number, text: string): WebGLShader | null {
    const shader = gl!.createShader(type)!
    gl!.shaderSource(shader, text)
    gl!.compileShader(shader)
    if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
      console.error('BlackHole shader error:', gl!.getShaderInfoLog(shader))
      gl!.deleteShader(shader)
      return null
    }
    return shader
  }

  const vertexShader = compile(gl.VERTEX_SHADER, VERT)
  const fragmentShader = compile(gl.FRAGMENT_SHADER, FRAG)
  if (!vertexShader || !fragmentShader) return null

  const program = gl.createProgram()!
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('BlackHole link error:', gl.getProgramInfoLog(program))
    gl.deleteProgram(program)
    return null
  }
  gl.useProgram(program)

  const quad = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, quad)
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW,
  )
  gl.enableVertexAttribArray(0)
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

  const uResolution = gl.getUniformLocation(program, 'uResolution')
  const uTime = gl.getUniformLocation(program, 'uTime')
  const uCollapse = gl.getUniformLocation(program, 'uCollapse')
  const uMotion = gl.getUniformLocation(program, 'uMotion')

  const renderScale = isPhoneDevice()
    ? RENDER_SCALE_PHONE
    : RENDER_SCALE_DESKTOP

  function syncSize() {
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR) * renderScale
    const width = Math.max(1, Math.round(canvas.clientWidth * dpr))
    const height = Math.max(1, Math.round(canvas.clientHeight * dpr))
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width
      canvas.height = height
    }
  }
  syncSize()

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  let reducedMotion = motionQuery.matches

  let time = 0
  let collapse = 0
  let collapseTarget = 0
  let raf = 0
  let lastTime = performance.now()
  let destroyed = false
  let running = false

  function render() {
    gl!.viewport(0, 0, canvas.width, canvas.height)
    gl!.uniform2f(uResolution, canvas.width, canvas.height)
    gl!.uniform1f(uTime, time)
    gl!.uniform1f(uCollapse, collapse)
    gl!.uniform1f(uMotion, reducedMotion ? 0 : 1)
    gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4)
    if (typeof window !== 'undefined') {
      const w = window as unknown as { __blackHoleFrames?: number }
      w.__blackHoleFrames = (w.__blackHoleFrames ?? 0) + 1
    }
  }

  function frame(now: number) {
    if (destroyed) return
    if (now - lastTime < MIN_FRAME_INTERVAL_MS) {
      raf = requestAnimationFrame(frame)
      return
    }
    const delta = Math.min((now - lastTime) / 1000, 1 / 15)
    lastTime = now
    if (!reducedMotion) time += delta
    if (collapse !== collapseTarget) {
      collapse += (collapseTarget - collapse) * 0.14
      if (Math.abs(collapseTarget - collapse) < 0.002) collapse = collapseTarget
    }
    render()
    // Reduced motion: one considered frame, then rest. Everything else loops.
    if (reducedMotion && collapse === collapseTarget) {
      running = false
      return
    }
    raf = requestAnimationFrame(frame)
  }

  function start() {
    if (destroyed || running) return
    running = true
    lastTime = performance.now()
    raf = requestAnimationFrame(frame)
  }

  if (reducedMotion) {
    time = STILL_TIME
  }
  start()

  function onMotionChange() {
    reducedMotion = motionQuery.matches
    if (reducedMotion) time = STILL_TIME
    start()
  }
  motionQuery.addEventListener('change', onMotionChange)

  function onVisibility() {
    if (document.hidden) {
      cancelAnimationFrame(raf)
      running = false
    } else {
      start()
    }
  }
  document.addEventListener('visibilitychange', onVisibility)

  const observer = new ResizeObserver(() => {
    syncSize()
    start()
  })
  observer.observe(canvas)

  return {
    collapse() {
      collapseTarget = 1
      start()
    },
    destroy() {
      destroyed = true
      cancelAnimationFrame(raf)
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      motionQuery.removeEventListener('change', onMotionChange)
      gl!.deleteProgram(program)
      gl!.deleteShader(vertexShader!)
      gl!.deleteShader(fragmentShader!)
      gl!.deleteBuffer(quad)
      gl!.getExtension('WEBGL_lose_context')?.loseContext()
    },
  }
}

export function BlackHoleCanvas({
  revealing,
  className,
}: {
  /** True once the intro starts its reveal — triggers the collapse. */
  revealing: boolean
  className?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const instanceRef = useRef<BlackHoleInstance | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const instance = createBlackHole(canvas)
    instanceRef.current = instance
    if (!instance) setFailed(true)
    return () => {
      instanceRef.current?.destroy()
      instanceRef.current = null
    }
  }, [])

  useEffect(() => {
    if (revealing) instanceRef.current?.collapse()
  }, [revealing])

  // No WebGL2: the CSS underlay (.brand-intro-bh-under) stays as the visual.
  if (failed) return null

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}
