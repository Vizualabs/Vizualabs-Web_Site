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
    aspectRatio?: string
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

export function ServicesShowcase() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const isProgrammaticScroll = useRef(false)

  // Scroll to slide when dot is clicked or auto-transition fires
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

  // Sync activeIndex on native horizontal scroll / touch swipe
  const handleScroll = useCallback(() => {
    if (isProgrammaticScroll.current || !scrollContainerRef.current) return
    const container = scrollContainerRef.current
    const scrollLeft = container.scrollLeft
    const slideWidth = container.clientWidth

    if (slideWidth > 0) {
      const newIndex = Math.round(scrollLeft / slideWidth)
      if (
        newIndex >= 0 &&
        newIndex < servicesData.length &&
        newIndex !== activeIndex
      ) {
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

  // Automatic slide transition every 8 seconds
  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % servicesData.length
      scrollToSlide(nextIndex)
    }, 8000)

    return () => clearInterval(interval)
  }, [activeIndex, isPaused, scrollToSlide])

  return (
    <section
      id="service-offerings"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative z-10 w-full bg-black py-8 sm:py-10 md:py-12 px-4 sm:px-6 lg:px-8 text-white selection:bg-[#FF553E] selection:text-zinc-950 overflow-hidden"
    >
      <div className="mx-auto w-full max-w-6xl xl:max-w-7xl">
        {/* Clean 3-Dots Awareness Indicator */}
        <div className="mb-5 sm:mb-6 flex justify-center items-center gap-2">
          {servicesData.map((service, dotIdx) => (
            <button
              key={dotIdx}
              type="button"
              aria-label={`Go to ${service.title}`}
              onClick={() => scrollToSlide(dotIdx)}
              className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                dotIdx === activeIndex
                  ? 'w-7 bg-[#FF553E] shadow-sm shadow-[#FF553E]/40'
                  : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>

        {/* Horizontal Scroll Track containing all 3 Bento Grid sections */}
        <div
          ref={scrollContainerRef}
          tabIndex={0}
          role="region"
          aria-label="Services carousel"
          className="flex w-full overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar gap-6 sm:gap-8 pb-4 outline-none focus-visible:ring-1 focus-visible:ring-white/20 rounded-2xl"
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
                <div className="text-center max-w-2xl mx-auto mb-4 sm:mb-6">
                  <span className="inline-block text-[10px] sm:text-[11px] font-semibold tracking-[0.22em] uppercase text-[#E7978B] mb-1.5 sm:mb-2">
                    {service.serviceNumber}
                  </span>
                  <h2 className="font-hanken text-2xl sm:text-3xl md:text-4xl lg:text-[2.65rem] font-bold tracking-tight leading-tight text-[#E5E2E1]">
                    {service.title}
                  </h2>
                  <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm md:text-[0.935rem] font-normal leading-relaxed text-[#EBBBB4] max-w-xl mx-auto">
                    {service.subtitle}
                  </p>
                </div>

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 w-full">
                  {/* Left Column: Large Feature Card (Span 6 on LG) */}
                  <div className="lg:col-span-6 flex flex-col justify-between rounded-2xl sm:rounded-[1.35rem] bg-[#1E1E20] border border-white/[0.06] p-5 sm:p-6 lg:p-7 shadow-xl transition-all duration-300 hover:border-white/15">
                    <div>
                      {/* Icon Badge */}
                      <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#2A2A2E] border border-white/[0.08] text-[#EBBBB4] mb-4 shadow-inner">
                        <PrimaryIcon className="h-4.5 w-4.5" strokeWidth={1.8} />
                      </div>

                      {/* Title */}
                      <h3 className="font-hanken text-xl sm:text-2xl font-bold tracking-tight text-[#E5E2E1] mb-1.5 sm:mb-2">
                        {service.primaryCard.title}
                      </h3>

                      {/* Description (100% #EBBBB4) */}
                      <p className="text-xs sm:text-sm leading-relaxed text-[#EBBBB4]">
                        {service.primaryCard.description}
                      </p>
                    </div>

                    {/* Bottom Image Container */}
                    <div className="mt-4 relative aspect-[16/8.8] sm:aspect-[16/8.4] w-full overflow-hidden rounded-xl sm:rounded-2xl bg-[#141416] border border-white/[0.06] shadow-inner flex items-center justify-center">
                      <div className="relative w-full h-full">
                        <img
                          src={service.primaryCard.image}
                          alt={service.primaryCard.imageAlt}
                          loading={index === 0 ? 'eager' : 'lazy'}
                          decoding="async"
                          className={`h-full w-full object-cover ${
                            service.primaryCard.imagePosition || 'object-center'
                          } transition-transform duration-700 ease-out hover:scale-[1.03]`}
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#141416]/40 via-transparent to-transparent" />
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Grid of 3 Cards (Span 6 on LG) */}
                  <div className="lg:col-span-6 flex flex-col gap-4 sm:gap-5">
                    {/* Top-Right Card */}
                    <div className="flex-1 min-h-[130px] sm:min-h-[145px] flex flex-col justify-center rounded-2xl sm:rounded-[1.35rem] bg-[#1E1E20] border border-white/[0.06] p-5 sm:p-6 lg:p-7 shadow-xl transition-all duration-300 hover:border-white/15">
                      <div className="flex items-start justify-between gap-4 sm:gap-6">
                        <div className="max-w-md">
                          <h3 className="font-hanken text-xl sm:text-2xl font-bold tracking-tight text-[#E5E2E1] mb-1.5 sm:mb-2">
                            {service.topRightCard.title}
                          </h3>
                          <p className="text-xs sm:text-sm leading-relaxed text-[#EBBBB4]">
                            {service.topRightCard.description}
                          </p>
                        </div>

                        {TopRightIcon && (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2A2A2E] border border-white/[0.08] text-[#EBBBB4] shadow-inner">
                            <TopRightIcon className="h-4.5 w-4.5" strokeWidth={1.8} />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Sub-grid: 2 Cards (Middle Bottom Card + Peach Action Card) */}
                    <div className="flex-[1.2] grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 min-h-[170px] sm:min-h-[190px]">
                      {/* Bottom-Middle Card */}
                      <div className="h-full flex flex-col justify-start rounded-2xl sm:rounded-[1.35rem] bg-[#1E1E20] border border-white/[0.06] p-5 sm:p-6 shadow-xl transition-all duration-300 hover:border-white/15">
                        <BottomMiddleIcon
                          className="h-5 w-5 text-[#E7978B] mb-3.5 shrink-0"
                          strokeWidth={1.8}
                        />
                        <h4 className="font-hanken text-base sm:text-lg font-bold tracking-tight text-[#E5E2E1] mb-1.5">
                          {service.bottomMiddleCard.title}
                        </h4>
                        <p className="text-xs sm:text-[0.825rem] leading-relaxed text-[#EBBBB4]">
                          {service.bottomMiddleCard.description}
                        </p>
                      </div>

                      {/* Bottom-Right Action Card (Cream/Peach #FFB4A8 box with #690100 text) */}
                      <a
                        href={`/contact?service=${service.contactParam}`}
                        className="h-full group relative flex flex-col justify-between rounded-2xl sm:rounded-[1.35rem] bg-[#FFB4A8] p-5 sm:p-6 shadow-xl text-[#690100] transition-all duration-300 hover:bg-[#FFA597] hover:shadow-2xl hover:shadow-[#FFB4A8]/25 hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] cursor-pointer"
                      >
                        <h4 className="font-hanken text-lg sm:text-xl font-bold tracking-tight leading-snug pr-1.5 text-[#690100]">
                          {service.actionCard.title}
                        </h4>

                        <div className="mt-5 sm:mt-6 flex items-center justify-start">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#690100] text-[#690100] transition-all duration-300 group-hover:bg-[#690100] group-hover:text-[#FFB4A8] group-hover:scale-105">
                            <ArrowRight
                              className="h-4.5 w-4.5 transition-transform duration-300 group-hover:translate-x-0.5"
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
