import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Sparkles, Loader2, ChevronDown, AlertCircle } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import {
  estimateProjectClient,
  type EstimatePayload,
} from '#/lib/assistant/estimateClient'
import { BlobMascotIcon } from '#/components/chat/BlobMascotIcon'

const MAX_LENGTH = 1500
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const COMPLEXITY_STYLES: Record<
  Extract<EstimatePayload, { kind: 'read' }>['complexity'],
  string
> = {
  Simple: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  Moderate: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  Complex: 'bg-[#FF5E4D]/15 text-[#FF8F7A] border-[#FF5E4D]/35',
  Enterprise: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
}

function EstimateReadResult({ estimate }: { estimate: Extract<EstimatePayload, { kind: 'read' }> }) {
  return (
    <div className="space-y-3 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#E5E2E1]/45">
          Complexity
        </span>
        <span
          className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${COMPLEXITY_STYLES[estimate.complexity]}`}
        >
          {estimate.complexity}
        </span>
      </div>
      <p className="leading-relaxed text-[#E5E2E1]/85">{estimate.complexityWhy}</p>
      <p className="text-[#E5E2E1]/70">
        <span className="font-semibold text-[#FFB4A8]">Timeline:</span> {estimate.timeline}
      </p>
      <p className="text-xs text-[#E5E2E1]/40">
        Optional AI read — not a formal quote. Include this context in your message above if helpful.
      </p>
    </div>
  )
}

/** Collapsible optional AI scope read — lives inside the contact form flow. */
export function ContactAiReadPanel({
  onReadComplete,
}: {
  onReadComplete?: (summary: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [estimate, setEstimate] = useState<EstimatePayload | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [clarifyAnswer, setClarifyAnswer] = useState('')
  const clarifyInputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (estimate?.kind === 'clarify') {
      clarifyInputRef.current?.focus()
    }
  }, [estimate])

  const runEstimate = async (nextDescription: string) => {
    const trimmed = nextDescription.trim()
    if (loading || !trimmed) return

    setLoading(true)
    setError(null)
    setEstimate(null)
    setClarifyAnswer('')

    try {
      const result = await estimateProjectClient(trimmed)
      if (result.ok) {
        setEstimate(result.estimate)
        if (result.estimate.kind === 'read' && onReadComplete) {
          const summary = [
            `AI scope read (${result.estimate.complexity}): ${result.estimate.complexityWhy}`,
            `Timeline: ${result.estimate.timeline}`,
            `Next step: ${result.estimate.nextStep}`,
          ].join('\n')
          onReadComplete(summary)
        }
      } else {
        setError(result.error)
      }
    } catch {
      setError('Something went wrong generating that read. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    await runEstimate(description)
  }

  const handleClarify = async (event: FormEvent) => {
    event.preventDefault()
    const detail = clarifyAnswer.trim()
    if (!detail || !estimate || estimate.kind !== 'clarify') return
    const nextDescription = `${description.trim()}\n\nMore detail: ${detail}`.slice(0, MAX_LENGTH)
    setDescription(nextDescription)
    await runEstimate(nextDescription)
  }

  return (
    <div className="rounded-xl border border-dashed border-white/10 bg-black/20">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex min-h-11 w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-white/[0.02]"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2 text-sm font-medium text-[#E5E2E1]/75">
          <Sparkles className="h-4 w-4 text-[#FF5540]" aria-hidden="true" />
          Optional: get an instant AI scope read
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[#E5E2E1]/45 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="space-y-3 border-t border-white/10 px-4 pb-4 pt-3">
              <p className="text-xs leading-relaxed text-[#E5E2E1]/45">
                Not required to send your message. Helpful if you want a quick complexity and timeline
                read before we reply.
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                <label htmlFor="contact-ai-description" className="sr-only">
                  Project description for AI read
                </label>
                <textarea
                  id="contact-ai-description"
                  rows={3}
                  value={description}
                  onChange={(event) => setDescription(event.target.value.slice(0, MAX_LENGTH))}
                  placeholder="Briefly describe what you're building…"
                  className="w-full resize-none rounded-xl border border-white/10 bg-black/35 px-3 py-2.5 text-sm text-[#E5E2E1] outline-none placeholder:text-[#E5E2E1]/30 focus:border-[#FF5540] focus:ring-1 focus:ring-[#FF5540]"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !description.trim()}
                  className="flex min-h-10 items-center justify-center gap-2 rounded-full border border-[#FF5540]/40 bg-[#FF5540]/10 px-4 text-xs font-semibold text-[#FFB4A8] transition-colors hover:bg-[#FF5540]/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                      Thinking…
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                      Get instant read
                    </>
                  )}
                </button>
              </form>

              {error ? (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200"
                >
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>{error}</span>
                </div>
              ) : null}

              {estimate ? (
                <div className="rounded-xl border border-[#FF5540]/20 bg-[#FF5540]/[0.05] p-3">
                  {estimate.kind === 'clarify' ? (
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <BlobMascotIcon className="h-7 w-7 shrink-0" mood="hmm" />
                        <p className="text-sm leading-relaxed text-[#E5E2E1]/85">{estimate.question}</p>
                      </div>
                      <form onSubmit={handleClarify} className="space-y-2">
                        <textarea
                          ref={clarifyInputRef}
                          rows={2}
                          value={clarifyAnswer}
                          onChange={(event) => setClarifyAnswer(event.target.value.slice(0, 500))}
                          placeholder="Your answer…"
                          className="w-full resize-none rounded-lg border border-white/10 bg-black/35 px-3 py-2 text-sm text-[#E5E2E1] outline-none focus:border-[#FF5540]"
                          disabled={loading}
                          required
                        />
                        <button
                          type="submit"
                          disabled={loading || !clarifyAnswer.trim()}
                          className="text-xs font-semibold text-[#FFB4A8] hover:text-[#FF5540] disabled:opacity-50"
                        >
                          Continue
                        </button>
                      </form>
                    </div>
                  ) : (
                    <EstimateReadResult estimate={estimate} />
                  )}
                </div>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
