import { useState, type ComponentType, type SVGProps } from 'react'
import { createLucideIcon, type LucideIcon } from 'lucide-react'
import { CaseStudyLayout } from '../components/CaseStudyLayout'
import { MediaPlaceholder } from '../components/MediaPlaceholder'
import { mediaAssets } from '../data/mediaAssets'
import type { TocItem } from '../data/formaCaseStudy'
import { mediaUrl } from '../lib/media'

const toc: TocItem[] = [
  { id: 'summary', label: 'Summary' },
  { id: 'try', label: 'Live demo' },
  { id: 'role', label: 'Role' },
  { id: 'tech', label: 'Tech stack' },
  { id: 'challenges', label: 'Design challenges' },
  { id: 'reasoning', label: 'Reasoning transparency' },
]

const LIVE_URL = 'https://chat-ai-ux.vercel.app'

type BrandSvgProps = SVGProps<SVGSVGElement> & {
  size?: number | string
  strokeWidth?: number
  absoluteStrokeWidth?: boolean
  strokeLinecap?: 'round' | 'square' | 'butt'
}

/** Official brand paths (Simple Icons, CC0) as filled Lucide-sized marks. */
function createBrandIcon(title: string, path: string) {
  function BrandIcon({
    size = 24,
    className,
    ...props
  }: BrandSvgProps) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="currentColor"
        className={className}
        role="img"
        aria-label={title}
        {...props}
      >
        <title>{title}</title>
        <path d={path} />
      </svg>
    )
  }
  BrandIcon.displayName = title
  return BrandIcon
}

const CursorIcon = createBrandIcon(
  'Cursor',
  'M11.503.131 1.891 5.678a.84.84 0 0 0-.42.726v11.188c0 .3.162.575.42.724l9.609 5.55a1 1 0 0 0 .998 0l9.61-5.55a.84.84 0 0 0 .42-.724V6.404a.84.84 0 0 0-.42-.726L12.497.131a1.01 1.01 0 0 0-.996 0M2.657 6.338h18.55c.263 0 .43.287.297.515L12.23 22.918c-.062.107-.229.064-.229-.06V12.335a.59.59 0 0 0-.295-.51l-9.11-5.257c-.109-.063-.064-.23.061-.23',
)

const ClaudeIcon = createBrandIcon(
  'Claude',
  'm4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z',
)

const FigmaIcon = createLucideIcon('FigmaBrand', [
  ['path', { d: 'M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z', key: 'top-left' }],
  ['path', { d: 'M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z', key: 'top-right' }],
  ['path', { d: 'M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z', key: 'mid-right' }],
  ['path', { d: 'M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z', key: 'mid-left' }],
  ['path', { d: 'M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z', key: 'bottom' }],
])

const SerpApiIcon = createLucideIcon('SerpApiBrand', [
  ['circle', { cx: '8', cy: '8', r: '2.2', key: 'n1' }],
  ['circle', { cx: '16', cy: '8', r: '2.2', key: 'n2' }],
  ['circle', { cx: '8', cy: '16', r: '2.2', key: 'n3' }],
  ['circle', { cx: '16', cy: '16', r: '2.2', key: 'n4' }],
  ['path', { d: 'M8 5.8V3.5', key: 's1' }],
  ['path', { d: 'M5.8 16H3.5', key: 's2' }],
  ['path', { d: 'M8 18.2V20.5', key: 's3' }],
  ['path', { d: 'M16 10.2v3.6', key: 's4' }],
  ['path', { d: 'M18.2 8H20.5', key: 's5' }],
  ['path', { d: 'M16 18.2V20.5', key: 's6' }],
])

const ViteIcon = createLucideIcon('ViteBrand', [
  ['path', { d: 'M12 2 3 14h7l-2 8 12-14h-7L15 2z', key: 'bolt' }],
])

const VercelIcon = createLucideIcon('VercelBrand', [
  ['path', { d: 'M12 3 21.5 20h-19L12 3z', key: 'tri' }],
])

type TechIcon = LucideIcon | ComponentType<BrandSvgProps>

const techStack: {
  name: string
  detail: string
  Icon: TechIcon
  filled?: boolean
}[] = [
  {
    name: 'Cursor',
    detail: 'Main development platform',
    Icon: CursorIcon,
    filled: true,
  },
  {
    name: 'Figma',
    detail: 'Wireframe, UX, and workflow planning',
    Icon: FigmaIcon,
  },
  {
    name: 'Claude',
    detail: 'Trip reasoning and packing plans',
    Icon: ClaudeIcon,
    filled: true,
  },
  {
    name: 'SerpAPI',
    detail: 'Live product image search',
    Icon: SerpApiIcon,
  },
  {
    name: 'Vite',
    detail: 'Fast local build and ship pipeline',
    Icon: ViteIcon,
  },
  {
    name: 'Vercel',
    detail: 'Production hosting and serverless APIs',
    Icon: VercelIcon,
  },
]

export function SecretStashPage() {
  const [activeTech, setActiveTech] = useState<string | null>(null)

  return (
    <CaseStudyLayout
      brand="SecretStash"
      title="SecretStash"
      toc={toc}
      heroImage={mediaUrl(mediaAssets.secretStashHeroBg)}
      lede="An AI packing companion for international travelers planning outdoor adventures."
    >
      <section id="summary" className="section">
        <p className="section__label">Summary</p>
        <p>
          For one-bag travelers and outdoor adventurers, finding proper gear in
          foreign lands is a messy race against time, language, and inventory.
          SecretStash transforms how people gear up for international trips. By
          analyzing live local weather, elevation, and owned equipment through a
          natural chat interface, it builds an accurate, shoppable packing list
          before departure. It takes the guesswork out of expedition prep while
          pioneering a personalized, context-aware approach to e-commerce.
        </p>
        <p>
          <strong>Challenge:</strong> Create an intuitive AI-guided workflow that
          processes trip context and gives curated, reliable purchase
          suggestions based on live conditions.
        </p>
      </section>

      <section id="try" className="section">
        <p className="section__label">Live demo</p>
        <p>
          Try the live app{' '}
          <a href={LIVE_URL} target="_blank" rel="noreferrer">
            here
          </a>{' '}
          or on your phone.
        </p>
        <div className="live-embed">
          <div className="clay-phone">
            <div className="clay-phone__shell">
              <div className="clay-phone__screen">
                <iframe
                  title="SecretStash live prototype"
                  src={LIVE_URL}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allow="clipboard-write"
                />
              </div>
            </div>
          </div>
        </div>
        <p className="live-embed__link">
          <a href={LIVE_URL} target="_blank" rel="noreferrer">
            Open live app ↗
          </a>
        </p>
      </section>

      <section id="role" className="section">
        <p className="section__label">Role</p>
        <p>
          Solo founder build: I designed, developed, and tested the entire app
          end-to-end as a startup idea: product framing, conversation UX,
          systems behavior, and the shipped web prototype.
        </p>
      </section>

      <section id="tech" className="section">
        <p className="section__label">Tech stack</p>
        <ul className="tech-stack">
          {techStack.map((item) => {
            const selected = activeTech === item.name
            const Icon = item.Icon
            return (
              <li key={item.name}>
                <button
                  type="button"
                  className={[
                    'tech-stack__tile',
                    selected ? 'tech-stack__tile--selected' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-pressed={selected}
                  aria-describedby={`tech-detail-${item.name}`}
                  onClick={() =>
                    setActiveTech((current) =>
                      current === item.name ? null : item.name,
                    )
                  }
                >
                  <span className="tech-stack__icon" aria-hidden="true">
                    {item.filled ? (
                      <Icon />
                    ) : (
                      <Icon strokeWidth={1.75} absoluteStrokeWidth />
                    )}
                  </span>
                  <strong className="tech-stack__name">{item.name}</strong>
                  <span
                    id={`tech-detail-${item.name}`}
                    className="tech-stack__detail"
                    role="tooltip"
                  >
                    {item.detail}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section id="challenges" className="section">
        <p className="section__label">Design challenges</p>
        <ul>
          <li>
            Grounding packing advice in reliable live weather and commerce data
            when default scraping fails
          </li>
          <li>
            Scoping the AI interaction: layered subject control, off-topic
            rejection, and redirect tone
          </li>
          <li>
            Making wait states legible: reasoning progress, pause controls, and
            calm stop messaging
          </li>
          <li>
            Suggestion cards with live image search, owned/revisit loops, and
            stash as durable memory
          </li>
          <li>
            Multi-turn memory under context limits: summarization, past chat,
            and new chat resets
          </li>
          <li>
            Expressing confidence without false certainty; designing for tool
            and LLM failure
          </li>
          <li>
            Practical retrieval (RAG) for categories, preferences, and product
            grounding
          </li>
          <li>
            Visual system: liquid motion background, glass UI, and artwork
            derived from the product collection
          </li>
        </ul>
        <p>
          This case study is still in progress. I’ll add more process detail
          soon.
        </p>
      </section>

      <section id="reasoning" className="section section--last">
        <p className="section__label">Reasoning transparency</p>
        <p>
          Expose the model’s intermediate steps during generation so latency
          reads as visible system status, not an opaque wait.
        </p>
        <MediaPlaceholder id="GIF::secret-stash::reasoning" />
      </section>
    </CaseStudyLayout>
  )
}
