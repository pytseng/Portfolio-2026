/**
 * Media placeholders for assets on pytseng.com that Portfolio 2026 cannot
 * host yet (native Squarespace video, expired signed HTML reports,
 * password-protected pages, etc.).
 *
 * Grep for `VIDEO::` or `MEDIA::` (or open this file) when replacing.
 */

export type MediaKind = 'video' | 'image' | 'gif' | 'file' | 'page'

export type MediaPlaceholderMeta = {
  /** Stable replace key — also rendered on the page */
  id: string
  kind: MediaKind
  /** Portfolio 2026 route */
  route: string
  /** Matching pytseng.com path */
  sourcePath: string
  /** Short label shown in the placeholder UI */
  label: string
  /** Optional Squarespace / source asset id */
  sourceId?: string
  /** Optional note for whoever replaces this later */
  note?: string
}

export const mediaPlaceholders: MediaPlaceholderMeta[] = [
  // —— README.MD ——
  // Resolved: hosted at /media/readme/randy-bobandy.mp4 (from local
  // Career 2025/Portfolio dad-bod liquor clip matching pytseng.com duration).
  // {
  //   id: 'VIDEO::readme::randy-bobandy',
  //   kind: 'video',
  //   ...
  // },

  // —— Forma Editor ——
  // Resolved:
  // - overview: /media/forma-editor/hero-overview.mp4
  //   (Movies/CapCut/0523.mov ↔ Squarespace 75a79994… / 150s)
  // - mvp: /media/forma-editor/mvp-run-through.mp4
  //   (Career 2025/Forma Editor/Unity Forma - Run-Through_20201103.mp4)
  // Note: pytseng.com used the same 150s asset for both players; MVP uses the
  // dedicated local run-through cut for a clearer interface demo.

  // —— Gen AI in Render Studio ——
  // Resolved videos (hosted under /media/gen-ai/):
  // - walkthrough: CapCut “Render Studio brief.mov” ↔ 42f8a7e4… (~70.7s)
  // - comparative-audit: CapCut gen ai study part 1 ↔ c9557773… (~26.5s)
  // - mesh-workflow: CapCut gen ai study part 2 ↔ a9c7a5b4… (~20.5s)
  // - manual-ui: CapCut gen ai study part 3 ↔ 37859fb1… (~32.2s)
  // - claude-prototype: CapCut “claudcowork render studio.mov” ↔ 63f56e7b… (~66.9s)
  // - design-decision: CapCut 0403.mov ↔ 29499140… (~10.7s)
  // Resolved reports:
  // - comparative: /media/gen-ai/reports/comparative-analysis.html
  // - meshy: /media/gen-ai/reports/meshy-workflow-analysis.html

  // —— Render Studio ——
  // Resolved (hosted under /media/render-studio/):
  // - product-walkthrough: CapCut “Render Studio brief.mov”
  //   ↔ Squarespace 42f8a7e4… (~70.7s) — Solution + Outcome
  // - output-types: CapCut RenderStudioOutput.mov
  //   ↔ Squarespace 0b3fa169… (~11.3s) — Basic output types
  // Compare panels open-pm / open-mine hosted from Career 2025/Render Studio.

  // —— Forma Cloud ——
  // Resolved: /media/forma-cloud/e2e-walkthrough.mp4
  // CapCut 1007.mov ↔ Squarespace d10d2f4b… (~190.5s)

  // —— AR/VR Design ——
  // Resolved under /media/ar-vr/:
  // - cvpr-poster.pdf
  // - annotator-mode (mf1.mov ↔ fc67e835…)
  // - latest-channel (mf2.mov ↔ 93fd602d…)
  // - channel-selection-1 (mf3.mov ↔ 27f0227b…)
  // - channel-selection-2 (mf123.mov ↔ 30179885…)
  // - vr-keyboard (2021-06-24… ↔ a3ec6c22…)
  // - space-invader-1 (spaceinvaders.MP4 ↔ cfea78b2…)
  // - vr-maker-space (movie1.mp4 ↔ 06320c8f…)
  // - car-simulator (CapCut car simulator.mov ↔ 4d7233c1…)
  // Removed: Artsy / Wifi Signal Visualizer; Space Invader clip 2 (no local ~33s match).

  // —— Junyi / Ford (gated in-app; password: underconstruction) ——
  {
    id: 'MEDIA::junyi::full-page',
    kind: 'page',
    route: '/junyi',
    sourcePath: '/junyi',
    label: 'Junyi Academy — full case study',
    note: 'Route gated via PasswordGate. Replace when full content is ready.',
  },
  {
    id: 'MEDIA::ford::full-page',
    kind: 'page',
    route: '/ford',
    sourcePath: '/ford-1',
    label: 'Ford — Audio Experience — full case study',
    note: 'Route gated via PasswordGate. Replace when full content is ready.',
  },
]

export function getMediaPlaceholder(id: string) {
  const meta = mediaPlaceholders.find((v) => v.id === id)
  if (!meta) throw new Error(`Unknown media placeholder id: ${id}`)
  return meta
}

/** @deprecated use getMediaPlaceholder */
export const getVideoPlaceholder = getMediaPlaceholder
/** @deprecated use mediaPlaceholders */
export const videoPlaceholders = mediaPlaceholders
