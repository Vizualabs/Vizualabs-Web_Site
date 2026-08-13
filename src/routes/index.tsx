import { createFileRoute } from '@tanstack/react-router'
import { ScrollHeroSection } from '../components/hero/ScrollHeroSection'
import { CapabilitiesSection } from '../components/layout/CapabilitiesSection'
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


      {/* Below-the-fold sections opt into content-visibility so their layout
          and paint stay off the initial-load critical path. */}
      <div className="defer-paint">
        <CapabilitiesSection />
      </div>

      <div className="defer-paint">
        <CtaSection />
      </div>

      {/* Footer Section */}
      <Footer />
    </div>
  )
}

