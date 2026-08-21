import { Link } from '@tanstack/react-router'

export function GlobalError({ error, reset }: { error: unknown; reset?: () => void }) {
  const message = error instanceof Error ? error.message : 'Something went wrong.'

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center font-sans text-white selection:bg-[#FF5E4D] selection:text-white">
      <p className="font-hanken text-[5rem] sm:text-[6.5rem] font-extrabold leading-none tracking-tight text-[#E5E2E1]">
        Oops
      </p>
      <h1 className="mt-4 text-2xl sm:text-3xl font-semibold text-[#E5E2E1]">
        Something broke on our end
      </h1>
      <p className="mt-3 max-w-md text-sm sm:text-base text-[#E5E2E1]/60">{message}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {reset ? (
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center rounded-full bg-[#FF5E4D] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#FF5E4D]/25 transition-all duration-200 hover:bg-[#ff4836] hover:-translate-y-0.5 active:translate-y-0"
          >
            Try again
          </button>
        ) : null}
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:border-white/40 hover:-translate-y-0.5 active:translate-y-0"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
