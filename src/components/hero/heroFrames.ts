/**
 * Shared frame addressing for the scroll-driven hero sequence.
 *
 * Lives outside the component so the document head can preload the opening
 * frames using the exact same URLs the runtime will request — a mismatch would
 * silently double-fetch instead of warming the cache.
 */
export const TOTAL_FRAMES = 121

export const heroFrameUrl = (frameIndex: number) =>
  `/Frist-opt/ezgif-frame-${String(frameIndex).padStart(3, '0')}.webp`

/**
 * Opening frames worth preloading. Enough to get the hero painting immediately
 * without crowding out the stylesheet and route bundle on a cold connection —
 * the remaining frames stream in over fetch once the route JS runs.
 */
export const HERO_PRELOAD_FRAMES = [1, 2, 3, 4, 5, 6]
