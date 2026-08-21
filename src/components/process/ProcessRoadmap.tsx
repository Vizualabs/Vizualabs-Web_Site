import {
  ClipboardCheck,
  Lightbulb,
  MessagesSquare,
  Puzzle,
  Rocket,
  Settings2,
  Wrench,
} from 'lucide-react'
import { JellyBlobMascot } from 'feral-blob'
import { motion, MotionConfig } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { BLOB_WHITE_SKIN } from '#/components/chat/BlobMascotIcon'
import { ErrorBoundary } from '#/components/ErrorBoundary'
import 'feral-blob/blob.css'

const TRAVEL_DURATION_MS = 24_000
const MASCOT_CENTER_OFFSET = 24

/** Soft enter/exit band — exit soon after leaving so fade-out can start promptly. */
const STEP_ENTER_RADIUS = 48
const STEP_EXIT_RADIUS = 48
/** Brief dwell before auto-opening — kills one-frame flash-pass pops. */
const TRAVEL_ENTER_DWELL_MS = 90

const HOVER_SPRING_IN = { type: 'spring' as const, stiffness: 280, damping: 24, mass: 0.7 }
const HOVER_SPRING_OUT = { type: 'spring' as const, stiffness: 180, damping: 28, mass: 0.85 }
const LABEL_EASE_IN = { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const }
const LABEL_EASE_OUT = { duration: 0.38, ease: [0.33, 1, 0.68, 1] as const }

const ROADMAP_STEPS = [
  {
    id: 1,
    title: 'Idea stage',
    description:
      'Conceptualizing the core digital strategy and identifying opportunities for innovation.',
    icon: Lightbulb,
    position: 'bottom' as const,
  },
  {
    id: 2,
    title: 'Discussion',
    description: 'Brainstorming with stakeholders to align vision and goals.',
    icon: MessagesSquare,
    position: 'top' as const,
  },
  {
    id: 3,
    title: 'Planning',
    description:
      'Detailed roadmap creation, resource allocation, and timeline establishment.',
    icon: ClipboardCheck,
    position: 'top' as const,
  },
  {
    id: 4,
    title: 'Design Phase',
    description:
      'Crafting intuitive user experiences with stunning visual design and prototypes.',
    icon: Settings2,
    position: 'bottom' as const,
  },
  {
    id: 5,
    title: 'Building',
    description: 'Iterative development and quality assurance to ship robust solutions.',
    icon: Puzzle,
    position: 'top' as const,
  },
  {
    id: 6,
    title: 'Launch',
    description:
      'Strategic deployment to market with comprehensive testing and monitoring.',
    icon: Rocket,
    position: 'bottom' as const,
  },
  {
    id: 7,
    title: 'Maintenance',
    description: 'Ongoing support, optimization, and feature improvements.',
    icon: Wrench,
    position: 'top' as const,
  },
]

const STEP_POSITIONS = [
  { cx: 115, cy: 323 },
  { cx: 170, cy: 220 },
  { cx: 327, cy: 161 },
  { cx: 380, cy: 342 },
  { cx: 530, cy: 161 },
  { cx: 580, cy: 342 },
  { cx: 710, cy: 161 },
]

const ROAD_PATH = `
    M 0 350
    L 50 350
    Q 80 350 80 320
    Q 80 290 110 290
    L 140 290
    Q 170 290 170 260
    Q 170 230 200 230
    L 250 230
    Q 280 230 280 200
    Q 280 170 310 170
    L 350 170
    Q 380 170 380 200
    V 320
    Q 380 350 410 350
    L 450 350
    Q 480 350 480 320
    V 200
    Q 480 170 510 170
    L 550 170
    Q 580 170 580 200
    V 320
    Q 580 350 610 350
    L 650 350
    Q 680 350 680 320
    V 200
    Q 680 170 710 170
    L 800 170
  `

// Short end fades: long fades make the white jelly read as muddy pink on the red road.
const TRAVEL_FADE_FRACTION = 0.05

function getTravelOpacity(progress: number) {
  if (progress < TRAVEL_FADE_FRACTION) return progress / TRAVEL_FADE_FRACTION
  if (progress > 1 - TRAVEL_FADE_FRACTION) return (1 - progress) / TRAVEL_FADE_FRACTION
  return 1
}

function distanceToStep(x: number, y: number, stepIndex: number) {
  const position = STEP_POSITIONS[stepIndex]
  return Math.hypot(x - position.cx, y - position.cy)
}

function findNearestStepId(x: number, y: number, radius: number) {
  let nearestStep: number | null = null
  let nearestDistance = radius

  for (let index = 0; index < STEP_POSITIONS.length; index++) {
    const distance = distanceToStep(x, y, index)
    if (distance < nearestDistance) {
      nearestDistance = distance
      nearestStep = ROADMAP_STEPS[index].id
    }
  }

  return nearestStep
}

export function ProcessRoadmap() {
  const pathRef = useRef<SVGPathElement>(null)
  const mascotGroupRef = useRef<SVGGElement>(null)
  const travelStepRef = useRef<number | null>(null)
  const enterCandidateRef = useRef<{ id: number; since: number } | null>(null)

  const [travelHoveredStep, setTravelHoveredStep] = useState<number | null>(null)
  const [manualHoveredStep, setManualHoveredStep] = useState<number | null>(null)

  useEffect(() => {
    const path = pathRef.current
    const mascotGroup = mascotGroupRef.current
    if (!path || !mascotGroup) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const totalLength = path.getTotalLength()
    const start = performance.now()
    let frame = 0

    const commitTravelStep = (next: number | null) => {
      if (travelStepRef.current === next) return
      travelStepRef.current = next
      setTravelHoveredStep(next)
    }

    const tick = (now: number) => {
      const elapsed = now - start
      const progress = (elapsed % TRAVEL_DURATION_MS) / TRAVEL_DURATION_MS
      const point = path.getPointAtLength(progress * totalLength)
      const opacity = getTravelOpacity(progress)

      // Drive the traveler on the DOM only — never through React state.
      mascotGroup.setAttribute('transform', `translate(${point.x} ${point.y})`)
      mascotGroup.setAttribute('opacity', String(opacity))

      const current = travelStepRef.current
      let next = current

      if (current != null) {
        const distance = distanceToStep(point.x, point.y, current - 1)

        if (distance <= STEP_EXIT_RADIUS) {
          enterCandidateRef.current = null
          next = current
        } else {
          // Clear immediately when past — Motion's exit easing handles the soft fade.
          next = null
          enterCandidateRef.current = null
        }
      }

      if (next == null) {
        const candidate = findNearestStepId(point.x, point.y, STEP_ENTER_RADIUS)
        if (candidate == null) {
          enterCandidateRef.current = null
        } else if (enterCandidateRef.current?.id !== candidate) {
          enterCandidateRef.current = { id: candidate, since: now }
        } else if (now - enterCandidateRef.current.since >= TRAVEL_ENTER_DWELL_MS) {
          next = candidate
          enterCandidateRef.current = null
        }
      }

      commitTravelStep(next)
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <section
      className="relative w-full overflow-hidden bg-black pt-6 pb-0 md:pt-12"
      aria-label="Strategic journey roadmap"
    >
      <MotionConfig reducedMotion="user">
        <div className="relative w-full">
          <div className="hidden md:block relative w-full pb-0 px-0">
            <div className="pointer-events-none absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-red-600/10 blur-[120px] animate-pulse" />
            <div
              className="pointer-events-none absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-red-900/10 blur-[120px] animate-pulse"
              style={{ animationDelay: '700ms' }}
            />

            <svg
              viewBox="0 0 800 500"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="relative z-10 h-auto w-full"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <filter id="processRoadShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="20" />
                  <feOffset dx="0" dy="15" result="offsetblur" />
                  <feComponentTransfer>
                    <feFuncA type="linear" slope="0.7" />
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <linearGradient id="processRoadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4a0000" />
                  <stop offset="25%" stopColor="#990000" />
                  <stop offset="50%" stopColor="#ff0000" />
                  <stop offset="75%" stopColor="#990000" />
                  <stop offset="100%" stopColor="#4a0000" />
                </linearGradient>
                <filter id="processGlow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <path id="processMainRoadPath" ref={pathRef} d={ROAD_PATH} />
              </defs>

              <motion.path
                d={ROAD_PATH}
                stroke="#FF0000"
                strokeWidth="70"
                strokeLinecap="round"
                className="blur-3xl opacity-10"
              />
              <motion.path
                d={ROAD_PATH}
                stroke="white"
                strokeWidth="54"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <motion.path
                d={ROAD_PATH}
                stroke="url(#processRoadGradient)"
                strokeWidth="50"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#processRoadShadow)"
              />

              {/* Traveler motion is ref-driven; React only mounts it once. */}
              <g
                ref={mascotGroupRef}
                pointerEvents="none"
                style={{ pointerEvents: 'none' }}
                opacity={0}
                transform="translate(0 0)"
              >
                <foreignObject
                  x={-MASCOT_CENTER_OFFSET}
                  y={-MASCOT_CENTER_OFFSET}
                  width={MASCOT_CENTER_OFFSET * 2}
                  height={MASCOT_CENTER_OFFSET * 2}
                  overflow="visible"
                  pointerEvents="none"
                >
                  <div
                    style={{
                      ...BLOB_WHITE_SKIN,
                      width: '100%',
                      height: '100%',
                      pointerEvents: 'none',
                    }}
                  >
                    <ErrorBoundary
                      fallback={
                        <div
                          className="h-full w-full rounded-full"
                          style={{ background: 'var(--jelly-body-mid, #F7F7F8)' }}
                        />
                      }
                    >
                      <JellyBlobMascot mood="happy" className="h-full w-full pointer-events-none" />
                    </ErrorBoundary>
                  </div>
                </foreignObject>
              </g>

              <path
                d={ROAD_PATH}
                stroke="white"
                strokeWidth="2"
                strokeDasharray="10 20"
                strokeLinecap="round"
                fill="none"
                className="opacity-40 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
              />

              {ROADMAP_STEPS.map((step, index) => {
                const pos = STEP_POSITIONS[index]

                // Manual and auto visit share the ambient look exactly
                // (soft size/color + tilt + title/description).
                const isActive =
                  manualHoveredStep === step.id ||
                  (manualHoveredStep === null && travelHoveredStep === step.id)

                return (
                  <g key={step.id} className="cursor-pointer">
                    <foreignObject
                      x={pos.cx - 30}
                      y={pos.cy - 30}
                      width="60"
                      height="60"
                      className="overflow-visible"
                    >
                      {/* Avoid scale-from-0 inside SVG foreignObject — browsers
                          often clip/paint that transform as invisible. */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.35, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full w-full"
                      >
                        <motion.div
                          animate={{
                            scale: isActive ? 1.05 : 1,
                            rotate: isActive ? 3 : 0,
                          }}
                          transition={isActive ? HOVER_SPRING_IN : HOVER_SPRING_OUT}
                          onMouseEnter={() => setManualHoveredStep(step.id)}
                          onMouseLeave={() => setManualHoveredStep(null)}
                          className={`relative flex h-full w-full cursor-pointer items-center justify-center overflow-hidden rounded-full border-4 bg-white shadow-2xl transition-[border-color,box-shadow] duration-300 ease-out ${
                            isActive
                              ? 'border-[#FF0000] shadow-[0_0_14px_rgba(255,0,0,0.3)]'
                              : 'border-[#FF0000]/80 shadow-2xl'
                          }`}
                        >
                          <div
                            className={`absolute inset-0 bg-gradient-to-br from-red-500 to-red-700 transition-opacity duration-300 ease-out ${
                              isActive ? 'opacity-30' : 'opacity-0'
                            }`}
                          />
                          <step.icon
                            className={`relative z-10 h-5 w-5 transition-all duration-300 ease-out ${
                              isActive ? 'scale-105 text-gray-800' : 'text-gray-700'
                            }`}
                            strokeWidth={2.5}
                            aria-hidden="true"
                          />
                        </motion.div>
                      </motion.div>
                    </foreignObject>

                    <foreignObject
                      x={pos.cx - 100}
                      y={step.position === 'top' ? pos.cy - 120 : pos.cy + 50}
                      width="200"
                      height="120"
                      className="pointer-events-none overflow-visible"
                    >
                      <motion.div
                        initial={{ opacity: 0, y: step.position === 'top' ? 20 : -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.12 + 0.4 }}
                        className="text-center"
                      >
                        <motion.h3
                          className="mb-2 font-hanken text-xs font-bold uppercase tracking-wide text-white md:text-sm"
                          animate={{
                            color: isActive ? '#ef4444' : '#ffffff',
                            scale: isActive ? 1.06 : 1,
                          }}
                          transition={isActive ? LABEL_EASE_IN : LABEL_EASE_OUT}
                        >
                          {step.title}
                        </motion.h3>
                        <motion.p
                          initial={false}
                          animate={{
                            opacity: isActive ? 1 : 0,
                            y: isActive ? 0 : 6,
                          }}
                          transition={isActive ? LABEL_EASE_IN : LABEL_EASE_OUT}
                          className="px-4 text-[10px] leading-relaxed text-white/75 md:text-xs"
                        >
                          {step.description}
                        </motion.p>
                      </motion.div>
                    </foreignObject>
                  </g>
                )
              })}
            </svg>
          </div>

          <div className="relative w-full px-5 pb-0 md:hidden">
            <div className="pointer-events-none absolute top-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-red-600/10 blur-[100px]" />

            <ol className="relative z-10 space-y-8">
              {ROADMAP_STEPS.map((step, index) => (
                <motion.li
                  key={step.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
                  className="relative"
                >
                  <div className="flex items-start gap-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-red-500 bg-white shadow-xl"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-700 opacity-0 transition-opacity duration-500" />
                      <step.icon
                        className="relative z-10 h-7 w-7 text-gray-700"
                        strokeWidth={2.5}
                        aria-hidden="true"
                      />
                    </motion.div>

                    <div className="flex-1 pt-1">
                      <h3 className="mb-1 font-hanken text-base font-bold uppercase tracking-wide text-white">
                        {step.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-white/60">{step.description}</p>
                    </div>
                  </div>

                  {index < ROADMAP_STEPS.length - 1 ? (
                    <div className="ml-8 mt-4 mb-4 h-8 w-0.5 bg-gradient-to-b from-red-500 to-red-500/20" />
                  ) : null}
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      </MotionConfig>
    </section>
  )
}
