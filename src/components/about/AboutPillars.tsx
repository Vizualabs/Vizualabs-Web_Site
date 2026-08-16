import { Rocket, Shield } from 'lucide-react'

// Precision Drafting Compass Icon
function CompassIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="4" r="2" />
      <path d="M12 6L6 21" />
      <path d="M12 6L18 21" />
      <path d="M8.5 14.5C9.5 13.5 14.5 13.5 15.5 14.5" />
    </svg>
  )
}

// 4-Way Connected Node Integration Icon
function IntegrationIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="4" r="1.75" />
      <circle cx="12" cy="20" r="1.75" />
      <circle cx="4" cy="12" r="1.75" />
      <circle cx="20" cy="12" r="1.75" />
      <polygon points="12,7 17,12 12,17 7,12" />
      <circle cx="12" cy="12" r="1.25" fill="currentColor" />
    </svg>
  )
}

// Line Trend / Analytics Insight Icon
function InsightIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 16L9 10L14 15L21 8" />
      <path d="M16 8H21V13" />
      <circle cx="6" cy="18" r="2" />
    </svg>
  )
}

export function AboutPillars() {
  return (
    <section className="relative w-full bg-[#313131] py-16 sm:py-24 px-6 sm:px-10 lg:px-16 overflow-hidden selection:bg-[#FF5540] selection:text-white">
      <div className="relative mx-auto max-w-7xl">
        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Top-Left Card: The Architectural Void (Spans 2 columns on lg) */}
          <div className="lg:col-span-2 rounded-[28px] bg-[#1e1e1e] border border-white/5 p-8 sm:p-10 md:p-12 flex flex-col justify-between shadow-2xl transition-all duration-300 hover:border-white/10">
            <div>
              {/* Compass Icon */}
              <div className="text-[#E7978B] mb-6">
                <CompassIcon className="h-7 w-7 sm:h-8 sm:w-8" />
              </div>

              {/* Title */}
              <h2 className="font-hanken text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#E5E2E1] mb-4">
                The Architectural Void
              </h2>

              {/* Description */}
              <p className="text-sm sm:text-base md:text-lg font-light leading-relaxed text-[#EBBBB4] max-w-2xl">
                We specialize in turning "the void"—untapped technical potential—into stable, high-performance architectures. Our engineering core is built for enterprise-grade scalability.
              </p>
            </div>

            {/* Bottom Stat & Progress Bar */}
            <div className="mt-10 sm:mt-14 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Progress Track */}
              <div className="flex-1 max-w-xl">
                <div className="h-[3px] w-full rounded-full bg-white/15 overflow-hidden">
                  <div
                    className="h-full bg-[#E7978B] rounded-full transition-all duration-1000 ease-out"
                    style={{ width: '84%' }}
                  />
                </div>
              </div>

              {/* Stat Label */}
              <div className="shrink-0 text-left sm:text-right">
                <span className="text-xs sm:text-sm font-normal text-[#E7978B] leading-tight block">
                  84% Efficiency
                </span>
                <span className="text-xs sm:text-sm font-normal text-[#E7978B] leading-tight block">
                  Gain
                </span>
              </div>
            </div>
          </div>

          {/* Top-Right Accent Card: Momentum (Solid vibrant red-orange) */}
          <div className="lg:col-span-1 rounded-[28px] bg-[#FF5540] p-8 sm:p-10 md:p-12 flex flex-col items-center justify-center text-center shadow-2xl transition-all duration-300 hover:scale-[1.01]">
            {/* Rocket Icon */}
            <div className="text-[#141414] mb-4 sm:mb-6">
              <Rocket className="h-12 w-12 sm:h-14 sm:w-14 -rotate-45 stroke-[2.2]" />
            </div>

            {/* Title */}
            <h3 className="font-hanken text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#141414] mb-3">
              Momentum
            </h3>

            {/* Description */}
            <p className="text-xs sm:text-sm md:text-base font-light leading-relaxed text-[#141414]/90 max-w-xs">
              Driving strategic velocity for global market leaders since 2018.
            </p>
          </div>

          {/* Bottom Row - Card 1: Security */}
          <div className="rounded-[28px] bg-[#1e1e1e] border border-white/5 p-8 sm:p-10 flex flex-col justify-between shadow-2xl transition-all duration-300 hover:border-white/10 min-h-[220px]">
            <div>
              <div className="text-[#E7978B] mb-5">
                <Shield className="h-6 w-6 sm:h-7 sm:w-7 stroke-[1.8]" />
              </div>
              <h3 className="font-hanken text-xl sm:text-2xl font-bold tracking-tight text-[#E5E2E1] mb-2.5">
                Security
              </h3>
              <p className="text-xs sm:text-sm md:text-base font-light leading-relaxed text-[#EBBBB4]">
                Rigorous protocols embedded into every line of code.
              </p>
            </div>
          </div>

          {/* Bottom Row - Card 2: Integration */}
          <div className="rounded-[28px] bg-[#1e1e1e] border border-white/5 p-8 sm:p-10 flex flex-col justify-between shadow-2xl transition-all duration-300 hover:border-white/10 min-h-[220px]">
            <div>
              <div className="text-[#E7978B] mb-5">
                <IntegrationIcon className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <h3 className="font-hanken text-xl sm:text-2xl font-bold tracking-tight text-[#E5E2E1] mb-2.5">
                Integration
              </h3>
              <p className="text-xs sm:text-sm md:text-base font-light leading-relaxed text-[#EBBBB4]">
                Seamlessly bridging legacy systems with AI-driven futures.
              </p>
            </div>
          </div>

          {/* Bottom Row - Card 3: Data Insight */}
          <div className="rounded-[28px] bg-[#1e1e1e] border border-white/5 p-8 sm:p-10 flex flex-col justify-between shadow-2xl transition-all duration-300 hover:border-white/10 min-h-[220px]">
            <div>
              <div className="text-[#E7978B] mb-5">
                <InsightIcon className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <h3 className="font-hanken text-xl sm:text-2xl font-bold tracking-tight text-[#E5E2E1] mb-2.5">
                Data Insight
              </h3>
              <p className="text-xs sm:text-sm md:text-base font-light leading-relaxed text-[#EBBBB4]">
                Transforming raw data into actionable strategic threads.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
