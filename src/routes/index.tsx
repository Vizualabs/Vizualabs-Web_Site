import { createFileRoute } from '@tanstack/react-router'
import { ScrollHeroSection } from '../components/hero/ScrollHeroSection'
import { CapabilitiesSection } from '../components/layout/CapabilitiesSection'
import { StrategicJourney } from '../components/layout/StrategicJourney'
import { CtaSection } from '../components/layout/CtaSection'
import { Footer } from '../components/layout/Footer'
import { Navbar } from '../components/layout/Navbar'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#FF5E4D] selection:text-white">
      {/* Fixed navbar — sits above the hero, below the intro overlay (z-50). */}
      <Navbar />

      {/* Scroll-driven canvas image sequence Hero Section */}
      <ScrollHeroSection />

      {/* Below-the-fold sections */}
      <div className="defer-paint">
        <CapabilitiesSection />
      </div>

      {/* The Strategic Journey Cyclical Step Animation Section */}
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
