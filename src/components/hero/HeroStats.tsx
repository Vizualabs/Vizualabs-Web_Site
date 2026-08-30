import { Zap, Code, Award } from 'lucide-react'

// Static stats array hoisted to module scope (vercel-react-best-practices: rendering-hoist-jsx)
const STATS_DATA = [
  {
    icon: Zap,
    value: '99.9%',
    label: 'Uptime & Reliability',
  },
  {
    icon: Code,
    value: '50+',
    label: 'Projects Delivered',
  },
  {
    icon: Award,
    value: '10x',
    label: 'Speed & Scale',
  },
] as const

export function HeroStats() {
  return (
    <div className="pt-8 border-t border-gray-800/60 grid grid-cols-3 gap-4 sm:gap-8 max-w-xl mx-auto lg:mx-0">
      {STATS_DATA.map((stat) => {
        const IconComponent = stat.icon
        return (
          <div key={stat.label} className="flex flex-col items-center lg:items-start group">
            <div className="flex items-center gap-2 mb-1">
              <IconComponent className="h-4 w-4 text-indigo-400 group-hover:scale-110 transition-transform" />
              <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {stat.value}
              </span>
            </div>
            <span className="text-xs sm:text-sm text-gray-400 font-medium text-center lg:text-left">
              {stat.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
