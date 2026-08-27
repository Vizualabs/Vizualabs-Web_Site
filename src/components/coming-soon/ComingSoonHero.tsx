import { useState } from 'react'
import { Bell, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react'
import { TextReveal, FadeLine } from '#/components/ui/text-reveal'
import { RetroGrid } from '#/components/ui/retro-grid'
import { ShimmerButton } from '#/components/ui/shimmer-button'

export function ComingSoonHero() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@') || !email.includes('.')) {
      setErrorMessage('Please enter a valid email address.')
      return
    }
    setErrorMessage('')
    setIsSubmitting(true)

    // Simulate registration
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 600)
  }

  return (
    <section className="relative z-10 w-full min-h-[85vh] flex flex-col justify-center overflow-hidden bg-black text-white pt-36 sm:pt-40 md:pt-48 pb-16 sm:pb-24 px-5 sm:px-8 lg:px-12 selection:bg-[#FF5540] selection:text-white">
      {/* Perspective grid backdrop */}
      <RetroGrid angle={60} className="opacity-30" />

      {/* Atmospheric radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 h-[32rem] w-[45rem] rounded-full bg-[#FF5E4D]/12 blur-[140px]"
      />

      <div className="relative mx-auto w-full max-w-5xl text-center flex flex-col items-center">
        {/* Live Status Badge */}
        <FadeLine>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#42221E]/90 bg-[#1A1211]/90 px-4 py-1.5 backdrop-blur-md mb-6 sm:mb-8 shadow-lg shadow-[#FF5540]/5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5540] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF5540]" />
            </span>
            <span className="text-[11px] sm:text-xs font-semibold tracking-[0.18em] uppercase text-[#E7978B]">
              Case Studies In The Lab
            </span>
            <span className="text-white/20">|</span>
            <span className="text-[10px] sm:text-[11px] font-mono text-[#A1A1AA]">
              Publishing Soon
            </span>
          </div>
        </FadeLine>

        {/* Hero Title */}
        <h1 className="mb-0 space-y-1 sm:space-y-2 flex flex-col items-center">
          <TextReveal
            as="span"
            className="font-hanken text-4xl sm:text-6xl md:text-7xl lg:text-[5rem] font-extrabold tracking-tight leading-[1.08] text-[#E5E2E1] justify-center"
            delay={0.05}
          >
            Engineering Breakdowns.
          </TextReveal>
          <TextReveal
            as="span"
            className="font-hanken text-4xl sm:text-6xl md:text-7xl lg:text-[5rem] font-extrabold tracking-tight leading-[1.08] text-[#FF5540] justify-center"
            delay={0.22}
          >
            Arriving Very Soon.
          </TextReveal>
        </h1>

        {/* Subtitle */}
        <FadeLine delay={0.35}>
          <p className="mt-6 sm:mt-8 max-w-2xl text-base sm:text-lg md:text-[1.125rem] font-normal leading-relaxed text-[#EBBBB4]/90">
            We are curating comprehensive case studies, architectural blueprints,
            and real-world production metrics from our recent enterprise builds and AI deployments.
          </p>
        </FadeLine>

        {/* Email Notification & CTA Box */}
        <FadeLine delay={0.45} className="w-full max-w-lg mt-8 sm:mt-10">
          {!isSubmitted ? (
            <form
              onSubmit={handleSubmit}
              className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-1.5 rounded-2xl sm:rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-xl shadow-2xl shadow-black/80 focus-within:border-[#FF5540]/60 focus-within:ring-2 focus-within:ring-[#FF5540]/20 transition-all duration-300"
            >
              <div className="relative flex-1 flex items-center pl-4 pr-2 py-2 sm:py-0">
                <Bell className="h-4 w-4 text-[#E7978B] mr-2.5 shrink-0 opacity-70" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (errorMessage) setErrorMessage('')
                  }}
                  placeholder="Enter your work email for early access..."
                  className="w-full bg-transparent text-sm text-white placeholder:text-[#A1A1AA]/60 focus:outline-none focus:ring-0 border-none font-sans"
                  aria-label="Work email address"
                  disabled={isSubmitting}
                />
              </div>

              <ShimmerButton
                type="submit"
                disabled={isSubmitting}
                className="text-xs sm:text-sm font-semibold px-5 sm:px-6 py-3 sm:py-2.5 rounded-xl sm:rounded-full"
                background="#FF5540"
                hoverBackground="#FF6B57"
              >
                <span className="flex items-center gap-1.5">
                  {isSubmitting ? (
                    'Joining...'
                  ) : (
                    <>
                      Get Notified
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </span>
              </ShimmerButton>
            </form>
          ) : (
            <div className="flex items-center justify-center gap-3 p-4 rounded-2xl sm:rounded-full bg-[#1A1211]/90 border border-[#FF5540]/40 text-[#EBBBB4] backdrop-blur-xl shadow-xl shadow-[#FF5540]/10 animate-in fade-in duration-300">
              <CheckCircle2 className="h-5 w-5 text-[#FF5540] shrink-0" />
              <span className="text-sm font-medium">
                You&apos;re on the VIP list! We&apos;ll notify you the moment our first case study drops.
              </span>
            </div>
          )}

          {errorMessage && (
            <p className="mt-2 text-xs text-[#FF5540] font-medium">{errorMessage}</p>
          )}

          {/* Micro stats tag pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-[#A1A1AA]">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/5 font-mono text-[11px]">
              <Sparkles className="h-3 w-3 text-[#FF5540]" />
              System Architecture
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/5 font-mono text-[11px]">
              <Sparkles className="h-3 w-3 text-[#FF5540]" />
              Production Metrics
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/5 font-mono text-[11px]">
              <Sparkles className="h-3 w-3 text-[#FF5540]" />
              Benchmark Deep Dives
            </span>
          </div>
        </FadeLine>
      </div>
    </section>
  )
}
