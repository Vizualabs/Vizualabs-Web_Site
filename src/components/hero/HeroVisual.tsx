import { Terminal, CheckCircle2, Cpu } from 'lucide-react'

// Hoisted code snippet (vercel-react-best-practices: rendering-hoist-jsx)
const CODE_SNIPPET = [
  'import { VizuaStudio } from "@vizualabs/core"',
  '',
  'const studio = new VizuaStudio({',
  '  mode: "intelligent-automation",',
  '  performance: "ultra-fast",',
  '})',
  '',
  'await studio.deploy({',
  '  scale: "global",',
  '  security: "zero-trust"',
  '})',
]

export function HeroVisual() {
  return (
    <div className="relative w-full max-w-lg mx-auto lg:max-w-none">
      {/* Background Ambient Glow */}
      <div className="absolute -top-12 -left-12 h-72 w-72 bg-indigo-500/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute -bottom-12 -right-12 h-72 w-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" />

      {/* Glassmorphic Code IDE Card */}
      <div className="relative glass-card rounded-2xl p-5 sm:p-6 shadow-2xl shadow-indigo-950/50 border border-gray-800/80 animate-float">
        {/* IDE Header Bar */}
        <div className="flex items-center justify-between border-b border-gray-800/80 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-rose-500/80" />
            <div className="h-3 w-3 rounded-full bg-amber-500/80" />
            <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
          </div>
          <div className="flex items-center gap-2 rounded-md bg-gray-900/80 px-3 py-1 text-xs text-gray-400 font-mono border border-gray-800">
            <Terminal className="h-3.5 w-3.5 text-indigo-400" />
            <span>vizualabs-engine.ts</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Active</span>
          </div>
        </div>

        {/* Code Lines */}
        <div className="font-mono text-xs sm:text-sm space-y-1.5 overflow-x-auto py-2 text-gray-300">
          {CODE_SNIPPET.map((line, idx) => (
            <div key={idx} className="flex items-start gap-4">
              <span className="text-gray-600 select-none text-right w-5">{idx + 1}</span>
              <span className="flex-1">
                {line.includes('import') ? (
                  <>
                    <span className="text-purple-400">import</span>{' '}
                    <span className="text-indigo-300 font-medium">{"{ VizuaStudio }"}</span>{' '}
                    <span className="text-purple-400">from</span>{' '}
                    <span className="text-emerald-300">'"@vizualabs/core"'</span>
                  </>
                ) : line.includes('new') ? (
                  <>
                    <span className="text-purple-400">const</span>{' '}
                    <span className="text-sky-300">studio</span> ={' '}
                    <span className="text-purple-400">new</span>{' '}
                    <span className="text-amber-300">VizuaStudio</span>({"{"}
                  </>
                ) : line.includes(':') ? (
                  <>
                    &nbsp;&nbsp;<span className="text-indigo-300">{line.split(':')[0]}:</span>
                    <span className="text-emerald-300">{line.split(':')[1]}</span>
                  </>
                ) : line.includes('await') ? (
                  <>
                    <span className="text-purple-400">await</span>{' '}
                    <span className="text-sky-300">studio</span>.
                    <span className="text-indigo-300">deploy</span>({"{"}
                  </>
                ) : line.includes('}') ? (
                  <span className="text-gray-400">{line}</span>
                ) : (
                  line
                )}
              </span>
            </div>
          ))}
        </div>

        {/* Floating Feature Floating Cards */}
        <div className="absolute -bottom-6 -left-6 glass-pill rounded-xl p-3.5 shadow-xl border border-indigo-500/30 flex items-center gap-3 hidden sm:flex">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">AI-Powered Tech</div>
            <div className="text-[11px] text-gray-400">Next-gen intelligence</div>
          </div>
        </div>

        <div className="absolute -top-6 -right-6 glass-pill rounded-xl p-3.5 shadow-xl border border-emerald-500/30 flex items-center gap-3 hidden sm:flex">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Enterprise Ready</div>
            <div className="text-[11px] text-gray-400">99.9% Production SLA</div>
          </div>
        </div>
      </div>
    </div>
  )
}
