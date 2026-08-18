import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  ArrowUpRight,
  BrainCircuit,
  Check,
  Compass,
  Layers3,
} from 'lucide-react'

interface ServiceItem {
  id: string
  eyebrow: string
  title: string
  description: string
  image: string
  imageAlt: string
  cta: string
  icon: typeof Compass
  points: string[]
}

const services: ServiceItem[] = [
  {
    id: 'product-development',
    eyebrow: '01 / PRODUCT DEVELOPMENT',
    title: 'Product Development',
    description:
      'From first sketch to a product people return to, we turn ambitious ideas into clear, useful digital experiences.',
    image: '/service/image1.webp',
    imageAlt: 'Responsive architecture website displayed across desktop, laptop, and mobile devices',
    cta: 'Ready to scale?',
    icon: Compass,
    points: ['Product strategy and discovery', 'Interface systems that convert', 'Reliable full-stack delivery'],
  },
  {
    id: 'custom-software',
    eyebrow: '02 / CUSTOM SOFTWARE',
    title: 'Custom Software Development',
    description:
      'We build the dependable systems behind complex operations, designed for the speed, security, and scale your team needs.',
    image: '/service/image2.webp',
    imageAlt: 'Custom bakery ecommerce website displayed on a laptop and mobile phone',
    cta: 'Speak to an engineer',
    icon: Layers3,
    points: ['Scalable application architecture', 'Modernization without disruption', 'Observability built in from day one'],
  },
  {
    id: 'ai-solutions',
    eyebrow: '03 / AI SOLUTIONS',
    title: 'AI Solutions',
    description:
      'We make AI practical: connected to your data, shaped around your workflows, and measured against meaningful business outcomes.',
    image: '/service/image3.webp',
    imageAlt: 'Dark digital agency website displayed across laptop, tablet, and mobile devices',
    cta: 'Explore AI integration',
    icon: BrainCircuit,
    points: ['LLM and agent workflow design', 'Predictive intelligence for teams', 'Secure, production-ready integrations'],
  },
]

const panelVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

export function ServicesShowcase() {
  const [activeIndex, setActiveIndex] = useState(0)
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([])
  const activeService = services[activeIndex]
  const ActiveIcon = activeService.icon

  const selectService = (index: number, moveFocus = false) => {
    setActiveIndex(index)
    if (moveFocus) {
      requestAnimationFrame(() => tabsRef.current[index]?.focus())
    }
  }

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex = index

    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      nextIndex = (index + 1) % services.length
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      nextIndex = (index - 1 + services.length) % services.length
    } else if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = services.length - 1
    } else {
      return
    }

    event.preventDefault()
    selectService(nextIndex, true)
  }

  return (
    <section
      id="service-offerings"
      className="relative overflow-hidden border-y border-white/[0.07] bg-[#080808] px-5 py-20 text-white selection:bg-[#FF553E] selection:text-zinc-950 sm:px-8 sm:py-24 lg:px-12 lg:py-32"
    >
      <div className="pointer-events-none absolute -right-48 top-20 h-[28rem] w-[28rem] rounded-full bg-[#FF553E]/[0.06] blur-[130px]" />
      <div className="pointer-events-none absolute -left-48 bottom-0 h-[22rem] w-[22rem] rounded-full bg-[#FF553E]/[0.035] blur-[120px]" />

      <div className="relative mx-auto w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 max-w-2xl sm:mb-14"
        >
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FF8D80]">
            How we help
          </p>
          <h2 className="font-hanken text-4xl font-extrabold leading-[1.04] tracking-tight text-[#E5E2E1] sm:text-5xl lg:text-[4.25rem]">
            Built for the next move.
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-[#EBBBB4]/75 sm:text-base">
            Three ways to move from a strong idea to a system that creates momentum.
            Choose a direction and see what we can build together.
          </p>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-[minmax(17rem,0.72fr)_minmax(0,1.28fr)] lg:gap-8">
          <div
            role="tablist"
            aria-label="Services"
            aria-orientation="vertical"
            className="flex flex-col gap-3"
          >
            {services.map((service, index) => {
              const Icon = service.icon
              const isActive = index === activeIndex

              return (
                <button
                  key={service.id}
                  ref={(element) => {
                    tabsRef.current[index] = element
                  }}
                  id={`${service.id}-tab`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`${service.id}-panel`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => selectService(index)}
                  onKeyDown={(event) => handleTabKeyDown(event, index)}
                  className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition-[border-color,background-color,transform,box-shadow] duration-200 sm:p-6 ${
                    isActive
                      ? 'border-[#FF553E]/75 bg-[#FF553E]/[0.08] shadow-[0_18px_45px_rgba(0,0,0,0.2)]'
                      : 'border-white/10 bg-[#121212] hover:-translate-y-0.5 hover:border-[#FF553E]/40 hover:bg-[#171717]'
                  } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB4A8] focus-visible:ring-offset-4 focus-visible:ring-offset-[#080808]`}
                >
                  <span
                    className={`absolute inset-y-0 left-0 w-1 bg-[#FF553E] transition-transform duration-300 ${
                      isActive ? 'scale-y-100' : 'scale-y-0'
                    }`}
                  />
                  <span className="flex items-start justify-between gap-4">
                    <span>
                      <span className="mb-3 block text-[10px] font-semibold tracking-[0.17em] text-[#FF8D80]">
                        {service.eyebrow}
                      </span>
                      <span className="block font-hanken text-xl font-bold tracking-tight text-[#E5E2E1] sm:text-2xl">
                        {service.title}
                      </span>
                    </span>
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors duration-200 ${
                        isActive
                          ? 'border-[#FF553E]/40 bg-[#FF553E]/15 text-[#FF8D80]'
                          : 'border-white/10 bg-white/[0.04] text-[#EBBBB4]/65 group-hover:border-[#FF553E]/30 group-hover:text-[#FF8D80]'
                      }`}
                    >
                      <Icon className="h-4 w-4" strokeWidth={1.8} />
                    </span>
                  </span>
                  <span className="mt-4 block text-xs leading-relaxed text-[#E5E2E1]/55 sm:text-sm">
                    {index === 0
                      ? 'Shape the experience, then ship it with confidence.'
                      : index === 1
                        ? 'Make complex systems feel clear, fast, and dependable.'
                        : 'Turn useful intelligence into an advantage your team can trust.'}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="relative min-w-0">
            <AnimatePresence initial={false} mode="wait">
              <motion.article
                key={activeService.id}
                id={`${activeService.id}-panel`}
                role="tabpanel"
                aria-labelledby={`${activeService.id}-tab`}
                variants={panelVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden rounded-2xl border border-white/10 bg-[#121212] shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-[#0b0b0b] sm:aspect-[16/8.5]">
                  <img
                    src={activeService.image}
                    alt={activeService.imageAlt}
                    loading={activeIndex === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out motion-safe:hover:scale-[1.02]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/10" />
                  <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#E5E2E1] backdrop-blur-md sm:bottom-5 sm:left-5">
                    <ActiveIcon className="h-3.5 w-3.5 text-[#FF8D80]" strokeWidth={1.8} />
                    {activeService.eyebrow}
                  </div>
                </div>

                <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-end lg:p-10">
                  <div>
                    <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#FF8D80]">
                      A closer look
                    </p>
                    <h3 className="font-hanken text-3xl font-bold leading-tight tracking-tight text-[#E5E2E1] sm:text-4xl">
                      {activeService.title}
                    </h3>
                    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#E5E2E1]/65 sm:text-base">
                      {activeService.description}
                    </p>
                    <ul className="mt-6 grid gap-2 sm:grid-cols-3 lg:max-w-2xl">
                      {activeService.points.map((point) => (
                        <li key={point} className="flex items-start gap-2 text-xs leading-relaxed text-[#EBBBB4]/75">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#FF8D80]" strokeWidth={2.5} />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href={`/contact?service=${activeService.id}`}
                    className="group inline-flex min-h-14 w-full items-center justify-between gap-8 rounded-xl bg-[#FF553E] px-5 py-4 text-sm font-bold text-zinc-950 shadow-[0_10px_30px_rgba(255,85,62,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#FF422A] hover:shadow-[0_14px_36px_rgba(255,85,62,0.3)] active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB4A8] focus-visible:ring-offset-4 focus-visible:ring-offset-[#121212] sm:min-w-56 lg:w-auto lg:min-w-52"
                  >
                    <span>{activeService.cta}</span>
                    <ArrowUpRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2.2} />
                  </a>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
