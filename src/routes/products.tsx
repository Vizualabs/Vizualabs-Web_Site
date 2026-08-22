import { createFileRoute } from '@tanstack/react-router'
import { Navbar } from '#/components/layout/Navbar'
import { Footer } from '#/components/layout/Footer'
import { ProductsHero } from '#/components/products/ProductsHero'
import { ProductShowcase } from '#/components/products/ProductShowcase'
import { ProductsCapabilitiesMarquee } from '#/components/products/ProductsCapabilitiesMarquee'
import { ProductsCta } from '#/components/products/ProductsCta'

export const Route = createFileRoute('/products')({
  component: ProductsPage,
  head: () => ({
    meta: [
      { title: 'Products — Vizualabs' },
      {
        name: 'description',
        content:
          'Explore Vizualabs products: Odeasy business AI agent, Dine Mate restaurant POS, and Doc Channeling healthcare AI for scheduling, queues, and triage.',
      },
      { property: 'og:title', content: 'Products — Vizualabs' },
      {
        property: 'og:description',
        content:
          'Odeasy, Dine Mate, and Doc Channeling — production software from Vizualabs for ops, dining, and healthcare.',
      },
      { property: 'og:url', content: 'https://vizualabs.com/products' },
    ],
  }),
})

function ProductsPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#FF5E4D] selection:text-white">
      <Navbar />
      <main>
        <ProductsHero />
        <ProductsCapabilitiesMarquee />
        <ProductShowcase />
        <ProductsCta />
      </main>
      <Footer />
    </div>
  )
}
