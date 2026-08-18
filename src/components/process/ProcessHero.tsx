export function ProcessHero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#131313] pt-32 pb-10 sm:pt-40 sm:pb-14 md:pt-48 md:pb-16 px-5 sm:px-8 lg:px-12 selection:bg-[#FF5540] selection:text-white">
      <div className="pointer-events-none absolute top-1/4 left-1/12 h-96 w-96 rounded-full bg-[#FF5540]/5 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-1/3 right-1/12 h-80 w-80 rounded-full bg-[#FF5540]/4 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">
        <p className="mb-4 sm:mb-5 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-[#E7978B]">
          Strategic Methodology
        </p>

        <h1 className="font-hanken text-4xl sm:text-6xl md:text-7xl lg:text-[5.25rem] font-extrabold tracking-tight leading-[1.08] text-[#E5E2E1]">
          The Strategic Journey
        </h1>

        <p className="mt-6 sm:mt-7 max-w-2xl text-base sm:text-lg md:text-xl font-light leading-relaxed text-[#EBBBB4]/70">
          We engineer momentum through a disciplined process — bridging the gap between
          technical challenges and strategic vision, from first idea to lasting maintenance.
        </p>
      </div>
    </section>
  )
}
