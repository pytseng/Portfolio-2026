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
  {
    id: 'MEDIA::gen-ai::civit-report',
    kind: 'file',
    route: '/gen-ai',
    sourcePath: '/image-gen-ai',
    label: 'Civit.ai UI study report (HTML)',
    note: 'Was S3 civit-study.html; local copy not found. Re-host and link here.',
  },

  // —— Render Studio ——
  // Resolved (hosted under /media/render-studio/):
  // - product-walkthrough: CapCut “Render Studio brief.mov”
  //   ↔ Squarespace 42f8a7e4… (~70.7s) — Solution + Outcome
  // - output-types: CapCut RenderStudioOutput.mov
  //   ↔ Squarespace 0b3fa169… (~11.3s) — Basic output types
  // Compare panels open-pm / open-mine hosted from Career 2025/Render Studio.

  // —— Forma Cloud ——
  {
    id: 'VIDEO::forma-cloud::e2e-walkthrough',
    kind: 'video',
    route: '/forma-cloud',
    sourcePath: '/forma-cloud',
    label:
      'Forma Cloud end-to-end walkthrough (bike company link / publish / manage)',
    sourceId: 'd10d2f4b-f338-4b98-b46c-fe28639ed5a7',
  },

  // —— AR/VR Design ——
  {
    id: 'MEDIA::ar-vr::cvpr-poster-pdf',
    kind: 'file',
    route: '/ar-vr',
    sourcePath: '/annotate-all',
    label: 'CVPR poster PDF download',
    note: 'Page caption asks for PDF; only a JPEG poster is currently embedded.',
  },
  {
    id: 'VIDEO::ar-vr::annotator-mode',
    kind: 'video',
    route: '/ar-vr',
    sourcePath: '/annotate-all',
    label: 'Annotator Mode',
    sourceId: 'fc67e835-140f-4bc7-beb7-427624fad77f',
  },
  {
    id: 'VIDEO::ar-vr::latest-channel-mode',
    kind: 'video',
    route: '/ar-vr',
    sourcePath: '/annotate-all',
    label: 'Latest Channel Mode',
    sourceId: '93fd602d-3d0f-40c7-9e2a-945f83dee07f',
  },
  {
    id: 'VIDEO::ar-vr::channel-selection-mode-1',
    kind: 'video',
    route: '/ar-vr',
    sourcePath: '/annotate-all',
    label: 'Channel Selection Mode — clip 1',
    sourceId: '27f0227b-2ee3-4090-ba27-a07de38e7443',
  },
  {
    id: 'VIDEO::ar-vr::channel-selection-mode-2',
    kind: 'video',
    route: '/ar-vr',
    sourcePath: '/annotate-all',
    label: 'Channel Selection Mode — clip 2',
    sourceId: '30179885-17c8-475f-bc58-40cdabd187e6',
  },
  {
    id: 'VIDEO::ar-vr::vr-keyboard',
    kind: 'video',
    route: '/ar-vr',
    sourcePath: '/annotate-all',
    label: 'VR Keyboard Design',
    sourceId: 'a3ec6c22-50bc-4a50-ad08-4a83f553ab3c',
  },
  {
    id: 'VIDEO::ar-vr::space-invader-1',
    kind: 'video',
    route: '/ar-vr',
    sourcePath: '/annotate-all',
    label: 'Mobile AR Space Invader — clip 1',
    sourceId: 'cfea78b2-1c29-4284-853f-136a2897081b',
  },
  {
    id: 'VIDEO::ar-vr::space-invader-2',
    kind: 'video',
    route: '/ar-vr',
    sourcePath: '/annotate-all',
    label: 'Mobile AR Space Invader — clip 2',
    sourceId: '5845d1f1-9477-448f-919e-b41548910698',
  },
  {
    id: 'VIDEO::ar-vr::vr-maker-space',
    kind: 'video',
    route: '/ar-vr',
    sourcePath: '/annotate-all',
    label: 'VR Maker Space',
    sourceId: '06320c8f-432f-4157-a845-09126924b32d',
  },
  {
    id: 'VIDEO::ar-vr::car-simulator',
    kind: 'video',
    route: '/ar-vr',
    sourcePath: '/annotate-all',
    label: '360 Car Simulator',
    sourceId: '4d7233c1-4b09-4e87-a4cc-95e758512b23',
  },
  {
    id: 'VIDEO::ar-vr::wifi-missing-recording',
    kind: 'video',
    route: '/ar-vr',
    sourcePath: '/annotate-all',
    label: 'Wifi Signal Visualizer — original recording (missing on source site)',
  },
  {
    id: 'VIDEO::ar-vr::wifi-unity-prototype',
    kind: 'video',
    route: '/ar-vr',
    sourcePath: '/annotate-all',
    label: 'Wifi Alchemist — prototype ran on Unity gameplay',
    sourceId: '1e1ff733-f3ee-4602-983d-7cb61615bc9e',
  },

  // —— Junyi / Ford (password-protected on pytseng.com) ——
  {
    id: 'MEDIA::junyi::full-page',
    kind: 'page',
    route: '/junyi',
    sourcePath: '/junyi',
    label: 'Junyi Academy — full case study',
    note: 'pytseng.com/junyi is password-protected. Unlock or export content, then replace this page.',
  },
  {
    id: 'MEDIA::ford::full-page',
    kind: 'page',
    route: '/ford',
    sourcePath: '/ford-1',
    label: 'Ford — Audio Experience — full case study',
    note: 'pytseng.com/ford-1 is password-protected. Unlock or export content, then replace this page.',
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
