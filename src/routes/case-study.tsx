import { createFileRoute } from '@tanstack/react-router'
import { Navbar } from '#/components/layout/Navbar'
import { Footer } from '#/components/layout/Footer'
import { WorkHero } from '#/components/work/WorkHero'
import { CaseStudies } from '#/components/work/CaseStudies'
import { WorkCtaSection } from '#/components/work/WorkCtaSection'

export const Route = createFileRoute('/case-study')({
  component: CaseStudyPage,
  head: () => ({
    meta: [
      { title: 'Case Studies — Vizualabs' },
      {
        name: 'description',
        content: 'Selected projects Vizualabs has engineered — the problems, the builds, and the outcomes.',
      },
      { property: 'og:title', content: 'Case Studies — Vizualabs' },
      {
        property: 'og:description',
        content: 'Selected projects Vizualabs has engineered — the problems, the builds, and the outcomes.',
      },
      { property: 'og:url', content: 'https://vizualabs.com/case-study' },
    ],
  }),
})

function CaseStudyPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#FF5E4D] selection:text-white">
      <Navbar />
      <main>
        <WorkHero />
        <CaseStudies />
        <WorkCtaSection />
      </main>
      <Footer />
    </div>
  )
}
