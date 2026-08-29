import { useNavigate } from '@tanstack/react-router'
import { LiveButton } from '#/components/ui/live-button'
import { BlurFade } from '#/components/ui/blur-fade'
import { Meteors } from '#/components/ui/meteors'

export function CtaSection() {
  const navigate = useNavigate()

  return (
    <section className="relative z-30 w-full bg-black py-12 sm:py-16 md:py-20 px-5 sm:px-8 lg:px-12 selection:bg-[#FF5E4D] selection:text-white">
      <div className="mx-auto w-full max-w-7xl">
        <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] bg-[#222222] px-6 py-16 sm:px-12 sm:py-20 md:px-16 md:py-24 text-center shadow-2xl">
          <Meteors number={10} className="opacity-80" />
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-[36rem] rounded-full bg-white/[0.03] blur-[80px]" />

          <div className="relative mx-auto max-w-3xl space-y-5 sm:space-y-6">
            <BlurFade inView delay={0.05} direction="up">
              <h2 className="type-cta text-[#E5E2E1]">
                Ready to Accelerate Your Journey?
              </h2>
            </BlurFade>

            <BlurFade inView delay={0.12} direction="up">
              <p className="type-lead mx-auto max-w-2xl text-[#EBBBB4]">
                Book a session and leave with a clear, engineered plan for what&apos;s next — no
                guesswork, no fluff.
              </p>
            </BlurFade>

            <BlurFade inView delay={0.2} direction="up" className="pt-3 sm:pt-4 flex justify-center">
              <LiveButton type="button" onClick={() => navigate({ to: '/book' })}>
                Book a Strategy Session
              </LiveButton>
            </BlurFade>
          </div>
        </div>
      </div>
    </section>
  )
}
