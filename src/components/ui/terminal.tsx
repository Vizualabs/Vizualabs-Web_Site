import { useEffect, useMemo, useRef, useState, type ReactElement } from 'react'
import { FileCode2 } from 'lucide-react'

/** Characters of code revealed per animation tick. */
const CHARS_PER_TICK = 1

const KEYWORDS =
  /\b(const|let|var|function|async|await|return|export|default|import|from|interface|type|new|if|else|for|of|in|extends|implements|class|public|private|readonly|void|typeof)\b/

const LITERALS = /\b(true|false|null|undefined)\b/

const TOKEN_REGEX = new RegExp(
  [
    /\/\/.*$/.source, // comment
    /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`/.source, // string
    KEYWORDS.source,
    LITERALS.source,
    /\b\d+(?:\.\d+)?\b/.source, // number
    /[A-Za-z_$][\w$]*(?=\()/.source, // function call name
  ].join('|'),
  'g',
)

/** Colors a single line of code like a syntax-highlighted editor (VS Code Dark+ palette). */
function highlightLine(line: string, key: string): ReactElement[] {
  const nodes: ReactElement[] = []
  let lastIndex = 0
  let matchIndex = 0

  for (const match of line.matchAll(TOKEN_REGEX)) {
    const [token] = match
    const index = match.index ?? 0
    if (index > lastIndex) {
      nodes.push(<span key={`${key}-plain-${matchIndex}`}>{line.slice(lastIndex, index)}</span>)
    }

    let colorClass = 'text-[#D4D4D4]'
    if (token.startsWith('//')) colorClass = 'italic text-[#6A9955]'
    else if (/^['"`]/.test(token)) colorClass = 'text-[#CE9178]'
    else if (KEYWORDS.test(token)) colorClass = 'text-[#569CD6]'
    else if (LITERALS.test(token)) colorClass = 'text-[#569CD6]'
    else if (/^\d/.test(token)) colorClass = 'text-[#B5CEA8]'
    else colorClass = 'text-[#DCDCAA]'

    nodes.push(
      <span key={`${key}-tok-${matchIndex}`} className={colorClass}>
        {token}
      </span>,
    )
    lastIndex = index + token.length
    matchIndex += 1
  }

  if (lastIndex < line.length) {
    nodes.push(<span key={`${key}-plain-tail`}>{line.slice(lastIndex)}</span>)
  }

  return nodes
}

function Cursor() {
  return (
    <span
      className="inline-block h-4 w-[2px] animate-pulse bg-[#FF5540] align-middle shadow-[0_0_6px_rgba(255,85,64,0.8)]"
      aria-hidden="true"
    />
  )
}

export type TerminalProps = {
  fileName: string
  code: string
  pulseInterval?: number
  /** When true, the typing animation runs (typically viewport-triggered). */
  playing?: boolean
  /** Replay the sequence on hover once it has finished. */
  resetOnHover?: boolean
  className?: string
}

function MacControls() {
  return (
    <div className="flex items-center gap-1.5" aria-hidden="true">
      <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
    </div>
  )
}

export function Terminal({
  fileName,
  code,
  pulseInterval = 16,
  playing = true,
  resetOnHover = true,
  className = '',
}: TerminalProps) {
  const trimmedCode = useMemo(() => code.replace(/^\n+|\n+$/g, ''), [code])
  const finalCount = Math.ceil(trimmedCode.length / CHARS_PER_TICK) + 20

  const [counter, setCounter] = useState(0)
  const outputRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!playing) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setCounter(finalCount)
      return
    }

    setCounter(0)
    const interval = window.setInterval(() => {
      setCounter((prev) => (prev >= finalCount ? prev : prev + 1))
    }, pulseInterval)

    return () => window.clearInterval(interval)
  }, [playing, finalCount, pulseInterval])

  useEffect(() => {
    const node = outputRef.current
    if (!node) return
    node.scrollTop = node.scrollHeight
  }, [counter])

  const shownChars = Math.min(trimmedCode.length, counter * CHARS_PER_TICK)
  const visibleCode = trimmedCode.slice(0, shownChars)
  const lines = visibleCode.split('\n')

  const revealComplete = counter >= finalCount

  return (
    <div
      className={`relative w-full min-w-0 max-w-full ${className}`}
      onMouseEnter={() => {
        if (!resetOnHover || !revealComplete) return
        setCounter(0)
      }}
    >
      <div
        className={`w-full max-w-full overflow-hidden rounded-xl border bg-[#1e1e1e] shadow-2xl shadow-black/40 transition-shadow duration-700 sm:rounded-2xl ${
          revealComplete
            ? 'border-[#FF5540]/25 shadow-[0_0_50px_-12px_rgba(255,85,64,0.35)]'
            : 'border-white/10'
        }`}
      >
        <div className="flex items-center justify-between gap-2 border-b border-white/8 bg-[#161616] px-3 py-2.5 sm:px-4 sm:py-3">
          <MacControls />
          <div className="flex min-w-0 flex-1 items-center justify-end gap-1.5 text-[10px] font-medium text-[#EBBBB4]/50 sm:justify-center sm:text-[11px]">
            <FileCode2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate font-mono">
              {fileName.includes('/') ? (
                <>
                  <span className="text-[#EBBBB4]/40">
                    {fileName.slice(0, fileName.lastIndexOf('/') + 1)}
                  </span>
                  <span className="text-[#EBBBB4]/80">
                    {fileName.slice(fileName.lastIndexOf('/') + 1)}
                  </span>
                </>
              ) : (
                fileName
              )}
            </span>
          </div>
          <div className="hidden w-12 shrink-0 sm:block" aria-hidden="true" />
        </div>

        <div
          ref={outputRef}
          className="relative h-[14rem] overflow-x-auto overflow-y-auto px-3 py-3 sm:h-[16rem] sm:px-5 sm:py-5 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.15)_transparent]"
          aria-live="polite"
          aria-label="Code sample"
        >
          <div className="flex min-w-max gap-3 sm:gap-4">
            <div
              className="select-none whitespace-pre text-right font-mono text-[12px] leading-relaxed text-white/20 sm:text-sm"
              aria-hidden="true"
            >
              {lines.map((_, i) => (
                <div key={`ln-${i}`}>{i + 1}</div>
              ))}
            </div>
            <div className="whitespace-pre font-mono text-[12px] leading-relaxed text-[#D4D4D4] sm:text-sm">
              {lines.map((line, i) => (
                <div key={`code-${i}`}>
                  {highlightLine(line, `l${i}`)}
                  {i === lines.length - 1 ? <Cursor /> : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
