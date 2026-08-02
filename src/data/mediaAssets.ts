/**
 * Known R2 object keys for this portfolio.
 * Upload files to the bucket using these exact paths, then reference via mediaUrl().
 */
export const mediaAssets = {
  secretStashHeroBg: 'secret-stash/herobg.png',
  secretStashReasoning: 'secret-stash/reasoning.gif',
  secretStashScoping: 'secret-stash/scoping.gif',
} as const

export type MediaAssetKey = keyof typeof mediaAssets
