/** R2 / CDN base for portfolio media. Empty → fall back to local `/public`. */
export const MEDIA_BASE = (
  import.meta.env.VITE_MEDIA_BASE as string | undefined
)?.replace(/\/$/, '') ?? ''

/**
 * Resolve a media path to a full URL.
 * @example mediaUrl('secret-stash/reasoning.gif')
 */
export function mediaUrl(path: string): string {
  const clean = path.replace(/^\//, '')
  if (!MEDIA_BASE) return `/${clean}`
  return `${MEDIA_BASE}/${clean}`
}
