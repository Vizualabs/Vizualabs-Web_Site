import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Sparkles, Loader2, Mail, Check, AlertCircle, Clock3, ListChecks, ArrowRight } from 'lucide-react'
import {
  estimateProject,
  requestWrittenBrief,
  formatEstimateForEmail,
  type EstimatePayload,
} from '#/lib/assistant/estimate'
import { BlobMascotIcon } from '#/components/chat/BlobMascotIcon'

const MAX_LENGTH = 1500

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
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <BlobMascotIcon className="h-9 w-9 shrink-0" mood="happy" />
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
              Complexity
            </span>
            <span
              className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${COMPLEXITY_STYLES[estimate.complexity]}`}
            >
              {estimate.complexity}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-white/90 sm:text-base">{estimate.complexityWhy}</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-black/25 p-4">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
            <Clock3 className="h-3.5 w-3.5 text-[#FF5E4D]" aria-hidden="true" />
            Rough timeline
          </div>
          <p className="text-base font-semibold text-white sm:text-lg">{estimate.timeline}</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/25 p-4">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
            <ArrowRight className="h-3.5 w-3.5 text-[#FF5E4D]" aria-hidden="true" />
            Suggested first step
          </div>
          <p className="text-sm leading-relaxed text-white/85">{estimate.nextStep}</p>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-black/25 p-4">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
          <ListChecks className="h-3.5 w-3.5 text-[#FF5E4D]" aria-hidden="true" />
          What would shape the build
        </div>
        <ul className="space-y-2">
          {estimate.considerations.map((item) => (
            <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-white/85">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF5E4D]" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-xs text-white/40">
        Instant AI read — not a formal quote. A real conversation still shapes the final plan.
      </p>
    </div>
  )
}

export function ProjectEstimator() {
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [estimate, setEstimate] = useState<EstimatePayload | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [clarifyAnswer, setClarifyAnswer] = useState('')
  const clarifyInputRef = useRef<HTMLTextAreaElement>(null)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [briefState, setBriefState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [briefError, setBriefError] = useState<string | null>(null)

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
    setBriefState('idle')
    setBriefError(null)

    try {
      const result = await estimateProject({ data: { description: trimmed } })
      if (result.ok) {
        setEstimate(result.estimate)
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

  const handleBrief = async (event: FormEvent) => {
    event.preventDefault()
    if (briefState === 'sending' || !estimate) return

    setBriefState('sending')
    setBriefError(null)

    try {
      const result = await requestWrittenBrief({
        data: {
          name,
          email,
          description,
          estimate: formatEstimateForEmail(estimate),
        },
      })
      if (result.ok) {
        setBriefState('sent')
      } else {
        setBriefState('error')
        setBriefError(result.error)
      }
    } catch {
      setBriefState('error')
      setBriefError('Something went wrong sending that. Please try again.')
    }
  }

  return (
    <section className="relative w-full border-t border-white/10 bg-[#0d0d0d] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#FF5E4D]">Live AI read</p>
          <h2 className="mt-3 font-hanken text-3xl font-bold text-white sm:text-4xl">
            What would your project take?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/60 sm:text-base">
            Describe what you&apos;re building. Get an honest, instant read on complexity and
            timeline — no form, no wait.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-[#141414] p-5 shadow-xl sm:p-6"
        >
          <textarea
            rows={4}
            value={description}
            onChange={(event) => setDescription(event.target.value.slice(0, MAX_LENGTH))}
            placeholder="e.g. A marketplace app connecting freelance designers with small businesses, with in-app payments and messaging..."
            className="w-full resize-none rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#FF5E4D] focus:ring-1 focus:ring-[#FF5E4D]"
            disabled={loading}
          />
          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="text-xs text-white/30">
              {description.length}/{MAX_LENGTH}
            </span>
            <button
              type="submit"
              disabled={loading || !description.trim()}
              className="flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#FF5540] px-5 text-sm font-semibold text-[#5C0000] transition-all hover:-translate-y-0.5 hover:bg-[#ff422a] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Thinking…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  Get instant read
                </>
              )}
            </button>
          </div>
        </form>

        {error ? (
          <div
            role="alert"
            className="mt-4 flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        ) : null}

        {estimate ? (
          <div className="mt-6 rounded-2xl border border-[#FF5E4D]/25 bg-[#FF5E4D]/[0.06] p-5 sm:p-6">
            {estimate.kind === 'clarify' ? (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <BlobMascotIcon className="h-9 w-9 shrink-0" mood="hmm" />
                  <div className="min-w-0 space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
                      Need a bit more
                    </p>
                    <p className="text-sm leading-relaxed text-white/90 sm:text-base">
                      {estimate.question}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleClarify} className="space-y-3 border-t border-white/10 pt-4">
                  <label htmlFor="clarify-answer" className="sr-only">
                    Your answer
                  </label>
                  <textarea
                    id="clarify-answer"
                    ref={clarifyInputRef}
                    rows={3}
                    value={clarifyAnswer}
                    onChange={(event) => setClarifyAnswer(event.target.value.slice(0, 500))}
                    placeholder="Type your answer here…"
                    className="w-full resize-none rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#FF5E4D] focus:ring-1 focus:ring-[#FF5E4D]"
                    disabled={loading}
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading || !clarifyAnswer.trim()}
                    className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#FF5540] px-5 text-sm font-semibold text-[#5C0000] transition-all hover:-translate-y-0.5 hover:bg-[#ff422a] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 sm:w-auto sm:self-end"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        Thinking…
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" aria-hidden="true" />
                        Continue with this detail
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <>
                <EstimateReadResult estimate={estimate} />

                <div className="mt-5 border-t border-white/10 pt-5">
                  {briefState === 'sent' ? (
                    <p className="flex items-center gap-2 text-sm text-emerald-400">
                      <Check className="h-4 w-4" aria-hidden="true" />
                      Got it - our team will follow up by email shortly.
                    </p>
                  ) : (
                    <form onSubmit={handleBrief} className="flex flex-col gap-2">
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(event) => setName(event.target.value)}
                          placeholder="Your name"
                          autoComplete="name"
                          className="h-11 flex-1 rounded-xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#FF5E4D] focus:ring-1 focus:ring-[#FF5E4D]"
                        />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          placeholder="you@company.com"
                          autoComplete="email"
                          className="h-11 flex-1 rounded-xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#FF5E4D] focus:ring-1 focus:ring-[#FF5E4D]"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={briefState === 'sending'}
                        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/15 px-5 text-sm font-semibold text-white transition-colors hover:border-[#FF5E4D] hover:text-[#FF5E4D] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:self-end"
                      >
                        <Mail className="h-4 w-4" aria-hidden="true" />
                        {briefState === 'sending' ? 'Sending…' : 'Request a follow-up'}
                      </button>
                    </form>
                  )}
                  {briefState === 'error' && briefError ? (
                    <p className="mt-2 text-xs text-red-300">{briefError}</p>
                  ) : null}
                </div>
              </>
            )}
          </div>
        ) : null}
      </div>
    </section>
  )
}
