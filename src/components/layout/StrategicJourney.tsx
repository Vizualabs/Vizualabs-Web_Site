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

  return (
    <section className="relative z-30 w-full bg-[#050505] py-20 sm:py-28 px-6 sm:px-12 border-t border-white/10 text-white selection:bg-[#FF5E4D] selection:text-white overflow-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute top-1/4 left-0 h-96 w-96 rounded-full bg-[#FF5E4D]/5 blur-[140px]" />

      <div className="relative mx-auto max-w-3xl">
        {/* Header section matching exact reference image */}
        <div className="space-y-3 mb-12 sm:mb-16">
          <span className="text-xs sm:text-sm font-normal tracking-[0.2em] text-[#FF5E4D] uppercase block">
            THE STRATEGIC JOURNEY
          </span>
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-white leading-tight">
            Digital Success{' '}
            <span className="font-serif-italic text-[#FF5E4D] block sm:inline font-normal">
              Mastered.
            </span>
          </h2>
        </div>

        {/* Clean Vertical Timeline Steps List matching reference image */}
        <div className="relative space-y-10 pl-2">
          {steps.map((step, idx) => {
            const IconComponent = step.icon
            const isActive = step.id === activeStep
            const isLast = idx === steps.length - 1

            return (
              <div
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className="group relative flex items-start gap-6 cursor-pointer select-none"
              >
                {/* Vertical connecting line */}
                {!isLast && (
                  <div
                    className={`absolute left-5 top-12 bottom-0 w-[2px] -mb-10 transition-colors duration-300 ${isActive ? 'bg-[#FF5E4D]' : 'bg-white/10'
                      }`}
                  />
                )}

                {/* Step Icon Circle Badge */}
                <div
                  className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${isActive
                      ? 'bg-[#FF5E4D] text-white shadow-lg shadow-[#FF5E4D]/40 scale-105'
                      : 'bg-[#1c1c1c] border border-white/10 text-gray-500 group-hover:border-[#FF5E4D]/40 group-hover:text-gray-300'
                    }`}
                >
                  <IconComponent className="h-5 w-5" />
                </div>

                {/* Step Content */}
                <div className="space-y-1.5 pt-1">
                  <h3
                    className={`text-xl sm:text-2xl font-bold transition-colors ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'
                      }`}
                  >
                    {step.title}
                  </h3>
                  <p
                    className={`text-sm sm:text-base font-normal leading-relaxed max-w-xl transition-colors ${isActive ? 'text-gray-300' : 'text-gray-500 group-hover:text-gray-400'
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
    </section>
  )
}
