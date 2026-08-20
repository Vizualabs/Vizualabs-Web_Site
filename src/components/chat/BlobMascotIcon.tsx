import type { CSSProperties } from 'react'
import { JellyBlobMascot, type JellyBlobMascotProps } from 'feral-blob'
import 'feral-blob/blob.css'

/** Vizualabs coral skin — matches brand #FF5E4D. */
export const BLOB_CORAL_SKIN = {
  '--jelly-body-top': '#FFA36B',
  '--jelly-body-mid': '#FF5E4D',
  '--jelly-body-deep': '#E8482F',
  '--jelly-body-rim': '#FF6B5A',
  '--jelly-outline': '#C93A2A',
  '--jelly-outline-light': '#E8482F',
  '--jelly-arm-light': '#FFB088',
  '--jelly-arm-mid': '#FF5E4D',
  '--jelly-arm-deep': '#E8482F',
  '--jelly-cheek-light': '#FFD9C7',
  '--jelly-cheek': '#FF9A8A',
  '--jelly-cheek-deep': '#F08070',
  '--jelly-eye-light': '#3A1408',
  '--jelly-eye': '#2A0E06',
  '--jelly-eye-deep': '#1A0804',
  '--jelly-belly-glow': '#FFB8A0',
  '--jelly-eye-sparkle': '#FF7A6A',
} as CSSProperties

type BlobMascotIconProps = {
  className?: string
  mood?: JellyBlobMascotProps['mood']
  gaze?: JellyBlobMascotProps['gaze']
  nod?: boolean
  mouth?: JellyBlobMascotProps['mouth']
  onOverpoke?: JellyBlobMascotProps['onOverpoke']
}

export function BlobMascotIcon({
  className = 'h-8 w-8',
  mood = 'happy',
  gaze,
  nod,
  mouth,
  onOverpoke,
}: BlobMascotIconProps) {
  return (
    <div className={className} style={BLOB_CORAL_SKIN} aria-hidden="true">
      <JellyBlobMascot
        mood={mood}
        gaze={gaze}
        nod={nod}
        mouth={mouth}
        onOverpoke={onOverpoke}
        happyEyes="star"
        className="h-full w-full"
      />
    </div>
  )
}
