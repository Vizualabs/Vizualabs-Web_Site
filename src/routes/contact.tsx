import { createFileRoute } from '@tanstack/react-router'
import { ContactSection } from '#/components/contact/ContactSection'
import { Footer } from '#/components/layout/Footer'
import { Navbar } from '#/components/layout/Navbar'

// No manual code-splitting needed here: TanStack Start's Vite plugin
// already auto-splits each route's component into its own chunk
// (`?tsr-split=component`), so ContactSection's `motion` dependency is
// already isolated to the /contact chunk without any extra work.
export const Route = createFileRoute('/contact')({
  component: ContactPage,
})

function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans text-white selection:bg-[#FF5540] selection:text-[#0a0a0a]">
      <Navbar />
      <main>
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
