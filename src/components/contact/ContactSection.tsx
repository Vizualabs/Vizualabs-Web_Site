import { useState, useRef, useEffect, type FormEvent } from 'react'
import { Link } from '@tanstack/react-router'
import { SendHorizontal, AtSign, ChevronDown, MapPin, Mail, Check, AlertCircle, ArrowUpRight } from 'lucide-react'
import { AnimatePresence, motion, MotionConfig } from 'motion/react'
import { submitLeadClient } from '#/lib/submitLeadClient'
import { ContactAiReadPanel } from '#/components/contact/ContactAiReadPanel'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
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
    label: 'Instagram',
    href: 'https://www.instagram.com/vizualabs/',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 11-2.881.001 1.44 1.44 0 012.881-.001z" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/Vizualabs',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
]

export function ContactSection({ variant = 'page' }: { variant?: 'page' | 'home' }) {
  const isHome = variant === 'home'
  const [formData, setFormData] = useState(initialFormData)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const serviceParam = params.get('service')
      if (serviceParam === 'product-development') {
        setFormData((prev) => ({ ...prev, subject: 'Product Development' }))
      } else if (serviceParam === 'custom-software') {
        setFormData((prev) => ({ ...prev, subject: 'Custom Software' }))
      } else if (serviceParam === 'ai-solutions') {
        setFormData((prev) => ({ ...prev, subject: 'AI Solutions' }))
      }
    }
  }, [])

  const handleFieldChange = (field: keyof ContactFormData, value: string) => {
    setSubmitted(false)
    setError(null)
    setFormData((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting) return

    setSubmitting(true)
    setError(null)

    try {
      const result = await submitLeadClient(formData)
      if (result.ok) {
        setSubmitted(true)
        setFormData(initialFormData)
      } else {
        setError(result.error)
      }
    } catch {
      setError('Something went wrong sending your message. Please try emailing us directly instead.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleAiReadComplete = (summary: string) => {
    setFormData((current) => {
      const marker = '\n\n--- AI scope read ---\n'
      if (current.message.includes('--- AI scope read ---')) return current
      const nextMessage = current.message.trim()
        ? `${current.message.trim()}${marker}${summary}`
        : summary
      return { ...current, message: nextMessage.slice(0, 4000) }
    })
  }

  return (
    <section
      id="contact"
      className={`relative isolate overflow-hidden bg-[#0a0a0a] px-4 text-[#E5E2E1] selection:bg-[#FF5540] selection:text-[#0a0a0a] sm:px-8 lg:px-16 ${
        isHome ? 'py-16 sm:py-20 lg:py-24' : 'py-20 sm:py-28 lg:py-36'
      }`}
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
            <h1 className="type-section font-bold text-[#E5E2E1]">
              {isHome ? 'Tell us what you\u2019re building' : 'Initiate Strategic Contact'}
            </h1>
            <p className="type-lead mt-6 max-w-lg text-[#E5E2E1]/70">
              {isHome
                ? 'Reach out first — a founder reads every message personally. Prefer to explore our work before you write? Browse the projects below.'
                : 'Tell us what you\u2019re building — a founder reads every message personally.'}
            </p>

            {isHome ? (
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
                <Link
                  to="/case-study"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#3A3735] bg-[#171615] px-5 text-sm font-semibold text-[#E5E2E1] transition-colors hover:border-[#FF5540] hover:text-[#FFB4A8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5540] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
                >
                  View our case studies
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <a
                  href="mailto:info@vizualabs.com"
                  className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[#FFB4A8] transition-colors hover:text-[#FF5540]"
                >
                  <AtSign className="h-4 w-4" aria-hidden="true" />
                  info@vizualabs.com
                </a>
              </div>
            ) : null}

            <div className={`space-y-6 sm:space-y-7 ${isHome ? 'mt-10 sm:mt-12' : 'mt-10 sm:mt-12'}`}>
              {!isHome ? (
              <>
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#3A3735] bg-[#171615] text-[#FFB4A8]">
                  <MapPin className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
                </div>
                <div className="pt-0.5">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#FFB4A8]">Global Headquarters</p>
                  <address className="mt-1.5 not-italic text-sm sm:text-base leading-relaxed text-[#E5E2E1]">
                    <span className="font-medium text-[#E5E2E1]">Vizualabs (Pvt.) Ltd.</span>
                    <br />
                    6/A/9, Golden Park
                    <br />
                    Malamulla West, Panadura
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
                    <a className="inline-block break-all py-2 -my-2 transition-colors hover:text-[#FFB4A8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5540] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] sm:break-normal" href="mailto:info@vizualabs.com">
                      info@vizualabs.com
                    </a>
                  </div>
                </div>
              </div>
              </>
              ) : null}
            </div>

            <div className={`border-t border-white/10 pt-6 sm:pt-7 ${isHome ? 'mt-8' : 'mt-10 sm:mt-12'}`}>
              <p className="mb-4 font-geist text-xs font-medium uppercase tracking-[0.16em] text-[#E5E2E1]/40">Connect with us</p>
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
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            className="w-full max-w-[560px] justify-self-end rounded-[20px] border border-[#2A2826] bg-[#171615] p-5 sm:p-7 lg:p-8 shadow-[0_24px_64px_rgba(0,0,0,0.34),0_8px_24px_rgba(0,0,0,0.2)]"
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
                      placeholder="e.g. Alex Morgan"
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
                      placeholder="alex@enterprise.com"
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
                              className={`flex min-h-11 w-full items-center justify-between rounded-lg px-3.5 py-3 text-left text-sm transition-colors duration-150 ${
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
                    placeholder="Describe your project, timeline, and strategic engineering goals..."
                    className="min-h-32 w-full resize-y rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-relaxed text-[#E5E2E1] outline-none transition-colors placeholder:text-[#E5E2E1]/30 focus:border-[#FF5540] focus:ring-1 focus:ring-[#FF5540]"
                  />
                </div>

                <ContactAiReadPanel onReadComplete={handleAiReadComplete} />

                {error ? (
                  <div
                    role="alert"
                    className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>{error}</span>
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={submitting}
                  className="group mt-2 flex min-h-13 w-full items-center justify-center gap-2.5 rounded-full bg-[#FF5540] px-5 py-3 text-sm sm:text-base font-bold text-[#5C0000] shadow-[0_8px_24px_rgba(255,85,64,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#ff422a] hover:shadow-[0_12px_30px_rgba(255,85,64,0.28)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB4A8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#171615] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {submitting ? 'Sending…' : 'Send Transmission'}
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
