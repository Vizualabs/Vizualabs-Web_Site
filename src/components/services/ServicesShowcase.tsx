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
} from 'lucide-react'
import { Safari } from '#/components/ui/safari'

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
    url: string
    imagePosition?: string
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
      url: 'product.vizualabs.com',
      imagePosition: 'object-center',
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
      url: 'platform.vizualabs.com',
      imagePosition: 'object-center',
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
      image: '/service/image3.webp',
      imageAlt: 'Custom LLM deployment and AI neural systems interface',
      url: 'ai.vizualabs.com',
      imagePosition: 'object-center',
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

// 3 sets of services for seamless continuous infinite forward & backward cycling
const extendedServices = [
  ...servicesData.map((s, i) => ({ ...s, cloneKey: `pre-${i}`, realIndex: i })),
  ...servicesData.map((s, i) => ({ ...s, cloneKey: `mid-${i}`, realIndex: i })),
  ...servicesData.map((s, i) => ({ ...s, cloneKey: `post-${i}`, realIndex: i })),
]

export function ServicesShowcase() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const isProgrammaticScroll = useRef(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Pause the auto-scroll loop while the carousel is off-screen so the interval
  // never competes with the user scrolling elsewhere on the page.
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.05 }
    )
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  // Initialize scroll position to the middle set (index 3 = Service 01)
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return
    const middleSlide = container.children[3] as HTMLElement
    if (middleSlide) {
      container.scrollTo({
        left: middleSlide.offsetLeft,
        behavior: 'instant',
      })
    }
  }, [])

  // Check boundary wrap silently when scroll settles
  const checkBoundaryWrap = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) return
    const slide = container.children[0] as HTMLElement | undefined
    const slideWidth = slide ? slide.offsetWidth : container.clientWidth
    if (slideWidth <= 0) return

    const rawIndex = Math.round(container.scrollLeft / slideWidth)

    // If reached post-set (>= 6), silently reset to middle-set (-3)
    if (rawIndex >= 6) {
      const resetTarget = container.children[rawIndex - 3] as HTMLElement
      if (resetTarget) {
        container.scrollTo({
          left: resetTarget.offsetLeft,
          behavior: 'instant',
        })
      }
    }
    // If reached pre-set (< 3), silently reset to middle-set (+3)
    else if (rawIndex < 3 && rawIndex >= 0) {
      const resetTarget = container.children[rawIndex + 3] as HTMLElement
      if (resetTarget) {
        container.scrollTo({
          left: resetTarget.offsetLeft,
          behavior: 'instant',
        })
      }
    }
  }, [])

  // Sync active dot on hand-scroll / auto-scroll + debounced silent boundary wrap
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) return
    const slide = container.children[0] as HTMLElement | undefined
    const slideWidth = slide ? slide.offsetWidth : container.clientWidth
    if (slideWidth <= 0) return

    const rawIndex = Math.round(container.scrollLeft / slideWidth)
    const realIndex = ((rawIndex % 3) + 3) % 3

    setActiveIndex(realIndex)

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }

    scrollTimeoutRef.current = setTimeout(() => {
      isProgrammaticScroll.current = false
      checkBoundaryWrap()
    }, 150)
  }, [checkBoundaryWrap])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      container.removeEventListener('scroll', handleScroll)
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
    }
  }, [handleScroll])

  // Scroll forward seamlessly in cycling loop
  const scrollToNext = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) return
    const slide = container.children[0] as HTMLElement | undefined
    const slideWidth = slide ? slide.offsetWidth : container.clientWidth
    if (slideWidth <= 0) return

    isProgrammaticScroll.current = true
    const currentRaw = Math.round(container.scrollLeft / slideWidth)
    const targetRaw = currentRaw + 1 // Always move forward +1 slide

    const targetChild = container.children[targetRaw] as HTMLElement
    if (targetChild) {
      container.scrollTo({
        left: targetChild.offsetLeft,
        behavior: 'smooth',
      })
    }
  }, [])

  // Jump to specific dot clicked by user
  const scrollToDot = useCallback((dotIndex: number) => {
    const container = scrollContainerRef.current
    if (!container) return
    const slide = container.children[0] as HTMLElement | undefined
    const slideWidth = slide ? slide.offsetWidth : container.clientWidth
    if (slideWidth <= 0) return

    isProgrammaticScroll.current = true
    const currentRaw = Math.round(container.scrollLeft / slideWidth)
    const currentReal = ((currentRaw % 3) + 3) % 3
    const diff = dotIndex - currentReal
    const targetRaw = currentRaw + diff

    const targetChild = container.children[targetRaw] as HTMLElement
    if (targetChild) {
      container.scrollTo({
        left: targetChild.offsetLeft,
        behavior: 'smooth',
      })
    }
  }, [])

  // Automatic slide transition every 8 seconds in forward cycling.
  // Only runs while the section is visible (and not hovered) so the interval
  // never fights the user's own scrolling / swiping off-screen.
  useEffect(() => {
    if (isPaused || !isVisible) return

    const interval = setInterval(() => {
      scrollToNext()
    }, 8000)

    return () => clearInterval(interval)
  }, [isPaused, isVisible, scrollToNext])

  return (
    <section
      id="service-offerings"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative z-10 w-full bg-black py-6 sm:py-10 md:py-12 px-3 sm:px-6 lg:px-8 text-white selection:bg-[#FF553E] selection:text-zinc-950 overflow-hidden"
    >
      <div className="mx-auto w-full max-w-6xl xl:max-w-7xl">
        {/* Clean 3-Dots Awareness Indicator with accessible touch targets */}
        <div className="mb-4 sm:mb-6 flex justify-center items-center gap-1.5 sm:gap-2">
          {servicesData.map((service, dotIdx) => (
            <button
              key={dotIdx}
              type="button"
              aria-label={`Go to ${service.title}`}
              onClick={() => scrollToDot(dotIdx)}
              // Negative margin cancels the padding's layout footprint, so the
              // visible strip stays the same size while the tap target grows.
              className="cursor-pointer p-3 -m-3 focus:outline-none sm:p-1.5 sm:-m-1.5"
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-500 ${
                  dotIdx === activeIndex
                    ? 'w-6 sm:w-7 bg-[#FF553E] shadow-sm shadow-[#FF553E]/40'
                    : 'w-1.5 sm:w-2 bg-white/20 hover:bg-white/40'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Infinite Horizontal Scroll Track with Touch-Pan-X & Native Swipe */}
        <div
          ref={scrollContainerRef}
          tabIndex={0}
          role="region"
          aria-label="Services carousel"
          // `relative` makes this element the offsetParent for its slide
          // children — without it, offsetParent resolves to the ancestor
          // <section> (which is position:relative for its own glow blobs),
          // so child.offsetLeft picks up the section's px-3/6/8 padding and
          // every scrollTo() below lands short by that padding, leaving
          // slides permanently un-snapped with neighboring slides bleeding in.
          className="relative flex w-full overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar gap-4 sm:gap-6 md:gap-8 pb-3 sm:pb-4 outline-none focus-visible:ring-1 focus-visible:ring-white/20 rounded-2xl [touch-action:pan-x_pan-y]"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {extendedServices.map((service) => {
            const PrimaryIcon = service.primaryCard.icon
            const BottomMiddleIcon = service.bottomMiddleCard.icon
            const TopRightIcon = service.topRightCard.icon

            return (
              <div
                key={service.cloneKey}
                id={`slide-${service.cloneKey}`}
                className="w-full min-w-full snap-center shrink-0 flex flex-col"
              >
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-3.5 sm:mb-6 px-1">
                  <span className="type-eyebrow mb-1 inline-block text-[#E7978B] sm:mb-2">
                    {service.serviceNumber}
                  </span>
                  <h2 className="type-section font-bold text-[#E5E2E1]">
                    {service.title}
                  </h2>
                  <p className="type-lead mt-1 text-[#EBBBB4] max-w-xl mx-auto sm:mt-2">
                    {service.subtitle}
                  </p>
                </div>

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-5 w-full">
                  {/* Left Column: Large Feature Card (Span 6 on LG) */}
                  <div className="lg:col-span-6 flex flex-col justify-between rounded-2xl sm:rounded-[1.35rem] bg-[#1E1E20] border border-white/[0.06] p-4 sm:p-6 lg:p-7 shadow-xl transition-all duration-300 hover:border-white/15">
                    <div>
                      {/* Icon Badge */}
                      <div className="inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-[#2A2A2E] border border-white/[0.08] text-[#EBBBB4] mb-3 sm:mb-4 shadow-inner">
                        <PrimaryIcon className="h-4 w-4 sm:h-4.5 sm:w-4.5" strokeWidth={1.8} />
                      </div>

                      {/* Title */}
                      <h3 className="font-hanken text-lg sm:text-2xl font-bold tracking-tight text-[#E5E2E1] mb-1 sm:mb-2">
                        {service.primaryCard.title}
                      </h3>

                      {/* Description (100% #EBBBB4) */}
                      <p className="text-xs sm:text-sm leading-relaxed text-[#EBBBB4]">
                        {service.primaryCard.description}
                      </p>
                    </div>

                    {/* Bottom — product shot in Safari chrome */}
                    <div className="mt-3.5 sm:mt-4 w-full">
                      <Safari
                        url={service.primaryCard.url}
                        imageSrc={service.primaryCard.image}
                        imageAlt={service.primaryCard.imageAlt}
                        className="transition-transform duration-700 ease-out hover:scale-[1.01]"
                      >
                        <div className="absolute inset-0 flex flex-col gap-2 p-3 sm:p-4">
                          <div className="flex items-center justify-between">
                            <div className="h-2.5 w-28 rounded-full bg-white/12" />
                            <div className="h-2.5 w-12 rounded-full bg-[#FF5E4D]/45" />
                          </div>
                          <div className="grid flex-1 grid-cols-2 gap-2">
                            <div className="rounded-lg border border-white/8 bg-[#161618] p-2.5">
                              <div className="h-2 w-16 rounded bg-white/10" />
                              <div className="mt-3 space-y-1.5">
                                <div className="h-1.5 w-full rounded bg-white/8" />
                                <div className="h-1.5 w-[80%] rounded bg-white/6" />
                                <div className="h-1.5 w-[60%] rounded bg-[#FF5E4D]/35" />
                              </div>
                            </div>
                            <div className="rounded-lg border border-white/8 bg-[#161618] p-2.5">
                              <div className="h-2 w-14 rounded bg-white/10" />
                              <div className="mt-3 flex h-[70%] items-end gap-1">
                                {[45, 70, 55, 90, 60].map((h, i) => (
                                  <div
                                    key={i}
                                    className="flex-1 rounded-t-sm bg-[#FF5E4D]/40"
                                    style={{ height: `${h}%` }}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Safari>
                    </div>
                  </div>

                  {/* Right Column: Grid of 3 Cards (Span 6 on LG) */}
                  <div className="lg:col-span-6 flex flex-col gap-3.5 sm:gap-5">
                    {/* Top-Right Card */}
                    <div className="flex-1 min-h-[115px] sm:min-h-[145px] flex flex-col justify-center rounded-2xl sm:rounded-[1.35rem] bg-[#1E1E20] border border-white/[0.06] p-4 sm:p-6 lg:p-7 shadow-xl transition-all duration-300 hover:border-white/15">
                      <div className="flex items-start justify-between gap-3 sm:gap-6">
                        <div className="max-w-md">
                          <h3 className="font-hanken text-lg sm:text-2xl font-bold tracking-tight text-[#E5E2E1] mb-1 sm:mb-2">
                            {service.topRightCard.title}
                          </h3>
                          <p className="text-xs sm:text-sm leading-relaxed text-[#EBBBB4]">
                            {service.topRightCard.description}
                          </p>
                        </div>

                        {TopRightIcon && (
                          <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-[#2A2A2E] border border-white/[0.08] text-[#EBBBB4] shadow-inner">
                            <TopRightIcon className="h-4 w-4 sm:h-4.5 sm:w-4.5" strokeWidth={1.8} />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Sub-grid: 2 Cards (Middle Bottom Card + Peach Action Card) */}
                    <div className="flex-[1.2] grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5 min-h-[140px] sm:min-h-[190px]">
                      {/* Bottom-Middle Card */}
                      <div className="h-full flex flex-col justify-start rounded-2xl sm:rounded-[1.35rem] bg-[#1E1E20] border border-white/[0.06] p-4 sm:p-6 shadow-xl transition-all duration-300 hover:border-white/15">
                        <BottomMiddleIcon
                          className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-[#E7978B] mb-2.5 sm:mb-3.5 shrink-0"
                          strokeWidth={1.8}
                        />
                        <h4 className="font-hanken text-base sm:text-lg font-bold tracking-tight text-[#E5E2E1] mb-1">
                          {service.bottomMiddleCard.title}
                        </h4>
                        <p className="text-xs sm:text-[0.825rem] leading-relaxed text-[#EBBBB4]">
                          {service.bottomMiddleCard.description}
                        </p>
                      </div>

                      {/* Bottom-Right Action Card (Cream/Peach #FFB4A8 box with #690100 text) */}
                      <a
                        href={`/contact?service=${service.contactParam}`}
                        className="h-full group relative flex flex-col justify-between rounded-2xl sm:rounded-[1.35rem] bg-[#FFB4A8] p-4 sm:p-6 shadow-xl text-[#690100] transition-all duration-300 hover:bg-[#FFA597] hover:shadow-2xl hover:shadow-[#FFB4A8]/25 hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] cursor-pointer"
                      >
                        <h4 className="font-hanken text-base sm:text-xl font-bold tracking-tight leading-snug pr-1.5 text-[#690100]">
                          {service.actionCard.title}
                        </h4>

                        <div className="mt-4 sm:mt-6 flex items-center justify-start">
                          <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border-2 border-[#690100] text-[#690100] transition-all duration-300 group-hover:bg-[#690100] group-hover:text-[#FFB4A8] group-hover:scale-105">
                            <ArrowRight
                              className="h-4 w-4 sm:h-4.5 sm:w-4.5 transition-transform duration-300 group-hover:translate-x-0.5"
                              strokeWidth={2.4}
                            />
                          </div>
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
