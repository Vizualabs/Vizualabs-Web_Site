import { HeroBadge } from './HeroBadge'
import { HeroHeadline } from './HeroHeadline'
import { HeroActions } from './HeroActions'
import { HeroStats } from './HeroStats'
import { HeroVisual } from './HeroVisual'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-32 bg-grid-pattern bg-radial-glow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <HeroBadge />
            <HeroHeadline />
            <HeroActions />
            <HeroStats />
          </div>

          {/* Right Column: Visual Component */}
          <div className="lg:col-span-5 lg:pl-4">
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  )
}
