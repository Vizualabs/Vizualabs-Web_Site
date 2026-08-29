import type { ReactNode } from 'react'

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string
  updated: string
  children: ReactNode
}) {
  return (
    <section className="relative w-full bg-[#0a0a0a] px-5 pb-20 pt-32 text-[#E5E2E1] selection:bg-[#FF5E4D] selection:text-white sm:px-8 sm:pb-28 sm:pt-40 lg:px-12">
      <div className="pointer-events-none absolute top-1/4 left-1/2 h-[28rem] w-[40rem] -translate-x-1/2 rounded-full bg-[#FF5E4D]/10 blur-[120px]" aria-hidden />
      <div className="relative mx-auto max-w-3xl">
        <p className="type-eyebrow text-[#FF5E4D]/80">
          Vizualabs (Pvt.) Ltd.
        </p>
        <h1 className="type-section mt-4 font-bold text-[#E5E2E1]">{title}</h1>
        <p className="mt-3 text-sm text-[#E5E2E1]/45">Last updated {updated}</p>
        <div className="type-lead mt-10 space-y-8 text-[#E5E2E1]/70">
          {children}
        </div>
      </div>
    </section>
  )
}

export function LegalSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="space-y-3">
      <h2 className="font-hanken text-lg font-semibold tracking-tight text-[#E5E2E1] sm:text-xl">
        {title}
      </h2>
      {children}
    </section>
  )
}
