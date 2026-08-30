/**
 * TanStack Start's createClientRpc reads process.env.TSS_SERVER_FN_BASE at
 * module init. After some Vite HMR/program reloads that env object is missing
 * in the browser and contact/chat/estimator crash with "process is not defined".
 * Seed a safe default before any createServerFn client stub evaluates.
 */
type ProcessEnvShim = { env: Record<string, string | undefined> }

const runtime = globalThis as unknown as { process?: ProcessEnvShim }

if (typeof runtime.process === 'undefined') {
  runtime.process = { env: {} }
}
if (!runtime.process.env) {
  runtime.process.env = {}
}
if (!runtime.process.env.TSS_SERVER_FN_BASE) {
  runtime.process.env.TSS_SERVER_FN_BASE = '/_serverFn/'
}

export {}
