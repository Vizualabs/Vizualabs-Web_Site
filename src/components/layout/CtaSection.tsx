import { useState } from 'react'
import { ShimmerButton } from '../ui/shimmer-button'
import { BookingModal } from '../ui/BookingModal'

export function CtaSection() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <section className="relative z-30 overflow-hidden bg-[#2A2A2A] py-24 sm:py-32 px-6 sm:px-12 text-center border-t border-white/10 selection:bg-[#FF5E4D] selection:text-white">
      <div className="relative mx-auto max-w-4xl space-y-6">
        {/* Main Title */}
        <h2 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-normal tracking-tight text-[#E5E2E1] leading-tight">
          Ready to Accelerate Your Journey?
        </h2>

        {/* Sub-text */}
        <p className="mx-auto max-w-2xl text-base sm:text-lg text-[#E5E2E1]/60 font-normal leading-relaxed">
          Book a session and leave with a clear, engineered plan for what's next — no guesswork, no fluff.
        </p>

        {/* Call to Action Button with Magic UI Shimmer Effect */}
        <div className="pt-6 flex justify-center">
          <ShimmerButton
            onClick={() => setModalOpen(true)}
            background="#FF5540"
            shimmerColor="#FFD700"
            shimmerSize="0.15em"
            shimmerDuration="2.5s"
          >
            <span>Book a Strategy Session</span>
          </ShimmerButton>
        </div>
      </div>

      <BookingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Book a Strategy Session"
        subtitle="1-on-1 discovery with Vizualabs engineering leads"
        source="homepage_cta_section"
      />
    </section>
  )
}
