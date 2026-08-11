import { Sparkles } from 'lucide-react'

export function HeroBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/40 px-4 py-1.5 backdrop-blur-md shadow-lg shadow-indigo-500/10 hover:border-indigo-500/50 transition-all duration-300">
      <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
      <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
      <span className="text-xs font-semibold tracking-wide text-indigo-200">
        Next-Gen Software & AI Engineering Studio
      </span>
    </div>
  )
}
