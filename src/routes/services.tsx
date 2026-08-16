import { createFileRoute } from '@tanstack/react-router'
import { Navbar } from '../components/layout/Navbar'
import { ServicesHero } from '../components/services/ServicesHero'
import { Footer } from '../components/layout/Footer'

export const Route = createFileRoute('/services')({ component: ServicesPage })

function ServicesPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#FF5E4D] selection:text-white">
      {/* Fixed Navbar with active state on Services */}
      <Navbar />

      {/* Services Hero Section matching exact design */}
      <ServicesHero />

      {/* Footer */}
      <Footer />
    </div>
  )
}
