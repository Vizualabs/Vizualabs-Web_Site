import { createFileRoute } from '@tanstack/react-router'
import { Navbar } from '#/components/layout/Navbar'
import { Footer } from '#/components/layout/Footer'
import { ComingSoonHero } from '#/components/coming-soon/ComingSoonHero'
import { ComingSoonPreview } from '#/components/coming-soon/ComingSoonPreview'

export const Route = createFileRoute('/coming-soon')({
  component: ComingSoonPage,
  head: () => ({
    meta: [
      { title: 'Case Studies — Coming Soon | Vizualabs' },
      {
        name: 'description',
        content:
          'Vizualabs technical case studies and architectural breakdowns are arriving soon. Explore our upcoming engineering deep dives and production blueprints.',
      },
      { property: 'og:title', content: 'Case Studies — Coming Soon | Vizualabs' },
      {
        property: 'og:description',
        content:
          'Vizualabs technical case studies and architectural breakdowns are arriving soon. Explore our upcoming engineering deep dives and production blueprints.',
      },
      { property: 'og:url', content: 'https://vizualabs.com/coming-soon' },
    ],
  }),
})

function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#FF5540] selection:text-white">
      <Navbar />
      <main>
        <ComingSoonHero />
        <ComingSoonPreview />
      </main>
      <Footer />
    </div>
  )
}
