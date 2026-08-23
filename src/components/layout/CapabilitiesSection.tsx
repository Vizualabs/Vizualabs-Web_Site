import { useRef } from 'react'
import { Link } from '@tanstack/react-router'
import {
  Terminal,
  Compass,
  Bot,
  Cloud,
  ShieldCheck,
  Database,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'
import { MagicCard } from '#/components/ui/magic-card'
import { BlurFade } from '#/components/ui/blur-fade'
import { BentoGrid } from '#/components/ui/bento-grid'
import { cn } from '#/lib/cn'

interface CapabilityCard {
  id: string
  number: string
  category: string
  title: string
  titleLine2?: string
  description: string
  icon: typeof Terminal
  /** Desktop bento span classes (lg+). */
  bentoClass: string
  featured?: boolean
}

const capabilities: CapabilityCard[] = [
  {
    id: 'custom-software',
    number: '01',
    category: 'Implementation',
    title: 'Custom Software',
    description:
      'Scalable, secure, and performant architectures built with mathematical precision for mission-critical operations.',
    icon: Terminal,
    bentoClass: 'lg:col-span-2',
    featured: true,
  },
  {
    id: 'product-development',
    number: '02',
    category: 'Innovation',
    title: 'Product',
    titleLine2: 'Development',
    description:
      'From discovery to deployment, we translate strategic goals into intuitive, market-leading user experiences.',
    icon: Compass,
    bentoClass: 'lg:col-span-1',
  },
  {
    id: 'ai-solutions',
    number: '03',
    category: 'Intelligence',
    title: 'AI Solutions',
    description:
      'Integrating generative and predictive models into existing workflows to unlock unprecedented operational velocity.',
    icon: Bot,
    bentoClass: 'lg:col-span-1',
  },
  {
    id: 'cloud-architecture',
    number: '04',
    category: 'DevOps & Cloud',
    title: 'Cloud Architecture',
    description:
      'Enterprise-grade multi-cloud deployment, Kubernetes orchestration, and automated zero-downtime infrastructure.',
    icon: Cloud,
    bentoClass: 'lg:col-span-1',
  },
  {
    id: 'cybersecurity-shield',
    number: '05',
    category: 'Security & Audit',
    title: 'Cybersecurity Shield',
    description:
      'Zero-trust network architecture, automated vulnerability scanning, and comprehensive enterprise compliance auditing.',
    icon: ShieldCheck,
    bentoClass: 'lg:col-span-2',
    featured: true,
  },
  {
    id: 'data-engineering',
    number: '06',
    category: 'Data Systems',
    title: 'Enterprise Data',
    titleLine2: 'Pipelines',
    description:
      'High-throughput data pipelines, real-time stream processing, and predictive executive decision dashboards.',
    icon: Database,
    bentoClass: 'lg:col-span-1',
  },
  {
    id: 'digital-strategy',
    number: '07',
    category: 'Advisory & Strategy',
    title: 'Digital',
    titleLine2: 'Transformation',
    description:
      'Roadmap planning, legacy modernization, and technical due diligence for high-growth enterprise systems.',
    icon: Sparkles,
    bentoClass: 'lg:col-span-2',
  },
  {
    id: 'automated-qa',
    number: '08',
    category: 'QA & Reliability',
    title: 'Automated',
    titleLine2: 'Quality Assurance',
    description:
      'End-to-end regression suites, performance stress testing, and continuous integration quality gates.',
    icon: CheckCircle2,
    bentoClass: 'lg:col-span-2',
  },
]

function CapabilityCardFace({
  item,
  index,
  className,
}: {
  item: CapabilityCard
  index: number
  className?: string
}) {
  const IconComp = item.icon

  return (
    <div
      data-capability-card
      className={cn(
        'group relative h-full overflow-hidden rounded-2xl',
        className,
      )}
    >
      <MagicCard
        className="h-full rounded-2xl bg-[#121212] transition-transform duration-300 group-hover:-translate-y-0.5"
        gradientFrom="#FF5E4D"
        gradientTo="#FF8A6B"
        gradientColor="#2a1512"
      >
        <div
          className={cn(
            'relative flex h-full flex-col justify-between p-6 sm:p-7 md:p-8',
            item.featured ? 'min-h-[300px] lg:min-h-[320px]' : 'min-h-[280px] lg:min-h-[300px]',
          )}
        >
          <div>
            <div className="mb-5 sm:mb-6 inline-flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl border border-white/10 bg-[#1c1c1c] text-[#FF5E4D] shadow-inner transition-colors duration-300 group-hover:border-[#FF5E4D]/40 group-hover:bg-[#FF5E4D]/10">
              <IconComp className="h-5 w-5 sm:h-6 sm:w-6 text-[#FF5E4D]" />
            </div>

            <h3
              className={cn(
                'mb-3 font-normal tracking-tight text-[#E5E2E1] leading-tight',
                item.featured
                  ? 'text-2xl sm:text-3xl lg:text-[2rem]'
                  : 'text-xl sm:text-2xl',
              )}
            >
              {item.title}
              {item.titleLine2 ? <span className="block">{item.titleLine2}</span> : null}
            </h3>

            <p
              className={cn(
                'text-[#E5E2E1]/60 font-normal leading-relaxed',
                item.featured ? 'text-sm sm:text-base max-w-xl' : 'text-sm sm:text-[0.95rem]',
              )}
            >
              {item.description}
            </p>
          </div>

          <div className="pt-5 border-t border-white/10 flex items-center gap-2 mt-6">
            <span className="text-xs sm:text-sm font-normal tracking-wide text-[#FF5E4D]">
              {item.number} — {item.category}
            </span>
          </div>
        </div>
      </MagicCard>

    </div>
  )
}

export function CapabilitiesSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const handleNextCardClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const container = scrollContainerRef.current
    if (!container) return

    const firstCard = container.querySelector<HTMLElement>('[data-capability-card]')
    const step = firstCard ? firstCard.offsetWidth + 24 : 400
    const maxScroll = container.scrollWidth - container.clientWidth

    if (container.scrollLeft >= maxScroll - 20) {
      container.scrollTo({ left: 0, behavior: 'smooth' })
    } else {
      container.scrollBy({ left: step, behavior: 'smooth' })
    }
  }

  return (
    <section
      id="solutions"
      className="relative z-30 w-full bg-[#080808] py-16 sm:py-20 md:py-24 px-5 sm:px-8 md:px-12 text-white border-t border-white/10 selection:bg-[#FF5E4D] selection:text-white overflow-hidden"
    >
      <div className="pointer-events-none absolute top-1/2 right-0 h-64 w-64 sm:h-96 sm:w-96 rounded-full bg-[#FF5E4D]/5 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl space-y-10 sm:space-y-12 md:space-y-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 sm:gap-6 pb-2">
          <BlurFade inView delay={0.05} direction="up" className="space-y-3 sm:space-y-3.5 max-w-5xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.6rem] font-normal tracking-tight text-[#E5E2E1] leading-tight whitespace-normal md:whitespace-nowrap">
              Core Strategic Capabilities
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-[#E5E2E1]/60 font-normal leading-relaxed max-w-3xl">
              We engineer precise solutions for the enterprise void, transforming complex challenges
              into competitive advantages.
            </p>
          </BlurFade>

          <BlurFade inView delay={0.12} direction="up">
            {/* Mobile: advance snap carousel · Desktop: full services page */}
            <button
              type="button"
              onClick={handleNextCardClick}
              className="group inline-flex shrink-0 items-center gap-2 self-start p-2 -m-2 text-sm font-normal uppercase tracking-wider text-[#FF5E4D] transition-all duration-300 hover:gap-3 hover:text-[#ff4634] cursor-pointer md:self-end sm:text-base lg:hidden"
            >
              <span>VIEW ALL SERVICES</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <Link
              to="/services"
              className="group hidden lg:inline-flex shrink-0 items-center gap-2 self-end p-2 -m-2 text-sm font-normal uppercase tracking-wider text-[#FF5E4D] transition-all duration-300 hover:gap-3 hover:text-[#ff4634] cursor-pointer sm:text-base"
            >
              <span>VIEW ALL SERVICES</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </BlurFade>
        </div>

        {/* Mobile / tablet — horizontal snap */}
        <div
          ref={scrollContainerRef}
          className="-mx-5 sm:-mx-8 lg:hidden flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth px-5 sm:px-8 pb-8 pt-2 snap-x snap-mandatory focus:outline-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {capabilities.map((item, index) => (
            <CapabilityCardFace
              key={item.id}
              item={item}
              index={index}
              className="w-[min(85vw,320px)] sm:w-[360px] shrink-0 snap-start"
            />
          ))}
        </div>

        {/* Desktop — asymmetric bento */}
        <BentoGrid className="hidden lg:grid">
          {capabilities.map((item, index) => (
            <CapabilityCardFace
              key={item.id}
              item={item}
              index={index}
              className={item.bentoClass}
            />
          ))}
        </BentoGrid>
      </div>
    </section>
  )
}
