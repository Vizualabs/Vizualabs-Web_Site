import { Marquee } from '#/components/ui/marquee'
import { MagicCard } from '#/components/ui/magic-card'
import { BlurFade } from '#/components/ui/blur-fade'

interface Testimonial {
  quote: string
  name: string
  role: string
  company?: string
  initials: string
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'Vizualabs has been a reliable and efficient partner for our IT solutions. Their responsiveness, attention to detail, and ability to deliver high-quality work within deadlines were impressive. The team’s commitment to excellence and customer satisfaction made the entire collaboration smooth and productive.',
    name: 'HaborLine Imports PVT LTD',
    role: 'Client',
    initials: 'HI',
  },
  {
    quote:
      'We had an excellent experience working with Vizualabs for our IT requirements. Their team demonstrated strong technical expertise, creativity, and a clear understanding of our expectations. The support provided throughout the project was highly professional, timely, and solution-oriented. We truly appreciate their dedication and outstanding service.',
    name: 'Veritas International PVT LTD',
    role: 'Client',
    initials: 'VI',
  },
  {
    quote:
      'Top-notch IT expertise! They handled our issues smoothly and efficiently. The team was professional, knowledgeable, and delivered a seamless transition. A fantastic IT partner.',
    name: 'Manoj Rathnayake',
    role: 'Partner',
    company: 'Reliance',
    initials: 'MR',
  },
  {
    quote:
      'I sincerely appreciate the dedicated efforts of the Vizualabs team in bringing this masterpiece to life. Their exceptional work on the website, with its stunning graphics and thoughtfully designed layout, perfectly aligns with my architectural vision while captivating clients. I highly recommend them for their outstanding creativity and professionalism.',
    name: 'Chamara Liyanage',
    role: 'Chartered Architect, Principal Architect',
    company: 'CLCA Associates',
    initials: 'CL',
  },
  {
    quote:
      'We are extremely grateful to have worked with Vizualabs as our official tech partner for our concert. Their team handled our entire ticket management system and technical operations with outstanding professionalism and precision. From start to finish, Vizualabs delivered a seamless, error-free experience ensuring smooth ticketing, fast customer support, reliable scanning systems, and perfect technical coordination throughout the event. Their attention to detail, quick problem-solving, and dedication to delivering the best possible outcome truly stood out. Thanks to Vizualabs, our event ran flawlessly, and our audience enjoyed a smooth entry and a great overall experience. We highly recommend Vizualabs to anyone looking for a trusted, professional, and top-tier technical partner for events of any scale. 100% recommended. Exceptional service. Reliable team.',
    name: 'Shanuka Marasinghe',
    role: 'Founder and CEO',
    company: 'Wenas Entertainments',
    initials: 'SM',
  },
]

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const attribution = testimonial.company
    ? `${testimonial.role}, ${testimonial.company}`
    : testimonial.role

  return (
    <MagicCard
      className="w-[min(85vw,340px)] sm:w-[380px] md:w-[400px] shrink-0 rounded-2xl bg-[#121212]"
      gradientFrom="#FF5E4D"
      gradientTo="#FF8A6B"
      gradientColor="#2a1512"
    >
      <div className="flex h-full min-h-[280px] sm:min-h-[300px] flex-col justify-between p-6 sm:p-7 md:p-8">
        <p className="text-[0.95rem] sm:text-base md:text-lg font-normal leading-relaxed text-[#E5E2E1] line-clamp-8 sm:line-clamp-9">
          &ldquo;{testimonial.quote}&rdquo;
        </p>

        <div className="mt-6 sm:mt-8 flex items-center gap-3 pt-5 sm:pt-6 border-t border-white/10 min-w-0">
          <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#1c1c1c] text-[#FF5E4D] font-hanken font-bold text-sm">
            {testimonial.initials}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium text-[#E5E2E1] truncate">{testimonial.name}</div>
            <div className="text-xs text-[#E5E2E1]/50 truncate">{attribution}</div>
          </div>
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
            What clients say after we ship
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
