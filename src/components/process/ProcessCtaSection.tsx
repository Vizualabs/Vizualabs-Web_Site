import { useState } from 'react'
import { ShimmerButton } from '../ui/shimmer-button'
import { BookingModal } from '../ui/BookingModal'

export function ProcessCtaSection() {
  const [modalOpen, setModalOpen] = useState(false)

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

      <BookingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Free Consultation"
        subtitle="Direct architecture consultation with Vizualabs leads"
        source="process_cta_section"
        accentColor="#EE2E10"
      />
    </section>
  )
}
