import { ArrowUpRight } from 'lucide-react'
import { Safari } from '#/components/ui/safari'

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
    url: 'dispatch.vizualabs.app',
    preview: 'fleet' as const,
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
    url: 'support.vizualabs.app',
    preview: 'support' as const,
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
    url: 'inventory.vizualabs.app',
    preview: 'inventory' as const,
  },
]

function CasePreview({ kind }: { kind: (typeof CASE_STUDIES)[number]['preview'] }) {
  if (kind === 'fleet') {
    return (
      <div className="absolute inset-0 flex flex-col gap-2 p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <div className="h-2.5 w-24 rounded-full bg-white/15" />
          <div className="h-2.5 w-14 rounded-full bg-[#FF5E4D]/50" />
        </div>
        <div className="grid flex-1 grid-cols-3 gap-2">
          <div className="col-span-2 rounded-lg border border-white/8 bg-[#161618] p-2">
            <div className="mb-2 h-2 w-16 rounded bg-white/10" />
            <div className="grid h-[calc(100%-1rem)] grid-cols-4 grid-rows-3 gap-1.5">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-sm bg-white/[0.04]"
                  style={{
                    boxShadow:
                      i % 5 === 0
                        ? 'inset 0 0 0 1px rgba(255,94,77,0.45)'
                        : undefined,
                  }}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            {[72, 48, 88].map((w, i) => (
              <div
                key={i}
                className="flex-1 rounded-lg border border-white/8 bg-[#161618] p-2"
              >
                <div className="h-1.5 w-10 rounded bg-white/10" />
                <div
                  className="mt-2 h-1.5 rounded-full bg-[#FF5E4D]/40"
                  style={{ width: `${w}%` }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (kind === 'support') {
    return (
      <div className="absolute inset-0 flex gap-2 p-3 sm:p-4">
        <div className="w-[32%] space-y-1.5 rounded-lg border border-white/8 bg-[#161618] p-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`rounded-md px-2 py-1.5 ${i === 2 ? 'bg-[#FF5E4D]/15' : 'bg-white/[0.03]'}`}
            >
              <div className="h-1.5 w-[70%] rounded bg-white/15" />
              <div className="mt-1 h-1 w-[45%] rounded bg-white/8" />
            </div>
          ))}
        </div>
        <div className="flex flex-1 flex-col rounded-lg border border-white/8 bg-[#161618] p-2.5">
          <div className="mb-2 h-2 w-28 rounded bg-white/12" />
          <div className="space-y-2">
            <div className="ml-auto max-w-[75%] rounded-lg rounded-br-sm bg-[#FF5E4D]/25 px-2.5 py-2">
              <div className="h-1.5 w-full rounded bg-white/25" />
              <div className="mt-1 h-1.5 w-[60%] rounded bg-white/15" />
            </div>
            <div className="max-w-[80%] rounded-lg rounded-bl-sm bg-white/[0.06] px-2.5 py-2">
              <div className="h-1.5 w-full rounded bg-white/15" />
              <div className="mt-1 h-1.5 w-[80%] rounded bg-white/10" />
              <div className="mt-1 h-1.5 w-[40%] rounded bg-white/8" />
            </div>
          </div>
          <div className="mt-auto flex gap-1.5 pt-2">
            <div className="h-7 flex-1 rounded-md border border-white/10 bg-[#0e0e10]" />
            <div className="h-7 w-7 rounded-md bg-[#FF5E4D]/70" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute inset-0 flex flex-col gap-2 p-3 sm:p-4">
      <div className="flex gap-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex-1 rounded-lg border border-white/8 bg-[#161618] p-2.5"
          >
            <div className="h-1.5 w-12 rounded bg-white/12" />
            <div className="mt-2 font-hanken text-lg font-semibold text-white/80 sm:text-xl">
              {i === 1 ? '98%' : i === 2 ? '12' : '4.2k'}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-1 gap-2">
        <div className="flex-[1.4] rounded-lg border border-white/8 bg-[#161618] p-2.5">
          <div className="mb-2 h-1.5 w-20 rounded bg-white/12" />
          <div className="flex h-[calc(100%-1rem)] items-end gap-1.5 px-1 pb-1">
            {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-sm bg-gradient-to-t from-[#FF5E4D]/70 to-[#FF5E4D]/25"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
        <div className="flex-1 space-y-1.5 rounded-lg border border-white/8 bg-[#161618] p-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2 rounded-md bg-white/[0.03] px-2 py-1.5">
              <div className="size-4 rounded bg-[#FF5E4D]/30" />
              <div className="h-1.5 flex-1 rounded bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function CaseStudies() {
  return (
    <section className="relative w-full bg-black px-5 pb-24 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl space-y-8 sm:space-y-10">
        {CASE_STUDIES.map((study) => (
          <article
            key={study.title}
            className="group overflow-hidden rounded-[2rem] border border-white/10 bg-[#141414] transition-colors hover:border-[#FF5E4D]/30"
          >
            <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-[#FF5E4D]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#FF5E4D]">
                    {study.tag}
                  </span>
                  <span className="text-xs font-medium uppercase tracking-wide text-white/40">
                    {study.client}
                  </span>
                </div>

                <h2 className="mt-4 font-hanken text-xl font-bold text-white sm:text-2xl">
                  {study.title}
                </h2>

                <div className="mt-5 grid gap-5 sm:grid-cols-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-white/40">
                      Problem
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/70">{study.problem}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-white/40">
                      What we built
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/70">{study.approach}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-white/40">
                      Outcome
                    </p>
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
              </div>

              <div className="border-t border-white/8 bg-[#0f0f10] p-5 sm:p-6 lg:border-t-0 lg:border-l lg:border-white/8">
                <Safari url={study.url} className="max-w-lg lg:ml-auto">
                  <CasePreview kind={study.preview} />
                </Safari>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
