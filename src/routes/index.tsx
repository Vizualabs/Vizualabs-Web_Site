import { createFileRoute } from '@tanstack/react-router'
import { ScrollHeroSection } from '../components/hero/ScrollHeroSection'
import { LogoCloud } from '../components/layout/LogoCloud'
import { CapabilitiesSection } from '../components/layout/CapabilitiesSection'
import { TestimonialsSection } from '../components/layout/TestimonialsSection'
import { StrategicJourney } from '../components/layout/StrategicJourney'
import { ProjectEstimator } from '../components/estimator/ProjectEstimator'
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
        <LogoCloud />
      </div>

      <div className="defer-paint">
        <CapabilitiesSection />
      </div>

      <div className="defer-paint">
        <TestimonialsSection />
      </div>

      {/* The Strategic Journey Cyclical Step Animation Section */}
      <div className="defer-paint">
        <StrategicJourney />
      </div>

      <div className="defer-paint">
        <ProjectEstimator />
      </div>

      <div className="defer-paint">
        <CtaSection />
      </div>

      {/* Footer Section */}
      <Footer />
    </div>
  )
}
