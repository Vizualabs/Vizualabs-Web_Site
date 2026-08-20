// Meridian Health keeps the original mark + name treatment.
// Other fictional marks are replaced with uploaded partner logos + names.

function PulseMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 10h3.5l2-5.5L11 15.5l2.5-9L15 10h3" />
    </svg>
  )
}

type ClientEntry =
  | { name: string; kind: 'mark'; mark: typeof PulseMark }
  | { name: string; kind: 'image'; src: string; tone: 'dark' | 'light' | 'mono' }

const CLIENTS: ClientEntry[] = [
  { name: 'Meridian Health', kind: 'mark', mark: PulseMark },
  { name: 'Neyuki Premium Cars', kind: 'image', src: '/clients/neyuki.png', tone: 'dark' },
  { name: 'Sugar Co Bakers', kind: 'image', src: '/clients/sugar-co-bakers.png', tone: 'dark' },
  { name: 'CLCA Associates', kind: 'image', src: '/clients/clca-associates.png', tone: 'dark' },
  {
    name: 'Madara Restaurant',
    kind: 'image',
    src: '/clients/madara-restaurant-mono.png?v=3',
    tone: 'mono',
  },
  {
    name: 'Sanura Cosmetics',
    kind: 'image',
    src: '/clients/sanura-cosmetics-mono.png?v=3',
    tone: 'mono',
  },
  { name: 'Wenas Events', kind: 'image', src: '/clients/crest-mark.png', tone: 'dark' },
]

function logoMarkClass(tone: 'dark' | 'light' | 'mono') {
  const toneClass =
    tone === 'mono'
      ? // Pre-flattened white silhouettes — inherit mute from parent text opacity.
        ''
      : tone === 'dark'
        ? 'mix-blend-lighten grayscale brightness-[1.75] contrast-125'
        : 'brightness-0 invert'

  return `h-12 w-auto max-w-[180px] sm:h-14 sm:max-w-[220px] object-contain object-left shrink-0 ${toneClass}`
}

function LogoGroup({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div className="logo-marquee-group" aria-hidden={ariaHidden}>
      {CLIENTS.map((client, i) => (
        <span
          key={`${client.name}-${i}`}
          className="group flex shrink-0 items-center gap-3.5 px-8 sm:gap-4 sm:px-12 text-white/40 transition-colors duration-300 hover:text-white/80 select-none whitespace-nowrap"
        >
          {client.kind === 'mark' ? (
            <client.mark className="h-7 w-7 sm:h-8 sm:w-8 shrink-0" />
          ) : (
            <img
              src={client.src}
              alt=""
              aria-hidden="true"
              className={`${logoMarkClass(client.tone)} ${
                client.tone === 'mono'
                  ? 'opacity-55 group-hover:opacity-90 transition-opacity duration-300'
                  : 'opacity-[0.95]'
              }`}
              draggable={false}
            />
          )}
          <span className="font-hanken text-lg sm:text-xl font-bold tracking-wide">{client.name}</span>
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
