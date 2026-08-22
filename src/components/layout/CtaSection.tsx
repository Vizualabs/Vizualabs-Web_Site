import { useNavigate } from '@tanstack/react-router'
import { LiveButton } from '#/components/ui/live-button'
import { BlurFade } from '#/components/ui/blur-fade'
import { Meteors } from '#/components/ui/meteors'

export function CtaSection() {
  const navigate = useNavigate()

  return (
    <section className="relative z-30 overflow-hidden bg-[#2A2A2A] py-20 sm:py-24 md:py-32 px-5 sm:px-8 md:px-12 text-center border-t border-white/10 selection:bg-[#FF5E4D] selection:text-white">
      <Meteors number={10} className="opacity-70" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,94,77,0.08),transparent_55%)]"
      />

      <div className="relative mx-auto max-w-4xl space-y-5 sm:space-y-6">
        <BlurFade inView delay={0.05} direction="up">
          <h2 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-normal tracking-tight text-[#E5E2E1] leading-tight">
            Ready to Accelerate Your Journey?
          </h2>
        </BlurFade>

        <BlurFade inView delay={0.12} direction="up">
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-[#E5E2E1]/60 font-normal leading-relaxed">
            Book a session and leave with a clear, engineered plan for what&apos;s next — no
            guesswork, no fluff.
          </p>
        </BlurFade>

        <BlurFade inView delay={0.2} direction="up" className="pt-4 sm:pt-6 flex justify-center">
          <LiveButton type="button" onClick={() => navigate({ to: '/book' })}>
            Book a Strategy Session
          </LiveButton>
        </BlurFade>
      </div>
    </section>
  )
}
