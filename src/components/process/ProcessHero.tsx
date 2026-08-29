import { TextReveal, FadeLine } from '#/components/ui/text-reveal'

export function ProcessHero() {
  return (
    <section className="relative z-10 w-full min-h-[calc(100vh-5rem)] flex flex-col justify-center overflow-hidden bg-black text-white pt-36 sm:pt-40 md:pt-48 pb-16 sm:pb-24 px-5 sm:px-8 lg:px-12 selection:bg-[#FF5540] selection:text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 h-[28rem] w-[40rem] rounded-full bg-[#FF5E4D]/10 blur-[120px]"
      />

      <div className="relative mx-auto w-full max-w-7xl">
        <FadeLine>
          <div className="inline-flex items-center rounded-full border border-[#42221E]/80 bg-[#1A1211]/80 px-4 py-1.5 backdrop-blur-sm mb-6 sm:mb-8">
            <span className="type-eyebrow text-[#E7978B]">
              Strategic Methodology
            </span>
          </div>
        </FadeLine>

        <h1 className="type-display flex flex-wrap gap-x-[0.28em] gap-y-1">
          <TextReveal as="span" className="text-[#E5E2E1]" delay={0.05}>
            The Strategic
          </TextReveal>
          <TextReveal as="span" className="text-[#FF553E]" delay={0.12}>
            Journey
          </TextReveal>
        </h1>

        <FadeLine delay={0.28}>
          <p className="type-lead mt-6 sm:mt-7 max-w-2xl sm:max-w-3xl text-[#EBBBB4]">
            We engineer momentum through a disciplined process — bridging the gap between
            technical challenges and strategic vision, from first idea to lasting maintenance.
          </p>
        </FadeLine>
      </div>
    </section>
  )
}
