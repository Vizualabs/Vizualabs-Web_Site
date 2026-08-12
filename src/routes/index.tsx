import { createFileRoute } from '@tanstack/react-router'
import { ScrollHeroSection } from '../components/hero/ScrollHeroSection'
import { CapabilitiesSection } from '../components/layout/CapabilitiesSection'
import { StrategicJourney } from '../components/layout/StrategicJourney'
import { CtaSection } from '../components/layout/CtaSection'
import { Footer } from '../components/layout/Footer'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#FF5E4D] selection:text-white">
      {/* Scroll-driven canvas image sequence Hero Section */}
      <ScrollHeroSection />

      {/* Continuation section after scroll sequence completes */}
      <section className="defer-paint relative z-30 bg-black py-24 sm:py-32 px-5 sm:px-6 border-t border-white/10 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/5 text-[10px] sm:text-xs text-gray-300 font-mono">
            <span>SEQUENCE COMPLETE</span>
          </div>
          <h2 className="text-3xl sm:text-6xl font-black tracking-tight text-white">
            Crafting Extraordinary Digital Experiences
          </h2>
          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
            From interactive product reveals to enterprise software architecture, we combine cutting-edge engineering with immersive visual design.
          </p>
        </div>
      </section>

      {/* Below-the-fold sections opt into content-visibility so their layout
          and paint stay off the initial-load critical path. */}
      <div className="defer-paint">
        <CapabilitiesSection />
      </div>

      <div className="defer-paint">
        <StrategicJourney />
      </div>

      <div className="defer-paint">
        <CtaSection />
      </div>

      {/* Footer Section */}
      <Footer />
    </div>
  )
}

