import { createFileRoute } from '@tanstack/react-router'
import { ContactSection } from '#/components/contact/ContactSection'
import { Footer } from '#/components/layout/Footer'
import { Navbar } from '#/components/layout/Navbar'

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
