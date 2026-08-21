const CAL_LINK = import.meta.env.VITE_CAL_LINK as string | undefined

export function getCalLink(): string | undefined {
  return CAL_LINK?.trim() || undefined
}

/** Dark-theme Cal.com embed URL used by the /book page. */
export function getCalEmbedUrl(): string | undefined {
  const link = getCalLink()
  if (!link) return undefined
  return `https://cal.com/${link}?embed=true&theme=dark`
}

export function getCalPublicUrl(): string | undefined {
  const link = getCalLink()
  if (!link) return undefined
  return `https://cal.com/${link}`
}
