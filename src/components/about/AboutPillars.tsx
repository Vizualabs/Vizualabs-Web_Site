import { motion, MotionConfig } from 'motion/react'
import { Rocket, Shield } from 'lucide-react'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
}

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
    <section className="relative w-full bg-[#0a0a0a] py-16 sm:py-24 px-6 sm:px-10 lg:px-16 overflow-hidden selection:bg-[#FF5540] selection:text-white">
      <MotionConfig reducedMotion="user">
        <div className="relative mx-auto max-w-7xl">
          {/* Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">

            {/* Top-Left Card: The Architectural Void (Spans 2 columns on lg) */}
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.45, ease: EASE, delay: 0 }}
              className="lg:col-span-2 rounded-[20px] bg-[#2A2A2A] border border-[#3A3735] p-6 sm:p-8 md:p-10 flex flex-col justify-between shadow-2xl transition-colors duration-300 hover:border-[#4A4745]"
            >
              <div>
                {/* Compass Icon */}
                <div className="text-[#FFB4A8] mb-6">
                  <CompassIcon className="h-7 w-7 sm:h-8 sm:w-8" />
                </div>

                {/* Title */}
                <h2 className="font-hanken text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#E5E2E1] mb-4">
                  The Architectural Void
                </h2>

                {/* Description */}
                <p className="text-sm sm:text-base md:text-lg font-light leading-relaxed text-[#E5E2E1]/60 max-w-2xl">
                  We specialize in turning "the void"—untapped technical potential—into stable, high-performance architectures. Our engineering core is built for enterprise-grade scalability.
                </p>
              </div>

              {/* Bottom Stat & Progress Bar */}
              <div className="mt-10 sm:mt-14 pt-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                {/* Progress Track */}
                <div className="flex-1 max-w-xl">
                  <div className="h-[3px] w-full rounded-full bg-[#E5E2E1]/20 overflow-hidden">
                    <motion.div
                      className="h-full bg-[#FFB4A8] rounded-full"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
                      style={{ width: '84%', transformOrigin: 'left center' }}
                    />
                  </div>
                </div>

                {/* Stat Label */}
                <div className="shrink-0 text-left">
                  <span className="text-xs sm:text-sm font-normal text-[#FFB4A8] leading-tight block">
                    84% Efficiency
                  </span>
                  <span className="text-xs sm:text-sm font-normal text-[#FFB4A8] leading-tight block">
                    Gain
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Top-Right Accent Card: Momentum (Solid vibrant red-orange, centered) */}
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.4, ease: EASE, delay: 0.08 }}
              whileHover={{ y: -2 }}
              className="lg:col-span-1 rounded-[20px] bg-[#FF5540] p-6 sm:p-8 md:p-10 flex flex-col items-center justify-center text-center shadow-2xl"
            >
              {/* Rocket Icon (Centered, 45 degree angle) */}
              <div className="text-[#2B0E0A] mb-5 sm:mb-6 flex items-center justify-center">
                <Rocket className="h-11 w-11 sm:h-12 sm:w-12" fill="currentColor" />
              </div>

              {/* Title */}
              <h3 className="font-hanken text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#2B0E0A] mb-2.5">
                Momentum
              </h3>

              {/* Description */}
              <p className="text-sm sm:text-base font-normal leading-relaxed text-[#3A1410]/85 max-w-xs">
                Driving strategic velocity for global market leaders since 2018.
              </p>
            </motion.div>

            {/* Bottom Row - Card 1: Security */}
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.38, ease: EASE, delay: 0.1 }}
              whileHover={{ y: -2 }}
              className="rounded-[16px] bg-[#171615] border border-[#2A2826] p-6 sm:p-8 flex flex-col justify-between shadow-2xl transition-colors duration-300 hover:border-[#3A3735] min-h-[220px]"
            >
              <div>
                <div className="text-[#C6C6C7] mb-5">
                  <Shield className="h-6 w-6 sm:h-7 sm:w-7 stroke-[1.8]" />
                </div>
                <h3 className="font-hanken text-xl sm:text-2xl font-bold tracking-tight text-[#E5E2E1] mb-2.5">
                  Security
                </h3>
                <p className="text-sm sm:text-base font-light leading-relaxed text-[#E5E2E1]/60">
                  Rigorous protocols embedded into every line of code.
                </p>
              </div>
            </motion.div>

            {/* Bottom Row - Card 2: Integration */}
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.38, ease: EASE, delay: 0.15 }}
              whileHover={{ y: -2 }}
              className="rounded-[16px] bg-[#171615] border border-[#2A2826] p-6 sm:p-8 flex flex-col justify-between shadow-2xl transition-colors duration-300 hover:border-[#3A3735] min-h-[220px]"
            >
              <div>
                <div className="text-[#C6C6C7] mb-5">
                  <IntegrationIcon className="h-6 w-6 sm:h-7 sm:w-7" />
                </div>
                <h3 className="font-hanken text-xl sm:text-2xl font-bold tracking-tight text-[#E5E2E1] mb-2.5">
                  Integration
                </h3>
                <p className="text-sm sm:text-base font-light leading-relaxed text-[#E5E2E1]/60">
                  Seamlessly bridging legacy systems with AI-driven futures.
                </p>
              </div>
            </motion.div>

            {/* Bottom Row - Card 3: Data Insight */}
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.38, ease: EASE, delay: 0.2 }}
              whileHover={{ y: -2 }}
              className="rounded-[16px] bg-[#171615] border border-[#2A2826] p-6 sm:p-8 flex flex-col justify-between shadow-2xl transition-colors duration-300 hover:border-[#3A3735] min-h-[220px]"
            >
              <div>
                <div className="text-[#C6C6C7] mb-5">
                  <InsightIcon className="h-6 w-6 sm:h-7 sm:w-7" />
                </div>
                <h3 className="font-hanken text-xl sm:text-2xl font-bold tracking-tight text-[#E5E2E1] mb-2.5">
                  Data Insight
                </h3>
                <p className="text-sm sm:text-base font-light leading-relaxed text-[#E5E2E1]/60">
                  Transforming raw data into actionable strategic threads.
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </MotionConfig>
    </section>
  )
}
