import { Marquee } from '#/components/ui/marquee'
import { MagicCard } from '#/components/ui/magic-card'
import { BlurFade } from '#/components/ui/blur-fade'

// Illustrative placeholder testimonials — swap for real client quotes
// (with permission to use their name/company) before this section ships live.
interface Testimonial {
  quote: string
  name: string
  role: string
  company: string
  metric: string
  initials: string
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Vizualabs didn't just ship the redesign — they cut our release cycle from six weeks to four days.",
    name: 'Priya Anand',
    role: 'VP Engineering',
    company: 'Meridian Health',
    metric: '6wk → 4d release cycle',
    initials: 'PA',
  },
  {
    quote:
      'We handed them a decade of technical debt. They handed back a system we can actually reason about.',
    name: 'Tomas Herrera',
    role: 'CTO',
    company: 'Northline Logistics',
    metric: '40% fewer prod incidents',
    initials: 'TH',
  },
  {
    quote:
      'The pipeline they built processes claims in under two seconds. Our old system took eleven.',
    name: 'Wren Okafor',
    role: 'Head of Data',
    company: 'Arclight Robotics',
    metric: '11s → 1.8s per claim',
    initials: 'WO',
  },
  {
    quote:
      "Every engineer I've worked with elsewhere talks about scale. This team actually built for it.",
    name: 'Daniel Cho',
    role: 'Founder',
    company: 'Solace Systems',
    metric: '3x traffic, zero downtime',
    initials: 'DC',
  },
  {
    quote:
      "Security audit came back clean on the first pass — first time that's happened in five vendors.",
    name: 'Lena Marchetti',
    role: 'CISO',
    company: 'Fenwick & Cole Capital',
    metric: '0 critical findings',
    initials: 'LM',
  },
  {
    quote:
      'They embedded with our team for two weeks before writing a line of code. That discipline shows in everything they shipped.',
    name: 'Aiden Fletcher',
    role: 'Product Lead',
    company: 'Ridgeline Analytics',
    metric: '18-day discovery-to-deploy',
    initials: 'AF',
  },
]

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <MagicCard
      className="w-[min(85vw,340px)] sm:w-[380px] md:w-[400px] shrink-0 rounded-2xl bg-[#121212]"
      gradientFrom="#FF5E4D"
      gradientTo="#FF8A6B"
      gradientColor="#2a1512"
    >
      <div className="flex h-full min-h-[240px] sm:min-h-[260px] flex-col justify-between p-6 sm:p-7 md:p-8">
        <p className="text-[0.95rem] sm:text-base md:text-lg font-normal leading-relaxed text-[#E5E2E1]">
          &ldquo;{testimonial.quote}&rdquo;
        </p>

        <div className="mt-6 sm:mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 pt-5 sm:pt-6 border-t border-white/10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#1c1c1c] text-[#FF5E4D] font-hanken font-bold text-sm">
              {testimonial.initials}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-[#E5E2E1] truncate">{testimonial.name}</div>
              <div className="text-xs text-[#E5E2E1]/50 truncate">
                {testimonial.role}, {testimonial.company}
              </div>
            </div>
          </div>

          <span className="shrink-0 self-start sm:self-auto rounded-full border border-[#FF5E4D]/25 bg-[#FF5E4D]/10 px-2.5 py-1 text-[10px] sm:text-[11px] font-normal tracking-wide text-[#FF5E4D] whitespace-nowrap">
            {testimonial.metric}
          </span>
        </div>
      </div>
    </MagicCard>
  )
}

export function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="relative z-30 w-full bg-[#080808] py-16 sm:py-20 md:py-24 border-t border-white/10 text-white selection:bg-[#FF5E4D] selection:text-white overflow-hidden"
    >
      <div className="pointer-events-none absolute top-1/3 left-1/4 h-64 w-64 sm:h-96 sm:w-96 rounded-full bg-[#FF5E4D]/5 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 md:px-12 mb-10 sm:mb-12 md:mb-14">
        <BlurFade inView delay={0.05} direction="up">
          <span className="text-[11px] sm:text-xs font-normal tracking-[0.2em] text-[#FF5E4D] uppercase block mb-3.5">
            Proof, Not Promises
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.6rem] font-normal tracking-tight text-[#E5E2E1] leading-tight max-w-3xl">
            What changed after we shipped
          </h2>
        </BlurFade>
      </div>

      <div className="relative w-full overflow-hidden motion-reduce:hidden">
        <Marquee
          pauseOnHover
          repeat={3}
          className="[--duration:55s] [--gap:1rem] sm:[--gap:1.5rem]"
        >
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.name} testimonial={t} />
          ))}
        </Marquee>

        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 md:w-24 bg-gradient-to-r from-[#080808] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 md:w-24 bg-gradient-to-l from-[#080808] to-transparent" />
      </div>

      <ul className="mx-auto hidden max-w-7xl grid-cols-1 gap-4 px-5 motion-reduce:grid sm:motion-reduce:grid-cols-2 sm:px-8 lg:motion-reduce:grid-cols-3 md:px-12">
        {TESTIMONIALS.map((t) => (
          <li key={`static-${t.name}`}>
            <TestimonialCard testimonial={t} />
          </li>
        ))}
      </ul>
    </section>
  )
}
