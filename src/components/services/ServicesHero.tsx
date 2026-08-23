import { ArrowRight } from 'lucide-react'

export function ServicesHero() {
  return (
    <section className="relative z-10 w-full min-h-[calc(100vh-5rem)] flex flex-col justify-center overflow-hidden bg-black text-white pt-36 sm:pt-40 md:pt-48 pb-20 sm:pb-28 px-5 sm:px-8 lg:px-12">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 h-[28rem] w-[40rem] rounded-full bg-[#FF5E4D]/10 blur-[120px]"
      />

      <div className="relative mx-auto w-full max-w-7xl">
        {/* Pill Badge */}
        <div className="inline-flex items-center rounded-full border border-[#42221E]/80 bg-[#1A1211]/80 px-4 py-1.5 backdrop-blur-sm mb-6 sm:mb-8">
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.18em] uppercase text-[#E7978B]">
            OUR CAPABILITIES
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="font-hanken text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6rem] font-extrabold tracking-tight leading-[1.04] text-[#E5E2E1]">
          Engineering <span className="text-[#FF553E]">Momentum.</span>
        </h1>

        {/* Subtitle / Description */}
        <p className="mt-6 sm:mt-7 max-w-2xl sm:max-w-3xl text-base sm:text-lg md:text-[1.125rem] font-normal leading-relaxed text-[#EBBBB4]">
          We bridge the void between raw technological potential and strategic market leadership.
          From high-integrity codebases to intelligent AI ecosystems, our services are architected
          for enterprise precision.
        </p>

        {/* Call to Action Buttons */}
        <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4 sm:gap-5">
          <a
            href="/process"
            className="inline-flex items-center gap-2 rounded-full bg-[#FF553E] px-7 py-3.5 text-sm sm:text-base font-bold text-zinc-950 shadow-md shadow-[#FF553E]/20 transition-all duration-200 hover:bg-[#FF422A] hover:shadow-lg hover:shadow-[#FF553E]/35 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <span>View our Process</span>
            <ArrowRight className="h-4 w-4 stroke-[2.5]" />
          </a>

          <a
            href="/#cases"
            className="inline-flex items-center justify-center rounded-full border border-zinc-700/80 bg-zinc-950/40 px-7 py-3.5 text-sm sm:text-base font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:border-zinc-500 hover:bg-white/[0.06] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            Case Studies
          </a>
        </div>
      </div>
    </section>
  )
}
