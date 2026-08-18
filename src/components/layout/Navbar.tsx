import { useState, useEffect, useRef } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'

interface NavItem {
  label: string
  href: string
  isRoute?: boolean
  disabled?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Services', href: '/services', isRoute: true },
  { label: 'About Us', href: '/about', isRoute: true },
  { label: 'Process', href: '/process', isRoute: true },
  { label: 'Case Studies', href: '/#cases' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const [introLoading, setIntroLoading] = useState(true)
  const lastScrollY = useRef(0)

  const routerState = useRouterState()
  const currentPath = routerState?.location?.pathname ?? ''

  // Listen to branded intro loading state
  useEffect(() => {
    // If not on home page, no intro loading exists
    if (currentPath !== '/' && currentPath !== '') {
      setIntroLoading(false)
      return
    }

    const handleIntroState = (e: any) => {
      setIntroLoading(Boolean(e.detail?.loading))
    }

    window.addEventListener('intro-loading-state', handleIntroState)

    // Check if initial document attribute is set
    if (typeof document !== 'undefined') {
      if (!document.documentElement.hasAttribute('data-intro-loading')) {
        // If attribute not set, assume loading is done
        const timer = setTimeout(() => {
          if (!document.documentElement.hasAttribute('data-intro-loading')) {
            setIntroLoading(false)
          }
        }, 150)
        return () => {
          clearTimeout(timer)
          window.removeEventListener('intro-loading-state', handleIntroState)
        }
      }
    }

    return () => {
      window.removeEventListener('intro-loading-state', handleIntroState)
    }
  }, [currentPath])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrolled(currentScrollY > 20)

      const diff = currentScrollY - lastScrollY.current

      // Lock visible at top of page
      if (currentScrollY <= 40) {
        setVisible(true)
        lastScrollY.current = currentScrollY
        return
      }

      // Require 10px scroll delta to prevent micro-jitter flicker
      if (Math.abs(diff) > 10) {
        if (diff > 0 && !open) {
          // Scrolling DOWN -> stash navbar
          setVisible(false)
        } else if (diff < 0) {
          // Scrolling UP -> reveal navbar smoothly
          setVisible(true)
        }
        lastScrollY.current = currentScrollY
      }
    }

    // Run on initial mount
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 border-0 border-none outline-none transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${visible && !introLoading ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        } ${scrolled ? 'bg-black/80 backdrop-blur-xl shadow-lg shadow-black/50' : 'bg-transparent'
        }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        {/* Brand logo — Hanken Grotesk wordmark */}
        <Link
          to="/"
          className="flex items-center gap-2 border-0 border-none outline-none ring-0 shadow-none select-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 active:outline-none active:border-none no-underline"
          aria-label="Vizualabs home"
        >
          <span className="font-hanken text-[1.65rem] font-extrabold tracking-tight text-white border-0 border-none outline-none ring-0 select-none">
            Vizualabs
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => {
            if (item.disabled) {
              return (
                <span
                  key={item.label}
                  className="nav-link cursor-not-allowed opacity-35 select-none hover:text-inherit"
                  aria-disabled="true"
                >
                  {item.label}
                </span>
              )
            }

            const isActive = item.isRoute
              ? currentPath === item.href ||
              (item.href === '/services' && currentPath.startsWith('/service')) ||
              (item.href === '/about' && currentPath.startsWith('/about')) ||
              (item.href === '/process' && currentPath.startsWith('/process'))
              : false

            if (item.isRoute) {
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                >
                  {item.label}
                </Link>
              )
            }

            return (
              <a
                key={item.href}
                href={item.href}
                className="nav-link"
              >
                {item.label}
              </a>
            )
          })}
        </nav>

        {/* Contact button — solid red-orange pill button */}
        <div className="hidden md:block">
          <a href="/contact#contact" className="nav-contact-btn">
            Contact Us
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex md:hidden items-center justify-center rounded-lg p-2 text-[#E5E2E1] transition-colors hover:text-[#FF553E]"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-black/95 px-5 pb-8 pt-2 backdrop-blur-xl border-b border-white/10">
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              if (item.disabled) {
                return (
                  <span
                    key={item.label}
                    className="nav-link nav-link-mobile cursor-not-allowed opacity-35 select-none hover:text-inherit"
                    aria-disabled="true"
                  >
                    {item.label}
                  </span>
                )
              }

              const isActive = item.isRoute
                ? currentPath === item.href ||
                (item.href === '/services' && currentPath.startsWith('/service')) ||
                (item.href === '/about' && currentPath.startsWith('/about')) ||
                (item.href === '/process' && currentPath.startsWith('/process'))
                : false

              if (item.isRoute) {
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setOpen(false)}
                    className={`nav-link nav-link-mobile ${isActive ? 'active' : ''}`}
                  >
                    {item.label}
                  </Link>
                )
              }

              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="nav-link nav-link-mobile"
                >
                  {item.label}
                </a>
              )
            })}
            <a
              href="/contact#contact"
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
