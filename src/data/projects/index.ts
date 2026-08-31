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
    slug: 'eyewall-lab',
    title: 'Eyewall Lab',
    path: 'https://eyewall-labs.vercel.app/',
    liveUrl: 'https://eyewall-labs.vercel.app/',
    thumbnail: '/side-quests/eyewall-lab.png',
    blurb:
      'A vortex of live dashboards — an interactive lab for spinning data into a storm eyewall.',
    lane: 'side-quests',
  },
  {
    slug: 'capital-gang',
    title: 'Capital Gang',
    path: 'https://capital-gang.vercel.app/',
    liveUrl: 'https://capital-gang.vercel.app/',
    thumbnail: '/side-quests/capital-gang.png',
    blurb:
      'A public ledger of congressional stock trades — members, whales, and late disclosures.',
    lane: 'side-quests',
  },
  {
    slug: 'pangu',
    title: 'Pangu',
    path: 'https://nuwa-six.vercel.app/',
    liveUrl: 'https://nuwa-six.vercel.app/',
    thumbnail: '/side-quests/pangu.png',
    blurb:
      'The most representative landscapes on Earth — an ink-wash globe of iconic places and the art they echo.',
    lane: 'side-quests',
  },
  {
    slug: 'ringcard',
    title: 'RingCard',
    path: 'https://muaythai-schedule.vercel.app/',
    liveUrl: 'https://muaythai-schedule.vercel.app/',
    thumbnail: '/side-quests/ringcard.png',
    blurb:
      'A martial arts event platform for the biggest, most exciting fight nights in the world.',
    lane: 'side-quests',
  },
  {
    slug: 'earth-101',
    title: 'Earth 101',
    path: 'https://earth101.vercel.app/',
    liveUrl: 'https://earth101.vercel.app/',
    thumbnail: '/side-quests/earth-101.png',
    blurb: 'A passport to learn our planet.',
    lane: 'side-quests',
  },
]

export { CDN }
