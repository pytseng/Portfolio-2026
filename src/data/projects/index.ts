export type ProjectMeta = {
  slug: string
  title: string
  path: string
  thumbnail: string
  blurb: string
}

const CDN = 'https://images.squarespace-cdn.com/content/v1/5a09f237017db2f48e166521'

export const projects: ProjectMeta[] = [
  {
    slug: 'readme',
    title: 'README.MD',
    path: '/readme',
    thumbnail: `${CDN}/d89d07cb-f684-45f8-a2d3-0fc2a05fb34f/u3369982172_A_simple_approachablesoothing_3d_cheeseburger_in__5e62d7d0-9941-4177-9b66-d68acf7f203a_0.png`,
    blurb: 'User guide — who I am, what I design, and where to look.',
  },
  {
    slug: 'forma-editor',
    title: 'Forma Editor',
    path: '/forma-editor',
    thumbnail: `${CDN}/1619821922264-SXD98I2R7ROEMQT89JLA/Forma02.png`,
    blurb: '0–1 UX for a multi-platform 3D authoring suite.',
  },
  {
    slug: 'gen-ai',
    title: 'Gen AI in Render Studio',
    path: '/gen-ai',
    thumbnail: `${CDN}/7ba24a44-912f-44ac-acf7-e62751ff8d3f/u3369982172_httpss.mj.runrm4Iv7qL894_httpss.mj.runSyQC41kO9QM_782df3cd-7b02-4b40-a85c-e7457435f480_1.png`,
    blurb: 'AI-assisted design process and background generation.',
  },
  {
    slug: 'render-studio',
    title: 'Render Studio',
    path: '/render-studio',
    thumbnail: `${CDN}/1622387590296-0547A2FO0Q310CSC2RE7/Concept%2BMock%2B-%2BRS%2BCloud.jpg`,
    blurb: 'Marketing content factory for configurable 3D products.',
  },
  {
    slug: 'forma-cloud',
    title: 'Forma Cloud',
    path: '/forma-cloud',
    thumbnail: `${CDN}/4ad9baa1-7c22-4248-b9d9-1edd63c43516/Thumbnail.png`,
    blurb: 'Web hub linking factory 3D data to eCommerce.',
  },
  {
    slug: 'ar-vr',
    title: 'AR/VR Design',
    path: '/ar-vr',
    thumbnail: `${CDN}/1560628466725-X2CISGSPR9AIAK5XBVKS/image-asset.jpeg`,
    blurb: 'Spatial annotation, mobile AR, VR experiments, and more.',
  },
]

export { CDN }
