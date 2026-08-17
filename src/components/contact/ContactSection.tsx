import { useState, useRef, useEffect, type FormEvent } from 'react'
import { SendHorizontal, AtSign, ChevronDown, MapPin, Mail, Check } from 'lucide-react'
import { AnimatePresence, motion, MotionConfig } from 'motion/react'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
}

const SUBJECT_OPTIONS = [
  'Product Development',
  'Custom Software',
  'AI Solutions',
  'Strategic Consulting',
  'Press & Media',
]

type ContactFormData = {
  name: string
  email: string
  subject: string
  message: string
}

const initialFormData: ContactFormData = {
  name: '',
  email: '',
  subject: 'Product Development',
  message: '',
}

const socialLinks = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/vizualabs',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
      </svg>
    ),
  },
  {
    label: 'X',
    href: 'https://x.com/vizualabs',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: 'https://github.com/vizualabs',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
      </svg>
    ),
  },
]

export function ContactSection() {
  const [formData, setFormData] = useState(initialFormData)
  const [submitted, setSubmitted] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleFieldChange = (field: keyof ContactFormData, value: string) => {
    setSubmitted(false)
    setFormData((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <section
      id="contact"
      className="relative isolate overflow-hidden bg-[#0a0a0a] px-6 py-28 text-[#E5E2E1] selection:bg-[#FF5540] selection:text-[#0a0a0a] sm:px-10 sm:py-32 lg:px-16 lg:py-40"
    >
      <div className="pointer-events-none absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-[#FF5540]/[0.035] blur-[140px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-[#FF5540]/[0.035] blur-[130px]" />

      <MotionConfig reducedMotion="user">
        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start lg:gap-16">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.55, ease: EASE }}
            className="max-w-xl"
          >
            <h1 className="font-hanken text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-bold leading-tight tracking-tight text-[#E5E2E1] sm:whitespace-nowrap">
              Initiate Strategic Contact
            </h1>
            <p className="mt-6 max-w-lg text-sm sm:text-base font-light font-[300] leading-relaxed text-[#E5E2E1]/70">
              Ready to accelerate your engineering roadmap? Our team of architects and strategists are standing by.
            </p>

            <div className="mt-12 space-y-7">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#3A3735] bg-[#171615] text-[#FFB4A8]">
                  <MapPin className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
                </div>
                <div className="pt-0.5">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#FFB4A8]">Global Headquarters</p>
                  <address className="mt-1.5 not-italic text-sm sm:text-base leading-relaxed text-[#E5E2E1]">
                    101 Silicon Valley Way, Suite 500
                    <br />
                    San Jose, CA 95110
                  </address>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#3A3735] bg-[#171615] text-[#FFB4A8]">
                  <AtSign className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
                </div>
                <div className="pt-0.5">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#FFB4A8]">Communications</p>
                  <div className="mt-1.5 flex flex-col text-sm sm:text-base leading-relaxed text-[#E5E2E1]">
                    <a className="transition-colors hover:text-[#FFB4A8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5540] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]" href="mailto:strategy@vizualabs.tech">
                      strategy@vizualabs.tech
                    </a>
                    <a className="transition-colors hover:text-[#FFB4A8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5540] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]" href="mailto:press@vizualabs.tech">
                      press@vizualabs.tech
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 border-t border-white/10 pt-7">
              <p className="mb-4 font-geist text-xs font-medium uppercase tracking-[0.16em] text-[#E5E2E1]">Connect with us</p>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Visit Vizualabs on ${social.label}`}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-[#2A2826] text-[#C6C6C7] transition-colors duration-200 hover:border-[#FF5540] hover:bg-[#FF5540]/10 hover:text-[#FF5540] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5540] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
                  >
                    <span className="h-5 w-5">{social.icon}</span>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            className="w-full max-w-[560px] justify-self-end rounded-[20px] border border-[#2A2826] bg-[#171615] p-6 sm:p-8 lg:p-9 shadow-[0_24px_64px_rgba(0,0,0,0.34),0_8px_24px_rgba(0,0,0,0.2)]"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#FFB4A8]">Project inquiry</p>
                <h2 className="mt-1.5 font-hanken text-xl font-bold tracking-tight text-[#E5E2E1] sm:text-2xl">Send a transmission</h2>
              </div>
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[#FFB4A8]" strokeWidth={1.6} aria-hidden="true" />
            </div>

            {submitted ? (
              <div className="flex min-h-[320px] flex-col items-center justify-center text-center" role="status" aria-live="polite">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#FF5540]/40 bg-[#FF5540]/10 text-[#FFB4A8]">
                  <Mail className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mt-5 font-hanken text-2xl font-bold text-[#E5E2E1]">Transmission received.</h3>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#E5E2E1]/60">
                  Our engineering strategists will review your message and be in touch shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-6 min-h-11 rounded-xl border border-[#3A3735] px-5 text-sm font-semibold text-[#E5E2E1] transition-colors hover:border-[#FF5540] hover:text-[#FF5540] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5540] focus-visible:ring-offset-2 focus-visible:ring-offset-[#171615]"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#E5E2E1]/55">
                      Full Name
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      value={formData.name}
                      onChange={(event) => handleFieldChange('name', event.target.value)}
                      placeholder="John Doe"
                      className="h-11 w-full rounded-xl border border-white/10 bg-black/35 px-4 text-sm text-[#E5E2E1] outline-none transition-colors placeholder:text-[#E5E2E1]/30 focus:border-[#FF5540] focus:ring-1 focus:ring-[#FF5540]"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#E5E2E1]/55">
                      Work Email
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={(event) => handleFieldChange('email', event.target.value)}
                      placeholder="john@enterprise.com"
                      className="h-11 w-full rounded-xl border border-white/10 bg-black/35 px-4 text-sm text-[#E5E2E1] outline-none transition-colors placeholder:text-[#E5E2E1]/30 focus:border-[#FF5540] focus:ring-1 focus:ring-[#FF5540]"
                    />
                  </div>
                </div>

                <div ref={dropdownRef} className="relative">
                  <label htmlFor="contact-subject-btn" className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#E5E2E1]/55">
                    Subject of Inquiry
                  </label>
                  <button
                    id="contact-subject-btn"
                    type="button"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className={`flex h-11 w-full items-center justify-between rounded-xl border bg-black/35 px-4 text-sm text-[#E5E2E1] outline-none transition-all duration-200 ${
                      dropdownOpen
                        ? 'border-[#FF5540] ring-1 ring-[#FF5540]'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                    aria-haspopup="listbox"
                    aria-expanded={dropdownOpen}
                  >
                    <span>{formData.subject}</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180 text-[#FF5540]' : 'text-[#E5E2E1]/55'}`}
                      aria-hidden="true"
                    />
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        transition={{ duration: 0.18, ease: EASE }}
                        className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-xl border border-[#3A3735] bg-[#171615] p-1.5 shadow-[0_16px_36px_rgba(0,0,0,0.65),0_4px_12px_rgba(0,0,0,0.4)] backdrop-blur-md"
                        role="listbox"
                      >
                        {SUBJECT_OPTIONS.map((option) => {
                          const isSelected = formData.subject === option
                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() => {
                                handleFieldChange('subject', option)
                                setDropdownOpen(false)
                              }}
                              className={`flex w-full items-center justify-between rounded-lg px-3.5 py-2.5 text-left text-sm transition-colors duration-150 ${
                                isSelected
                                  ? 'bg-[#FF5540]/15 font-medium text-[#FFB4A8]'
                                  : 'text-[#E5E2E1]/85 hover:bg-white/5 hover:text-[#E5E2E1]'
                              }`}
                              role="option"
                              aria-selected={isSelected}
                            >
                              <span>{option}</span>
                              {isSelected && <Check className="h-4 w-4 text-[#FFB4A8]" />}
                            </button>
                          )
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <label htmlFor="contact-message" className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#E5E2E1]/55">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(event) => handleFieldChange('message', event.target.value)}
                    placeholder="Describe your strategic engineering needs..."
                    className="min-h-32 w-full resize-y rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-relaxed text-[#E5E2E1] outline-none transition-colors placeholder:text-[#E5E2E1]/30 focus:border-[#FF5540] focus:ring-1 focus:ring-[#FF5540]"
                  />
                </div>

                <button
                  type="submit"
                  className="group mt-2 flex min-h-13 w-full items-center justify-center gap-2.5 rounded-full bg-[#FF5540] px-5 py-3 text-sm sm:text-base font-bold text-[#5C0000] shadow-[0_8px_24px_rgba(255,85,64,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#ff422a] hover:shadow-[0_12px_30px_rgba(255,85,64,0.28)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB4A8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#171615]"
                >
                  Send Transmission
                  <SendHorizontal className="h-4.5 w-4.5 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.2} aria-hidden="true" />
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </MotionConfig>
    </section>
  )
}
