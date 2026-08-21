import { Calendar } from 'lucide-react'
import { getCalEmbedUrl } from '#/lib/cal'

/**
 * Full-page Cal.com booking embed — used on /book so mobile gets a normal
 * scrollable page (nav + footer) instead of a cramped modal overlay.
 */
export function BookingSection() {
  const embedUrl = getCalEmbedUrl()

  return (
    <section className="relative isolate overflow-hidden bg-[#0a0a0a] px-4 pb-16 pt-28 text-[#E5E2E1] selection:bg-[#FF5540] selection:text-[#0a0a0a] sm:px-8 sm:pb-24 sm:pt-32 lg:px-16">
      <div className="pointer-events-none absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-[#FF5540]/[0.035] blur-[140px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-[#FF5540]/[0.035] blur-[130px]" />

      <div className="relative mx-auto max-w-3xl">
        <div className="mb-8 flex flex-col items-start gap-4 sm:mb-10 sm:flex-row sm:items-center sm:gap-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#FF5540]/30 bg-[#FF5540]/15 text-[#FF5540]">
            <Calendar className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h1 className="font-hanken text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Book a Strategy Session
            </h1>
            <p className="mt-1.5 text-sm leading-relaxed text-white/55 sm:text-base">
              1-on-1 discovery with Vizualabs engineering leads — pick a time that works for you.
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#121214] shadow-2xl sm:rounded-3xl">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title="Book a strategy session"
              className="block h-[min(720px,calc(100dvh-11rem))] min-h-[560px] w-full border-0 bg-[#121214]"
              loading="lazy"
              allow="payment *"
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 px-6 py-20 text-center sm:px-10">
              <p className="max-w-md text-sm text-white/55 sm:text-base">
                Scheduling isn&apos;t configured yet. In the meantime, reach us directly:
              </p>
              <a
                href="mailto:strategy@vizualabs.tech"
                className="font-semibold text-[#FF5540] underline-offset-4 hover:underline"
              >
                strategy@vizualabs.tech
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
