import { useState } from 'react'
import {
  Search,
  Wrench,
  Rocket,
  TrendingUp,
} from 'lucide-react'
import { AnimatedList } from '../ui/animated-list'

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
    highlights: [
      'Deep Codebase Analysis',
      'Infrastructure Bottleneck Detection',
      'Security & Compliance Scan',
      'Performance Benchmarking',
      'Technical Debt Assessment',
      'Roadmap Prioritization',
    ],
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
    highlights: [
      'Modular System Architecture',
      'Strict Type-Safe Workflows',
      'CI/CD Automated Pipelines',
      'Test-Driven Development',
      'Code Review Gates',
      'Performance Profiling',
    ],
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
    highlights: [
      'Blue-Green Releases',
      'Real-Time Telemetry',
      'Automated Fallback Guards',
      'Canary Rollouts',
      'Synthetic Monitoring',
      'Instant Rollback',
    ],
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
    highlights: [
      'AI-Driven Analytics',
      'Elastic Microservices',
      'Proactive Threat Shielding',
      'Predictive Scaling',
      'Global Edge Caching',
      'Continuous A/B Testing',
    ],
  },
]

const timelinePath = 'M 32 28 C 54 68 10 108 32 148 C 54 188 10 228 32 268 C 54 308 10 348 32 388 C 54 428 10 468 32 508'

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

        {/* Animated curved timeline: the SVG stays behind the interactive step nodes. */}
        <div className="strategic-timeline relative pl-0 sm:pl-2" data-testid="strategic-timeline">
          <svg
            aria-hidden="true"
            className="strategic-timeline-curve pointer-events-none absolute left-0 top-0 h-[536px] w-16 sm:w-[4.5rem]"
            viewBox="0 0 64 536"
            preserveAspectRatio="none"
          >
            <path className="strategic-timeline-path" d={timelinePath} />
            <path
              className="strategic-timeline-path strategic-timeline-progress"
              d={timelinePath}
              pathLength="1"
              strokeDasharray={`${Math.max(0.04, (activeStep - 1) / (steps.length - 1))} 1`}
            />
            <circle className="strategic-timeline-traveler" r="3.5" cx="32" cy="28">
              <animateMotion dur="5.8s" repeatCount="indefinite" path={timelinePath} />
            </circle>
          </svg>

          <div className="relative space-y-10">
            {steps.map((step) => {
              const IconComponent = step.icon
              const isActive = step.id === activeStep

              return (
                <button
                  type="button"
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  aria-current={isActive ? 'step' : undefined}
                  aria-pressed={isActive}
                  className={`group relative flex min-h-[116px] w-full items-start gap-5 text-left transition-[transform,opacity] duration-500 sm:min-h-[116px] sm:gap-6 ${isActive ? 'opacity-100' : 'opacity-65 hover:opacity-100'}`}
                >
                  {/* Step Icon Circle Badge */}
                  <div
                    className={`strategic-timeline-node relative z-10 mt-1 flex h-14 w-14 shrink-0 items-center justify-center rounded-full transition-all duration-500 ${isActive
                      ? 'strategic-timeline-node-active bg-[#FF5E4D] text-white shadow-[0_0_0_8px_rgba(255,94,77,0.08),0_0_28px_rgba(255,94,77,0.35)]'
                      : 'border border-white/15 bg-[#171717] text-gray-500 group-hover:border-[#FF5E4D]/50 group-hover:text-gray-300'
                      }`}
                  >
                    <IconComponent className="h-6 w-6" strokeWidth={1.7} />
                  </div>

                  {/* Step Content */}
                  <div className="min-w-0 flex-1 space-y-2 pt-1">
                    <h3
                      className={`text-xl font-bold tracking-tight transition-colors sm:text-2xl ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'
                        }`}
                    >
                      {step.title}
                    </h3>
                    <p
                      className={`max-w-xl text-sm font-normal leading-relaxed transition-colors sm:text-base ${isActive ? 'text-gray-300' : 'text-gray-500 group-hover:text-gray-400'
                        }`}
                    >
                      {step.description}
                    </p>

                    <div className={`flex flex-wrap gap-2 pt-1 transition-all duration-500 ${isActive ? 'translate-y-0 opacity-100' : 'pointer-events-none h-0 translate-y-1 overflow-hidden opacity-0'}`}>
                      {step.metrics.map((metric) => (
                        <span key={metric.label} className="rounded-full border border-white/10 bg-white/[0.045] px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-gray-400 sm:text-[11px]">
                          <strong className="mr-1.5 font-semibold text-[#FF8A7D]">{metric.value}</strong>
                          {metric.label}
                        </span>
                      ))}
                    </div>

                    {/* Animated highlights: each item springs in sequence when the
                        step becomes active. Remounts per step so the stagger
                        replays on every activation. */}
                    {isActive && (
                      <AnimatedList delay={400} className="pt-2">
                        {step.highlights.map((highlight) => (
                          <div
                            key={highlight}
                            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5"
                          >
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF5E4D]" />
                            <span className="text-sm font-medium text-gray-300">
                              {highlight}
                            </span>
                          </div>
                        ))}
                      </AnimatedList>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
