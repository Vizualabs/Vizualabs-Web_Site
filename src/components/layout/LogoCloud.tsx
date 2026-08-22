import { Marquee } from '#/components/ui/marquee'

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
  | {
      name: string
      kind: 'image'
      src: string
      tone: 'dark' | 'light' | 'mono'
      sizeClass?: string
    }

const CLIENTS: ClientEntry[] = [
  { name: 'Meridian Health', kind: 'mark', mark: PulseMark },
  {
    name: 'Mejestic Homes',
    kind: 'image',
    src: '/clients/mejestic-homes-mono.png',
    tone: 'mono',
  },
  {
    name: 'Neyuki Luxury Wedding Cars',
    kind: 'image',
    src: '/clients/neyuki-mono.png',
    tone: 'mono',
  },
  {
    name: 'Sugar Co Bakers',
    kind: 'image',
    src: '/clients/sugar-co-bakers-mono.png',
    tone: 'mono',
    sizeClass: 'h-14 max-w-[200px] sm:h-16 sm:max-w-[260px] md:h-[4.5rem] md:max-w-[300px]',
  },
  {
    name: 'CLCA Associates',
    kind: 'image',
    src: '/clients/clca-associates.png',
    tone: 'mono',
  },
  {
    name: 'Madara Restaurant',
    kind: 'image',
    src: '/clients/madara-restaurant-mono.png',
    tone: 'mono',
  },
  {
    name: 'Sanura Cosmetics',
    kind: 'image',
    src: '/clients/sanura-cosmetics-mono.png',
    tone: 'mono',
  },
  {
    name: 'Learnerble Education',
    kind: 'image',
    src: '/clients/learnerble-mono.png',
    tone: 'mono',
    sizeClass: 'h-8 max-w-[120px] sm:h-9 sm:max-w-[140px] md:h-10 md:max-w-[160px]',
  },
  {
    name: 'Gamage Recruiters',
    kind: 'image',
    src: '/clients/gamage-recruiters-mono.svg',
    tone: 'mono',
    sizeClass: 'h-9 max-w-[56px] sm:h-10 sm:max-w-[64px] md:h-11 md:max-w-[72px]',
  },
  {
    name: 'Digital Studio',
    kind: 'image',
    src: '/clients/digital-studio-mono.png',
    tone: 'mono',
    sizeClass: 'h-6 max-w-[150px] sm:h-7 sm:max-w-[180px] md:h-8 md:max-w-[210px]',
  },
  {
    name: 'Veritas International Campus',
    kind: 'image',
    src: '/clients/veritas-international-campus-mono.png',
    tone: 'mono',
    sizeClass: 'h-10 max-w-[56px] sm:h-11 sm:max-w-[64px] md:h-12 md:max-w-[72px]',
  },
  {
    name: 'Senarathna Transport',
    kind: 'image',
    src: '/clients/senarathna-transport-mono.png?v=3',
    tone: 'mono',
    sizeClass: 'h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11',
  },
  { name: 'Wenas Events', kind: 'image', src: '/clients/crest-mark.png', tone: 'mono' },
]

function logoMarkClass(tone: 'dark' | 'light' | 'mono', sizeClass?: string) {
  const toneClass =
    tone === 'mono'
      ? ''
      : tone === 'dark'
        ? 'mix-blend-lighten grayscale brightness-[1.75] contrast-125'
        : 'brightness-0 invert'

  const size = sizeClass ?? 'h-10 max-w-[140px] sm:h-12 sm:max-w-[180px] md:h-14 md:max-w-[220px]'
  const hasFixedWidth = /\bw-\d|\bw-\[|\bsm:w-|\bmd:w-|\blg:w-/.test(size)

  return `${size} ${hasFixedWidth ? '' : 'w-auto'} object-contain object-left shrink-0 ${toneClass}`.trim()
}

function ClientLogo({ client }: { client: ClientEntry }) {
  return (
    <span className="group flex shrink-0 items-center gap-2.5 px-1 sm:gap-3.5 sm:px-2 text-white/40 transition-colors duration-300 hover:text-white/80 select-none whitespace-nowrap">
      {client.kind === 'mark' ? (
        <client.mark className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 shrink-0" />
      ) : (
        <img
          src={client.src}
          alt=""
          aria-hidden="true"
          className={`${logoMarkClass(client.tone, client.sizeClass)} ${
            client.tone === 'mono'
              ? 'opacity-55 group-hover:opacity-90 transition-opacity duration-300'
              : 'opacity-[0.95]'
          }`}
          draggable={false}
        />
      )}
      <span className="font-hanken text-base sm:text-lg md:text-xl font-bold tracking-wide">
        {client.name}
      </span>
    </span>
  )
}

export function LogoCloud() {
  return (
    <section
      aria-label="Trusted by"
      className="relative z-30 w-full bg-black py-10 sm:py-14 overflow-hidden selection:bg-[#FF5E4D] selection:text-white"
    >
      <p className="mb-6 sm:mb-8 px-4 text-center text-[10px] sm:text-xs font-normal tracking-[0.2em] text-white/35 uppercase">
        Trusted by teams building the next decade of software
      </p>

      <div className="relative motion-reduce:hidden">
        <Marquee
          pauseOnHover
          repeat={3}
          className="[--duration:36s] [--gap:0.75rem] sm:[--gap:1.25rem] py-1"
        >
          {CLIENTS.map((client) => (
            <ClientLogo key={client.name} client={client} />
          ))}
        </Marquee>

        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-16 md:w-24 bg-gradient-to-r from-black to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-16 md:w-24 bg-gradient-to-l from-black to-transparent" />
      </div>

      <ul className="hidden motion-reduce:flex motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-x-6 motion-reduce:gap-y-4 motion-reduce:px-4 sm:motion-reduce:gap-x-8 sm:motion-reduce:px-6">
        {CLIENTS.map((client) => (
          <li key={`static-${client.name}`}>
            <ClientLogo client={client} />
          </li>
        ))}
      </ul>
    </section>
  )
}
