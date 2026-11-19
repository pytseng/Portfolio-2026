import { useState } from 'react'
import {
  Bot,
  Building2,
  Cloud,
  FolderKanban,
  LayoutDashboard,
  PenLine,
  Rocket,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { CaseStudyLayout, Figure } from '../components/CaseStudyLayout'
import { MediaPlaceholder } from '../components/MediaPlaceholder'
import type { TocItem } from '../data/formaCaseStudy'
import { CDN } from '../data/projects'
import { mediaAssets } from '../data/mediaAssets'
import { mediaUrl } from '../lib/media'

const LIVE_URL = 'https://forma-cloud-rework.vercel.app/'

const toc: TocItem[] = [
  { id: 'context', label: 'Context' },
  { id: 'user', label: 'User' },
  { id: 'problem', label: 'Problem' },
  { id: 'solution', label: 'Solution' },
  { id: 'live', label: 'Live demo' },
  { id: 'pipeline', label: 'Three steps' },
  { id: 'ai', label: 'AI design' },
  { id: 'ia', label: 'Structure' },
  { id: 'product', label: 'Product view' },
  { id: 'onboarding', label: 'Onboarding' },
  { id: 'details', label: 'The rest' },
  { id: 'result', label: 'Result' },
]

const img = {
  hero: `${CDN}/4ad9baa1-7c22-4248-b9d9-1edd63c43516/Thumbnail.png`,
  preview: mediaUrl(mediaAssets.formaCloudPreview),
  system: mediaUrl(mediaAssets.formaCloudSystem),
  productBefore: mediaUrl(mediaAssets.formaCloudProductBefore),
  productAfter: mediaUrl(mediaAssets.formaCloudProductAfter),
  aiDescribe: mediaUrl(mediaAssets.formaCloudAiDescribe),
  aiReview: mediaUrl(mediaAssets.formaCloudAiReview),
  aiTest: mediaUrl(mediaAssets.formaCloudAiTest),
  aiOn: mediaUrl(mediaAssets.formaCloudAiOn),
  iaProduct: mediaUrl(mediaAssets.formaCloudIaProduct),
  iaEndpoints: mediaUrl(mediaAssets.formaCloudIaEndpoints),
  iaIntegrations: mediaUrl(mediaAssets.formaCloudIaIntegrations),
  iaDocs: mediaUrl(mediaAssets.formaCloudIaDocs),
  iaApi: mediaUrl(mediaAssets.formaCloudIaApi),
  iaSupport: mediaUrl(mediaAssets.formaCloudIaSupport),
  onboarding: mediaUrl(mediaAssets.formaCloudOnboarding),
}

const facts: { icon: LucideIcon; text: string }[] = [
  { icon: Rocket, text: '0–1. Making the product happen.' },
  { icon: Users, text: 'The team started as the PM and me.' },
  {
    icon: PenLine,
    text: 'I was already senior designer on Forma Editor and Render Studio.',
  },
]

const keywords: { icon: LucideIcon; label: string }[] = [
  { icon: Building2, label: 'Enterprise SaaS' },
  { icon: LayoutDashboard, label: 'Dashboard' },
  { icon: FolderKanban, label: 'Content management' },
  { icon: Bot, label: 'AI agent creation' },
  { icon: Cloud, label: 'AI for enterprise cloud' },
]

type Screen = {
  id: string
  label: string
  src: string
  alt: string
  caption: string
}

const structure: Screen[] = [
  {
    id: 'catalogue',
    label: 'Catalogue',
    src: img.preview,
    alt: 'Forma Cloud catalogue of bike products, some live and one in review',
    caption: 'Catalogue. Every product, with a status.',
  },
  {
    id: 'product',
    label: 'Product',
    src: img.iaProduct,
    alt: 'DOGMA XM product page with the source model, access, activity, and publishing',
    caption: 'The product. Model, access, activity, and where it publishes.',
  },
  {
    id: 'endpoints',
    label: 'Endpoints',
    src: img.iaEndpoints,
    alt: 'Endpoints for DOGMA XM, with one embed and a live and in-review storefront',
    caption: 'Endpoints. One embed. Each storefront shows its own status.',
  },
  {
    id: 'integrations',
    label: 'Integrations',
    src: img.iaIntegrations,
    alt: 'Organization integrations for Salesforce, Shopify, and other commerce platforms',
    caption: 'Integrations. A platform is connected once, for the organization.',
  },
]

const rest: Screen[] = [
  {
    id: 'docs',
    label: 'Documentation',
    src: img.iaDocs,
    alt: 'Introduction to Forma Cloud in the documentation',
    caption: 'Documentation. What the workspace stores, and what the editor does.',
  },
  {
    id: 'api',
    label: 'API',
    src: img.iaApi,
    alt: 'Forma API reference for products, rules, publishing, and the embed',
    caption: 'API. A storefront reads the published product, its options, and its rules.',
  },
  {
    id: 'support',
    label: 'Support',
    src: img.iaSupport,
    alt: 'Support page with release notes, knowledge base, service status, and contact',
    caption: 'Support. Release notes, the knowledge base, status, and a way to ask.',
  },
]

function ScreenSwitch({
  items,
  label,
}: {
  items: Screen[]
  label: string
}) {
  const [activeId, setActiveId] = useState(items[0].id)
  const active = items.find((item) => item.id === activeId) ?? items[0]

  return (
    <div className="screen-switch">
      <div className="screen-switch__tabs" role="tablist" aria-label={label}>
        {items.map((item) => {
          const selected = item.id === active.id
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={selected}
              className={
                selected
                  ? 'screen-switch__tab screen-switch__tab--active'
                  : 'screen-switch__tab'
              }
              onClick={() => setActiveId(item.id)}
            >
              {item.label}
            </button>
          )
        })}
      </div>
      <Figure src={active.src} alt={active.alt} caption={active.caption} />
    </div>
  )
}

function IconRow({
  items,
}: {
  items: { icon: LucideIcon; text: string }[]
}) {
  return (
    <ul className="preface">
      {items.map((item) => (
        <li key={item.text}>
          <item.icon aria-hidden="true" />
          <span>{item.text}</span>
        </li>
      ))}
    </ul>
  )
}

export function FormaCloudPage() {
  return (
    <CaseStudyLayout
      brand="Forma Cloud"
      title="Forma Cloud"
      toc={toc}
      heroImage={img.hero}
      lede="Where every Forma creation lives, stays in sync, and gets published."
    >
      <section id="context" className="section">
        <p className="section__label">Context</p>
        <p>
          Forma Cloud was a 0–1. Editor and Render Studio already existed. I
          was the senior designer on both. The cloud product had to happen, and
          it started with the PM and me.
        </p>
        <IconRow items={facts} />
        <ul className="industry-grid" aria-label="What the work was">
          {keywords.map((item) => (
            <li className="industry-chip" key={item.label}>
              <item.icon aria-hidden="true" />
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="user" className="section">
        <p className="section__label">User</p>
        <p>
          The people already in Forma Editor and Render Studio — Unity’s
          industrial 3D creation tools — kept asking for a place to organize
          what they made, and to see what it did in sales and marketing.
        </p>
        <p>Those users are marketing and sales managers.</p>
      </section>

      <section id="problem" className="section">
        <p className="section__label">Problem</p>
        <p>
          The assets coming out of the tools were good. Publishing them,
          managing them, and understanding the impact was not. An existing
          ecommerce platform had no easy way to take a configurable 3D product,
          keep it current, and show what happened after it went live.
        </p>
      </section>

      <section id="solution" className="section">
        <p className="section__label">Solution</p>
        <p className="section__kicker">Forma Cloud</p>
        <p>
          Forma Cloud is the workspace that closes the pipeline. A factory
          model is ingested, edited in Forma Editor, rendered in Render Studio,
          then managed and published from here onto the customer’s platforms.
          Usage comes back to the same product, so a manager can see what
          shipped and what it did.
        </p>
        <Figure
          className="figure--fit"
          src={img.system}
          alt="Forma Editor and Render Studio write to one configurable model. Forma Cloud reads it and publishes to commerce platforms."
          caption="One model. Editor and Render Studio write to it. Forma Cloud reads both and publishes."
        />
      </section>

      <section id="live" className="section">
        <p className="section__label">Live demo</p>
        <p>
          I built this interaction demo in a week. I did not have the
          design-system files, and I did not have an industrial license to open
          the real tools. Forma AI is in the demo as an add-on. It was not part
          of the original scope.
        </p>
        <div className="live-cta">
          <a
            className="btn btn--primary"
            href={LIVE_URL}
            target="_blank"
            rel="noreferrer"
          >
            Open the live Forma Cloud project
          </a>
        </div>
        <Figure
          src={img.preview}
          alt="Forma Cloud catalogue, the live demo"
          caption="The live workspace. Catalogue first."
        />
      </section>

      <section id="pipeline" className="section">
        <p className="section__label">Design highlight</p>
        <h3>From the editor, to Forma Cloud, to ecommerce</h3>
        <p>Three steps. The clips for each one are still to come.</p>
        <div className="media-cluster media-cluster--3 step-placeholders">
          <MediaPlaceholder id="MEDIA::forma-cloud::step-editor" />
          <MediaPlaceholder id="MEDIA::forma-cloud::step-cloud" />
          <MediaPlaceholder id="MEDIA::forma-cloud::step-commerce" />
        </div>
      </section>

      <section id="ai" className="section">
        <p className="section__label">AI design</p>
        <p>
          The agent is how the job gets done, so the interface follows that
          role. I did not give it a workspace of its own. The catalogue stays.
          A panel beside it is enough.
        </p>
        <h3>Stay on the product</h3>
        <p>
          Starter chips only offer Forma work: automate publishing, check
          endpoints, summarize activity, prepare a review. Off-topic questions
          are refused before a model call. The panel only hands off into a
          rule when someone is actually describing one.
        </p>
        <h3>Show the reasoning, then turn it on</h3>
        <p>
          While it works, the panel shows the step it is on. A test shows the
          new version, what reached staging, what is still waiting on a person,
          and what would go live. Nothing publishes until that test is
          approved.
        </p>
        <div className="ai-steps">
          <Figure
            src={img.aiDescribe}
            alt="Forma AI starter chips for publishing, endpoints, activity, and review"
            caption="Describe"
          />
          <Figure
            src={img.aiReview}
            alt="A drafted publishing rule for staging, Shopify, and Salesforce"
            caption="Review"
          />
          <Figure
            src={img.aiTest}
            alt="A simulated publish with the new finish, staging, and a person still to approve"
            caption="Test"
          />
          <Figure
            src={img.aiOn}
            alt="The publishing agent switched on"
            caption="Turn on"
          />
        </div>
      </section>

      <section id="ia" className="section">
        <p className="section__label">Information architecture</p>
        <p>
          The structure is short. A catalogue of products, one product, the
          places it publishes, and the platforms connected once for the
          organization.
        </p>
        <ScreenSwitch items={structure} label="Forma Cloud structure" />
      </section>

      <section id="product" className="section">
        <p className="section__label">Product view</p>
        <h3>The product holds the assets</h3>
        <p>
          At the start I treated configurators and Render Studio media as
          separate assets. In testing, people reported the gap: they could not
          tell which files belonged to which product. The page became the
          product. The model, the renders, who can see it, and where it
          publishes sit together.
        </p>
        <div className="compare-row">
          <Figure
            src={img.productBefore}
            alt="Old content management, a library of configurators separate from the product"
            caption="Before. A library of configurators."
          />
          <Figure
            src={img.productAfter}
            alt="DOGMA XM, with the model, access, and publishing on one product page"
            caption="After. One product."
          />
        </div>
        <p>
          After the change I asked the same 11 managers who had reported the
          gap to try the task again.
        </p>
        <div className="survey">
          <div className="survey__row">
            <p className="survey__task">
              Find the latest render and the live configurator for one product
            </p>
            <p className="survey__scores">
              <span>
                Before <strong>3 of 11</strong>
              </span>
              <span>
                After <strong>9 of 11</strong>
              </span>
            </p>
          </div>
          <div className="survey__row">
            <p className="survey__task">
              Say whether the storefront is on the current version
            </p>
            <p className="survey__scores">
              <span>
                Before <strong>4 of 11</strong>
              </span>
              <span>
                After <strong>8 of 11</strong>
              </span>
            </p>
          </div>
        </div>
      </section>

      <section id="onboarding" className="section">
        <p className="section__label">Onboarding</p>
        <p>
          Getting in is four steps: install the editor, open a project, link
          it to this workspace, then publish to a commerce channel.
        </p>
        <Figure
          src={img.onboarding}
          alt="Get started: download the installer, create a project, link Forma Cloud, then integrations"
          caption="Get started. Install, create, link, publish."
        />
      </section>

      <section id="details" className="section">
        <p className="section__label">Also in the workspace</p>
        <p>
          Around the product: documentation for the path, an API a storefront
          can call, and support when a channel will not connect.
        </p>
        <ScreenSwitch items={rest} label="Documentation, API, and support" />
      </section>

      <section id="result" className="section section--last">
        <p className="section__label">Result</p>
        <p className="section__kicker">
          The missing piece of the 3D pipeline.
        </p>
        <p>Ingest, create, render, manage, publish.</p>
        <ol className="rich-list">
          <li>
            <strong>Completed the pipeline.</strong> Editor and Render Studio
            had somewhere for a creation to land, and a way out to a storefront.
          </li>
          <li>
            <strong>Made the impact readable.</strong> Marketing and sales can
            see a product, where it is published, and what changed.
          </li>
          <li>
            <strong>Left room for the agent.</strong> Forma AI shipped in the
            demo as a panel on the catalogue, not a separate product.
          </li>
        </ol>
      </section>
    </CaseStudyLayout>
  )
}
