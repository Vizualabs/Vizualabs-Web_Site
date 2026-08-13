import { useState, useRef } from 'react'
import {
  Terminal,
  Compass,
  Bot,
  Cloud,
  ShieldCheck,
  Database,
  Sparkles,
  CheckCircle2,
  ArrowRight
} from 'lucide-react'

interface CapabilityCard {
  id: string
  number: string
  category: string
  title: string
  titleLine2?: string
  description: string
  icon: typeof Terminal
}

const capabilities: CapabilityCard[] = [
  {
    id: 'custom-software',
    number: '01',
    category: 'Implementation',
    title: 'Custom Software',
    description: 'Scalable, secure, and performant architectures built with mathematical precision for mission-critical operations.',
    icon: Terminal,
  },
  {
    id: 'product-development',
    number: '02',
    category: 'Innovation',
    title: 'Product',
    titleLine2: 'Development',
    description: 'From discovery to deployment, we translate strategic goals into intuitive, market-leading user experiences.',
    icon: Compass,
  },
  {
    id: 'ai-solutions',
    number: '03',
    category: 'Intelligence',
    title: 'AI Solutions',
    description: 'Integrating generative and predictive models into existing workflows to unlock unprecedented operational velocity.',
    icon: Bot,
  },
  {
    id: 'cloud-architecture',
    number: '04',
    category: 'DevOps & Cloud',
    title: 'Cloud Architecture',
    description: 'Enterprise-grade multi-cloud deployment, Kubernetes orchestration, and automated zero-downtime infrastructure.',
    icon: Cloud,
  },
  {
    id: 'cybersecurity-shield',
    number: '05',
    category: 'Security & Audit',
    title: 'Cybersecurity Shield',
    description: 'Zero-trust network architecture, automated vulnerability scanning, and comprehensive enterprise compliance auditing.',
    icon: ShieldCheck,
  },
  {
    id: 'data-engineering',
    number: '06',
    category: 'Data Systems',
    title: 'Enterprise Data',
    titleLine2: 'Pipelines',
    description: 'High-throughput data pipelines, real-time stream processing, and predictive executive decision dashboards.',
    icon: Database,
  },
  {
    id: 'digital-strategy',
    number: '07',
    category: 'Advisory & Strategy',
    title: 'Digital',
    titleLine2: 'Transformation',
    description: 'Roadmap planning, legacy modernization, and technical due diligence for high-growth enterprise systems.',
    icon: Sparkles,
  },
  {
    id: 'automated-qa',
    number: '08',
    category: 'QA & Reliability',
    title: 'Automated',
    titleLine2: 'Quality Assurance',
    description: 'End-to-end regression suites, performance stress testing, and continuous integration quality gates.',
    icon: CheckCircle2,
  },
]

export function CapabilitiesSection() {
  const [showAll, setShowAll] = useState(false)

  const displayedCapabilities = showAll ? capabilities : capabilities.slice(0, 3)

  return (
    <section id="solutions" className="relative z-30 w-full bg-[#080808] py-16 sm:py-20 px-6 sm:px-12 text-white border-t border-white/10 selection:bg-[#FF5E4D] selection:text-white overflow-hidden">
      {/* Background subtle glow effect */}
      <div className="pointer-events-none absolute top-1/2 right-0 h-96 w-96 rounded-full bg-[#FF5E4D]/5 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl space-y-10 sm:space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
          <div className="space-y-3 max-w-2xl">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              Core Strategic Capabilities
            </h2>
            <p className="text-base sm:text-lg text-gray-400 font-normal leading-relaxed">
              We engineer precise solutions for the enterprise void, transforming complex challenges into competitive advantages.
            </p>
          </div>

          {/* Action Header Link */}
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold tracking-wider text-[#FF5E4D] uppercase transition-all duration-300 hover:gap-3 hover:text-[#ff4634] shrink-0 self-start md:self-end group cursor-pointer"
          >
            <span>{showAll ? 'SHOW LESS' : 'VIEW ALL SERVICES'}</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* 3-Column Grid Cards Container (matching reference image) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {displayedCapabilities.map((item) => {
            const IconComp = item.icon
            return (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-[#121212] p-7 sm:p-9 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#FF5E4D]/40 hover:bg-[#161616] hover:shadow-2xl hover:shadow-[#FF5E4D]/10"
              >
                <div>
                  {/* Top Icon Badge */}
                  <div className="mb-8 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-[#1c1c1c] text-[#FF5E4D] shadow-inner transition-colors duration-300 group-hover:border-[#FF5E4D]/40 group-hover:bg-[#FF5E4D]/10">
                    <IconComp className="h-6 w-6 text-[#FF5E4D]" />
                  </div>

                  {/* Title */}
                  <h3 className="mb-4 text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                    {item.title}
                    {item.titleLine2 && <span className="block">{item.titleLine2}</span>}
                  </h3>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-gray-400 font-normal leading-relaxed mb-8">
                    {item.description}
                  </p>
                </div>

                {/* Footer Tagline / Number */}
                <div className="pt-6 border-t border-white/10 flex items-center gap-2">
                  <span className="text-sm font-bold tracking-wide text-[#FF5E4D]">
                    {item.number} — {item.category}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
