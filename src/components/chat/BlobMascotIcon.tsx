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

/** White skin for dark/red surfaces (roadmap path). */
export const BLOB_WHITE_SKIN = {
  '--jelly-body-top': '#FFFFFF',
  '--jelly-body-mid': '#F7F7F8',
  '--jelly-body-deep': '#E8E8EC',
  '--jelly-body-rim': '#F2F2F4',
  '--jelly-outline': '#D0D0D6',
  '--jelly-outline-light': '#E4E4E8',
  '--jelly-arm-light': '#FFFFFF',
  '--jelly-arm-mid': '#F0F0F3',
  '--jelly-arm-deep': '#DCDCE2',
  '--jelly-cheek-light': '#FFE4EC',
  '--jelly-cheek': '#FFC4D4',
  '--jelly-cheek-deep': '#F0A8BC',
  '--jelly-eye-light': '#3A1408',
  '--jelly-eye': '#2A0E06',
  '--jelly-eye-deep': '#1A0804',
  '--jelly-belly-glow': '#FFFFFF',
  '--jelly-eye-sparkle': '#B8B8C0',
  '--jelly-shadow': '#8e88a6',
  '--jelly-shadow-light': '#aaa4c0',
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
