import { useState } from 'react'
import {
  Search,
  Wrench,
  Rocket,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  BarChart3,
  Sparkles,
  ArrowRight
} from 'lucide-react'

interface JourneyStep {
  id: number
  title: string
  description: string
  icon: typeof Search
  metrics: { label: string; value: string }[]
  highlights: string[]
}

const steps: JourneyStep[] = [
  {
    id: 1,
    title: 'Strategic Audit',
    description: 'Analyzing the landscape to identify technical debt and growth potential.',
    icon: Search,
    metrics: [
      { label: 'System Health', value: '99.8%' },
      { label: 'Debt Reduced', value: '45%' },
    ],
    highlights: ['Deep Codebase Analysis', 'Infrastructure Bottleneck Detection', 'Security & Compliance Scan'],
  },
  {
    id: 2,
    title: 'Precision Build',
    description: 'Agile execution with a focus on code quality and architectural integrity.',
    icon: Wrench,
    metrics: [
      { label: 'Code Coverage', value: '98.5%' },
      { label: 'Sprint Speed', value: '2.4x' },
    ],
    highlights: ['Modular System Architecture', 'Strict Type-Safe Workflows', 'CI/CD Automated Pipelines'],
  },
  {
    id: 3,
    title: 'Seamless Deployment',
    description: 'Zero-downtime release strategies paired with instant observability.',
    icon: Rocket,
    metrics: [
      { label: 'Uptime', value: '99.99%' },
      { label: 'Deploy Latency', value: '< 45ms' },
    ],
    highlights: ['Blue-Green Releases', 'Real-Time Telemetry', 'Automated Fallback Guards'],
  },
  {
    id: 4,
    title: 'Scalable Evolution',
    description: 'Continuous optimization and scaling to drive sustainable market dominance.',
    icon: TrendingUp,
    metrics: [
      { label: 'Scale Factor', value: '10x' },
      { label: 'ROI Growth', value: '+320%' },
    ],
    highlights: ['AI-Driven Analytics', 'Elastic Microservices', 'Proactive Threat Shielding'],
  },
]

export function StrategicJourney() {
  const [activeStep, setActiveStep] = useState(1)
  const currentStep = steps.find((s) => s.id === activeStep) || steps[0]

  return (
    <section className="relative z-30 w-full bg-[#050505] py-24 sm:py-32 px-6 sm:px-12 border-t border-white/10 text-white selection:bg-[#FF5E4D] selection:text-white overflow-hidden">
      {/* Subtle radial ambient background glows */}
      <div className="pointer-events-none absolute top-1/4 left-0 h-96 w-96 rounded-full bg-[#FF5E4D]/10 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 right-10 h-80 w-80 rounded-full bg-indigo-500/10 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Heading & Timeline Steps */}
          <div className="lg:col-span-7 space-y-10">
            {/* Header section matching exact reference image typography */}
            <div className="space-y-3">
              <span className="text-xs sm:text-sm font-bold tracking-[0.2em] text-[#FF5E4D] uppercase block">
                THE STRATEGIC JOURNEY
              </span>
              <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-none">
                Digital Success{' '}
                <span className="font-serif-italic text-[#FF5E4D] block mt-1 sm:inline sm:mt-0 font-normal">
                  Mastered.
                </span>
              </h2>
            </div>

            {/* Timeline Steps List */}
            <div className="relative pt-4 space-y-8">
              {steps.map((step, idx) => {
                const IconComponent = step.icon
                const isActive = step.id === activeStep
                const isLast = idx === steps.length - 1

                return (
                  <div
                    key={step.id}
                    onClick={() => setActiveStep(step.id)}
                    className={`group relative flex items-start gap-5 cursor-pointer transition-all duration-300 rounded-2xl p-4 sm:p-5 border ${
                      isActive
                        ? 'border-[#FF5E4D]/40 bg-white/[0.03] backdrop-blur-md shadow-xl shadow-[#FF5E4D]/5'
                        : 'border-transparent hover:border-white/10 hover:bg-white/[0.015]'
                    }`}
                  >
                    {/* Vertical connecting line */}
                    {!isLast && (
                      <div
                        className={`absolute left-9 sm:left-10 top-14 bottom-0 w-[2px] -mb-8 transition-colors duration-300 ${
                          isActive ? 'bg-gradient-to-b from-[#FF5E4D] to-white/10' : 'bg-white/10'
                        }`}
                      />
                    )}

                    {/* Step Icon Badge */}
                    <div
                      className={`relative z-10 flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                        isActive
                          ? 'bg-[#FF5E4D] text-white shadow-lg shadow-[#FF5E4D]/40 scale-110'
                          : 'bg-zinc-900 border border-white/15 text-gray-400 group-hover:border-[#FF5E4D]/40 group-hover:text-white'
                      }`}
                    >
                      <IconComponent className="h-5 w-5" />
                    </div>

                    {/* Step Content */}
                    <div className="space-y-1 pt-0.5">
                      <h3
                        className={`text-lg sm:text-xl font-bold transition-colors ${
                          isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'
                        }`}
                      >
                        {step.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-400 font-normal leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Column: Interactive Detail Card Panel */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 pt-4 lg:pt-14">
            <div className="relative rounded-3xl border border-white/15 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-6 sm:p-8 backdrop-blur-2xl shadow-2xl overflow-hidden">
              {/* Card Header Badge */}
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF5E4D]/20 text-[#FF5E4D] border border-[#FF5E4D]/30">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider text-gray-400 font-mono">PHASE 0{currentStep.id}</span>
                    <h4 className="text-lg font-bold text-white">{currentStep.title}</h4>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FF5E4D]/15 text-[#FF5E4D] border border-[#FF5E4D]/30">
                  Active Focus
                </span>
              </div>

              {/* Step Metrics Grid */}
              <div className="grid grid-cols-2 gap-4 py-6">
                {currentStep.metrics.map((metric, i) => (
                  <div key={i} className="rounded-2xl border border-white/10 bg-black/40 p-4">
                    <span className="text-xs text-gray-400 font-medium block mb-1">{metric.label}</span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {metric.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Highlights Checklist */}
              <div className="space-y-3 pt-2 pb-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Key Deliverables
                </span>
                <ul className="space-y-2.5 text-sm text-gray-300">
                  {currentStep.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#FF5E4D] shrink-0" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Interactive Footer Action */}
              <a
                href="#contact"
                className="flex items-center justify-center gap-2 w-full rounded-2xl bg-white/10 hover:bg-[#FF5E4D] py-3.5 text-sm font-semibold text-white transition-all duration-300 border border-white/10 hover:border-[#FF5E4D] group cursor-pointer"
              >
                <span>Initiate {currentStep.title}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
