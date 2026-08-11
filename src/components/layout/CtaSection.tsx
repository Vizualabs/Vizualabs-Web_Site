import { useState } from 'react'
import { ArrowRight, Sparkles, Calendar, X, CheckCircle2 } from 'lucide-react'

export function CtaSection() {
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
    <section className="relative z-30 overflow-hidden bg-[#0d0d0d] py-28 sm:py-36 px-6 sm:px-12 text-center border-t border-white/10 selection:bg-[#FF5E4D] selection:text-white">
      {/* Ambient background glow & grid elements */}
      <div className="pointer-events-none absolute inset-0 bg-radial-glow opacity-60" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[380px] w-[500px] sm:w-[700px] rounded-full bg-[#FF5E4D]/10 blur-[130px]" />
      
      <div className="relative mx-auto max-w-4xl space-y-8">
        {/* Main Title */}
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
          Ready to Accelerate Your Journey?
        </h2>

        {/* Sub-text */}
        <p className="mx-auto max-w-2xl text-base sm:text-xl text-gray-400 font-normal leading-relaxed">
          Join the enterprise leaders who choose precision over guesswork. Let's engineer your next digital success together.
        </p>

        {/* Call to Action Button */}
        <div className="pt-4">
          <button
            onClick={() => setModalOpen(true)}
            className="group relative inline-flex items-center gap-3 rounded-full bg-[#FF5E4D] px-8 sm:px-10 py-4 sm:py-4.5 text-base sm:text-lg font-semibold text-white shadow-[0_0_30px_rgba(255,94,77,0.35)] transition-all duration-300 hover:bg-[#ff4836] hover:shadow-[0_0_45px_rgba(255,94,77,0.55)] hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Book a Strategy Session</span>
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* Booking Strategy Session Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-[#121214] p-6 sm:p-8 shadow-2xl text-left">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 rounded-full p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FF5E4D]/20 border border-[#FF5E4D]/30 text-[#FF5E4D]">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Book a Strategy Session</h3>
                <p className="text-xs text-gray-400">1-on-1 discovery with Vizualabs engineering leads</p>
              </div>
            </div>

            {submitted ? (
              <div className="py-10 text-center space-y-3">
                <CheckCircle2 className="h-12 w-12 text-[#FF5E4D] mx-auto animate-bounce" />
                <h4 className="text-lg font-bold text-white">Session Requested!</h4>
                <p className="text-sm text-gray-400">We will reach out to confirm your scheduled time.</p>
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
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-[#FF5E4D] focus:outline-none focus:ring-1 focus:ring-[#FF5E4D]"
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
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-[#FF5E4D] focus:outline-none focus:ring-1 focus:ring-[#FF5E4D]"
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
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-[#FF5E4D] focus:outline-none focus:ring-1 focus:ring-[#FF5E4D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                    Project Goals (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Briefly describe what you're looking to build..."
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-[#FF5E4D] focus:outline-none focus:ring-1 focus:ring-[#FF5E4D] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 rounded-xl bg-[#FF5E4D] py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#FF5E4D]/25 hover:bg-[#ff4836] active:scale-[0.98] transition-all cursor-pointer"
                >
                  Confirm & Schedule
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
