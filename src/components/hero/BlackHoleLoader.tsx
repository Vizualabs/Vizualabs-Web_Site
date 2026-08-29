import { useEffect, useRef, useState } from 'react'
import { BLACK_HOLE_FRAG, BLACK_HOLE_VERT } from './blackHoleShader'
import { cn } from '../../lib/cn'

interface BlackHoleLoaderProps {
  /** 0..100 — drives the disk "ignition" and a slow camera dolly-in. */
  progress: number
  /** Skip the shader entirely (phones, returning-visitor fast intro). */
  simplified?: boolean
  className?: string
}

const MAX_DPR = 1.5

function compileShader(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('BlackHoleLoader shader error:', gl.getShaderInfoLog(shader))
  }
  return shader
}

function createGeometry(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl2', {
    alpha: false,
    depth: false,
    stencil: false,
    antialias: false,
    powerPreference: 'low-power',
  })
  if (!gl || gl.isContextLost()) return null

  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, BLACK_HOLE_VERT)
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, BLACK_HOLE_FRAG)
  const program = gl.createProgram()!
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('BlackHoleLoader program link error:', gl.getProgramInfoLog(program))
    return null
  }

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  gl.enableVertexAttribArray(0)
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

  const uniforms = {
    uResolution: gl.getUniformLocation(program, 'uResolution'),
    uTime: gl.getUniformLocation(program, 'uTime'),
    uProgress: gl.getUniformLocation(program, 'uProgress'),
    uIntensity: gl.getUniformLocation(program, 'uIntensity'),
  }

  return { gl, program, buffer, vertexShader, fragmentShader, uniforms }
}

/** Static CSS fallback — same coral core/orbit look the loader used before,
 *  shown on phones, reduced-motion, and if WebGL2 is unavailable. */
function StaticCore() {
  return (
    <div className="relative flex h-28 w-28 items-center justify-center sm:h-32 sm:w-32">
      <span className="brand-intro-orbit brand-intro-orbit-a" aria-hidden="true" />
      <span className="brand-intro-orbit brand-intro-orbit-b" aria-hidden="true" />
      <span className="brand-intro-core-glow" aria-hidden="true" />
      <span className="brand-intro-core-orb" aria-hidden="true" />
    </div>
  )
}

export function BlackHoleLoader({ progress, simplified = false, className }: BlackHoleLoaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const progressRef = useRef(progress)
  const [supported, setSupported] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    progressRef.current = progress
  }, [progress])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const useShader = !simplified && !reducedMotion && supported

  useEffect(() => {
    if (!useShader) return
    const canvas = canvasRef.current
    if (!canvas) return

    const geo = createGeometry(canvas)
    if (!geo) {
      setSupported(false)
      return
    }
    const { gl, program, buffer, vertexShader, fragmentShader, uniforms } = geo

    let raf = 0
    let start = performance.now()
    let visible = document.visibilityState === 'visible'

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      const width = Math.max(1, Math.round(canvas.clientWidth * dpr))
      const height = Math.max(1, Math.round(canvas.clientHeight * dpr))
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
        gl.viewport(0, 0, width, height)
      }
    }

    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    resize()

    const onVisibility = () => {
      visible = document.visibilityState === 'visible'
      if (visible) start = performance.now() - lastElapsed
    }
    document.addEventListener('visibilitychange', onVisibility)

    let lastElapsed = 0

    gl.useProgram(program)

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      if (!visible) return
      lastElapsed = now - start
      gl.uniform2f(uniforms.uResolution, canvas.width, canvas.height)
      gl.uniform1f(uniforms.uTime, lastElapsed / 1000)
      gl.uniform1f(uniforms.uProgress, Math.min(1, progressRef.current / 100))
      gl.uniform1f(uniforms.uIntensity, 1)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      gl.deleteBuffer(buffer)
      gl.deleteShader(vertexShader)
      gl.deleteShader(fragmentShader)
      gl.deleteProgram(program)
    }
  }, [useShader])

  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      {useShader ? (
        <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />
      ) : (
        <StaticCore />
      )}
    </div>
  )
}
