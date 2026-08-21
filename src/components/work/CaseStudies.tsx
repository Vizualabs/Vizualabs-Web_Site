import { ArrowUpRight } from 'lucide-react'

// PLACEHOLDER CONTENT — replace with real projects before this page goes
// live to real visitors. None of the clients, problems, or outcomes below
// are real; they exist to preview the page layout only.
const CASE_STUDIES = [
  {
    tag: 'Custom Software',
    client: 'A regional logistics provider',
    title: 'Replacing spreadsheets with real-time fleet dispatch',
    problem:
      'Dispatch ran on spreadsheets and phone calls — drivers found out about jobs late, and nobody had a live view of the fleet.',
    approach:
      'A custom dispatch platform with live GPS tracking, automated job assignment, and a driver mobile app.',
    outcome: 'Dispatch time dropped from hours to minutes; delivery windows became predictable.',
  },
  {
    tag: 'AI Solutions',
    client: 'A B2B SaaS startup',
    title: 'An AI support layer that actually resolves tickets',
    problem:
      'A two-person support team was drowning in repetitive tickets, with first-response times stretching past a day.',
    approach:
      'An AI assistant trained on their docs and ticket history, resolving common questions directly and handing off complex cases to a human with full context.',
    outcome: 'Most routine tickets now resolve without a human touch; the team reclaimed time for the hard cases.',
  },
  {
    tag: 'Product Development',
    client: 'A multi-location retail chain',
    title: 'One inventory system instead of five disconnected ones',
    problem:
      'Every location ran its own point-of-sale setup, so head office had no real-time view of stock or sales.',
    approach:
      'A unified POS and inventory platform with a centralized dashboard, rolled out location by location with zero downtime.',
    outcome: 'Head office gets live inventory across every location; month-end reconciliation went from days to hours.',
  },
]

export function CaseStudies() {
  return (
    <section className="relative w-full bg-black px-5 pb-24 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl space-y-6">
        {CASE_STUDIES.map((study) => (
          <article
            key={study.title}
            className="group rounded-[2rem] border border-white/10 bg-[#141414] p-6 transition-colors hover:border-[#FF5E4D]/30 sm:p-8"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[#FF5E4D]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#FF5E4D]">
                {study.tag}
              </span>
              <span className="text-xs font-medium uppercase tracking-wide text-white/40">{study.client}</span>
            </div>

            <h2 className="mt-4 font-hanken text-xl font-bold text-white sm:text-2xl">{study.title}</h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-white/40">Problem</p>
                <p className="mt-1.5 text-sm leading-relaxed text-white/70">{study.problem}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-white/40">What we built</p>
                <p className="mt-1.5 text-sm leading-relaxed text-white/70">{study.approach}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-white/40">Outcome</p>
                <p className="mt-1.5 text-sm leading-relaxed text-white/70">{study.outcome}</p>
              </div>
            </div>

            <a
              href="/contact#contact"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#FF5E4D] transition-colors hover:text-[#ff7a6b]"
            >
              Discuss a similar project
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}
