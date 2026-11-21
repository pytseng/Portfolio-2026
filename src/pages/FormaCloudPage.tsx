import { useState } from 'react'
import {
  Bot,
  Building2,
  CircleAlert,
  Cloud,
  Flag,
  FolderKanban,
  LayoutDashboard,
  Lightbulb,
  PenLine,
  Rocket,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { CaseStudyLayout, Figure } from '../components/CaseStudyLayout'
import { FormaAiSection } from '../components/FormaAiSection'
import { PipelineStepper, type Step } from '../components/PipelineStepper'
import type { TocItem } from '../data/formaCaseStudy'
import { mediaAssets } from '../data/mediaAssets'
import { mediaUrl } from '../lib/media'

const LIVE_URL = 'https://forma-cloud-rework.vercel.app/'

const toc: TocItem[] = [
  { id: 'overview', label: 'Overview' },
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
  hero: mediaUrl(mediaAssets.formaCloudHero),
  preview: mediaUrl(mediaAssets.formaCloudPreview),
  system: mediaUrl(mediaAssets.formaCloudSystem),
  productBefore: mediaUrl(mediaAssets.formaCloudProductBefore),
  productAfter: mediaUrl(mediaAssets.formaCloudProductAfter),
  iaProduct: mediaUrl(mediaAssets.formaCloudIaProduct),
  iaEndpoints: mediaUrl(mediaAssets.formaCloudIaEndpoints),
  iaIntegrations: mediaUrl(mediaAssets.formaCloudIaIntegrations),
  iaDocs: mediaUrl(mediaAssets.formaCloudIaDocs),
  iaApi: mediaUrl(mediaAssets.formaCloudIaApi),
  iaSupport: mediaUrl(mediaAssets.formaCloudIaSupport),
  onboarding: mediaUrl(mediaAssets.formaCloudOnboarding),
  aiChips: mediaUrl(mediaAssets.formaCloudAiChips),
  aiOfftopic: mediaUrl(mediaAssets.formaCloudAiOfftopic),
  aiOfftopicPoster: mediaUrl(mediaAssets.formaCloudAiOfftopicPoster),
  aiReasoning: mediaUrl(mediaAssets.formaCloudAiReasoning),
  aiReasoningPoster: mediaUrl(mediaAssets.formaCloudAiReasoningPoster),
  aiHover: mediaUrl(mediaAssets.formaCloudAiRuleHover),
}

const aiSteps: Step[] = [
  {
    id: 'describe',
    num: '01',
    title: 'Describe',
    description: 'Type the rule in one sentence and send it.',
    kind: 'video',
    src: mediaUrl(mediaAssets.formaCloudAiStepDescribe),
    poster: mediaUrl(mediaAssets.formaCloudAiStepDescribePoster),
    alt: 'Typing a publishing rule into Forma AI and sending it',
    plays: 1,
    objectPosition: 'center',
  },
  {
    id: 'review',
    num: '02',
    title: 'Review',
    description: 'The setup card, with each line traced to that sentence.',
    kind: 'image',
    src: mediaUrl(mediaAssets.formaCloudAiStepReview),
    alt: 'The agent setup card for staging, Shopify, and Sofia’s approval',
    plays: 1,
    objectPosition: 'center',
  },
  {
    id: 'test',
    num: '03',
    title: 'Test',
    description: 'A test run on a real sample update.',
    kind: 'video',
    src: mediaUrl(mediaAssets.formaCloudAiStepTest),
    poster: mediaUrl(mediaAssets.formaCloudAiStepTestPoster),
    alt: 'A test of the rule on a sample product update',
    plays: 1,
    objectPosition: 'center',
  },
  {
    id: 'on',
    num: '04',
    title: 'Turn on',
    description: 'The saved agent, with its rule, pause, and delete.',
    kind: 'image',
    src: mediaUrl(mediaAssets.formaCloudAiStepOn),
    alt: 'The Agents tab with the saved agent, its rule, and pause and delete',
    plays: 1,
    objectPosition: 'center',
  },
]

const role: { icon: LucideIcon; label: string }[] = [
  { icon: Rocket, label: 'From scratch to shipped' },
  { icon: PenLine, label: 'Full ownership' },
  { icon: Lightbulb, label: 'Co-started the idea' },
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

export function FormaCloudPage() {
  return (
    <CaseStudyLayout
      brand="Forma Cloud"
      title="Forma Cloud"
      toc={toc}
      heroImage={img.hero}
      heroAlt="Forma Cloud product window showing analytics, a 3D bike configurator, and the Forma AI panel"
      heroPriority
      lede="Where every Forma creation lives, stays in sync, and gets published."
    >
      <section id="overview" className="section">
        <p className="section__label">Overview</p>
        <div className="overview">
          <div className="overview__background">
            <p className="overview__sub">
              <Flag aria-hidden="true" />
              Background
            </p>
            <p>
              Forma Cloud was the hub to connect Forma Editor and other Unity
              industrial products. It was a zero to one process started by the
              PM and me.
            </p>
            <ul className="overview__facts">
              {role.map((item) => (
                <li key={item.label}>
                  <item.icon aria-hidden="true" />
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="overview__split">
            <div className="overview__card">
              <p className="overview__sub">
                <Users aria-hidden="true" />
                User
              </p>
              <p>
                Forma Editor and Render Studio are Unity’s tools for creating
                industrial 3D content. Most of the people using them were
                marketing and sales managers, and they kept asking for two
                things: a place to organize what they made, and a way to see
                how it performed.
              </p>
            </div>
            <div className="overview__card">
              <p className="overview__sub">
                <CircleAlert aria-hidden="true" />
                Problem
              </p>
              <p>
                Making 3D content was made easy with our tools. However, there
                was no good way to publish the 3D creation, update them, or see
                how it was performing on customer facing websites. Ecommerce
                platforms just weren’t built for configurable 3D products.
              </p>
            </div>
          </div>
          <ul className="industry-grid" aria-label="What the work was">
            {keywords.map((item) => (
              <li className="industry-chip" key={item.label}>
                <item.icon aria-hidden="true" />
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
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
          src={img.system}
          alt="Forma Editor saves a configurable model to Unity Cloud Storage. Render Studio reads that model and saves images. Forma Cloud reads both, publishes to commerce platforms, and usage data comes back."
          caption="Editor saves the model. Render Studio reads it and saves the images. Forma Cloud reads both, publishes, and usage comes back."
        />
      </section>

      <section id="live" className="section">
        <p className="section__label">Live demo</p>
        <p>
          I wanted people to try the product, not just look at screenshots,
          so I rebuilt it as a working demo in a week, without the original
          files or tool access. Then I went further and added Forma AI to test
          how agents could help teams create and manage content in enterprise
          software.
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
        <p>How one model goes from the editor to a live storefront.</p>
        <PipelineStepper
          editorSrc={mediaUrl(mediaAssets.formaCloudStepEditor)}
          cloudSrc={mediaUrl(mediaAssets.formaCloudStepCloud)}
          storeSrc={mediaUrl(mediaAssets.formaCloudStepStore)}
        />
      </section>

      <FormaAiSection
        chips={img.aiChips}
        offtopic={img.aiOfftopic}
        offtopicPoster={img.aiOfftopicPoster}
        reasoning={img.aiReasoning}
        reasoningPoster={img.aiReasoningPoster}
        hover={img.aiHover}
        steps={aiSteps}
      />

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
