const CDN = 'https://images.squarespace-cdn.com/content/v1/5a09f237017db2f48e166521'

export type TocItem = {
  id: string
  label: string
}

export const tocItems: TocItem[] = [
  { id: 'overview', label: 'Product Overview' },
  { id: 'discovery', label: 'Initial Discovery' },
  { id: 'journey', label: 'Journey Mapping' },
  { id: 'users', label: 'Target Users' },
  { id: 'problem', label: 'Main Problem' },
  { id: 'metrics', label: 'Success Metrics' },
  { id: 'process', label: 'Design Process' },
  { id: 'feature', label: 'Feature deep dive' },
  { id: 'constraints', label: 'Working with Constraints' },
  { id: 'interface', label: 'Forma Interface' },
  { id: 'shipping', label: 'Shipping and Beyond' },
  { id: 'validation', label: 'Post-launch validation' },
  { id: 'takeaway', label: 'Takeaway' },
  { id: 'testimony', label: 'Testimony' },
]

export const assets = {
  logo: `${CDN}/1569435158706-R3PDCXYEKH6B97ZNYTSK/Asset+14%402x.png`,
  heroPoster:
    'https://video.squarespace-cdn.com/content/v1/5a09f237017db2f48e166521/75a79994-e7e5-4435-963d-bd6a3fc8e2a0/thumbnail',
  youtubeEmbed: 'https://www.youtube.com/embed/pwYk9USt1-M',
  journeyMap: `${CDN}/2a3111f6-ed91-4a53-8a8c-0eebc5355868/01+%C2%B7+Journey+Map+%28Light%29.png`,
  conceptToShape: `${CDN}/1617938952294-5442OJYQWV6RSEV6AI25/concept-to-shape.png`,
  cmf: `${CDN}/1617939002816-3RR0F99WF9MPSIPLL16D/look+dev01.png`,
  optimized: `${CDN}/1617939409697-K3R3JVE4PCG9EPAQI89L/Screen+Shot+2021-04-08+at+23.35.47.png`,
  salesAssets: `${CDN}/1617940348647-0VF8XK4I9AYUNESQUXB6/Screen+Shot+2021-04-08+at+23.52.17.png`,
  configurator: `${CDN}/1617940413095-JUG27B79KUT1JLR8NKPD/Screen+Shot+2021-04-08+at+23.36.29.png`,
  framing: `${CDN}/e656739b-b79b-4d39-9b74-4a74b338153a/Framining.png`,
  stakeholder: `${CDN}/f7c156a6-4db8-4eff-b60c-33193cab7672/stackholder+alignment.png`,
  ideation: `${CDN}/5f1bc159-bca5-4202-9f05-5263e7d38057/Design+Ideation.png`,
  production: `${CDN}/f2664709-5bda-4c60-911f-5fba3233d5fe/Production.png`,
  ruleIt1: `${CDN}/95f49224-c796-4715-80b8-df99d5aad807/Rule+-+It1.png`,
  ruleIt2: `${CDN}/872a742c-7b58-4b74-95e6-d162c4fa67b8/Rule+-+It2.png`,
  ruleIt3: `${CDN}/a78886d9-2143-49a3-b0d3-c11bd0c62244/Rule+-+It3.png`,
  ruleFinalize: `${CDN}/068e02df-8bea-4aa6-bfd5-7bbadcfd4468/Rule+-+Finalize.png`,
  ruleDetails: `${CDN}/fdf42810-5e08-4d4c-88b4-6e4c624978a6/Rule+details.png`,
  designSystem1: `${CDN}/1618064415923-DU5NY9TTT82KFM7ORBKJ/Screen+Shot+2021-04-10+at+10.20.05.png`,
  designSystem2: `${CDN}/1618064640424-VCA02A5RN1QXC64ZC27B/Screen+Shot+2021-04-10+at+10.23.50.png`,
  designSystem3: `${CDN}/1618064658024-SYPNUXHUEQZ9WQ1HL64I/Screen+Shot+2021-04-10+at+10.23.54.png`,
  designSystem4: `${CDN}/1618064649402-33OFBUMOTCRETKFPLZFF/Screen+Shot+2021-04-10+at+10.23.47.png`,
  productTab: `${CDN}/1619819251274-0N27IDFS9B4Q045STYPM/Product.png`,
  wysiwyg: `${CDN}/1619819404555-OECKPJQGBDGZS5APZRXB/wysiwyg.png`,
  profile: `${CDN}/1619820558432-6WTNTH1WP944JQSBU9H5/Assign+product+to+profile.png`,
  camera: `${CDN}/1619820198990-NBC9PYA87PV7CS95FHQI/Cam.png`,
  environment: `${CDN}/1619820259099-I6MTGX2AO0RF7R70T66K/Env.png`,
  ruleTab: `${CDN}/1619820292193-ICAXWHFMXYQSRMMBOHJO/rule.png`,
  exportTab: `${CDN}/1619820363490-PF4VG4S3217Q1ZM8KEVF/Export.png`,
  runtimePreview: `${CDN}/1618574323204-J471L1A3JJDAO1254E4J/runtimeUIinPreview.png`,
  mobileAnalysis: `${CDN}/1618185898677-GABIBUHBD86GSEBG2V6P/Mobile+UI+layout+analysis.png`,
  mobileWireframe: `${CDN}/1618185919512-N81HMDOSFKL8WOPB4DRJ/Mobile+Wireframe.png`,
  landscapePortrait: `${CDN}/1618186730383-5U8ZU0EU157SZBTHDF0D/landscape+and+portrait.png`,
  layoutCompare: `${CDN}/1618187959393-RW3X60X6LR27IYWSHUZU/Layout+Compare.png`,
  decision: `${CDN}/1618188462983-2DFO0AWG1I2A92YVOE5M/Decision.png`,
  allScale: `${CDN}/1618185872482-RJX5RZWXZFQ4N4BFZ9A2/All+scale.png`,
  vwLogo: `${CDN}/1618579873935-R8IA1PC6H1NMFYDM75G9/vw+logo.png`,
  texelLogo: `${CDN}/1618579730112-T5GH4Z5TR8I63G2CV6KD/texel_logo.png`,
  designoryLogo: `${CDN}/1618579612723-R9UKP4D1N78YW94QZVUP/designory+logo.png`,
}
