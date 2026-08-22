import { useRef } from 'react'
import { Search, Wrench, Rocket, TrendingUp } from 'lucide-react'
import { AnimatedBeam } from '#/components/ui/animated-beam'
import { cn } from '#/lib/cn'

const pillars = [
  { id: 'audit', label: 'Audit', icon: Search, stepRange: [0, 1] as const },
  { id: 'build', label: 'Build', icon: Wrench, stepRange: [2, 3] as const },
  { id: 'deploy', label: 'Deploy', icon: Rocket, stepRange: [4, 5] as const },
  { id: 'evolve', label: 'Evolve', icon: TrendingUp, stepRange: [6, 8] as const },
] as const

type JourneySystemsDiagramProps = {
  activeIndex: number
}

/**
 * Compact architecture strip — Animated Beams between process pillars.
 * Syncs highlight with the rotary wheel active step.
 */
export function JourneySystemsDiagram({ activeIndex }: JourneySystemsDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const auditRef = useRef<HTMLDivElement>(null)
  const buildRef = useRef<HTMLDivElement>(null)
  const deployRef = useRef<HTMLDivElement>(null)
  const evolveRef = useRef<HTMLDivElement>(null)
  const nodeRefs = [auditRef, buildRef, deployRef, evolveRef]

  const activePillar = pillars.findIndex(
    (p) => activeIndex >= p.stepRange[0] && activeIndex <= p.stepRange[1],
  )

  return (
    <div
      ref={containerRef}
      className="relative mb-10 sm:mb-12 hidden md:flex h-[88px] w-full max-w-xl items-center justify-between px-2"
      aria-hidden
    >
      {pillars.map((pillar, i) => {
        const Icon = pillar.icon
        const isActive = i === activePillar
        return (
          <div
            key={pillar.id}
            ref={nodeRefs[i]}
            className={cn(
              'relative z-10 flex size-12 items-center justify-center rounded-full border transition-all duration-500',
              isActive
                ? 'border-[#FF5E4D]/60 bg-[#FF553E]/20 text-white shadow-[0_0_20px_-4px_rgba(255,85,62,0.7)]'
                : 'border-white/10 bg-[#121214] text-[#71717A]',
            )}
          >
            <Icon className="size-5" strokeWidth={isActive ? 2.2 : 1.8} />
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] tracking-wide uppercase text-white/40">
              {pillar.label}
            </span>
          </div>
        )
      })}

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={nodeRefs[0]}
        toRef={nodeRefs[1]}
        duration={3.5}
        delay={0}
        curvature={-8}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={nodeRefs[1]}
        toRef={nodeRefs[2]}
        duration={3.5}
        delay={0.4}
        curvature={8}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={nodeRefs[2]}
        toRef={nodeRefs[3]}
        duration={3.5}
        delay={0.8}
        curvature={-8}
      />
    </div>
  )
}
