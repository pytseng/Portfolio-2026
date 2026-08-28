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
  secretStashPaySearch: 'secret-stash/pay-01-search.png',
  secretStashPayExpand: 'secret-stash/pay-02-expand.png',
  secretStashPayAdd: 'secret-stash/pay-03-add.png',
  secretStashPayCart: 'secret-stash/pay-04-cart.png',
  secretStashPayCheckout: 'secret-stash/pay-05-checkout.png',
  secretStashPayFill: 'secret-stash/pay-06-fill.png',
  secretStashPayComplete: 'secret-stash/pay-07-complete.png',
  secretStashPayStash: 'secret-stash/pay-08-stash.png',
  secretStashPayFlow: 'secret-stash/pay-flow.mp4',
  secretStashPayFlowPoster: 'secret-stash/pay-flow-poster.png',
} as const

export type MediaAssetKey = keyof typeof mediaAssets
