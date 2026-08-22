/**
 * TanStack Start's createClientRpc reads process.env.TSS_SERVER_FN_BASE at
 * module init. After some Vite HMR/program reloads that env object is missing
 * in the browser and contact/chat/estimator crash with "process is not defined".
 * Seed a safe default before any createServerFn client stub evaluates.
 */
const g = globalThis as typeof globalThis & {
  process?: { env?: Record<string, string | undefined> }
}

if (typeof g.process === 'undefined') {
  g.process = { env: {} }
}
if (!g.process.env) {
  g.process.env = {}
}
if (!g.process.env.TSS_SERVER_FN_BASE) {
  g.process.env.TSS_SERVER_FN_BASE = '/_serverFn/'
}

export {}
