import { motion, MotionConfig } from 'motion/react'
import { FOUNDERS, type FounderProfile } from '#/lib/founders'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
}

function QuoteMark({ className = '' }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`font-hanken text-[#FF5540] leading-none select-none ${className}`}
    >
      &ldquo;
    </span>
  )
}

function FounderCard({
  founder,
  index,
}: {
  founder: FounderProfile
  index: number
}) {
  const reversed = index % 2 === 1

  return (
    <motion.article
      {...fadeUp}
      transition={{ duration: 0.5, ease: EASE, delay: index * 0.08 }}
      className={`group relative overflow-hidden rounded-[20px] border border-[#2A2826] bg-[#121214] shadow-2xl transition-colors duration-300 hover:border-[#3A3735] ${
        reversed ? 'lg:flex-row-reverse' : ''
      } flex flex-col lg:flex-row`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 top-0 h-48 w-48 rounded-full bg-[#FF5540]/[0.04] blur-[80px]"
      />

      {/* Portrait */}
      <div className="relative aspect-[4/5] w-full shrink-0 overflow-hidden bg-[#0a0a0a] sm:aspect-[5/6] lg:aspect-auto lg:w-[min(42%,360px)]">
        <img
          src={founder.imageSrc}
          alt={founder.imageAlt}
          width={720}
          height={900}
          loading={index === 0 ? 'eager' : 'lazy'}
          decoding="async"
          className="h-full w-full object-cover object-[center_18%] transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#121214]/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[#121214]/40" />
      </div>

      {/* Quote panel */}
      <div className="relative flex flex-1 flex-col justify-center px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12">
        <p className="type-eyebrow mb-4 text-[#E7978B]">Co-Founder</p>

        <blockquote className="relative mb-8 sm:mb-10">
          <QuoteMark className="absolute -left-1 -top-3 text-5xl sm:text-6xl opacity-90" />
          <p className="type-lead relative z-[1] pl-6 sm:pl-8 font-light italic leading-relaxed text-[#E5E2E1]/90 sm:text-lg sm:leading-[1.7]">
            {founder.quote}
          </p>
          <QuoteMark className="absolute -bottom-6 right-0 rotate-180 text-4xl sm:text-5xl opacity-70" />
        </blockquote>

        <footer className="border-t border-[#2A2826] pt-6">
          <p className="font-hanken text-xl font-bold tracking-tight text-white sm:text-2xl">
            {founder.name}
          </p>
          <p className="mt-1 text-sm font-medium text-[#E5E2E1]/50 sm:text-base">
            {founder.title}
          </p>
        </footer>
      </div>
    </motion.article>
  )
}

export function AboutFounders() {
  return (
    <section
      aria-labelledby="about-founders-heading"
      className="relative w-full overflow-hidden bg-[#0a0a0a] px-4 py-16 sm:px-8 sm:py-24 lg:px-16 lg:py-28 selection:bg-[#FF5540] selection:text-white"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-[#FF5540]/[0.035] blur-[120px]"
      />

      <MotionConfig reducedMotion="user">
        <div className="relative mx-auto max-w-6xl">
          <motion.header
            {...fadeUp}
            transition={{ duration: 0.45, ease: EASE }}
            className="mb-10 sm:mb-14 md:mb-16 max-w-3xl"
          >
            <div className="mb-5 inline-flex items-center rounded-full border border-[#42221E]/80 bg-[#1A1211]/80 px-4 py-1.5 backdrop-blur-sm">
              <span className="type-eyebrow text-[#E7978B]">Leadership</span>
            </div>
            <h2
              id="about-founders-heading"
              className="type-section font-bold text-[#E5E2E1]"
            >
              The founders behind{' '}
              <span className="text-[#FF5540]">the build.</span>
            </h2>
            <p className="type-lead mt-4 text-[#E5E2E1]/60">
              Three co-founders. One standard — rigorous engineering, strategic clarity, and
              software that earns trust in production.
            </p>
          </motion.header>

          <div className="flex flex-col gap-6 sm:gap-8 lg:gap-10">
            {FOUNDERS.map((founder, index) => (
              <FounderCard key={founder.id} founder={founder} index={index} />
            ))}
          </div>
        </div>
      </MotionConfig>
    </section>
  )
}
