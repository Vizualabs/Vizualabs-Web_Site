import { TextReveal, FadeLine } from '#/components/ui/text-reveal'

export function AboutHero() {
  return (
    <section className="relative z-10 w-full min-h-[calc(100vh-5rem)] flex flex-col justify-center overflow-hidden bg-black text-white pt-36 sm:pt-40 md:pt-48 pb-16 sm:pb-24 px-5 sm:px-8 lg:px-12 selection:bg-[#FF5540] selection:text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 h-[28rem] w-[40rem] rounded-full bg-[#FF5E4D]/10 blur-[120px]"
      />

      <div className="relative mx-auto w-full max-w-7xl">
        <FadeLine>
          <div className="inline-flex items-center rounded-full border border-[#42221E]/80 bg-[#1A1211]/80 px-4 py-1.5 backdrop-blur-sm mb-6 sm:mb-8">
            <span className="text-[11px] sm:text-xs font-semibold tracking-[0.18em] uppercase text-[#E7978B]">
              Our DNA
            </span>
          </div>
        </FadeLine>

        <h1 className="mb-0 space-y-1 sm:space-y-2">
          <TextReveal
            as="span"
            className="font-hanken text-5xl sm:text-6xl md:text-7xl lg:text-[5.25rem] xl:text-[5.75rem] font-extrabold tracking-tight leading-[1.05] text-[#E5E2E1]"
            delay={0.05}
          >
            Precision in Engineering,
          </TextReveal>
          <TextReveal
            as="span"
            className="font-hanken text-5xl sm:text-6xl md:text-7xl lg:text-[5.25rem] xl:text-[5.75rem] font-extrabold tracking-tight leading-[1.05] text-[#FF5540]"
            delay={0.22}
          >
            Strategic in Vision.
          </TextReveal>
        </h1>

        <FadeLine delay={0.4}>
          <p className="mt-6 sm:mt-7 max-w-2xl sm:max-w-3xl text-base sm:text-lg md:text-[1.125rem] font-normal leading-relaxed text-[#EBBBB4]">
            Vizualabs (Pvt.) Ltd. doesn&apos;t just build software. We engineer momentum. Our approach
            fuses rigorous technical discipline with high-level strategic foresight to bridge the gap
            between complex engineering and market-defining innovation.
          </p>
        </FadeLine>
      </div>
    </section>
  )
}
