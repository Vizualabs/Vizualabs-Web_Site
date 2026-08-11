import { useState } from 'react'
import {
  MessageSquare,
  Mail,
  Globe,
  ArrowUpRight,
  Send,
  X,
  CheckCircle2
} from 'lucide-react'

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
  const [msgSent, setMsgSent] = useState(false)
  const [messageInput, setMessageInput] = useState('')

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageInput.trim()) return
    setMsgSent(true)
    setTimeout(() => {
      setMsgSent(false)
      setMessageInput('')
      setChatOpen(false)
    }, 2500)
  }

  return (
    <footer className="relative w-full bg-[#080808] border-t border-white/10 text-gray-300 font-sans selection:bg-[#FF5E4D] selection:text-white pt-16 pb-12 overflow-hidden">
      {/* Background radial glow effect */}
      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[#FF5E4D]/5 blur-[120px]" />
      <div className="pointer-events-none absolute top-0 left-1/4 h-64 w-64 rounded-full bg-[#FF5E4D]/5 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 pb-14 border-b border-white/10">
          
          {/* Column 1: Brand & Tagline */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <a href="/" className="inline-block">
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-2">
                  Vizualabs
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#FF5E4D] shadow-[0_0_10px_#FF5E4D]" />
                </h2>
              </a>
              <p className="mt-4 text-base sm:text-lg text-gray-400 font-normal max-w-md leading-relaxed">
                Precision in Engineering, Strategic in Vision.
              </p>
            </div>

            {/* Social & Quick Contact Badges matching Corner Msg Icon style */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Connect With Us
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setChatOpen(true)}
                  aria-label="Open Chat"
                  className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-[#FF5E4D] text-white shadow-md shadow-[#FF5E4D]/25 transition-all duration-300 hover:scale-110 active:scale-95 hover:bg-[#ff4634]"
                >
                  <MessageSquare className="h-5 w-5 fill-white text-white transition-transform group-hover:rotate-12" />
                </button>
                <a
                  href="mailto:contact@vizualabs.com"
                  aria-label="Email Us"
                  className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-[#FF5E4D] text-white shadow-md shadow-[#FF5E4D]/25 transition-all duration-300 hover:scale-110 active:scale-95 hover:bg-[#ff4634]"
                >
                  <Mail className="h-5 w-5 fill-white text-[#FF5E4D] group-hover:text-white transition-colors" />
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-[#FF5E4D] text-white shadow-md shadow-[#FF5E4D]/25 transition-all duration-300 hover:scale-110 active:scale-95 hover:bg-[#ff4634]"
                >
                  <GithubIcon className="h-5 w-5 text-white transition-colors" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-[#FF5E4D] text-white shadow-md shadow-[#FF5E4D]/25 transition-all duration-300 hover:scale-110 active:scale-95 hover:bg-[#ff4634]"
                >
                  <LinkedinIcon className="h-5 w-5 text-white transition-colors" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Twitter"
                  className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-[#FF5E4D] text-white shadow-md shadow-[#FF5E4D]/25 transition-all duration-300 hover:scale-110 active:scale-95 hover:bg-[#ff4634]"
                >
                  <TwitterIcon className="h-5 w-5 text-white transition-colors" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: SOLUTIONS */}
          <div className="space-y-4">
            <h3 className="text-xs sm:text-sm font-bold tracking-wider text-[#FF5E4D] uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5E4D]" />
              SOLUTIONS
            </h3>
            <ul className="space-y-3 text-sm sm:text-base font-normal">
              <li>
                <a href="#solutions" className="hover:text-white transition-colors duration-200 text-gray-300 flex items-center gap-1 group">
                  <span>Custom Software</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#FF5E4D]" />
                </a>
              </li>
              <li>
                <a href="#solutions" className="hover:text-white transition-colors duration-200 text-gray-300 flex items-center gap-1 group">
                  <span>Product Development</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#FF5E4D]" />
                </a>
              </li>
              <li>
                <a href="#solutions" className="hover:text-white transition-colors duration-200 text-gray-300 flex items-center gap-1 group">
                  <span>AI Solutions</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#FF5E4D]" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: COMPANY */}
          <div className="space-y-4">
            <h3 className="text-xs sm:text-sm font-bold tracking-wider text-[#FF5E4D] uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5E4D]" />
              COMPANY
            </h3>
            <ul className="space-y-3 text-sm sm:text-base font-normal">
              <li>
                <a href="#about" className="hover:text-white transition-colors duration-200 text-gray-300 flex items-center gap-1 group">
                  <span>About Us</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#FF5E4D]" />
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors duration-200 text-gray-300 flex items-center gap-1 group">
                  <span>Case Studies</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#FF5E4D]" />
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors duration-200 text-gray-300 flex items-center gap-1 group">
                  <span>Contact</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#FF5E4D]" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: LEGAL */}
          <div className="space-y-4">
            <h3 className="text-xs sm:text-sm font-bold tracking-wider text-[#FF5E4D] uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5E4D]" />
              LEGAL
            </h3>
            <ul className="space-y-3 text-sm sm:text-base font-normal">
              <li>
                <a href="#privacy" className="hover:text-white transition-colors duration-200 text-gray-300 flex items-center gap-1 group">
                  <span>Privacy Policy</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#FF5E4D]" />
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-white transition-colors duration-200 text-gray-300 flex items-center gap-1 group">
                  <span>Terms of Service</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#FF5E4D]" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Sub-footer */}
        <div className="pt-8 text-center text-xs sm:text-sm text-gray-400 font-medium tracking-wide">
          <p>© 2024 Vizualabs. All rights reserved. Precision in Engineering, Strategic in Vision.</p>
        </div>
      </div>

      {/* Interactive Corner Message Modal */}
      {chatOpen && (
        <div className="fixed bottom-20 right-5 sm:right-6 z-50 w-80 sm:w-96 rounded-2xl border border-white/15 bg-black/90 p-5 shadow-2xl backdrop-blur-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FF5E4D]">
                <MessageSquare className="h-3.5 w-3.5 fill-white text-white" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Vizualabs Assistant</h4>
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online
                </span>
              </div>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="rounded-lg p-1 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="py-4">
            {msgSent ? (
              <div className="flex flex-col items-center justify-center py-6 text-center space-y-2">
                <CheckCircle2 className="h-10 w-10 text-[#FF5E4D] animate-bounce" />
                <p className="text-sm font-semibold text-white">Message Delivered!</p>
                <p className="text-xs text-gray-400">Our team will get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-3">
                <p className="text-xs text-gray-300">
                  Have a project in mind or need quick assistance? Send us a quick note below!
                </p>
                <textarea
                  rows={3}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs sm:text-sm text-white placeholder-gray-500 focus:border-[#FF5E4D] focus:outline-none focus:ring-1 focus:ring-[#FF5E4D] transition-all resize-none"
                  required
                />
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#FF5E4D] py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-[#FF5E4D]/25 hover:bg-[#ff4634] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <span>Send Message</span>
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Floating Corner Message Icon Button */}
      <div className="fixed bottom-5 right-5 sm:right-6 z-50">
        <button
          onClick={() => setChatOpen(!chatOpen)}
          aria-label="Toggle Quick Message"
          className="relative group flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#FF5E4D] text-white shadow-xl shadow-[#FF5E4D]/35 transition-all duration-300 hover:scale-110 active:scale-95 hover:bg-[#ff4634] focus:outline-none cursor-pointer"
        >
          {/* Subtle pulse glow animation */}
          <span className="absolute -inset-0.5 rounded-full bg-[#FF5E4D] animate-ping opacity-25 pointer-events-none" />

          {chatOpen ? (
            <X className="h-5 w-5 text-white" />
          ) : (
            <MessageSquare className="h-5 w-5 fill-white text-white group-hover:rotate-12 transition-transform duration-300" />
          )}

          {/* Tooltip on hover */}
          <span className="absolute right-full mr-3 hidden group-hover:block whitespace-nowrap rounded-lg bg-black/90 px-2.5 py-1 text-[11px] font-semibold text-white shadow-lg border border-white/10 backdrop-blur-md">
            Message Us
          </span>
        </button>
      </div>
    </footer>
  )
}

