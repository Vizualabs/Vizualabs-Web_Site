import { keyHairBackdrop } from './keyHairBackdrop'

type DecodeRequest = {
  id: number
  blob: Blob
  sourceWidth: number
  sourceHeight: number
  targetWidth: number
  targetHeight: number
}

type DecodeResponse =
  | { id: number; bitmap: ImageBitmap }
  | { id: number; error: string }

const workerScope = self as unknown as Worker

async function decodeFrame({
  blob,
  sourceWidth,
  sourceHeight,
  targetWidth,
  targetHeight,
}: DecodeRequest) {
  try {
    return await createImageBitmap(blob, 0, 0, sourceWidth, sourceHeight, {
      resizeWidth: targetWidth,
      resizeHeight: targetHeight,
      resizeQuality: 'medium',
    })
  } catch {
    return createImageBitmap(blob)
  }
}

// Keep the expensive pixel-readback work serial inside this dedicated worker.
// The first frame therefore finishes first, while the main thread remains free
// to paint the loader, hydrate React, and respond to the first interaction.
let queue = Promise.resolve()

workerScope.onmessage = (event: MessageEvent<DecodeRequest>) => {
  const request = event.data
  queue = queue.then(async () => {
    try {
      const decoded = await decodeFrame(request)
      const bitmap = await keyHairBackdrop(decoded)
      const response: DecodeResponse = { id: request.id, bitmap }
      workerScope.postMessage(response, [bitmap])
    } catch (error) {
      const response: DecodeResponse = {
        id: request.id,
        error: error instanceof Error ? error.message : 'Frame decode failed',
      }
      workerScope.postMessage(response)
    }
  })
}
