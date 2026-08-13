/**
 * Punch photographic black that sits *above* the hair, not in it.
 *
 * The CSS mask is a two-pose union matte, so unused head volume would otherwise
 * paint an opaque black smudge over the heading and the fire behind the crown.
 * Each column is keyed from the top until the first real subject pixel — so
 * dark hair cannot tunnel the key the way a flood-fill would. The hoodie is
 * below this band and is never touched.
 */
const HAIR_KEY_BAND = 0.42
const LUMA_CUTOFF = 14
const CHROMA_LIMIT = 8
const FRINGE_PX = 2

const luma = (r: number, g: number, b: number) =>
  0.2126 * r + 0.7152 * g + 0.0722 * b

const isBackdrop = (data: Uint8ClampedArray, i: number) => {
  const r = data[i]
  const g = data[i + 1]
  const b = data[i + 2]
  if (Math.max(r, g, b) - Math.min(r, g, b) > CHROMA_LIMIT) return false
  return luma(r, g, b) < LUMA_CUTOFF
}

export async function keyHairBackdrop(
  bitmap: ImageBitmap,
): Promise<ImageBitmap> {
  const width = bitmap.width
  const height = bitmap.height
  const bandH = Math.max(1, Math.ceil(height * HAIR_KEY_BAND))

  const canvas =
    typeof OffscreenCanvas === 'function'
      ? new OffscreenCanvas(width, height)
      : Object.assign(document.createElement('canvas'), { width, height })

  const ctx = canvas.getContext('2d', { willReadFrequently: true }) as
    | OffscreenCanvasRenderingContext2D
    | CanvasRenderingContext2D
    | null
  if (!ctx) return bitmap

  ctx.drawImage(bitmap, 0, 0)
  const image = ctx.getImageData(0, 0, width, bandH)
  const data = image.data

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < bandH; y++) {
      const i = (y * width + x) * 4
      if (isBackdrop(data, i)) {
        data[i + 3] = 0
        continue
      }
      for (let k = 0; k < FRINGE_PX && y + k < bandH; k++) {
        data[((y + k) * width + x) * 4 + 3] = 0
      }
      break
    }
  }

  ctx.putImageData(image, 0, 0)

  const keyed =
    'transferToImageBitmap' in canvas
      ? (canvas as OffscreenCanvas).transferToImageBitmap()
      : await createImageBitmap(canvas as HTMLCanvasElement)

  bitmap.close()
  return keyed
}
