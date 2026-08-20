// Illustrative placeholder clients — same fictional roster used in
// TestimonialsSection for narrative consistency. Swap for real client/partner
// marks (with permission to use their name/logo) before this ships live.

/** Simple abstract marks, one per placeholder client — inline SVG, no image
 *  requests, inherits text color so the hover brighten applies to the mark
 *  and wordmark together. */
function PulseMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 10h3.5l2-5.5L11 15.5l2.5-9L15 10h3" />
    </svg>
  )
}

function RouteMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2.5 15.5L11 7" />
      <path d="M11 3.5h4v4" />
    </svg>
  )
}

function ArcMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
      <path d="M3 13.5A8 8 0 0 1 15.8 5.2" />
      <circle cx="15.8" cy="5.2" r="1.15" fill="currentColor" stroke="none" />
    </svg>
  )
}

function RingsMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <circle cx="10" cy="10" r="2" />
      <circle cx="10" cy="10" r="5.5" opacity="0.6" />
      <circle cx="10" cy="10" r="9" opacity="0.3" />
    </svg>
  )
}

function BarsMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
      <path d="M4 15.5V11" />
      <path d="M10 15.5V6.5" />
      <path d="M16 15.5V3" />
    </svg>
  )
}

function RidgeMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 14l3.5-6 2.5 3 3-7 3.5 6 3.5-4.5" />
    </svg>
  )
}

const PLACEHOLDER_CLIENTS = [
  { name: 'Meridian Health', mark: PulseMark },
  { name: 'Northline Logistics', mark: RouteMark },
  { name: 'Arclight Robotics', mark: ArcMark },
  { name: 'Solace Systems', mark: RingsMark },
  { name: 'Fenwick & Cole Capital', mark: BarsMark },
  { name: 'Ridgeline Analytics', mark: RidgeMark },
] as const

function LogoGroup({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div className="logo-marquee-group" aria-hidden={ariaHidden}>
      {PLACEHOLDER_CLIENTS.map(({ name, mark: Mark }, i) => (
        <span
          key={`${name}-${i}`}
          className="flex shrink-0 items-center gap-2.5 px-8 sm:px-12 text-white/25 transition-colors duration-300 hover:text-white/70 select-none whitespace-nowrap"
        >
          <Mark className="h-5 w-5 sm:h-[22px] sm:w-[22px] shrink-0" />
          <span className="font-hanken text-lg sm:text-xl font-bold tracking-wide">
            {name}
          </span>
        </span>
      ))}
    </div>
  )
}

export function LogoCloud() {
  return (
    <section
      aria-label="Trusted by"
      className="relative z-30 w-full bg-black py-10 sm:py-14 overflow-hidden selection:bg-[#FF5E4D] selection:text-white"
    >
      <p className="mb-6 sm:mb-8 text-center text-[10px] sm:text-xs font-normal tracking-[0.2em] text-white/35 uppercase">
        Trusted by teams building the next decade of software
      </p>

      <div
        className="logo-marquee-track"
        style={{ '--logo-marquee-duration': '34s' } as React.CSSProperties}
      >
        <LogoGroup />
        <LogoGroup ariaHidden />
      </div>
    </section>
  )
}
