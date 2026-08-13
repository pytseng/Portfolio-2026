import { mediaAssets } from '../mediaAssets'
import { mediaUrl } from '../../lib/media'

export type ProjectLane = 'selected' | 'side-quests'

export type ProjectMeta = {
  slug: string
  title: string
  /** Internal route, or same as liveUrl for external side quests */
  path: string
  blurb: string
  lane: ProjectLane
  thumbnail?: string
  /** Live Vercel (or other) app URL — renders an embed card in Side quests */
  liveUrl?: string
  /** Show lock affordance; page is gated with PasswordGate */
  locked?: boolean
}

export const workLanes: {
  id: ProjectLane
  label: string
  heading: string
  empty: string
}[] = [
  {
    id: 'selected',
    label: 'Selected',
    heading: 'Selected projects',
    empty: 'Nothing here yet.',
  },
  {
    id: 'side-quests',
    label: 'Side quests',
    heading: 'Side quests',
    empty: 'Loose ends and half-baked fun. More soon.',
  },
]

const CDN = 'https://images.squarespace-cdn.com/content/v1/5a09f237017db2f48e166521'

export const projects: ProjectMeta[] = [
  {
    slug: 'readme',
    title: 'README.MD',
    path: '/readme',
    thumbnail: `${CDN}/d89d07cb-f684-45f8-a2d3-0fc2a05fb34f/u3369982172_A_simple_approachablesoothing_3d_cheeseburger_in__5e62d7d0-9941-4177-9b66-d68acf7f203a_0.png`,
    blurb: 'User guide — who I am, what I design, and where to look.',
    lane: 'selected',
  },
  {
    slug: 'secret-stash',
    title: 'SecretStash',
    path: '/secret-stash',
    thumbnail: mediaUrl(mediaAssets.secretStashHeroBg),
    blurb:
      'AI packing companion for international outdoor travel: weather-aware plans you can correct.',
    lane: 'selected',
  },
  {
    slug: 'forma-editor',
    title: 'Forma Editor',
    path: '/forma-editor',
    thumbnail: `${CDN}/1619821922264-SXD98I2R7ROEMQT89JLA/Forma02.png`,
    blurb: '0–1 UX for a multi-platform 3D authoring suite.',
    lane: 'selected',
  },
  {
    slug: 'gen-ai',
    title: 'Gen AI in Render Studio',
    path: '/gen-ai',
    thumbnail: `${CDN}/7ba24a44-912f-44ac-acf7-e62751ff8d3f/u3369982172_httpss.mj.runrm4Iv7qL894_httpss.mj.runSyQC41kO9QM_782df3cd-7b02-4b40-a85c-e7457435f480_1.png`,
    blurb: 'AI-assisted design process and background generation.',
    lane: 'selected',
  },
  {
    slug: 'render-studio',
    title: 'Render Studio',
    path: '/render-studio',
    thumbnail: `${CDN}/1622387590296-0547A2FO0Q310CSC2RE7/Concept%2BMock%2B-%2BRS%2BCloud.jpg`,
    blurb: 'Marketing content factory for configurable 3D products.',
    lane: 'selected',
  },
  {
    slug: 'forma-cloud',
    title: 'Forma Cloud',
    path: '/forma-cloud',
    thumbnail: `${CDN}/4ad9baa1-7c22-4248-b9d9-1edd63c43516/Thumbnail.png`,
    blurb: 'Web hub linking factory 3D data to eCommerce.',
    lane: 'selected',
  },
  {
    slug: 'ar-vr',
    title: 'AR/VR Design',
    path: '/ar-vr',
    thumbnail: `${CDN}/1560628466725-X2CISGSPR9AIAK5XBVKS/image-asset.jpeg`,
    blurb: 'Spatial annotation, mobile AR, VR experiments, and more.',
    lane: 'selected',
  },
  {
    slug: 'junyi',
    title: 'Junyi Academy',
    path: '/junyi',
    thumbnail: `${CDN}/1531196261851-H975ZKAG60XRKX9H432D/Asset+3haha.png`,
    blurb:
      'Design for social impact, an open learning platform for K-12 educators and students',
    lane: 'selected',
    locked: true,
  },
  {
    slug: 'ford',
    title: 'Ford - Audio Experience',
    path: '/ford',
    thumbnail: `${CDN}/1531240007005-CNX9B6XJZJA9R8G6GVHU/Asset+1car.png`,
    blurb: 'Autonomous vehicle dashboard and earcon design.',
    lane: 'selected',
    locked: true,
  },
  {
    slug: 'nuwa',
    title: 'Nüwa',
    path: 'https://nuwa-six.vercel.app/',
    liveUrl: 'https://nuwa-six.vercel.app/',
    thumbnail: '/side-quests/nuwa.png',
    blurb:
      'An ink wash globe of the earth’s most iconic landscapes, each matched to the painting it echoes.',
    lane: 'side-quests',
  },
  {
    slug: 'ringcard',
    title: 'RingCard',
    path: 'https://muaythai-schedule.vercel.app/',
    liveUrl: 'https://muaythai-schedule.vercel.app/',
    thumbnail: '/side-quests/ringcard.png',
    blurb:
      'Muay Thai schedule for past and upcoming fight events in Thailand, with live data.',
    lane: 'side-quests',
  },
  {
    slug: 'earth-101',
    title: 'Earth 101',
    path: 'https://earth101.vercel.app/',
    liveUrl: 'https://earth101.vercel.app/',
    thumbnail: '/side-quests/earth-101.png',
    blurb:
      'A guide to Earth’s most epic, representative nature: surfaces worth knowing.',
    lane: 'side-quests',
  },
]

export { CDN }
