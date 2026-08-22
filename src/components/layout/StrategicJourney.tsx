import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Search,
  Wrench,
  Rocket,
  TrendingUp,
  Cpu,
  Cloud,
  ShieldCheck,
  Database,
  Sparkles,
} from 'lucide-react'
import { BlurFade } from '#/components/ui/blur-fade'
import { OrbitingCircles } from '#/components/ui/orbiting-circles'
import { JourneySystemsDiagram } from '#/components/layout/JourneySystemsDiagram'

interface JourneyStep {
  id: number
  title: string
  description: string
  icon: typeof Search
}

const steps: JourneyStep[] = [
  {
    id: 1,
    title: 'Strategic Audit',
    description: 'Analyzing the landscape to identify technical debt and growth potential.',
    icon: Search,
  },
  {
    id: 2,
    title: 'Precision Build',
    description: 'Agile execution with a focus on code quality and architectural integrity.',
    icon: Wrench,
  },
  {
    id: 3,
    title: 'Seamless Deployment',
    description: 'Zero-downtime release strategies paired with instant observability.',
    icon: Rocket,
  },
  {
    id: 4,
    title: 'Scalable Evolution',
    description: 'Continuous optimization and scaling to drive sustainable market dominance.',
    icon: TrendingUp,
  },
  {
    id: 5,
    title: 'Intelligent Systems',
    description: 'Deep AI integrations, autonomous agent pipelines, and enterprise LLM infrastructure.',
    icon: Cpu,
  },
  {
    id: 6,
    title: 'Cloud Architecture',
    description: 'Multi-region Kubernetes orchestration, elastic infrastructure, and automated failover.',
    icon: Cloud,
  },
  {
    id: 7,
    title: 'Enterprise Shield',
    description: 'Zero-trust network topology, cryptographic verification, and end-to-end security compliance.',
    icon: ShieldCheck,
  },
  {
    id: 8,
    title: 'Data Mastery',
    description: 'High-throughput stream processing pipelines, real-time analytics, and executive dashboards.',
    icon: Database,
  },
  {
    id: 9,
    title: 'Continuous Innovation',
    description: 'Rapid prototyping cycles, user telemetry feedback loops, and market leadership.',
    icon: Sparkles,
  },
]

const ITEM_HEIGHT = 142 // Height of each step on desktop / tablet

export function StrategicJourney() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [stepOffset, setStepOffset] = useState(0) // 0 = resting at slot 0, -1 = sliding forward, +1 = sliding backward
  const [isTransitioning, setIsTransitioning] = useState(true)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const isLocked = useRef(false)
  const touchStartY = useRef(0)
  const touchStartTime = useRef(0)
  const wheelLockTimer = useRef<number | null>(null)
  const wheelDeltaAccumulator = useRef(0)

  // Continuous forward wheel roll (1 -> 2 -> ... -> 9 -> 1 seamlessly)
  const rollNext = useCallback(() => {
    if (isLocked.current) return
    isLocked.current = true
    setIsTransitioning(true)
    setStepOffset(-1)

    setTimeout(() => {
      // Instantly advance activeIndex and reset offset without jump
      setIsTransitioning(false)
      setActiveIndex((prev) => (prev + 1) % steps.length)
      setStepOffset(0)
      setDragOffset(0)

      // Re-enable smooth transition on next tick
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true)
          isLocked.current = false
        })
      })
    }, 450)
  }, [])

  // Continuous backward wheel roll (1 -> 9 -> 8 ...)
  const rollPrev = useCallback(() => {
    if (isLocked.current) return
    isLocked.current = true
    setIsTransitioning(true)
    setStepOffset(1)

    setTimeout(() => {
      setIsTransitioning(false)
      setActiveIndex((prev) => (prev - 1 + steps.length) % steps.length)
      setStepOffset(0)
      setDragOffset(0)

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true)
          isLocked.current = false
        })
      })
    }, 450)
  }, [])

  // Jump to specific dot index smoothly
  const snapToStep = useCallback((targetIndex: number) => {
    if (isLocked.current || targetIndex === activeIndex) return
    setActiveIndex(targetIndex)
  }, [activeIndex])

  // Non-passive wheel event listener: intercepts wheel and isolates page scroll
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleNativeWheel = (e: WheelEvent) => {
      e.preventDefault()
      e.stopPropagation()

      wheelDeltaAccumulator.current += e.deltaY

      if (wheelLockTimer.current) {
        window.clearTimeout(wheelLockTimer.current)
      }

      if (Math.abs(wheelDeltaAccumulator.current) > 20 && !isLocked.current) {
        if (wheelDeltaAccumulator.current > 0) {
          rollNext()
        } else {
          rollPrev()
        }
        wheelDeltaAccumulator.current = 0
      }

      wheelLockTimer.current = window.setTimeout(() => {
        wheelDeltaAccumulator.current = 0
      }, 150)
    }

    container.addEventListener('wheel', handleNativeWheel, { passive: false })
    return () => {
      container.removeEventListener('wheel', handleNativeWheel)
    }
  }, [rollNext, rollPrev])

  // Touch / Pointer Drag Gestures for Mobile & PC
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isLocked.current) return
    setIsDragging(true)
    touchStartY.current = e.clientY
    touchStartTime.current = performance.now()
    setDragOffset(0)
    if (containerRef.current) {
      containerRef.current.setPointerCapture(e.pointerId)
    }
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return
    const deltaY = e.clientY - touchStartY.current
    setDragOffset(deltaY * 0.75)
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return
    setIsDragging(false)

    const deltaY = e.clientY - touchStartY.current
    const elapsed = performance.now() - touchStartTime.current
    const velocity = Math.abs(deltaY) / Math.max(elapsed, 1)

    if (deltaY < -35 || (deltaY < -15 && velocity > 0.35)) {
      rollNext()
    } else if (deltaY > 35 || (deltaY > 15 && velocity > 0.35)) {
      rollPrev()
    } else {
      setDragOffset(0)
    }

    if (containerRef.current && containerRef.current.hasPointerCapture(e.pointerId)) {
      containerRef.current.releasePointerCapture(e.pointerId)
    }
  }

  // Auto-cycle gently every 4.5s when stationary
  useEffect(() => {
    if (isDragging) return

    const interval = setInterval(() => {
      rollNext()
    }, 4500)

    return () => clearInterval(interval)
  }, [isDragging, rollNext])

  // Infinite Rotary Wheel Slots:
  // - slotOffset -1: Item above view
  // - slotOffset 0: Active top item
  // - slotOffset 1: Preview bottom item (ALWAYS populated, e.g. at step 9, slot 1 is step 1!)
  // - slotOffset 2: Next upcoming item below view
  const wheelSlots = [-1, 0, 1, 2].map((slotOffset) => {
    const wrappedIndex = ((activeIndex + slotOffset) % steps.length + steps.length) % steps.length
    return {
      slotOffset,
      step: steps[wrappedIndex],
      stepIndex: wrappedIndex,
    }
  })

  // Dynamic active highlight based on stepOffset animation state
  const effectiveActiveSlot = stepOffset === -1 ? 1 : stepOffset === 1 ? -1 : 0

  return (
    <section
      id="process"
      className="relative z-30 w-full bg-[#050505] py-16 sm:py-24 md:py-32 px-4 sm:px-8 md:px-12 border-t border-white/10 text-white selection:bg-[#FF5E4D] selection:text-white overflow-hidden"
    >
      {/* Background ambient radial glow */}
      <div className="pointer-events-none absolute top-1/3 left-0 h-72 sm:h-96 w-72 sm:w-96 rounded-full bg-[#FF5E4D]/5 blur-[120px] sm:blur-[140px]" />
      <div className="pointer-events-none absolute bottom-1/4 right-0 h-72 sm:h-96 w-72 sm:w-96 rounded-full bg-[#FF5E4D]/5 blur-[120px] sm:blur-[160px]" />

      <div className="relative mx-auto max-w-4xl">
        {/* Section Heading: completely solid and anchored */}
        <BlurFade inView delay={0.05} direction="up" className="space-y-2 sm:space-y-3 mb-8 sm:mb-10 md:mb-12">
          <span className="text-[11px] sm:text-xs md:text-sm font-normal tracking-[0.2em] text-[#FF5E4D] uppercase block">
            THE STRATEGIC JOURNEY
          </span>
          <h2 className="font-hanken text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight text-white leading-[1.1] sm:leading-[1.08]">
            Digital Success
            <span className="text-[#FF5E4D] italic block font-normal">
              Mastered.
            </span>
          </h2>
        </BlurFade>

        <JourneySystemsDiagram activeIndex={activeIndex} />

        {/* Magnetic Rotary Wheel Viewport: Infinite unbroken reel */}
        <div className="relative">
          
          <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className={`relative h-[290px] sm:h-[320px] md:h-[330px] overflow-hidden select-none cursor-grab active:cursor-grabbing touch-none ${
              isDragging ? 'cursor-grabbing' : ''
            }`}
            style={{
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 20px, black calc(100% - 28px), transparent 100%)',
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 20px, black calc(100% - 28px), transparent 100%)',
              touchAction: 'none',
            }}
          >
            {/* Magnetically Translating Continuous Rotary Wheel */}
            <div
              className={`flex flex-col pt-6 sm:pt-8 pl-4 sm:pl-8 pr-2 sm:pr-4 will-change-transform ${
                isDragging || !isTransitioning
                  ? 'transition-none'
                  : 'transition-transform duration-450 [transition-timing-function:cubic-bezier(0.25,1.35,0.36,1)]'
              }`}
              style={{
                transform: `translateY(${
                  (-1 + stepOffset) * ITEM_HEIGHT + dragOffset
                }px)`,
              }}
            >
              {wheelSlots.map(({ slotOffset, step, stepIndex }) => {
                const IconComponent = step.icon
                const isTopActive = slotOffset === effectiveActiveSlot
                const isBottomPreview = slotOffset === effectiveActiveSlot + 1

                return (
                  <div
                    key={`${step.id}-${stepIndex}-${slotOffset}`}
                    onClick={() => {
                      if (slotOffset === 1) rollNext()
                    }}
                    style={{ height: `${ITEM_HEIGHT}px` }}
                    className={`relative flex items-start gap-4 sm:gap-6 md:gap-7 cursor-pointer transition-all duration-400 ease-out ${
                      isTopActive
                        ? 'opacity-100 scale-100 translate-x-1'
                        : isBottomPreview
                        ? 'opacity-65 hover:opacity-90 scale-98 translate-x-0'
                        : 'opacity-0 scale-95 pointer-events-none'
                    }`}
                  >
                    {/* Left Column: Round Icon Badge + Vertical Connecting Line */}
                    <div className="relative flex flex-col items-center shrink-0">
                      {/* Icon Circle */}
                      <div className="relative flex h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 items-center justify-center">
                        {/* Magnetic Glow Bloom when active */}
                        {isTopActive && (
                          <div className="pointer-events-none absolute -inset-2 rounded-full bg-[#FF553E] opacity-70 blur-lg transition-opacity duration-500 animate-pulse" />
                        )}
                        {isTopActive && (
                          <OrbitingCircles
                            className="border-none bg-[#FF5E4D]/90"
                            radius={38}
                            duration={14}
                            iconSize={8}
                            path={false}
                          >
                            <span className="size-1.5 rounded-full bg-[#FF8A6B]" />
                            <span className="size-1 rounded-full bg-white/80" />
                            <span className="size-1.5 rounded-full bg-[#FF5E4D]" />
                          </OrbitingCircles>
                        )}
                        <div
                          className={`relative z-10 flex h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 items-center justify-center rounded-full transition-all duration-400 ${
                            isTopActive
                              ? 'bg-[#FF553E] text-white scale-105 shadow-[0_0_16px_rgba(255,85,62,0.85)]'
                              : 'border border-white/10 bg-[#18181A] text-[#71717A] shadow-inner scale-95 hover:border-[#FF553E]/40 hover:text-gray-300'
                          }`}
                        >
                          <IconComponent
                            className={`h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 transition-colors duration-300 ${
                              isTopActive
                                ? 'text-white stroke-[2.2]'
                                : 'text-[#71717A] stroke-[1.8]'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Connecting Line between badges — traveling beam when active */}
                      <div
                        className={`relative w-[1.5px] h-14 sm:h-16 md:h-18 my-1 overflow-hidden transition-colors duration-400 ${
                          isTopActive
                            ? 'bg-gradient-to-b from-[#FF553E]/40 via-white/10 to-white/5'
                            : 'bg-gradient-to-b from-white/10 to-transparent'
                        }`}
                      >
                        {isTopActive ? (
                          <span
                            aria-hidden
                            className="journey-line-beam absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-transparent via-[#FF8A6B] to-transparent opacity-90 motion-reduce:hidden"
                          />
                        ) : null}
                      </div>
                    </div>

                    {/* Right Column: Title & Description */}
                    <div className="pt-1.5 sm:pt-2 md:pt-2.5 space-y-1.5 sm:space-y-2 flex-1 min-w-0 pr-2 sm:pr-4">
                      <h3
                        className={`font-hanken text-xl sm:text-2xl md:text-3xl font-bold tracking-tight transition-colors duration-300 ${
                          isTopActive ? 'text-white' : 'text-[#71717A] hover:text-gray-300'
                        }`}
                      >
                        {step.title}
                      </h3>
                      <p
                        className={`text-xs sm:text-base md:text-lg font-normal leading-relaxed max-w-xl transition-colors duration-300 ${
                          isTopActive ? 'text-[#9CA3AF]' : 'text-[#52525B]'
                        }`}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Magnetic Progress Indicator & Dots */}
          <div className="mt-6 sm:mt-8 md:mt-10 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
            {/* Step Progress Dots with Magnetic Glow */}
            <div className="flex items-center gap-1.5 sm:gap-2 max-w-full overflow-x-auto scrollbar-none py-1">
              {steps.map((step, idx) => {
                const isActive = idx === activeIndex
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => snapToStep(idx)}
                    // p-3 -m-3: pads the tap target out to a comfortable size
                    // without growing the visible strip — the negative margin
                    // cancels the padding's layout footprint.
                    className="shrink-0 cursor-pointer p-3 -m-3"
                    aria-label={`Go to step ${step.title}`}
                  >
                    <span
                      className={`block h-2 rounded-full transition-all duration-500 ${
                        isActive
                          ? 'w-7 sm:w-9 bg-[#FF553E] shadow-[0_0_12px_#FF553E]'
                          : 'w-2 bg-white/20 hover:bg-white/40'
                      }`}
                    />
                  </button>
                )
              })}
            </div>

            <span className="text-[11px] sm:text-xs text-gray-500 font-medium">
              Rotary wheel • Swipe or scroll
            </span>
          </div>

        </div>
      </div>
    </section>
  )
}
