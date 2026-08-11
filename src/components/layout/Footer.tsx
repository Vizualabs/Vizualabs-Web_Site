import { Cpu, Heart, Globe, Code2, Sparkles } from 'lucide-react'

export function Footer() {
  return (
    <footer className="w-full border-t border-gray-800/80 bg-gray-950 py-12 text-gray-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Cpu className="h-4 w-4" />
            </div>
            <span className="font-bold text-lg text-white">Vizualabs</span>
            <span className="text-xs text-gray-500">© {new Date().getFullYear()} Vizualabs Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 text-sm font-medium text-gray-400">
            <a href="#solutions" className="hover:text-white transition-colors">Solutions</a>
            <a href="#services" className="hover:text-white transition-colors">Services</a>
            <a href="#products" className="hover:text-white transition-colors">Products</a>
            <a href="#about" className="hover:text-white transition-colors">About Studio</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
