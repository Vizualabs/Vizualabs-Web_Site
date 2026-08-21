import { createFileRoute } from '@tanstack/react-router'
import { Navbar } from '#/components/layout/Navbar'
import { Footer } from '#/components/layout/Footer'
import { ProcessHero } from '#/components/process/ProcessHero'
import { ProcessRoadmap } from '#/components/process/ProcessRoadmap'
import { ProcessTerminalSection } from '#/components/process/ProcessTerminalSection'
import { ProcessDetails } from '#/components/process/ProcessDetails'
import { ProcessCtaSection } from '#/components/process/ProcessCtaSection'

// No manual code-splitting needed here: TanStack Start's Vite plugin
// already auto-splits each route's component into its own chunk
// (`?tsr-split=component`), so ProcessRoadmap's `motion` dependency is
// already isolated to the /process chunk without any extra work.
export const Route = createFileRoute('/process')({
  component: ProcessPage,
  head: () => ({
    meta: [
      { title: 'Process — Vizualabs' },
      {
        name: 'description',
        content:
          'A disciplined process from first idea to launch and beyond — see how Vizualabs engineers momentum at every stage.',
      },
      { property: 'og:title', content: 'Process — Vizualabs' },
      {
        property: 'og:description',
        content:
          'A disciplined process from first idea to launch and beyond — see how Vizualabs engineers momentum at every stage.',
      },
      { property: 'og:url', content: 'https://vizualabs.com/process' },
    ],
  }),
})

function ProcessPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#FF5E4D] selection:text-white">
      <Navbar />
      <main>
        <ProcessHero />
        <ProcessRoadmap />
        <ProcessTerminalSection />
        <ProcessDetails />
        <ProcessCtaSection />
      </main>
      <Footer />
    </div>
  )
}
