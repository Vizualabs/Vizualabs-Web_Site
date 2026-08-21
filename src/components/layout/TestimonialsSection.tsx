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
    <div className="w-[340px] sm:w-[400px] shrink-0 flex flex-col justify-between rounded-2xl border border-white/10 bg-[#121212] p-7 sm:p-8">
      <p className="text-base sm:text-lg font-normal leading-relaxed text-[#E5E2E1]">
        &ldquo;{testimonial.quote}&rdquo;
      </p>

      <div className="mt-8 flex items-center justify-between gap-4 pt-6 border-t border-white/10">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#1c1c1c] text-[#FF5E4D] font-hanken font-bold text-sm">
            {testimonial.initials}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium text-[#E5E2E1] truncate">{testimonial.name}</div>
            <div className="text-xs text-[#E5E2E1]/50 truncate">
              {testimonial.role}, {testimonial.company}
            </div>
          </div>
        </div>

        <span className="shrink-0 text-[11px] font-normal tracking-wide text-[#FF5E4D] whitespace-nowrap">
          {testimonial.metric}
        </span>
      </div>
    </div>
  )
}

function TestimonialGroup({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div className="testimonial-marquee-group gap-6 pr-6" aria-hidden={ariaHidden}>
      {TESTIMONIALS.map((testimonial, i) => (
        <TestimonialCard key={`${testimonial.name}-${i}`} testimonial={testimonial} />
      ))}
    </div>
  )
}

export function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="relative z-30 w-full bg-[#080808] py-20 sm:py-24 border-t border-white/10 text-white selection:bg-[#FF5E4D] selection:text-white overflow-hidden"
    >
      <div className="pointer-events-none absolute top-1/3 left-1/4 h-96 w-96 rounded-full bg-[#FF5E4D]/5 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-12 mb-12 sm:mb-14">
        <span className="text-[11px] sm:text-xs font-normal tracking-[0.2em] text-[#FF5E4D] uppercase block mb-3.5">
          Proof, Not Promises
        </span>
        <h2 className="text-4xl sm:text-5xl lg:text-[3.6rem] font-normal tracking-tight text-[#E5E2E1] leading-tight max-w-3xl">
          What changed after we shipped
        </h2>
      </div>

      <div
        className="relative testimonial-marquee-track"
        style={{ '--testimonial-marquee-duration': '58s' } as React.CSSProperties}
      >
        <TestimonialGroup />
        <TestimonialGroup ariaHidden />
      </div>
    </section>
  )
}
