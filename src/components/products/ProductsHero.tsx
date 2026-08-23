import { ArrowRight } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { RetroGrid } from '#/components/ui/retro-grid'
import { LiveButton } from '#/components/ui/live-button'
import { TextReveal, FadeLine } from '#/components/ui/text-reveal'
import { PRODUCTS } from '#/lib/products'

export function ProductsHero() {
  return (
    <section className="relative z-10 w-full min-h-[calc(100vh-5rem)] flex flex-col justify-center overflow-hidden bg-black text-white pt-36 sm:pt-40 md:pt-48 pb-16 sm:pb-24 px-5 sm:px-8 lg:px-12">
      <RetroGrid className="opacity-70" />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 h-[28rem] w-[40rem] rounded-full bg-[#FF5E4D]/10 blur-[120px]"
      />

      <div className="relative mx-auto w-full max-w-7xl">
        <FadeLine>
          <div className="inline-flex items-center rounded-full border border-[#42221E]/80 bg-[#1A1211]/80 px-4 py-1.5 backdrop-blur-sm mb-6 sm:mb-8">
            <span className="text-[11px] sm:text-xs font-semibold tracking-[0.18em] uppercase text-[#E7978B]">
              Product Suite
            </span>
          </div>
        </FadeLine>

        <TextReveal
          as="h1"
          className="font-hanken text-5xl sm:text-6xl md:text-7xl lg:text-[5.25rem] xl:text-[5.75rem] font-extrabold tracking-tight leading-[1.05] text-[#E5E2E1]"
          delay={0.05}
        >
          Software that runs the business.
        </TextReveal>

        <FadeLine delay={0.28}>
          <p className="mt-6 sm:mt-7 max-w-2xl sm:max-w-3xl text-base sm:text-lg md:text-[1.125rem] font-normal leading-relaxed text-[#EBBBB4]">
            Three production-grade products from Vizualabs — an autonomous business AI agent, a
            restaurant POS built for service speed, and a healthcare AI agent for scheduling,
            queues, and triage.
          </p>
        </FadeLine>

        <FadeLine delay={0.38}>
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4 sm:gap-5">
            <LiveButton href="#products">
              <span className="inline-flex items-center gap-2">
                Explore products
                <ArrowRight className="h-4 w-4 stroke-[2.5]" />
              </span>
            </LiveButton>
            <Link
              to="/contact"
              hash="contact"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-zinc-700/80 bg-zinc-950/40 px-7 py-3 text-sm sm:text-base font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:border-zinc-500 hover:bg-white/[0.06] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8A6B] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Book a demo
            </Link>
          </div>
        </FadeLine>

        <FadeLine delay={0.48}>
          <ul className="mt-14 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {PRODUCTS.map((product) => (
              <li key={product.id}>
                <a
                  href={`#${product.id}`}
                  className="group flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 sm:px-6 sm:py-5 backdrop-blur-sm transition-all duration-300 hover:border-[#FF5E4D]/40 hover:bg-white/[0.05] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8A6B]"
                >
                  <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#FF5E4D]/90">
                    {product.number} · {product.category}
                  </span>
                  <span className="font-hanken text-xl sm:text-2xl font-bold text-[#E5E2E1] group-hover:text-white transition-colors">
                    {product.name}
                  </span>
                  <span className="text-sm text-[#EBBBB4]/85 leading-snug">
                    {product.tagline}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </FadeLine>
      </div>
    </section>
  )
}
