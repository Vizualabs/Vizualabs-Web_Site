import { useState } from 'react'
import { Calendar, CheckCircle2, X } from 'lucide-react'
import { ShimmerButton } from '../ui/shimmer-button'

export function ServicesCtaSection() {
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
    <section className="relative z-20 w-full bg-black py-12 sm:py-16 md:py-20 px-5 sm:px-8 lg:px-12 selection:bg-[#EE2E10] selection:text-white">
      <div className="mx-auto w-full max-w-7xl">
        {/* Main Card Container */}
        <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] bg-[#222222] px-6 py-16 sm:px-12 sm:py-20 md:px-16 md:py-24 text-center shadow-2xl">
          {/* Subtle Ambient Radial Highlight */}
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-[36rem] rounded-full bg-white/[0.03] blur-[80px]" />

          <div className="relative mx-auto max-w-3xl">
            {/* Title: Ready to Architect Your Future? */}
            <h2 className="font-hanken text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold tracking-tight leading-tight text-[#E5E2E1]">
              Ready to Architect Your Future?
            </h2>

            {/* Paragraph: Whether it's a mission-critical platform... */}
            <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg font-normal leading-relaxed text-[#EBBBB4] max-w-2xl mx-auto">
              Whether it's a mission-critical platform or an AI evolution, Vizualabs brings the
              precision your vision deserves.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4">
              {/* Shimmer Button: #EE2E10 with gold shimmer and gold border */}
              <ShimmerButton
                type="button"
                onClick={() => setModalOpen(true)}
                background="#EE2E10"
                shimmerColor="#FFD700"
                borderColor="#FFD700"
                textColor="text-zinc-950"
                shimmerSize="0.15em"
                shimmerDuration="2.5s"
                className="px-6.5 sm:px-7.5 py-3 sm:py-3.5 text-sm sm:text-base font-bold shadow-md shadow-[#EE2E10]/20"
              >
                <span>Let's Build</span>
              </ShimmerButton>

              {/* View Case Studies Button: bg #FFFFFF 10%, text #E5E2E1 */}
              <a
                href="/#cases"
                className="inline-flex items-center justify-center rounded-full bg-white/10 px-6.5 sm:px-7.5 py-3 sm:py-3.5 text-sm sm:text-base font-medium text-[#E5E2E1] backdrop-blur-sm transition-all duration-200 hover:bg-white/15 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                View Case Studies
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Booking Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-[#121214] p-6 sm:p-8 shadow-2xl text-left">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 rounded-full p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#EE2E10]/20 border border-[#EE2E10]/30 text-[#EE2E10]">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Let's Build Together</h3>
                <p className="text-xs text-gray-400">Direct architecture consultation with Vizualabs leads</p>
              </div>
            </div>

            {submitted ? (
              <div className="py-10 text-center space-y-3">
                <CheckCircle2 className="h-12 w-12 text-[#EE2E10] mx-auto animate-bounce" />
                <h4 className="text-lg font-bold text-white">Request Received!</h4>
                <p className="text-sm text-gray-400">Our engineering leads will contact you promptly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-[#EE2E10] focus:outline-none focus:ring-1 focus:ring-[#EE2E10]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                    Work Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@company.com"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-[#EE2E10] focus:outline-none focus:ring-1 focus:ring-[#EE2E10]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                    Company / Project Name
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Acme Corp"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-[#EE2E10] focus:outline-none focus:ring-1 focus:ring-[#EE2E10]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                    Project Vision (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us what you are aiming to build or scale..."
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-[#EE2E10] focus:outline-none focus:ring-1 focus:ring-[#EE2E10] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 rounded-xl bg-[#EE2E10] py-3.5 text-sm font-semibold text-zinc-950 shadow-lg shadow-[#EE2E10]/25 hover:bg-[#d8260b] active:scale-[0.98] transition-all cursor-pointer"
                >
                  Submit & Connect
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
