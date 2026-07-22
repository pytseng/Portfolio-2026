/**
 * Video placeholders for media that exists on pytseng.com (Squarespace native
 * video) but is not yet re-hosted for Portfolio 2026.
 *
 * Grep this file (or the page for `VIDEO::`) when you have a host URL, then
 * replace the matching <VideoPlaceholder id="…" /> with a real player.
 *
 * Source map: https://www.pytseng.com/ ↔ Portfolio 2026 routes
 */

export type VideoPlaceholderMeta = {
  /** Stable replace key — also rendered on the page */
  id: string
  /** Portfolio 2026 route */
  route: string
  /** Matching pytseng.com path */
  sourcePath: string
  /** Short label shown in the placeholder UI */
  label: string
  /** Optional Squarespace systemDataId for the original asset */
  squarespaceId?: string
}

export const videoPlaceholders: VideoPlaceholderMeta[] = [
  // —— README.MD ——
  {
    id: 'VIDEO::readme::randy-bobandy',
    route: '/readme',
    sourcePath: '/new-page-2',
    label: 'Inspired by Randy Bobandy, the legend',
    squarespaceId: '15929274-6b37-4394-8f97-76511ca2a003',
  },

  // —— Forma Editor ——
  {
    id: 'VIDEO::forma-editor::hero-overview',
    route: '/forma-editor',
    sourcePath: '/forma-editor-1',
    label: 'Forma Editor hero / product overview (native)',
    squarespaceId: '75a79994-e7e5-4435-963d-bd6a3fc8e2a0',
  },
  {
    id: 'VIDEO::forma-editor::mvp-run-through',
    route: '/forma-editor',
    sourcePath: '/forma-editor-1',
    label: 'MVP run through',
  },

  // —— Gen AI in Render Studio ——
  {
    id: 'VIDEO::gen-ai::walkthrough',
    route: '/gen-ai',
    sourcePath: '/image-gen-ai',
    label: 'Video walkthrough of Render Studio',
    squarespaceId: '42f8a7e4-83c4-4d3c-ad2c-2ec785f16a2c',
  },
  {
    id: 'VIDEO::gen-ai::comparative-audit',
    route: '/gen-ai',
    sourcePath: '/image-gen-ai',
    label: 'Create a high-level audit report of 8 products using Claude Cowork',
    squarespaceId: 'c9557773-1133-4eb8-ad8c-7d40e33dab4d',
  },
  {
    id: 'VIDEO::gen-ai::mesh-workflow-report',
    route: '/gen-ai',
    sourcePath: '/image-gen-ai',
    label: 'Claude Cowork step-by-step workflow breakdown of Mesh.ai',
    squarespaceId: 'a9c7a5b4-2645-47d3-86fa-15f7c272e17e',
  },
  {
    id: 'VIDEO::gen-ai::manual-ui-study',
    route: '/gen-ai',
    sourcePath: '/image-gen-ai',
    label: 'Manual study on high-interest interactions',
    squarespaceId: '37859fb1-19ef-402b-896f-fe3a9c5e424e',
  },
  {
    id: 'VIDEO::gen-ai::claude-prototype',
    route: '/gen-ai',
    sourcePath: '/image-gen-ai',
    label: 'Interactive prototype created from Claude Cowork',
    squarespaceId: '63f56e7b-2471-46ad-b4d5-d6da3c46ccbd',
  },
  {
    id: 'VIDEO::gen-ai::design-decision',
    route: '/gen-ai',
    sourcePath: '/image-gen-ai',
    label: 'Design Decision section video',
    squarespaceId: '29499140-bc4a-4c7c-8e8a-512664955033',
  },

  // —— Render Studio ——
  {
    id: 'VIDEO::render-studio::solution-demo-1',
    route: '/render-studio',
    sourcePath: '/forma-render',
    label: 'The Solution — demo video 1',
    squarespaceId: '42f8a7e4-83c4-4d3c-ad2c-2ec785f16a2c',
  },
  {
    id: 'VIDEO::render-studio::solution-demo-2',
    route: '/render-studio',
    sourcePath: '/forma-render',
    label: 'The Solution — demo video 2',
    squarespaceId: '0b3fa169-61fa-4502-9336-76bfb350bf20',
  },
  {
    id: 'VIDEO::render-studio::solution-demo-3',
    route: '/render-studio',
    sourcePath: '/forma-render',
    label: 'The Solution — demo video 3',
  },

  // —— Forma Cloud ——
  {
    id: 'VIDEO::forma-cloud::e2e-walkthrough',
    route: '/forma-cloud',
    sourcePath: '/forma-cloud',
    label:
      'Forma Cloud end-to-end walkthrough (bike company link / publish / manage)',
    squarespaceId: 'd10d2f4b-f338-4b98-b46c-fe28639ed5a7',
  },

  // —— AR/VR Design ——
  {
    id: 'VIDEO::ar-vr::annotator-mode',
    route: '/ar-vr',
    sourcePath: '/annotate-all',
    label: 'Annotator Mode',
    squarespaceId: 'fc67e835-140f-4bc7-beb7-427624fad77f',
  },
  {
    id: 'VIDEO::ar-vr::latest-channel-mode',
    route: '/ar-vr',
    sourcePath: '/annotate-all',
    label: 'Latest Channel Mode',
    squarespaceId: '93fd602d-3d0f-40c7-9e2a-945f83dee07f',
  },
  {
    id: 'VIDEO::ar-vr::channel-selection-mode-1',
    route: '/ar-vr',
    sourcePath: '/annotate-all',
    label: 'Channel Selection Mode — clip 1',
    squarespaceId: '27f0227b-2ee3-4090-ba27-a07de38e7443',
  },
  {
    id: 'VIDEO::ar-vr::channel-selection-mode-2',
    route: '/ar-vr',
    sourcePath: '/annotate-all',
    label: 'Channel Selection Mode — clip 2',
    squarespaceId: '30179885-17c8-475f-bc58-40cdabd187e6',
  },
  {
    id: 'VIDEO::ar-vr::vr-keyboard',
    route: '/ar-vr',
    sourcePath: '/annotate-all',
    label: 'VR Keyboard Design',
    squarespaceId: 'a3ec6c22-50bc-4a50-ad08-4a83f553ab3c',
  },
  {
    id: 'VIDEO::ar-vr::space-invader-1',
    route: '/ar-vr',
    sourcePath: '/annotate-all',
    label: 'Mobile AR Space Invader — clip 1',
    squarespaceId: 'cfea78b2-1c29-4284-853f-136a2897081b',
  },
  {
    id: 'VIDEO::ar-vr::space-invader-2',
    route: '/ar-vr',
    sourcePath: '/annotate-all',
    label: 'Mobile AR Space Invader — clip 2',
    squarespaceId: '5845d1f1-9477-448f-919e-b41548910698',
  },
  {
    id: 'VIDEO::ar-vr::vr-maker-space',
    route: '/ar-vr',
    sourcePath: '/annotate-all',
    label: 'VR Maker Space',
    squarespaceId: '06320c8f-432f-4157-a845-09126924b32d',
  },
  {
    id: 'VIDEO::ar-vr::car-simulator',
    route: '/ar-vr',
    sourcePath: '/annotate-all',
    label: '360 Car Simulator',
    squarespaceId: '4d7233c1-4b09-4e87-a4cc-95e758512b23',
  },
  {
    id: 'VIDEO::ar-vr::wifi-missing-recording',
    route: '/ar-vr',
    sourcePath: '/annotate-all',
    label: 'Wifi Signal Visualizer — original recording (missing on source site)',
  },
  {
    id: 'VIDEO::ar-vr::wifi-unity-prototype',
    route: '/ar-vr',
    sourcePath: '/annotate-all',
    label: 'Wifi Alchemist — prototype ran on Unity gameplay',
    squarespaceId: '1e1ff733-f3ee-4602-983d-7cb61615bc9e',
  },
]

export function getVideoPlaceholder(id: string) {
  const meta = videoPlaceholders.find((v) => v.id === id)
  if (!meta) throw new Error(`Unknown video placeholder id: ${id}`)
  return meta
}
