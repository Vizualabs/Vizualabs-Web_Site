import { useState } from 'react'
import { Calendar, CheckCircle2, X } from 'lucide-react'
import { ShimmerButton } from '../ui/shimmer-button'

export function ProcessCtaSection() {
  const [modalOpen, setModalOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setModalOpen(false)
      setFormData({ name: '', email: '', company: '', message: '' })
    }, 2500)
  }

  return (
    <section className="relative z-20 w-full bg-[#131313] pt-0 pb-16 sm:pb-20 px-5 sm:px-8 lg:px-12 selection:bg-[#EE2E10] selection:text-white">
      <div className="mx-auto w-full max-w-7xl">
        <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] bg-[#222222] px-6 py-16 sm:px-12 sm:py-20 md:px-16 md:py-24 text-center shadow-2xl">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-white/[0.03] blur-[80px]" />

          <div className="relative mx-auto max-w-3xl">
            <h2 className="font-hanken text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold tracking-tight leading-tight text-[#E5E2E1]">
              Ready to start your journey?
            </h2>
            <p className="mt-4 sm:mt-5 mx-auto max-w-2xl text-sm sm:text-base md:text-lg font-normal leading-relaxed text-[#EBBBB4]">
              Connect with our engineering leads and map the first stretch of your roadmap —
              from idea through launch and beyond.
            </p>

            <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4">
              <ShimmerButton
                type="button"
                onClick={() => setModalOpen(true)}
                background="#FF5540"
                hoverBackground="#EE2E10"
                shimmerColor="#FFD700"
                textColor="text-zinc-950"
                shimmerSize="0.15em"
                shimmerDuration="2.5s"
                className="px-6.5 sm:px-7.5 py-3 sm:py-3.5 text-sm sm:text-base font-bold shadow-md shadow-[#FF5540]/20 hover:shadow-[#EE2E10]/30 transition-all duration-300"
              >
                <span>Get a Free Consultation</span>
              </ShimmerButton>

              <a
                href="/#cases"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/25 px-6.5 sm:px-7.5 py-3 sm:py-3.5 text-sm sm:text-base font-medium text-white transition-all duration-200 hover:border-white/50 hover:bg-white/[0.06] hover:-translate-y-0.5 active:translate-y-0"
              >
                View Our Work
              </a>
            </div>
          </div>
        </div>
      </div>

      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-white/15 bg-[#121214] p-6 sm:p-8 shadow-2xl text-left">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 rounded-full p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
              aria-label="Close consultation form"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#EE2E10]/20 border border-[#EE2E10]/30 text-[#EE2E10]">
                <Calendar className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Free Consultation</h3>
                <p className="text-xs text-gray-400">Direct architecture consultation with Vizualabs leads</p>
              </div>
            </div>

            {submitted ? (
              <div className="py-10 text-center space-y-3">
                <CheckCircle2 className="h-12 w-12 text-[#EE2E10] mx-auto" aria-hidden="true" />
                <h4 className="text-lg font-bold text-white">Request Received!</h4>
                <p className="text-sm text-gray-400">Our engineering leads will contact you promptly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="process-cta-name" className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                    Your Name
                  </label>
                  <input
                    id="process-cta-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Alex Morgan"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-[#EE2E10] focus:outline-none focus:ring-1 focus:ring-[#EE2E10]"
                  />
                </div>

                <div>
                  <label htmlFor="process-cta-email" className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                    Work Email
                  </label>
                  <input
                    id="process-cta-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alex@company.com"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-[#EE2E10] focus:outline-none focus:ring-1 focus:ring-[#EE2E10]"
                  />
                </div>

                <div>
                  <label htmlFor="process-cta-company" className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                    Company / Project Name
                  </label>
                  <input
                    id="process-cta-company"
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Acme Corp"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-[#EE2E10] focus:outline-none focus:ring-1 focus:ring-[#EE2E10]"
                  />
                </div>

                <div>
                  <label htmlFor="process-cta-message" className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                    Project Vision (Optional)
                  </label>
                  <textarea
                    id="process-cta-message"
                    rows={2}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us what you are aiming to build or scale..."
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-[#EE2E10] focus:outline-none focus:ring-1 focus:ring-[#EE2E10] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 min-h-11 rounded-xl bg-[#EE2E10] py-3.5 text-sm font-semibold text-zinc-950 shadow-lg shadow-[#EE2E10]/25 hover:bg-[#d8260b] active:scale-[0.98] transition-all"
                >
                  Submit & Connect
                </button>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </section>
  )
}
