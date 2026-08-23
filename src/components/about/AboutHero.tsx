export function AboutHero() {
  return (
    <section className="relative w-full bg-[#0a0a0a] pt-32 pb-20 sm:pt-40 sm:pb-28 md:pt-48 md:pb-36 px-6 sm:px-10 lg:px-16 overflow-hidden selection:bg-[#FF5540] selection:text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 h-[28rem] w-[40rem] rounded-full bg-[#FF5E4D]/10 blur-[120px]"
      />

      <div className="relative mx-auto max-w-7xl">
        {/* 'Our DNA' Badge */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium tracking-wide border border-[#42221E] bg-[#1c1311]/80 text-[#E7978B] shadow-inner backdrop-blur-sm">
            Our DNA
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="font-hanken text-4xl sm:text-6xl md:text-7xl lg:text-[5.25rem] font-bold tracking-tight leading-[1.08] sm:leading-[1.06] mb-8 sm:mb-10 md:mb-12">
          <span className="text-[#E5E2E1] block">
            Precision in Engineering,
          </span>
          <span className="text-[#FF5540] block">
            Strategic in Vision.
          </span>
        </h1>

        {/* Sub-paragraph: Exactly #E5E2E1 at 70% opacity, clean light body weight */}
        <p className="text-base sm:text-lg md:text-xl font-light leading-relaxed text-[#E5E2E1]/70 max-w-2xl sm:max-w-3xl">
          At Vizualabs, we don't just build software. We engineer momentum. Our approach fuses rigorous technical discipline with high-level strategic foresight to bridge the gap between complex engineering and market-defining innovation.
        </p>
      </div>
    </section>
  )
}
