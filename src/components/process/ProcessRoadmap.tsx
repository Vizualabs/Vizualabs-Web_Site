import {
  ClipboardCheck,
  Lightbulb,
  MessagesSquare,
  Puzzle,
  Rocket,
  Settings2,
  Wrench,
} from 'lucide-react'
import { motion, MotionConfig } from 'motion/react'
import { useState } from 'react'

const ROADMAP_STEPS = [
  {
    id: 1,
    title: 'Idea stage',
    description:
      'Conceptualizing the core digital strategy and identifying opportunities for innovation.',
    icon: Lightbulb,
    position: 'bottom' as const,
  },
  {
    id: 2,
    title: 'Discussion',
    description:
      'Collaborative brainstorming sessions with stakeholders to align vision and goals.',
    icon: MessagesSquare,
    position: 'top' as const,
  },
  {
    id: 3,
    title: 'Planning',
    description:
      'Detailed roadmap creation, resource allocation, and timeline establishment.',
    icon: ClipboardCheck,
    position: 'top' as const,
  },
  {
    id: 4,
    title: 'Design Phase',
    description:
      'Crafting intuitive user experiences with stunning visual design and prototypes.',
    icon: Settings2,
    position: 'bottom' as const,
  },
  {
    id: 5,
    title: 'Building',
    description:
      'Engineering robust solutions through iterative development and quality assurance.',
    icon: Puzzle,
    position: 'top' as const,
  },
  {
    id: 6,
    title: 'Launch',
    description:
      'Strategic deployment to market with comprehensive testing and monitoring.',
    icon: Rocket,
    position: 'bottom' as const,
  },
  {
    id: 7,
    title: 'Maintenance',
    description:
      'Continuous optimization, support, and feature enhancements for sustained success.',
    icon: Wrench,
    position: 'top' as const,
  },
]

const STEP_POSITIONS = [
  { cx: 115, cy: 323 },
  { cx: 170, cy: 220 },
  { cx: 327, cy: 161 },
  { cx: 380, cy: 342 },
  { cx: 530, cy: 161 },
  { cx: 580, cy: 342 },
  { cx: 710, cy: 161 },
]

const ROAD_PATH = `
    M 0 350
    L 50 350
    Q 80 350 80 320
    Q 80 290 110 290
    L 140 290
    Q 170 290 170 260
    Q 170 230 200 230
    L 250 230
    Q 280 230 280 200
    Q 280 170 310 170
    L 350 170
    Q 380 170 380 200
    V 320
    Q 380 350 410 350
    L 450 350
    Q 480 350 480 320
    V 200
    Q 480 170 510 170
    L 550 170
    Q 580 170 580 200
    V 320
    Q 580 350 610 350
    L 650 350
    Q 680 350 680 320
    V 200
    Q 680 170 710 170
    L 800 170
  `

export function ProcessRoadmap() {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null)

  return (
    <section
      className="relative w-full overflow-hidden bg-black pt-6 pb-0 md:pt-12"
      aria-label="Strategic journey roadmap"
    >
      <MotionConfig reducedMotion="user">
        <div className="relative w-full">
          <div className="hidden md:block relative w-full pb-0 px-0">
            <div className="pointer-events-none absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-red-600/10 blur-[120px] animate-pulse" />
            <div
              className="pointer-events-none absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-red-900/10 blur-[120px] animate-pulse"
              style={{ animationDelay: '700ms' }}
            />

            <svg
              viewBox="0 0 800 500"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="relative z-10 h-auto w-full"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <filter id="processRoadShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="20" />
                  <feOffset dx="0" dy="15" result="offsetblur" />
                  <feComponentTransfer>
                    <feFuncA type="linear" slope="0.7" />
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <linearGradient id="processRoadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4a0000" />
                  <stop offset="25%" stopColor="#990000" />
                  <stop offset="50%" stopColor="#ff0000" />
                  <stop offset="75%" stopColor="#990000" />
                  <stop offset="100%" stopColor="#4a0000" />
                </linearGradient>
                <filter id="processGlow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <path id="processMainRoadPath" d={ROAD_PATH} />
              </defs>

              <motion.path
                d={ROAD_PATH}
                stroke="#FF0000"
                strokeWidth="70"
                strokeLinecap="round"
                className="blur-3xl opacity-10"
              />
              <motion.path
                d={ROAD_PATH}
                stroke="white"
                strokeWidth="54"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <motion.path
                d={ROAD_PATH}
                stroke="url(#processRoadGradient)"
                strokeWidth="50"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#processRoadShadow)"
              />

              <motion.circle r="10" fill="white" filter="url(#processGlow)">
                <animateMotion dur="12s" repeatCount="indefinite">
                  <mpath href="#processMainRoadPath" />
                </animateMotion>
                <animate attributeName="opacity" values="0;1;1;0" dur="12s" repeatCount="indefinite" />
              </motion.circle>

              <path
                d={ROAD_PATH}
                stroke="white"
                strokeWidth="2"
                strokeDasharray="10 20"
                strokeLinecap="round"
                fill="none"
                className="opacity-40 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
              />

              {ROADMAP_STEPS.map((step, index) => {
                const pos = STEP_POSITIONS[index]

                return (
                  <g
                    key={step.id}
                    onMouseEnter={() => setHoveredStep(step.id)}
                    onMouseLeave={() => setHoveredStep(null)}
                    className="cursor-pointer group/step"
                  >
                    <foreignObject
                      x={pos.cx - 30}
                      y={pos.cy - 30}
                      width="60"
                      height="60"
                      className="overflow-visible"
                    >
                      <motion.div
                        initial={{ scale: 0, rotate: -10 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        animate={{
                          scale: hoveredStep === step.id ? 1.2 : 1,
                          rotate: hoveredStep === step.id ? 5 : 0,
                        }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: index * 0.1 }}
                        viewport={{ once: true, margin: '-50px' }}
                        className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full border-4 border-[#FF0000] bg-white shadow-2xl"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-700 opacity-0 transition-opacity duration-500 group-hover/step:opacity-100" />
                        <step.icon
                          className="relative z-10 h-5 w-5 text-gray-700 transition-all duration-500 group-hover/step:scale-110 group-hover/step:text-white"
                          strokeWidth={2.5}
                          aria-hidden="true"
                        />
                      </motion.div>
                    </foreignObject>

                    <foreignObject
                      x={pos.cx - 100}
                      y={step.position === 'top' ? pos.cy - 120 : pos.cy + 50}
                      width="200"
                      height="120"
                      className="pointer-events-none overflow-visible"
                    >
                      <motion.div
                        initial={{ opacity: 0, y: step.position === 'top' ? 20 : -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.12 + 0.4 }}
                        viewport={{ once: true }}
                        className="text-center"
                      >
                        <motion.h3
                          className="mb-2 font-hanken text-xs font-bold uppercase tracking-wide text-white md:text-sm"
                          animate={{
                            color: hoveredStep === step.id ? '#ef4444' : '#ffffff',
                            scale: hoveredStep === step.id ? 1.1 : 1,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          {step.title}
                        </motion.h3>
                        <motion.p
                          initial={{ opacity: 0, y: 5 }}
                          animate={{
                            opacity: hoveredStep === step.id ? 1 : 0,
                            y: hoveredStep === step.id ? 0 : 5,
                          }}
                          transition={{ duration: 0.3 }}
                          className="px-4 text-[10px] leading-relaxed text-white/70 md:text-xs"
                        >
                          {step.description}
                        </motion.p>
                      </motion.div>
                    </foreignObject>
                  </g>
                )
              })}
            </svg>
          </div>

          <div className="relative w-full px-5 pb-0 md:hidden">
            <div className="pointer-events-none absolute top-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-red-600/10 blur-[100px]" />

            <ol className="relative z-10 space-y-8">
              {ROADMAP_STEPS.map((step, index) => (
                <motion.li
                  key={step.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
                  className="relative"
                >
                  <div className="flex items-start gap-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-red-500 bg-white shadow-xl"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-700 opacity-0 transition-opacity duration-500" />
                      <step.icon
                        className="relative z-10 h-7 w-7 text-gray-700"
                        strokeWidth={2.5}
                        aria-hidden="true"
                      />
                    </motion.div>

                    <div className="flex-1 pt-1">
                      <h3 className="mb-1 font-hanken text-base font-bold uppercase tracking-wide text-white">
                        {step.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-white/60">{step.description}</p>
                    </div>
                  </div>

                  {index < ROADMAP_STEPS.length - 1 ? (
                    <div className="ml-8 mt-4 mb-4 h-8 w-0.5 bg-gradient-to-b from-red-500 to-red-500/20" />
                  ) : null}
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      </MotionConfig>
    </section>
  )
}
