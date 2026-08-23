import { useNavigate } from '@tanstack/react-router'
import { LiveButton } from '#/components/ui/live-button'
import { BlurFade } from '#/components/ui/blur-fade'
import { Meteors } from '#/components/ui/meteors'

export function ProductsCta() {
  const navigate = useNavigate()

  return (
    <section className="relative z-20 w-full bg-black py-12 sm:py-16 md:py-20 px-5 sm:px-8 lg:px-12 selection:bg-[#EE2E10] selection:text-white">
      <div className="mx-auto w-full max-w-7xl">
        <BlurFade>
          <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] bg-[#181818] px-6 py-16 sm:px-12 sm:py-20 md:px-16 md:py-24 text-center shadow-2xl border border-white/8">
            <Meteors number={10} className="opacity-80" />
            <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-[36rem] rounded-full bg-[#FF5E4D]/10 blur-[90px]" />

            <div className="relative mx-auto max-w-3xl">
              <h2 className="font-hanken text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold tracking-tight leading-tight text-[#E5E2E1]">
                Ready to put a Vizualabs product to work?
              </h2>
              <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg font-normal leading-relaxed text-[#EBBBB4] max-w-2xl mx-auto">
                Whether you need Odeasy, Dine Mate, or Doc Channeling — we&apos;ll walk you through
                a live demo and a rollout plan that fits your operation.
              </p>

              <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4">
                <LiveButton
                  type="button"
                  onClick={() => navigate({ to: '/contact', hash: 'contact' })}
                >
                  Book a product demo
                </LiveButton>

                <a
                  href="/services"
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-white/10 px-6.5 sm:px-7.5 py-3 sm:py-3.5 text-sm sm:text-base font-medium text-[#E5E2E1] backdrop-blur-sm transition-all duration-200 hover:bg-white/15 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  Custom build instead?
                </a>
              </div>
            </div>
          </div>
        </BlurFade>
      </div>
    </section>
  )
}
