import { Marquee } from '#/components/ui/marquee'
import { BlurFade } from '#/components/ui/blur-fade'

const CAPABILITIES = [
  'Autonomous agents',
  'Kitchen display systems',
  'Patient queue intelligence',
  'Workflow orchestration',
  'Real-time POS sync',
  'Digital triage',
  'Business intelligence',
  'Appointment scheduling',
  'Multi-station ops',
  'Audit-ready actions',
  'Clinic coordination',
  'Floor-to-kitchen control',
]

export function ProductsCapabilitiesMarquee() {
  return (
    <section
      id="capabilities"
      aria-label="Product capabilities"
      className="relative scroll-mt-24 border-y border-white/[0.06] bg-black py-10 sm:py-14 overflow-hidden"
    >
      <BlurFade>
        <p className="mb-6 sm:mb-8 px-4 text-center text-[10px] sm:text-xs font-normal tracking-[0.2em] text-white/35 uppercase">
          Built into the Vizualabs product stack
        </p>
      </BlurFade>

      <div className="relative motion-reduce:hidden">
        <Marquee pauseOnHover repeat={3} className="[--duration:42s] [--gap:1rem] py-1">
          {CAPABILITIES.map((item) => (
            <span
              key={item}
              className="mx-1 inline-flex shrink-0 items-center rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-[#EBBBB4]/90"
            >
              {item}
            </span>
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-20 bg-gradient-to-r from-black to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-20 bg-gradient-to-l from-black to-transparent" />
      </div>

      <ul className="hidden motion-reduce:flex motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-2 motion-reduce:px-4">
        {CAPABILITIES.map((item) => (
          <li
            key={`static-${item}`}
            className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-[#EBBBB4]/90"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}
