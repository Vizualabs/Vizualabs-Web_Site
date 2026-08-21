import { createFileRoute } from '@tanstack/react-router'
import { BookingSection } from '#/components/booking/BookingSection'
import { Footer } from '#/components/layout/Footer'
import { Navbar } from '#/components/layout/Navbar'

export const Route = createFileRoute('/book')({
  component: BookPage,
  head: () => ({
    meta: [
      { title: 'Book a Session — Vizualabs' },
      {
        name: 'description',
        content:
          'Book a strategy session with Vizualabs engineering leads — pick a time that works for you.',
      },
      { property: 'og:title', content: 'Book a Session — Vizualabs' },
      {
        property: 'og:description',
        content:
          'Book a strategy session with Vizualabs engineering leads — pick a time that works for you.',
      },
      { property: 'og:url', content: 'https://vizualabs.com/book' },
    ],
  }),
})

function BookPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans text-white selection:bg-[#FF5540] selection:text-[#0a0a0a]">
      <Navbar />
      <main>
        <BookingSection />
      </main>
      <Footer />
    </div>
  )
}
