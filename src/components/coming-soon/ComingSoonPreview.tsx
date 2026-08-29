import { Cpu, Server, Activity, ArrowRight, Layers, Sparkles, ExternalLink } from 'lucide-react'
import { BorderBeam } from '#/components/ui/border-beam'
import { Link } from '@tanstack/react-router'

interface UpcomingCaseStudy {
  id: string
  title: string
  category: string
  stage: string
  description: string
  metrics: { label: string; value: string }[]
  technologies: string[]
  icon: typeof Cpu
  isFeatured?: boolean
}

const UPCOMING_STUDIES: UpcomingCaseStudy[] = [
  {
    id: 'ai-engine',
    title: 'High-Throughput Distributed AI Inference Platform',
    category: 'AI & Machine Learning Systems',
    stage: 'Authoring Deep Dive',
    description:
      'Architecting a low-latency LLM serving engine with custom batching pipelines, speculative decoding, and multi-tenant telemetry for enterprise workloads.',
    metrics: [
      { label: 'P99 Latency', value: '< 12ms' },
      { label: 'Throughput', value: '45k req/s' },
      { label: 'Uptime', value: '99.99%' },
    ],
    technologies: ['PyTorch', 'vLLM', 'Rust', 'Kubernetes', 'gRPC'],
    icon: Cpu,
    isFeatured: true,
  },
  {
    id: 'fintech-core',
    title: 'Fault-Tolerant Real-Time Clearing & Settlement Core',
    category: 'Financial Infrastructure',
    stage: 'Compiling Benchmarks',
    description:
      'Engineering an ultra-resilient distributed ledger and transaction core with zero-loss idempotency and audit logs under institutional volume.',
    metrics: [
      { label: 'Data Loss', value: '0.00%' },
      { label: 'TPS Peak', value: '120k' },
      { label: 'Failover', value: '< 150ms' },
    ],
    technologies: ['Go', 'PostgreSQL', 'Kafka', 'Temporal', 'OpenTelemetry'],
    icon: Server,
  },
  {
    id: 'saas-cloud',
    title: 'Next-Gen Edge-Optimized Multi-Tenant Platform',
    category: 'Cloud & Web Architecture',
    stage: 'Finalizing Visuals',
    description:
      'Designing an edge-first SaaS infrastructure featuring sub-second regional failover, dynamic asset streaming, and unified developer tooling.',
    metrics: [
      { label: 'Lighthouse', value: '99/100' },
      { label: 'Global TTFB', value: '42ms' },
      { label: 'Deploy Velocity', value: '4x Faster' },
    ],
    technologies: ['TypeScript', 'TanStack Start', 'Cloudflare Workers', 'TailwindCSS'],
    icon: Activity,
  },
]

export function ComingSoonPreview() {
  return (
    <section className="relative z-10 w-full bg-[#050505] text-white py-20 sm:py-28 px-5 sm:px-8 lg:px-12 border-t border-white/5 selection:bg-[#FF5540] selection:text-white">
      {/* Background ambient lighting */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-1/4 h-[24rem] w-[32rem] rounded-full bg-[#FF5E4D]/8 blur-[130px]"
      />

      <div className="relative mx-auto w-full max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-[#E7978B] mb-4">
              <Layers className="h-3.5 w-3.5" />
              Sneak Peek
            </div>
            <h2 className="font-hanken text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
              Upcoming Architectural Blueprints
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base text-[#A1A1AA] font-normal leading-relaxed">
            Here is a glimpse of the technical case studies and architectural breakdowns
            currently being prepared for release.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {UPCOMING_STUDIES.map((study) => {
            const Icon = study.icon
            return (
              <div
                key={study.id}
                className={`relative flex flex-col justify-between rounded-3xl p-6 sm:p-8 transition-all duration-300 overflow-hidden ${
                  study.isFeatured
                    ? 'bg-gradient-to-b from-[#161212] via-[#0E0C0C] to-[#0A0A0A] border border-[#FF5540]/30 shadow-2xl shadow-[#FF5540]/5'
                    : 'bg-[#0E0E0E]/90 border border-white/[0.08] hover:border-white/20'
                }`}
              >
                {study.isFeatured && (
                  <BorderBeam
                    size={120}
                    duration={8}
                    colorFrom="#FF5540"
                    colorTo="#FF8A6B"
                    borderWidth={1.5}
                  />
                )}

                <div>
                  {/* Category & Status */}
                  <div className="flex items-center justify-between gap-2 mb-6">
                    <span className="text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-[#E7978B]">
                      {study.category}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-white/[0.05] border border-white/10 text-[#A1A1AA]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#FF5540] animate-pulse" />
                      {study.stage}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="mb-4">
                    <div className="h-10 w-10 rounded-xl bg-[#1F1716] border border-[#42221E] flex items-center justify-center text-[#FF5540] mb-4">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-hanken text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
                      {study.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed mb-6 font-normal">
                    {study.description}
                  </p>

                  {/* Metric Highlights */}
                  <div className="grid grid-cols-3 gap-2 py-3 px-3.5 rounded-2xl bg-black/40 border border-white/5 mb-6">
                    {study.metrics.map((metric, i) => (
                      <div key={i} className="text-center">
                        <div className="font-mono text-xs sm:text-sm font-bold text-white tracking-tight">
                          {metric.value}
                        </div>
                        <div className="text-[10px] text-[#A1A1AA] truncate mt-0.5">
                          {metric.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Badges */}
                <div>
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                    {study.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 text-[10px] font-mono rounded-md bg-white/[0.03] text-[#A1A1AA] border border-white/5"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Quick Navigation Action Strip */}
        <div className="mt-16 sm:mt-20 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#141010] via-[#0E0D0D] to-[#141010] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h4 className="font-hanken text-xl sm:text-2xl font-bold text-white mb-2">
              Need engineering help right now?
            </h4>
            <p className="text-sm text-[#A1A1AA] max-w-lg">
              Explore our full suite of digital engineering capabilities or talk directly with our leadership team.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/15 transition-all duration-200"
            >
              Explore Services
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200"
            >
              Our Products
            </Link>
            <a
              href="/contact"
              className="nav-contact-btn text-xs sm:text-sm font-semibold"
            >
              Book Consultation
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
