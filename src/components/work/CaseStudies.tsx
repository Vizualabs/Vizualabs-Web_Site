import { ArrowUpRight } from 'lucide-react'

const CASE_STUDIES = [
  {
    tag: 'Custom ERP Development',
    industry: 'Hospitality Equipment Rental',
    title:
      'Streamlining operations for a hotel equipment rental business with a custom ERP system',
    challengeIntro:
      'A hotel equipment (cutlery, crockery, and event supplies) rental business was running its entire operation manually. Without a centralized system, the company faced three critical blind spots:',
    challengePoints: [
      'No inventory visibility — staff had no accurate way to track what stock was available, out on rental, damaged, or missing.',
      'No income/expense tracking — revenue and costs were not systematically recorded, making profitability difficult to assess.',
      'No outstanding payment tracking — there was no reliable way to know which clients owed money or how much, leading to missed collections and cash flow uncertainty.',
    ],
    challengeClose:
      'As the business scaled, these gaps were compounding — costing the company both revenue and operational control.',
    solutionIntro:
      'Vizualabs designed and built a custom ERP system tailored specifically to the rental business model, covering the full operational cycle:',
    solutionPoints: [
      'Inventory management — real-time stock tracking across categories, with visibility into what’s in the warehouse, out on rental, or under maintenance.',
      'Quotation and delivery workflow — digital quotations, delivery notes, and retention notes to formalize every transaction from booking to return.',
      'Discrepancy and damage tracking — a structured process to record shortages or damage on return, protecting the business from unaccounted losses.',
      'Payments and outstanding tracking — automated tracking of dues, payment history, and outstanding balances per client.',
      'Financial dashboard — a centralized reporting view giving management real-time insight into income, expenses, and profitability.',
    ],
    result:
      'The business moved from a fully manual, error-prone process to a single system of record. Inventory losses became visible and preventable, outstanding payments are now tracked and followed up on systematically, and management gained a real-time financial overview for the first time — turning guesswork into data-driven decision-making.',
  },
  {
    tag: 'POS & Network Infrastructure',
    industry: 'Food & Beverage / Restaurant',
    title:
      'Unifying multi-kitchen operations for a restaurant with a networked POS solution',
    challengeIntro:
      'A growing restaurant operated multiple kitchens that needed to work off a single, synchronized system. Orders, menus, and kitchen routing had to stay consistent across locations in real time — but the existing setup couldn’t reliably connect multiple kitchen stations to one central system, creating the risk of miscommunication, delayed orders, and inconsistent service.',
    challengePoints: [],
    challengeClose: '',
    solutionIntro:
      'Vizualabs implemented a networked POS and ERP solution that connected multiple kitchens under a single, unified system:',
    solutionPoints: [
      'Centralized order routing — orders placed at any point are instantly routed to the correct kitchen station over the network.',
      'Dual/multi-kitchen synchronization — menu items, order status, and kitchen load are kept in sync across all connected kitchens in real time.',
      'Integrated POS, inventory, and accounting — the same system handles point-of-sale, stock levels, HR/payroll, and accounting, giving the restaurant one connected operational backbone instead of siloed tools.',
      'Bilingual system design — built to support both English and Sinhala, ensuring the system was fully usable across the entire staff.',
    ],
    result:
      'The restaurant now runs multiple kitchens as one coordinated operation instead of disconnected stations. Order accuracy and kitchen coordination improved, and management gained a single system covering front-of-house, kitchen operations, and back-office finance.',
  },
  {
    tag: 'AI Solution Development',
    industry: 'Delivery / E-commerce Operations',
    title:
      'Solving missed orders at scale with an AI-powered customer & order management system',
    challengeIntro:
      'A high-volume business was losing thousands of orders every day. Customer inquiries and orders were being handled manually, and the sheer volume made it impossible for a human team to keep up — inquiries went unanswered, orders were missed entirely, and there was no reliable connection between the point of order and the delivery process.',
    challengePoints: [],
    challengeClose: '',
    solutionIntro:
      'Vizualabs built an AI-powered solution to automate the entire customer-to-delivery pipeline:',
    solutionPoints: [
      'AI-driven customer handling — an AI assistant manages incoming customer inquiries automatically, responding instantly instead of queuing behind manual staff capacity.',
      'Automated order collection — orders are captured directly through the AI conversation flow, removing manual data entry and the errors and delays that come with it.',
      'Delivery system integration — collected orders are automatically passed through to the delivery system, closing the gap between order placement and fulfillment without manual handoffs.',
      'Built to scale with volume — designed specifically to handle high daily inquiry and order volume without the bottleneck of a human-only team.',
    ],
    result:
      'The business eliminated the daily loss of orders caused by manual bottlenecks. Customer inquiries are now handled instantly and around the clock, orders flow automatically into delivery, and the business can absorb high order volume without scaling its support team at the same rate.',
  },
  {
    tag: 'Custom HR & Payroll Software',
    industry: 'HR Outsourcing / Business Process Services',
    title:
      'Centralizing multi-client HR operations with an automated payroll & attendance system',
    challengeIntro:
      'An HR solution provider managing payroll, attendance, EPF/ETF, and broader HR processes for multiple client companies was running the entire operation manually. Attendance sheets were collected by hand, and payroll, EPF/ETF calculations, and leave management were all prepared manually for every client — a process that was slow, repetitive, and difficult to scale as the client base grew.',
    challengePoints: [],
    challengeClose: '',
    solutionIntro:
      'Vizualabs built a centralized HR management platform that brought every client’s operations onto a single, connected dashboard:',
    solutionPoints: [
      'Multi-client dashboard — all client companies are managed from one unified system instead of separate manual processes per client.',
      'Fingerprint machine integration — attendance devices across all client sites are connected directly into the system, replacing manual attendance sheet collection with automated, real-time attendance data.',
      'Automated payroll processing — payroll is calculated automatically from attendance and employee data, removing manual computation and reducing errors.',
      'Automated EPF/ETF calculation — statutory EPF/ETF contributions are generated automatically per employee and per client, ensuring accuracy and compliance.',
      'Digital leave management — leave requests, approvals, and balances are tracked within the system instead of manual records.',
    ],
    result:
      'The HR provider eliminated manual data collection and calculation across every stage of the HR process. Attendance is now captured automatically at the source, payroll and EPF/ETF are generated with minimal manual input, and all client accounts are managed from a single dashboard — significantly reducing processing time and optimizing HR operations across their entire client portfolio.',
  },
]

export function CaseStudies() {
  return (
    <section className="relative w-full bg-black px-5 pb-24 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-4xl space-y-8 sm:space-y-10">
        {CASE_STUDIES.map((study) => (
          <article
            key={study.title}
            className="group rounded-[2rem] border border-white/10 bg-[#141414] p-6 sm:p-8 md:p-10 transition-colors hover:border-[#FF5E4D]/30"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[#FF5E4D]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#FF5E4D]">
                {study.tag}
              </span>
              <span className="text-xs font-medium uppercase tracking-wide text-white/40">
                {study.industry}
              </span>
            </div>

            <h2 className="type-card-title mt-5 leading-snug text-white">
              {study.title}
            </h2>

            <div className="mt-8 space-y-8">
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#FF5E4D]">
                  The Challenge
                </h3>
                <p className="mt-3 text-base leading-relaxed text-white/70">
                  {study.challengeIntro}
                </p>
                {study.challengePoints.length > 0 ? (
                  <ul className="mt-4 space-y-2.5 text-base leading-relaxed text-white/70">
                    {study.challengePoints.map((point) => (
                      <li key={point} className="flex gap-3">
                        <span
                          className="mt-2 size-1.5 shrink-0 rounded-full bg-[#FF5E4D]"
                          aria-hidden
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {study.challengeClose ? (
                  <p className="mt-4 text-base leading-relaxed text-white/70">
                    {study.challengeClose}
                  </p>
                ) : null}
              </section>

              <section>
                <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#FF5E4D]">
                  The Solution
                </h3>
                <p className="mt-3 text-base leading-relaxed text-white/70">
                  {study.solutionIntro}
                </p>
                <ul className="mt-4 space-y-2.5 text-base leading-relaxed text-white/70">
                  {study.solutionPoints.map((point) => (
                    <li key={point} className="flex gap-3">
                      <span
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-[#FF5E4D]"
                        aria-hidden
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#FF5E4D]">
                  The Result
                </h3>
                <p className="mt-3 text-base leading-relaxed text-white/70">{study.result}</p>
              </section>
            </div>

            <a
              href="/contact"
              className="mt-8 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-[#FF5E4D] transition-colors hover:text-[#ff7a6b]"
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
