import { Terminal, Compass, Bot, ArrowRight } from 'lucide-react'

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
]

export function CapabilitiesSection() {
  return (
    <section id="solutions" className="relative z-30 w-full bg-[#0a0a0a] py-24 sm:py-32 px-6 sm:px-12 text-white border-t border-white/10 selection:bg-[#FF5E4D] selection:text-white overflow-hidden">
      {/* Background glow effect */}
      <div className="pointer-events-none absolute top-1/2 right-0 h-96 w-96 rounded-full bg-[#FF5E4D]/5 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4">
          <div className="space-y-4 max-w-2xl">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              Core Strategic Capabilities
            </h2>
            <p className="text-base sm:text-lg text-gray-400 font-normal leading-relaxed">
              We engineer precise solutions for the enterprise void, transforming complex challenges into competitive advantages.
            </p>
          </div>

          <a
            href="#services"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold tracking-wider text-[#FF5E4D] uppercase transition-all duration-300 hover:gap-3 hover:text-[#ff4634] shrink-0 self-start md:self-end group"
          >
            <span>VIEW ALL SERVICES</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {capabilities.map((item) => {
            const IconComp = item.icon
            return (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-[#141414] p-8 sm:p-10 transition-all duration-300 hover:-translate-y-2 hover:border-[#FF5E4D]/40 hover:bg-[#181818] hover:shadow-2xl hover:shadow-[#FF5E4D]/10"
              >
                <div>
                  {/* Top Icon Badge */}
                  <div className="mb-10 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-[#FF5E4D] shadow-inner transition-colors duration-300 group-hover:border-[#FF5E4D]/40 group-hover:bg-[#FF5E4D]/10">
                    <IconComp className="h-7 w-7 text-[#FF5E4D]" />
                  </div>

                  {/* Title */}
                  <h3 className="mb-4 text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                    {item.title}
                    {item.titleLine2 && <span className="block">{item.titleLine2}</span>}
                  </h3>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-gray-400 font-normal leading-relaxed mb-10">
                    {item.description}
                  </p>
                </div>

                {/* Footer Tagline / Number */}
                <div className="pt-6 border-t border-white/5 flex items-center gap-2">
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
