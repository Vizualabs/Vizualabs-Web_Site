/** Lightweight className merge — no clsx/twMerge deps required. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}
