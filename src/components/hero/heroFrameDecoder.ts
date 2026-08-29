import { keyHairBackdrop } from './keyHairBackdrop'

type DecoderOptions = {
  sourceWidth: number
  sourceHeight: number
  targetWidth: number
  targetHeight: number
}

type DecodeResponse =
  | { id: number; bitmap: ImageBitmap }
  | { id: number; error: string }

type PendingDecode = {
  blob: Blob
  resolve: (bitmap: ImageBitmap) => void
  reject: (error: unknown) => void
}

export type HeroFrameDecoder = {
  decode: (blob: Blob) => Promise<ImageBitmap>
  dispose: () => void
}

async function decodeOnMainThread(blob: Blob, options: DecoderOptions) {
  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(
      blob,
      0,
      0,
      options.sourceWidth,
      options.sourceHeight,
      {
        resizeWidth: options.targetWidth,
        resizeHeight: options.targetHeight,
        resizeQuality: 'medium',
      }
    )
  } catch {
    bitmap = await createImageBitmap(blob)
  }

  try {
    return await keyHairBackdrop(bitmap)
  } catch {
    return bitmap
  }
}
/**
 * Create one decoder worker for the hero sequence.
 *
 * Image decoding, canvas readback, per-pixel hair cleanup, and bitmap creation
 * all happen away from the UI thread. Older browsers retain the exact same
 * visual pipeline through the main-thread fallback.
 */
export function createHeroFrameDecoder(
  options: DecoderOptions
): HeroFrameDecoder {
  let nextId = 0
  let disposed = false
  const pending = new Map<number, PendingDecode>()
  let worker: Worker | null = null

  if (typeof Worker === 'function' && typeof OffscreenCanvas === 'function') {
    try {
      worker = new Worker(new URL('./heroFrameWorker.ts', import.meta.url), {
        type: 'module',
        name: 'vizualabs-hero-frame-decoder',
      })
    } catch {
      worker = null
    }
  }

  const rejectPending = (error: Error) => {
    for (const task of pending.values()) task.reject(error)
    pending.clear()
  }

  if (worker) {
    worker.onmessage = (event: MessageEvent<DecodeResponse>) => {
      const response = event.data
      const task = pending.get(response.id)
      if (!task) {
        if ('bitmap' in response) response.bitmap.close()
        return
      }
      pending.delete(response.id)

      if ('bitmap' in response) {
        task.resolve(response.bitmap)
        return
      }

      // A worker-specific failure should not make the visual disappear. The
      // Blob is still available on the main thread, so retain compatibility.
      void decodeOnMainThread(task.blob, options).then(
        task.resolve,
        task.reject
      )
    }

    worker.onerror = () => {
      worker?.terminate()
      worker = null
      rejectPending(new Error('Hero frame worker stopped unexpectedly'))
    }
  }

  return {
    decode(blob) {
      if (disposed) {
        return Promise.reject(new Error('Hero frame decoder is disposed'))
      }
      if (!worker) return decodeOnMainThread(blob, options)

      const id = ++nextId
      return new Promise<ImageBitmap>((resolve, reject) => {
        pending.set(id, { blob, resolve, reject })
        worker!.postMessage({ id, blob, ...options })
      })
    },
    dispose() {
      disposed = true
      worker?.terminate()
      worker = null
      rejectPending(new Error('Hero frame decoder was disposed'))
    },
  }
}
