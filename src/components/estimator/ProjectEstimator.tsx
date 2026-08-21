import { useState, type FormEvent, type ReactNode } from 'react'
import { Sparkles, Loader2, Mail, Check, AlertCircle } from 'lucide-react'
import { estimateProject, requestWrittenBrief } from '#/lib/assistant/estimate'
import { trackEvent } from '#/lib/analytics'
import { BlobMascotIcon } from '#/components/chat/BlobMascotIcon'

const MAX_LENGTH = 1500

function renderInline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i} className="font-semibold text-white">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    )
  )
}

/** Claude's response uses light markdown ("- " bullets, **bold** labels) —
 *  parsed here rather than trusting dangerouslySetInnerHTML with model output. */
function renderEstimate(text: string): ReactNode[] {
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
  const blocks: ReactNode[] = []
  let bulletBuffer: string[] = []

  const flushBullets = () => {
    if (bulletBuffer.length === 0) return
    blocks.push(
      <ul key={`ul-${blocks.length}`} className="mt-2 space-y-1.5 pl-5">
        {bulletBuffer.map((item, i) => (
          <li key={i} className="list-disc marker:text-[#FF5E4D]">
            {renderInline(item)}
          </li>
        ))}
      </ul>
    )
    bulletBuffer = []
  }

  for (const line of lines) {
    if (line.startsWith('- ')) {
      bulletBuffer.push(line.slice(2))
    } else {
      flushBullets()
      blocks.push(
        <p key={blocks.length} className="mt-3 first:mt-0">
          {renderInline(line)}
        </p>
      )
    }
  }
  flushBullets()
  return blocks
}

export function ProjectEstimator() {
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [estimate, setEstimate] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [email, setEmail] = useState('')
  const [briefState, setBriefState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [briefError, setBriefError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (loading || !description.trim()) return

    setLoading(true)
    setError(null)
    setEstimate(null)
    trackEvent('estimator_submit')

    try {
      const result = await estimateProject({ data: { description } })
      if (result.ok) {
        setEstimate(result.estimate)
        trackEvent('estimator_result_shown')
      } else {
        setError(result.error)
      }
    } catch {
      setError('Something went wrong generating that read. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleBrief = async (event: FormEvent) => {
    event.preventDefault()
    if (briefState === 'sending') return

    setBriefState('sending')
    setBriefError(null)

    try {
      const result = await requestWrittenBrief({
        data: { email, description, estimate: estimate ?? '' },
      })
      if (result.ok) {
        trackEvent('estimator_email_capture')
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
            Describe what you're building. Get an honest, instant read on complexity and
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
            <div className="flex items-start gap-3">
              <BlobMascotIcon className="h-9 w-9 shrink-0" mood="happy" />
              <div className="min-w-0 text-sm leading-relaxed text-white/90 sm:text-base">
                {renderEstimate(estimate)}
              </div>
            </div>

            <div className="mt-5 border-t border-white/10 pt-5">
              {briefState === 'sent' ? (
                <p className="flex items-center gap-2 text-sm text-emerald-400">
                  <Check className="h-4 w-4" aria-hidden="true" />
                  Sent — check your inbox shortly.
                </p>
              ) : (
                <form onSubmit={handleBrief} className="flex flex-col gap-2 sm:flex-row">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@company.com"
                    className="h-11 flex-1 rounded-xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#FF5E4D] focus:ring-1 focus:ring-[#FF5E4D]"
                  />
                  <button
                    type="submit"
                    disabled={briefState === 'sending'}
                    className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-white/15 px-5 text-sm font-semibold text-white transition-colors hover:border-[#FF5E4D] hover:text-[#FF5E4D] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    {briefState === 'sending' ? 'Sending…' : 'Email me this'}
                  </button>
                </form>
              )}
              {briefState === 'error' && briefError ? (
                <p className="mt-2 text-xs text-red-300">{briefError}</p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
