/**
 * Known R2 object keys for this portfolio.
 * Upload files to the bucket using these exact paths, then reference via mediaUrl().
 */
export const mediaAssets = {
  secretStashHeroBg: 'secret-stash/herobg.png',
  secretStashReasoning: 'secret-stash/reasoning.gif',
  secretStashScoping: 'secret-stash/scoping.gif',
  secretStashHaiPrefs: 'secret-stash/hai-prefs.png?v=20260803b',
  secretStashHaiClarify: 'secret-stash/hai-clarify.png?v=20260803b',
  secretStashHaiOwned: 'secret-stash/hai-owned.png?v=20260803b',
  secretStashGroundingK2: 'secret-stash/grounding-k2.png?v=20260803c',
} as const

export type MediaAssetKey = keyof typeof mediaAssets
