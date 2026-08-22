import { useRef } from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { MagicCard } from '#/components/ui/magic-card'
import { BorderBeam } from '#/components/ui/border-beam'
import { BlurFade } from '#/components/ui/blur-fade'
import { BentoGrid } from '#/components/ui/bento-grid'
import { AnimatedBeam } from '#/components/ui/animated-beam'
import { Safari } from '#/components/ui/safari'
import { TextReveal, FadeLine } from '#/components/ui/text-reveal'
import { cn } from '#/lib/cn'
import { PRODUCTS, type Product } from '#/lib/products'

function OdeasyBeamDiagram() {
  const containerRef = useRef<HTMLDivElement>(null)
  const crmRef = useRef<HTMLDivElement>(null)
  const agentRef = useRef<HTMLDivElement>(null)
  const opsRef = useRef<HTMLDivElement>(null)
  const biRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={containerRef}
      className="relative flex h-full min-h-[220px] w-full items-center justify-center px-4 py-6"
    >
      <div className="relative z-10 grid w-full max-w-md grid-cols-3 gap-6 place-items-center">
        <div
          ref={crmRef}
          className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-[#1a1a1a] text-[10px] font-semibold uppercase tracking-wider text-[#EBBBB4]"
        >
          CRM
        </div>
        <div
          ref={agentRef}
          className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#FF5E4D]/45 bg-[#2a1512] text-xs font-bold text-[#FF8A6B] shadow-[0_0_32px_-8px_rgba(255,94,77,0.55)]"
        >
          AI
        </div>
        <div
          ref={opsRef}
          className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-[#1a1a1a] text-[10px] font-semibold uppercase tracking-wider text-[#EBBBB4]"
        >
          Ops
        </div>
        <div className="col-span-3 flex justify-center">
          <div
            ref={biRef}
            className="flex h-12 items-center justify-center rounded-full border border-white/12 bg-black/50 px-5 text-[11px] font-medium tracking-wide text-[#E5E2E1]"
          >
            Business Intelligence
          </div>
        </div>
      </div>

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={crmRef}
        toRef={agentRef}
        curvature={-20}
        duration={3.2}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={opsRef}
        toRef={agentRef}
        curvature={20}
        duration={3.4}
        reverse
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={agentRef}
        toRef={biRef}
        curvature={0}
        duration={2.8}
      />
    </div>
  )
}

function DineMateMock() {
  return (
    <div className="flex h-full min-h-[220px] flex-col gap-3 p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wide text-[#E5E2E1]">Table 12 · Main</span>
        <span className="rounded-full bg-[#FF5E4D]/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#FF8A6B]">
          Firing
        </span>
      </div>
      <div className="grid flex-1 grid-cols-2 gap-2">
        {[
          { title: 'Grilled Salmon', meta: 'Station A · 4:12', hot: true },
          { title: 'Truffle Pasta', meta: 'Station B · 2:40', hot: false },
          { title: 'House Salad', meta: 'Cold · Ready', hot: false },
          { title: 'Espresso', meta: 'Bar · Hold', hot: false },
        ].map((ticket) => (
          <div
            key={ticket.title}
            className={cn(
              'rounded-xl border p-3 transition-colors',
              ticket.hot
                ? 'border-[#FF5E4D]/40 bg-[#2a1512]/80'
                : 'border-white/10 bg-white/[0.03]',
            )}
          >
            <p className="text-xs font-semibold text-[#E5E2E1]">{ticket.title}</p>
            <p className="mt-1 text-[10px] text-[#EBBBB4]/80">{ticket.meta}</p>
          </div>
        ))}
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-[#FF5E4D] to-[#FF8A6B]" />
      </div>
    </div>
  )
}

function DocChannelingMock() {
  return (
    <div className="flex h-full min-h-[220px] flex-col gap-3 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-[#E5E2E1]">Live queue · Cardiology</span>
        <span className="text-[10px] font-medium text-[#FFB4A8]">ETA 12 min</span>
      </div>
      <ul className="flex flex-1 flex-col gap-2">
        {[
          { name: 'A. Perera', status: 'In consult', tone: 'active' },
          { name: 'S. Fernando', status: 'Triage flagged', tone: 'alert' },
          { name: 'R. Jayasuriya', status: 'Checked in', tone: 'wait' },
          { name: 'M. Silva', status: 'Scheduled 3:40', tone: 'wait' },
        ].map((row) => (
          <li
            key={row.name}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5"
          >
            <span className="text-xs font-medium text-[#E5E2E1]">{row.name}</span>
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                row.tone === 'active' && 'bg-emerald-500/15 text-emerald-300',
                row.tone === 'alert' && 'bg-[#FF5E4D]/20 text-[#FF8A6B]',
                row.tone === 'wait' && 'bg-white/10 text-[#EBBBB4]',
              )}
            >
              {row.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ProductVisual({ product }: { product: Product }) {
  if (product.id === 'odeasy') return <OdeasyBeamDiagram />
  if (product.id === 'dine-mate') return <DineMateMock />
  return <DocChannelingMock />
}

function ProductSection({ product, index }: { product: Product; index: number }) {
  const reverse = index % 2 === 1

  return (
    <section
      id={product.id}
      className="relative scroll-mt-28 border-t border-white/[0.06] py-16 sm:py-20 md:py-28"
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
        <div
          className={cn(
            'grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12',
            reverse && 'lg:[&>*:first-child]:order-2',
          )}
        >
          <div className="lg:col-span-5">
            <BlurFade delay={0.05}>
              <p className="text-[11px] sm:text-xs font-semibold tracking-[0.18em] uppercase text-[#FF5E4D]">
                Product {product.number} · {product.category}
              </p>
            </BlurFade>
            <TextReveal
              as="h2"
              delay={0.08}
              className="mt-3 font-hanken text-4xl sm:text-5xl md:text-[3.25rem] font-extrabold tracking-tight text-[#E5E2E1]"
            >
              {product.name}
            </TextReveal>
            <FadeLine delay={0.18}>
              <p className="mt-3 text-lg sm:text-xl font-medium text-[#FFB4A8]">
                {product.tagline}
              </p>
            </FadeLine>
            <FadeLine delay={0.24}>
              <p className="mt-5 text-base sm:text-[1.05rem] leading-relaxed text-[#EBBBB4]">
                {product.description}
              </p>
            </FadeLine>

            <FadeLine delay={0.3}>
              <ul className="mt-6 flex flex-wrap gap-2">
                {product.highlights.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs sm:text-sm text-[#E5E2E1]/90"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </FadeLine>

            <FadeLine delay={0.36}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/contact"
                  hash="contact"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#FF5540] px-6 py-3 text-sm font-bold text-zinc-950 shadow-md shadow-[#FF5540]/20 transition-all duration-200 hover:bg-[#FF422A] hover:-translate-y-0.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8A6B] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  Request {product.name} demo
                  <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                </Link>
                <a
                  href="#capabilities"
                  className="inline-flex min-h-11 items-center rounded-full border border-zinc-700/80 px-6 py-3 text-sm font-semibold text-white/90 transition-all duration-200 hover:border-zinc-500 hover:bg-white/[0.04] cursor-pointer"
                >
                  See capabilities
                </a>
              </div>
            </FadeLine>

            <FadeLine delay={0.42}>
              <dl className="mt-10 grid grid-cols-3 gap-3">
                {product.metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-2xl border border-white/10 bg-[#121212]/80 px-3 py-4 text-center"
                  >
                    <dt className="sr-only">{metric.label}</dt>
                    <dd className="font-hanken text-xl sm:text-2xl font-bold text-[#E5E2E1]">
                      {metric.value}
                    </dd>
                    <p className="mt-1 text-[10px] sm:text-[11px] leading-snug text-[#EBBBB4]/80">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </dl>
            </FadeLine>
          </div>

          <div className="lg:col-span-7">
            <BlurFade delay={0.12} className="h-full">
              <div className="relative overflow-hidden rounded-[1.75rem] sm:rounded-[2rem]">
                <MagicCard className="rounded-[inherit] bg-[#0c0c0c]">
                  <div className="relative p-3 sm:p-4 md:p-5">
                    <Safari
                      url={product.mockUrl}
                      className="w-full overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a]"
                    >
                      <div
                        className="absolute inset-0 overflow-hidden"
                        style={{
                          background: `radial-gradient(ellipse 70% 50% at 50% 0%, ${product.accentSoft}, transparent 70%)`,
                        }}
                      >
                        <ProductVisual product={product} />
                      </div>
                    </Safari>
                    <BorderBeam
                      size={80}
                      duration={9}
                      delay={index * 0.6}
                      colorFrom={product.accent}
                      colorTo="#FF8A6B"
                    />
                  </div>
                </MagicCard>
              </div>
            </BlurFade>
          </div>
        </div>

        <BlurFade delay={0.15} className="mt-10 sm:mt-12">
          <BentoGrid className="lg:auto-rows-[minmax(180px,auto)]">
            {product.features.map((feature, featureIndex) => {
              const Icon = feature.icon
              const span =
                featureIndex === 0
                  ? 'lg:col-span-2'
                  : featureIndex === 3
                    ? 'lg:col-span-2'
                    : 'lg:col-span-1'

              return (
                <div
                  key={feature.title}
                  className={cn(
                    'group relative overflow-hidden rounded-2xl border border-white/10 bg-[#141414] p-5 sm:p-6 transition-colors duration-300 hover:border-[#FF5E4D]/35',
                    span,
                  )}
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                    style={{ background: product.accentSoft }}
                  />
                  <div className="relative">
                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/40 text-[#FFB4A8]">
                      <Icon className="h-5 w-5" aria-hidden />
                    </div>
                    <h3 className="font-hanken text-lg sm:text-xl font-bold text-[#E5E2E1]">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm sm:text-[0.95rem] leading-relaxed text-[#EBBBB4]/90">
                      {feature.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </BentoGrid>
        </BlurFade>
      </div>
    </section>
  )
}

export function ProductShowcase() {
  return (
    <div id="products" className="relative bg-black">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 pt-6 sm:pt-8">
        <FadeLine>
          <div className="inline-flex items-center gap-2 text-[#FF8A6B]">
            <Sparkles className="h-4 w-4" aria-hidden />
            <span className="text-[11px] sm:text-xs font-semibold tracking-[0.16em] uppercase">
              Deep dive
            </span>
          </div>
        </FadeLine>
        <TextReveal
          as="h2"
          className="mt-3 max-w-3xl font-hanken text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#E5E2E1]"
        >
          Three products. One engineering standard.
        </TextReveal>
      </div>

      {PRODUCTS.map((product, index) => (
        <ProductSection key={product.id} product={product} index={index} />
      ))}
    </div>
  )
}
