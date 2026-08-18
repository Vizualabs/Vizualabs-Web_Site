import { Link } from '@tanstack/react-router'

export function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center font-sans text-white selection:bg-[#FF5E4D] selection:text-white">
      <p className="font-hanken text-[6rem] sm:text-[8rem] font-extrabold leading-none tracking-tight text-[#E5E2E1]">
        404
      </p>
      <h1 className="mt-4 text-2xl sm:text-3xl font-semibold text-[#E5E2E1]">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-sm sm:text-base text-[#E5E2E1]/60">
        The page you are looking for doesn't exist or may have been moved.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center justify-center rounded-full bg-[#FF5E4D] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#FF5E4D]/25 transition-all duration-200 hover:bg-[#ff4836] hover:-translate-y-0.5 active:translate-y-0"
      >
        Back to Home
      </Link>
    </div>
  )
}
