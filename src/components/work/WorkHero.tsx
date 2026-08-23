export function WorkHero() {
  return (
    <section className="relative w-full overflow-hidden bg-black px-5 pb-16 pt-32 sm:px-8 sm:pb-20 sm:pt-40 lg:px-12">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 h-[28rem] w-[40rem] rounded-full bg-[#FF5E4D]/10 blur-[120px]"
      />
      <div className="relative mx-auto max-w-4xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#FF5E4D]">Selected work</p>
        <h1 className="mt-4 font-hanken text-4xl font-bold tracking-tight text-[#E5E2E1] sm:text-5xl lg:text-6xl">
          Projects we've engineered
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base">
          A look at the problems we've solved and what we built to solve them — from first
          conversation to shipped product.
        </p>
      </div>
    </section>
  )
}
