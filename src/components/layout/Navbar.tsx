import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Services', href: '#services' },
  { label: 'About Us', href: '#about' },
  { label: 'Process', href: '#process' },
  { label: 'Case Studies', href: '#cases' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        {/* Brand logo — Hanken Grotesk wordmark */}
        <a href="/" className="flex items-center gap-2" aria-label="Vizualabs home">
          <span className="font-hanken text-[1.65rem] font-extrabold tracking-tight text-white">
            Vizualabs
          </span>
        </a>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href} className="nav-link">
              {item.label}
            </a>
          ))}
        </nav>

        {/* Contact button — solid red-orange pill button */}
        <div className="hidden md:block">
          <a href="#contact" className="nav-contact-btn">
            Contact Us
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex md:hidden items-center justify-center rounded-lg p-2 text-[#E5E2E1] transition-colors hover:text-[#FF5540]"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-black/90 px-5 pb-8 pt-2 backdrop-blur-xl border-b border-white/10">
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="nav-link nav-link-mobile"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="nav-contact-btn mt-4 justify-center"
            >
              Contact Us
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
