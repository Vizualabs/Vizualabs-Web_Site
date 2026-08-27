import { lazy, Suspense, useEffect, useState } from 'react'
const LazyAssistantWidget = lazy(() =>
  import('#/components/chat/AssistantWidget').then((module) => ({
    default: module.AssistantWidget,
  })),
)

function DeferredAssistantWidget({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const load = () => setReady(true)
    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout?: number }) => number
      cancelIdleCallback?: (id: number) => void
    }
    const idle = idleWindow.requestIdleCallback?.(load, { timeout: 1200 })
    const timeout = idle === undefined ? window.setTimeout(load, 800) : undefined

    return () => {
      if (idle !== undefined) idleWindow.cancelIdleCallback?.(idle)
      if (timeout !== undefined) window.clearTimeout(timeout)
    }
  }, [])

  if (!ready) return null

  return (
    <Suspense fallback={null}>
      <LazyAssistantWidget open={open} onOpenChange={onOpenChange} />
    </Suspense>
  )
}

function GithubIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
    </svg>
  )
}

function LinkedinIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  )
}

function TwitterIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

export function Footer() {
  const [chatOpen, setChatOpen] = useState(false)

  return (
    <footer className="relative w-full bg-[#080808] border-t border-white/10 text-[#EBBBB4] font-sans selection:bg-[#FF5E4D] selection:text-white pt-16 pb-12 overflow-hidden">
      {/* Background radial glow effect */}
      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[#FF5E4D]/5 blur-[120px]" />
      <div className="pointer-events-none absolute top-0 left-1/4 h-64 w-64 rounded-full bg-[#FF5E4D]/5 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 gap-12 pb-14 border-b border-white/10 md:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          
          {/* Column 1: Brand & Tagline */}
          <div className="space-y-6 md:col-span-2 lg:col-span-2">
            <div>
              <a href="/" className="inline-block">
                <h2 className="text-3xl sm:text-4xl font-bold font-hanken tracking-tight text-[#E5E2E1]">
                  Vizualabs
                </h2>
              </a>
              <p className="mt-4 text-base sm:text-lg text-[#EBBBB4] font-normal font-nimbus max-w-md leading-relaxed">
                Precision in Engineering, Strategic in<br />
                Vision.
              </p>
            </div>
          </div>

          {/* Column 2: SOLUTIONS */}
          <div className="space-y-4">
            <h3 className="text-xs sm:text-sm font-normal font-geist tracking-wider text-[#FF5540] uppercase">
              SOLUTIONS
            </h3>
            <ul className="space-y-3 text-sm sm:text-base font-normal font-nimbus">
              <li>
                <a href="/products" className="hover:text-white transition-colors duration-200 text-[#EBBBB4]">
                  Products
                </a>
              </li>
              <li>
                <a href="/services" className="hover:text-white transition-colors duration-200 text-[#EBBBB4]">
                  Custom Software
                </a>
              </li>
              <li>
                <a href="/services" className="hover:text-white transition-colors duration-200 text-[#EBBBB4]">
                  Product Development
                </a>
              </li>
              <li>
                <a href="/services" className="hover:text-white transition-colors duration-200 text-[#EBBBB4]">
                  AI Solutions
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: COMPANY */}
          <div className="space-y-4">
            <h3 className="text-xs sm:text-sm font-normal font-geist tracking-wider text-[#FF5540] uppercase">
              COMPANY
            </h3>
            <ul className="space-y-3 text-sm sm:text-base font-normal font-nimbus">
              <li>
                <a href="/about" className="hover:text-white transition-colors duration-200 text-[#EBBBB4]">
                  About Us
                </a>
              </li>
              <li>
                <a href="/products" className="hover:text-white transition-colors duration-200 text-[#EBBBB4]">
                  Products
                </a>
              </li>
              <li>
                <a href="/services" className="hover:text-white transition-colors duration-200 text-[#EBBBB4]">
                  Services
                </a>
              </li>
              <li>
                <a href="/process" className="hover:text-white transition-colors duration-200 text-[#EBBBB4]">
                  Process
                </a>
              </li>
              <li>
                <a href="/coming-soon" className="hover:text-white transition-colors duration-200 text-[#EBBBB4]">
                  Case Studies
                </a>
              </li>
              <li>
                <a href="/contact#contact" className="hover:text-white transition-colors duration-200 text-[#EBBBB4]">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: LEGAL */}
          <div className="space-y-4">
            <h3 className="text-xs sm:text-sm font-normal font-geist tracking-wider text-[#FF5540] uppercase">
              LEGAL
            </h3>
            <ul className="space-y-3 text-sm sm:text-base font-normal font-nimbus">
              <li>
                <a href="/privacy" className="hover:text-white transition-colors duration-200 text-[#EBBBB4]">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-white transition-colors duration-200 text-[#EBBBB4]">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Sub-footer */}
        <div className="pt-8 text-center text-xs sm:text-sm text-[#EBBBB4]/60 font-medium font-nimbus tracking-wide">
          <p>© {new Date().getFullYear()} Vizualabs (Pvt.) Ltd. All rights reserved. Precision in Engineering, Strategic in Vision.</p>
        </div>
      </div>

      <DeferredAssistantWidget open={chatOpen} onOpenChange={setChatOpen} />
    </footer>
  )
}
