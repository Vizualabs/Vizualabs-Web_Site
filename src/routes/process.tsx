import { createFileRoute } from '@tanstack/react-router'
import { Navbar } from '#/components/layout/Navbar'
import { Footer } from '#/components/layout/Footer'
import { ProcessHero } from '#/components/process/ProcessHero'
import { ProcessRoadmap } from '#/components/process/ProcessRoadmap'
import { ProcessDetails } from '#/components/process/ProcessDetails'
import { ProcessCtaSection } from '#/components/process/ProcessCtaSection'

export const Route = createFileRoute('/process')({
  component: ProcessPage,
  head: () => ({
    meta: [{ title: 'Process — Vizualabs' }],
  }),
})

function ProcessPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#FF5E4D] selection:text-white">
      <Navbar />
      <main>
        <ProcessHero />
        <ProcessRoadmap />
        <ProcessDetails />
        <ProcessCtaSection />
      </main>
      <Footer />
    </div>
  )
}
