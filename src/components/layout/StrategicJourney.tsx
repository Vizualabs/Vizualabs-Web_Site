import { useState, useRef, useEffect } from 'react'
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

const ITEM_HEIGHT = 138 // Height of each step

export function StrategicJourney() {
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const isAutoScrolling = useRef(false)

  // Track native scroll position on the list to dynamically set the active top item
  const handleScroll = () => {
    if (!scrollContainerRef.current) return
    const scrollTop = scrollContainerRef.current.scrollTop
    const newActiveIndex = Math.min(
      steps.length - 1,
      Math.max(0, Math.round(scrollTop / ITEM_HEIGHT))
    )
    if (newActiveIndex !== activeIndex) {
      setActiveIndex(newActiveIndex)
    }
  }

  // Scroll to specific step
  const scrollToStep = (index: number) => {
    if (!scrollContainerRef.current) return
    const targetTop = index * ITEM_HEIGHT
    isAutoScrolling.current = true
    scrollContainerRef.current.scrollTo({
      top: targetTop,
      behavior: 'smooth',
    })
    setTimeout(() => {
      isAutoScrolling.current = false
    }, 500)
  }

  return (
    <section
      id="process"
      className="relative z-30 w-full bg-[#050505] py-16 sm:py-24 md:py-32 px-4 sm:px-8 md:px-12 border-t border-white/10 text-white selection:bg-[#FF5E4D] selection:text-white overflow-hidden"
    >
      {/* Background ambient radial glow */}
      <div className="pointer-events-none absolute top-1/3 left-0 h-72 sm:h-96 w-72 sm:w-96 rounded-full bg-[#FF5E4D]/5 blur-[120px] sm:blur-[140px]" />
      <div className="pointer-events-none absolute bottom-1/4 right-0 h-72 sm:h-96 w-72 sm:w-96 rounded-full bg-[#FF5E4D]/5 blur-[120px] sm:blur-[160px]" />

      <div className="relative mx-auto max-w-4xl">
        {/* Section Heading matching exact reference layout */}
        <div className="space-y-2 sm:space-y-3 mb-10 sm:mb-14 md:mb-16">
          <span className="text-[11px] sm:text-xs md:text-sm font-normal tracking-[0.2em] text-[#FF5E4D] uppercase block">
            THE STRATEGIC JOURNEY
          </span>
          <h2 className="font-hanken text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight text-white leading-[1.1] sm:leading-[1.08]">
            Digital Success
            <span className="text-[#FF5E4D] italic block font-normal">
              Mastered.
            </span>
          </h2>
        </div>

        {/* Scrollable Container with native website scroll */}
        <div className="relative">
          
          {/* Scroll Viewport: Shows 2 items with smooth scroll snapping and smooth fade mask */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="relative h-[290px] sm:h-[320px] md:h-[330px] scroll-pt-6 sm:scroll-pt-8 overflow-y-auto overscroll-contain snap-y snap-mandatory scroll-smooth select-none focus:outline-none"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 20px, black calc(100% - 28px), transparent 100%)',
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 20px, black calc(100% - 28px), transparent 100%)',
            }}
          >
            <div className="flex flex-col pt-6 sm:pt-8 pl-4 sm:pl-8 pr-2 sm:pr-4 pb-[140px] sm:pb-[160px]">
              {steps.map((step, index) => {
                const IconComponent = step.icon
                const isTopActive = index === activeIndex
                const isBottomPreview = index === activeIndex + 1

                return (
                  <div
                    key={step.id}
                    onClick={() => scrollToStep(index)}
                    style={{ height: `${ITEM_HEIGHT}px` }}
                    className={`snap-start relative flex items-start gap-4 sm:gap-6 md:gap-7 cursor-pointer transition-opacity duration-300 ${
                      isTopActive
                        ? 'opacity-100'
                        : isBottomPreview
                        ? 'opacity-65 hover:opacity-90'
                        : 'opacity-30 hover:opacity-60'
                    }`}
                  >
                    {/* Left Column: Round Icon Badge + Vertical Connecting Line */}
                    <div className="relative flex flex-col items-center shrink-0">
                      {/* Icon Circle */}
                      <div className="relative">
                        {/* Smooth Circular Glow without any square bounding box clipping */}
                        {isTopActive && (
                          <div className="pointer-events-none absolute -inset-2 rounded-full bg-[#FF553E] opacity-65 blur-lg animate-pulse" />
                        )}
                        <div
                          className={`relative z-10 flex h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 items-center justify-center rounded-full transition-all duration-300 ${
                            isTopActive
                              ? 'bg-[#FF553E] text-white scale-100 shadow-[0_0_12px_rgba(255,85,62,0.8)]'
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

                      {/* Connecting Line between badges */}
                      {index < steps.length - 1 && (
                        <div
                          className={`w-[1.5px] h-14 sm:h-16 md:h-18 my-1 transition-colors duration-300 ${
                            isTopActive
                              ? 'bg-gradient-to-b from-[#FF553E]/80 via-white/20 to-white/10'
                              : 'bg-gradient-to-b from-white/10 to-transparent'
                          }`}
                        />
                      )}
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

          {/* Interactive Navigation & Progress Controls */}
          <div className="mt-6 sm:mt-8 md:mt-10 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
            {/* Step Progress Dots */}
            <div className="flex items-center gap-1.5 sm:gap-2 max-w-full overflow-x-auto scrollbar-none py-1">
              {steps.map((step, idx) => {
                const isActive = idx === activeIndex
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => scrollToStep(idx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer shrink-0 ${
                      isActive
                        ? 'w-6 sm:w-8 bg-[#FF553E] shadow-[0_0_10px_#FF553E]'
                        : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                    aria-label={`Go to step ${step.title}`}
                  />
                )
              })}
            </div>

            <span className="text-[11px] sm:text-xs text-gray-500 font-medium">
              Swipe or scroll to navigate
            </span>
          </div>

        </div>
      </div>
    </section>
  )
}
