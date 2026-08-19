import { useEffect } from 'react'
import { Calendar, X } from 'lucide-react'
import { trackEvent } from '#/lib/analytics'

const CAL_LINK = import.meta.env.VITE_CAL_LINK as string | undefined

interface BookingModalProps {
  open: boolean
  onClose: () => void
  title: string
  subtitle: string
  /** Distinguishes which CTA opened the modal in analytics. */
  source: string
  accentColor?: string
}

/**
 * Real Cal.com booking embed, shared by every "book a call" CTA on the
 * site — replaces what used to be three separate modals that each faked a
 * form submission and never actually booked anything.
 */
export function BookingModal({
  open,
  onClose,
  title,
  subtitle,
  source,
  accentColor = '#FF5E4D',
}: BookingModalProps) {
  useEffect(() => {
    if (open) trackEvent('booking_modal_open', { source })
  }, [open, source])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative flex h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/15 bg-[#121214] shadow-2xl">
        <div className="flex items-center gap-3 border-b border-white/10 p-5 sm:p-6">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border"
            style={{
              backgroundColor: `${accentColor}20`,
              borderColor: `${accentColor}4d`,
              color: accentColor,
            }}
          >
            <Calendar className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-white sm:text-xl">{title}</h3>
            <p className="text-xs text-gray-400 sm:text-sm">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto shrink-0 rounded-full p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close booking dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1">
          {CAL_LINK ? (
            <iframe
              src={`https://cal.com/${CAL_LINK}?embed=true&theme=dark`}
              title="Book a session"
              className="h-full w-full border-0"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
              <p className="text-sm text-gray-400">
                Scheduling isn't configured yet. In the meantime, reach us directly:
              </p>
              <a
                href="mailto:strategy@vizualabs.tech"
                className="font-semibold"
                style={{ color: accentColor }}
              >
                strategy@vizualabs.tech
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
