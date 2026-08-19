import { useEffect, useRef, useState } from 'react'
import { Terminal } from '#/components/ui/terminal'

const PROCESS_FILE_NAME = 'vizualabs/pipeline.ts'

const PROCESS_CODE = `type Stage = 'idea' | 'planning' | 'build' | 'launch'

interface Milestone {
  stage: Stage
  owner: string
  done: boolean
}

const pipeline: Milestone[] = [
  { stage: 'idea', owner: 'strategy', done: true },
  { stage: 'planning', owner: 'product', done: true },
  { stage: 'build', owner: 'engineering', done: true },
  { stage: 'launch', owner: 'growth', done: false },
]

export function nextMilestone() {
  return pipeline.find((m) => !m.done)
}

console.log(nextMilestone())
// → { stage: 'launch', owner: 'growth', done: false }`

export function ProcessTerminalSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setPlaying(true)
          observer.disconnect()
        }
      },
      { threshold: 0.35 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative z-10 w-full bg-[#131313] px-5 py-16 sm:px-8 sm:py-20 lg:px-12"
      aria-labelledby="process-terminal-heading"
    >
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14">
        <div>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E7978B]">
            Execution view
          </p>
          <h2
            id="process-terminal-heading"
            className="font-hanken text-3xl font-extrabold tracking-tight text-[#E5E2E1] sm:text-4xl"
          >
            How a project boots
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-[#EBBBB4]/75 sm:text-base">
            Every engagement follows the same disciplined pipeline — from first idea
            through launch and long-term maintenance. No guesswork, no black boxes.
          </p>
        </div>

        <Terminal
          fileName={PROCESS_FILE_NAME}
          code={PROCESS_CODE}
          playing={playing}
          resetOnHover
        />
      </div>
    </section>
  )
}
