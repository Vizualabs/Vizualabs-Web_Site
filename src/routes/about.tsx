import { createFileRoute } from '@tanstack/react-router'
import { Navbar } from '#/components/layout/Navbar'
import { Footer } from '#/components/layout/Footer'
import { AboutHero } from '#/components/about/AboutHero'
import { AboutPillars } from '#/components/about/AboutPillars'

// No manual code-splitting needed here: TanStack Start's Vite plugin
// already auto-splits each route's component into its own chunk
// (`?tsr-split=component`), so AboutPillars' `motion` dependency is
// already isolated to the /about chunk without any extra work.
export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-[#FF5540] selection:text-white">
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
