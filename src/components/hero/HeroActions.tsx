import { ArrowRight, Compass } from 'lucide-react'
import { trackEvent } from '#/lib/analytics'

export function HeroActions() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
      <a
        href="#contact"
        onClick={() => trackEvent('cta_click', { label: 'explore_services', location: 'hero' })}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-400 p-[1.5px] shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group"
      >
        <div className="flex h-full w-full items-center justify-center gap-2.5 rounded-[14.5px] bg-gray-950 px-7 py-3.5 font-semibold text-white group-hover:bg-transparent transition-colors">
          <span>Explore Services</span>
          <ArrowRight className="h-4 w-4 text-indigo-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
        </div>
      </a>

      <a
        href="#portfolio"
        onClick={() => trackEvent('cta_click', { label: 'view_portfolio', location: 'hero' })}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl border border-gray-800 bg-gray-900/60 px-7 py-3.5 text-sm font-semibold text-gray-300 hover:text-white hover:border-gray-700 hover:bg-gray-800/60 backdrop-blur-sm transition-all duration-200"
      >
        <Compass className="h-4 w-4 text-indigo-400" />
        <span>View Portfolio</span>
      </a>
    </div>
  )
}
