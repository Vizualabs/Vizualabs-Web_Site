import { useState } from 'react'
import { ShimmerButton } from '#/components/ui/shimmer-button'
import { BookingModal } from '#/components/ui/BookingModal'

export function WorkCtaSection() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <section className="relative z-20 w-full bg-black px-5 pb-20 sm:px-8 sm:pb-28 lg:px-12">
      <div className="mx-auto w-full max-w-5xl">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#222222] px-6 py-16 text-center shadow-2xl sm:rounded-[2.5rem] sm:px-12 sm:py-20">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-white/[0.03] blur-[80px]" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-hanken text-3xl font-bold tracking-tight text-[#E5E2E1] sm:text-4xl">
              Have a project like this?
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#EBBBB4] sm:text-base">
              Book a session and leave with a clear, engineered plan for what's next.
            </p>
            <div className="mt-8 flex justify-center">
              <ShimmerButton
                type="button"
                onClick={() => setModalOpen(true)}
                background="#FF5540"
                hoverBackground="#EE2E10"
                shimmerColor="#FFD700"
                textColor="text-zinc-950"
                shimmerSize="0.15em"
                shimmerDuration="2.5s"
                className="px-7 py-3.5 text-sm font-bold shadow-md shadow-[#FF5540]/20 transition-all duration-300 hover:shadow-[#EE2E10]/30 sm:text-base"
              >
                <span>Book a Strategy Session</span>
              </ShimmerButton>
            </div>
          </div>
        </div>
      </div>

      <BookingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Book a Strategy Session"
        subtitle="1-on-1 discovery with Vizualabs engineering leads"
        source="work_cta_section"
      />
    </section>
  )
}
