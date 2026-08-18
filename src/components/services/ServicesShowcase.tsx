import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Rocket,
  Settings,
  Brain,
  RotateCcw,
  Database,
  Eye,
  TrendingUp,
  Share2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Network,
} from 'lucide-react'

interface ServiceData {
  id: string
  serviceNumber: string
  title: string
  subtitle: string
  contactParam: string
  primaryCard: {
    icon: typeof Rocket
    title: string
    description: string
    image: string
    imageAlt: string
    graphicType?: 'image' | 'architecture' | 'ai-brain'
  }
  topRightCard: {
    title: string
    description: string
    icon?: typeof RotateCcw
  }
  bottomMiddleCard: {
    icon: typeof Share2
    title: string
    description: string
  }
  actionCard: {
    title: string
    circledArrow?: boolean
  }
}

const servicesData: ServiceData[] = [
  {
    id: 'product-development',
    serviceNumber: 'SERVICE 01',
    title: 'Product Development',
    subtitle:
      'Transforming concepts into market-dominant assets through strategic UX and robust full-stack execution.',
    contactParam: 'product-development',
    primaryCard: {
      icon: Rocket,
      title: 'Market Acceleration',
      description:
        'We handle the entire lifecycle, from rapid prototyping to GTM strategies that ensure your product captures market share instantly.',
      image: '/service/image1.webp',
      imageAlt: 'Market acceleration product design across desktop, tablet, and mobile devices',
      graphicType: 'image',
    },
    topRightCard: {
      title: 'Concept Validation',
      description:
        'Mathematically sound user-testing and feasibility audits before a single line of code is written.',
    },
    bottomMiddleCard: {
      icon: Share2,
      title: 'Ecosystem Integration',
      description: 'Seamlessly connecting your new product to existing tech stacks.',
    },
    actionCard: {
      title: 'Ready to Scale?',
      circledArrow: true,
    },
  },
  {
    id: 'custom-software',
    serviceNumber: 'SERVICE 02',
    title: 'Custom Software Development',
    subtitle:
      "We don't just write code; we engineer systems. Our approach focuses on precision engineering and mathematical certainty.",
    contactParam: 'custom-software',
    primaryCard: {
      icon: Settings,
      title: 'High-Concurrency Microservices',
      description:
        'Building scalable, secure, and performant backends that handle the most demanding enterprise workloads.',
      image: '/service/image2.webp',
      imageAlt: 'High-concurrency microservices systems architecture mockup',
      graphicType: 'image',
    },
    topRightCard: {
      title: 'Legacy Modernization',
      description:
        'Transforming outdated systems into modern, cloud-native architectures without disrupting operations.',
      icon: RotateCcw,
    },
    bottomMiddleCard: {
      icon: Database,
      title: 'Real-time Data',
      description: 'Architectures designed for sub-millisecond latency and high throughput.',
    },
    actionCard: {
      title: 'Speak to an Engineer',
      circledArrow: false,
    },
  },
  {
    id: 'ai-solutions',
    serviceNumber: 'SERVICE 03',
    title: 'AI Solutions',
    subtitle:
      'Leveraging LLMs and predictive modeling to give your enterprise a cognitive edge and measurable efficiency.',
    contactParam: 'ai-solutions',
    primaryCard: {
      icon: Brain,
      title: 'Custom LLM Deployment',
      description:
        'Private, secure, and fine-tuned language models specialized for your domain data and production-grade requirements.',
      image: '/service/image4.webp',
      imageAlt: 'Custom LLM deployment and AI neural systems interface',
      graphicType: 'image',
    },
    topRightCard: {
      title: 'Predictive Operations',
      description:
        'Anticipate market shifts and operational bottlenecks before they happen with advanced modeling.',
      icon: TrendingUp,
    },
    bottomMiddleCard: {
      icon: Eye,
      title: 'Computer Vision',
      description:
        'Automated visual inspection and spatial intelligence for enterprise scale.',
    },
    actionCard: {
      title: 'Explore AI Integration',
      circledArrow: true,
    },
  },
]

export function ServicesShowcase() {
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const isProgrammaticScroll = useRef(false)

  // Scroll to slide when tab is clicked
  const scrollToSlide = useCallback((index: number) => {
    if (!scrollContainerRef.current) return
    isProgrammaticScroll.current = true
    setActiveIndex(index)

    const container = scrollContainerRef.current
    const targetChild = container.children[index] as HTMLElement
    if (targetChild) {
      container.scrollTo({
        left: targetChild.offsetLeft - container.offsetLeft,
        behavior: 'smooth',
      })
    }

    setTimeout(() => {
      isProgrammaticScroll.current = false
    }, 600)
  }, [])

  // Sync activeIndex on user horizontal scroll / touch swipe
  const handleScroll = useCallback(() => {
    if (isProgrammaticScroll.current || !scrollContainerRef.current) return
    const container = scrollContainerRef.current
    const scrollLeft = container.scrollLeft
    const slideWidth = container.clientWidth

    if (slideWidth > 0) {
      const newIndex = Math.round(scrollLeft / slideWidth)
      if (newIndex >= 0 && newIndex < servicesData.length && newIndex !== activeIndex) {
        setActiveIndex(newIndex)
      }
    }
  }, [activeIndex])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const handlePrev = () => {
    const nextIndex = activeIndex === 0 ? servicesData.length - 1 : activeIndex - 1
    scrollToSlide(nextIndex)
  }

  const handleNext = () => {
    const nextIndex = activeIndex === servicesData.length - 1 ? 0 : activeIndex + 1
    scrollToSlide(nextIndex)
  }

  return (
    <section
      id="service-offerings"
      className="relative z-10 w-full bg-black py-16 sm:py-20 md:py-28 px-4 sm:px-8 lg:px-12 text-white selection:bg-[#FF553E] selection:text-zinc-950 overflow-hidden"
    >
      <div className="mx-auto w-full max-w-7xl">
        {/* Top Sticky/Header Switcher Navigation */}
        <div className="mb-10 sm:mb-14 flex flex-col items-center gap-5">
          <div
            role="tablist"
            aria-label="Services Horizontal Slider Navigation"
            className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 rounded-full border border-white/10 bg-[#121214]/90 p-1.5 backdrop-blur-md shadow-2xl"
          >
            {servicesData.map((service, index) => {
              const isActive = index === activeIndex
              return (
                <button
                  key={service.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  id={`tab-${service.id}`}
                  onClick={() => scrollToSlide(index)}
                  className={`relative rounded-full px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'text-white bg-[#262628] border border-white/15 shadow-md'
                      : 'text-[#E5E2E1]/60 hover:text-[#E5E2E1] hover:bg-white/[0.04]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={`text-[10px] sm:text-xs font-mono transition-colors ${
                        isActive ? 'text-[#FF8D80]' : 'text-[#E5E2E1]/40'
                      }`}
                    >
                      0{index + 1}
                    </span>
                    <span>{service.title}</span>
                  </span>
                </button>
              )
            })}
          </div>

          {/* Slide Navigation Controls & Indicators */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous service"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#E5E2E1] transition-all hover:bg-white/15 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {servicesData.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  aria-label={`Go to slide ${dotIdx + 1}`}
                  onClick={() => scrollToSlide(dotIdx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    dotIdx === activeIndex
                      ? 'w-8 bg-[#FF8D80]'
                      : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next service"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#E5E2E1] transition-all hover:bg-white/15 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Scroll Track containing all 3 Bento Grid sections */}
        <div
          ref={scrollContainerRef}
          tabIndex={0}
          role="region"
          aria-label="Services carousel"
          className="flex w-full overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar gap-8 sm:gap-12 pb-6 outline-none focus-visible:ring-1 focus-visible:ring-white/20 rounded-3xl"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {servicesData.map((service, index) => {
            const PrimaryIcon = service.primaryCard.icon
            const BottomMiddleIcon = service.bottomMiddleCard.icon
            const TopRightIcon = service.topRightCard.icon

            return (
              <div
                key={service.id}
                id={`slide-${service.id}`}
                className="w-full min-w-full snap-center shrink-0 flex flex-col"
              >
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
                  <span className="inline-block text-[11px] sm:text-xs font-semibold tracking-[0.22em] uppercase text-[#E7978B] mb-3">
                    {service.serviceNumber}
                  </span>
                  <h2 className="font-hanken text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold tracking-tight leading-tight text-[#E5E2E1]">
                    {service.title}
                  </h2>
                  <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg font-normal leading-relaxed text-[#EBBBB4]/80 max-w-2xl mx-auto">
                    {service.subtitle}
                  </p>
                </div>

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 w-full">
                  {/* Left Column: Large Feature Card (Span 6 on LG) */}
                  <div className="lg:col-span-6 flex flex-col justify-between rounded-[2rem] sm:rounded-[2.25rem] bg-[#1E1E20] border border-white/[0.06] p-7 sm:p-9 md:p-10 shadow-xl transition-all duration-300 hover:border-white/15">
                    <div>
                      {/* Icon Badge */}
                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2A2A2E] border border-white/[0.08] text-[#EBBBB4] mb-6 shadow-inner">
                        <PrimaryIcon className="h-5 w-5" strokeWidth={1.8} />
                      </div>

                      {/* Title */}
                      <h3 className="font-hanken text-2xl sm:text-3xl font-bold tracking-tight text-[#E5E2E1] mb-3">
                        {service.primaryCard.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm sm:text-base leading-relaxed text-[#EBBBB4]/75">
                        {service.primaryCard.description}
                      </p>
                    </div>

                    {/* Bottom Image Container */}
                    <div className="mt-8 relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-[#141416] border border-white/[0.06] shadow-inner flex items-center justify-center">
                      <div className="relative w-full h-full">
                        <img
                          src={service.primaryCard.image}
                          alt={service.primaryCard.imageAlt}
                          loading={index === 0 ? 'eager' : 'lazy'}
                          decoding="async"
                          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out hover:scale-[1.03]"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#141416]/40 via-transparent to-transparent" />
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Grid of 3 Cards (Span 6 on LG) */}
                  <div className="lg:col-span-6 flex flex-col gap-5 sm:gap-6">
                    {/* Top-Right Card (Full width of right column) */}
                    <div className="flex-1 flex items-start justify-between gap-6 rounded-[2rem] sm:rounded-[2.25rem] bg-[#1E1E20] border border-white/[0.06] p-7 sm:p-9 md:p-10 shadow-xl transition-all duration-300 hover:border-white/15">
                      <div className="max-w-md">
                        <h3 className="font-hanken text-2xl sm:text-3xl font-bold tracking-tight text-[#E5E2E1] mb-3">
                          {service.topRightCard.title}
                        </h3>
                        <p className="text-sm sm:text-base leading-relaxed text-[#EBBBB4]/75">
                          {service.topRightCard.description}
                        </p>
                      </div>

                      {TopRightIcon && (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#2A2A2E] border border-white/[0.08] text-[#EBBBB4] shadow-inner">
                          <TopRightIcon className="h-5 w-5" strokeWidth={1.8} />
                        </div>
                      )}
                    </div>

                    {/* Bottom Sub-grid: 2 Cards (Middle Bottom Card + Peach Action Card) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                      {/* Bottom-Middle Card */}
                      <div className="flex flex-col justify-between rounded-[2rem] sm:rounded-[2.25rem] bg-[#1E1E20] border border-white/[0.06] p-6 sm:p-8 shadow-xl transition-all duration-300 hover:border-white/15">
                        <div>
                          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#2A2A2E] border border-white/[0.08] text-[#EBBBB4] mb-5 shadow-inner">
                            <BottomMiddleIcon className="h-4 w-4" strokeWidth={1.8} />
                          </div>
                          <h4 className="font-hanken text-lg sm:text-xl font-bold tracking-tight text-[#E5E2E1] mb-2">
                            {service.bottomMiddleCard.title}
                          </h4>
                        </div>
                        <p className="text-xs sm:text-sm leading-relaxed text-[#EBBBB4]/75 mt-2">
                          {service.bottomMiddleCard.description}
                        </p>
                      </div>

                      {/* Bottom-Right Action Card (Soft Peach / Coral background routing to /contact) */}
                      <a
                        href={`/contact?service=${service.contactParam}`}
                        className="group relative flex flex-col justify-between rounded-[2rem] sm:rounded-[2.25rem] bg-[#FFB4A8] p-6 sm:p-8 shadow-xl text-[#78170B] transition-all duration-300 hover:bg-[#FFA597] hover:shadow-2xl hover:shadow-[#FFB4A8]/25 hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] cursor-pointer"
                      >
                        <h4 className="font-hanken text-xl sm:text-2xl font-bold tracking-tight leading-snug pr-2">
                          {service.actionCard.title}
                        </h4>

                        <div className="mt-8 flex items-center justify-start">
                          {service.actionCard.circledArrow ? (
                            <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#78170B] text-[#78170B] transition-all duration-300 group-hover:bg-[#78170B] group-hover:text-[#FFB4A8] group-hover:scale-105">
                              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={2.4} />
                            </div>
                          ) : (
                            <div className="flex items-center text-[#78170B] transition-transform duration-300 group-hover:translate-x-1">
                              <ArrowRight className="h-7 w-7" strokeWidth={2.5} />
                            </div>
                          )}
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
