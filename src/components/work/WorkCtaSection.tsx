import { useNavigate } from '@tanstack/react-router'
import { LiveButton } from '#/components/ui/live-button'
import { Meteors } from '#/components/ui/meteors'

export function WorkCtaSection() {
  const navigate = useNavigate()

  return (
    <section className="relative z-20 w-full bg-black px-5 pb-20 sm:px-8 sm:pb-28 lg:px-12">
      <div className="mx-auto w-full max-w-5xl">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#222222] px-6 py-16 text-center shadow-2xl sm:rounded-[2.5rem] sm:px-12 sm:py-20">
          <Meteors number={10} className="opacity-80" />
          <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-white/[0.03] blur-[80px]" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-hanken text-3xl font-bold tracking-tight text-[#E5E2E1] sm:text-4xl">
              Have a project like this?
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#EBBBB4] sm:text-base">
              Book a session and leave with a clear, engineered plan for what&apos;s next.
            </p>
            <div className="mt-8 flex justify-center">
              <LiveButton type="button" onClick={() => navigate({ to: '/book' })}>
                Book a Strategy Session
              </LiveButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
