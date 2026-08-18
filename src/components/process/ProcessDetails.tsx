import { ClipboardCheck, Code, MessagesSquare } from 'lucide-react'

const DETAIL_CARDS = [
  {
    title: 'Strategic Planning',
    body: 'We map the technical landscape, surface risk early, and define a roadmap the engineering team can actually ship against.',
    icon: ClipboardCheck,
    points: ['Architectural Blueprinting', 'Risk Mitigation Strategy', 'Resource Allocation'],
  },
  {
    title: 'Collaborative Discussion',
    body: 'Transparent workshops keep stakeholders aligned — vision, constraints, and requirements stay in the same conversation.',
    icon: MessagesSquare,
    points: ['Stakeholder Workshops', 'Vision Alignment', 'Requirement Refinement'],
  },
  {
    title: 'Iterative Building',
    body: 'Precision engineering in rapid sprints, with CI/CD and cloud infrastructure that keep quality moving with the product.',
    icon: Code,
    points: ['Agile Development', 'Automated Testing', 'Cloud Infrastructure'],
  },
]

export function ProcessDetails() {
  return (
    <section className="relative z-10 w-full bg-[#131313] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto grid w-full max-w-7xl gap-5 sm:gap-6 md:grid-cols-3">
        {DETAIL_CARDS.map((card) => (
          <article
            key={card.title}
            className="rounded-3xl border border-white/8 bg-[#201f1f] px-6 py-8 sm:px-7 sm:py-9"
          >
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FF5540]/12 text-[#FF5540]">
              <card.icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
            </div>
            <h2 className="font-hanken text-xl sm:text-2xl font-bold tracking-tight text-[#E5E2E1]">
              {card.title}
            </h2>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#EBBBB4]">
              {card.body}
            </p>
            <ul className="mt-6 space-y-2.5">
              {card.points.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-2.5 text-sm text-[#E5E2E1]/80"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#FF5540]" />
                  {point}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}
