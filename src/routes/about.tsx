import { createFileRoute } from '@tanstack/react-router'
import { Navbar } from '#/components/layout/Navbar'
import { Footer } from '#/components/layout/Footer'
import { AboutHero } from '#/components/about/AboutHero'
import { AboutPillars } from '#/components/about/AboutPillars'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  return (
    <div className="min-h-screen bg-[#313131] text-white font-sans selection:bg-[#FF5540] selection:text-white">
      {/* Dynamic Header */}
      <Navbar />

      <main>
        {/* About Hero Section */}
        <AboutHero />

        {/* Pillars / Bento Grid Section */}
        <AboutPillars />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
