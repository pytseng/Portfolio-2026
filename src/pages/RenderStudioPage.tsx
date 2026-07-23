import type { ReactNode } from 'react'
import { CaseStudyLayout, Figure } from '../components/CaseStudyLayout'
import { CaseStudyVideo } from '../components/CaseStudyVideo'
import type { TocItem } from '../data/formaCaseStudy'
import { CDN } from '../data/projects'

const toc: TocItem[] = [
  { id: 'overview', label: 'Product Overview' },
  { id: 'users', label: 'Target Users' },
  { id: 'problem', label: 'The Problem' },
  { id: 'solution', label: 'The Solution' },
  { id: 'process', label: 'Design Process' },
  { id: 'workflow', label: 'Basic Workflow' },
  { id: 'culture', label: 'Design Culture Impact' },
  { id: 'outcome', label: 'Outcome' },
]

const img = {
  hero: `${CDN}/1622387590296-0547A2FO0Q310CSC2RE7/Concept%2BMock%2B-%2BRS%2BCloud.jpg`,
  ui: `${CDN}/22af694b-7ab7-4064-a5e2-0685095b2816/UI+Overview.png`,
  process: [
    {
      src: '/media/render-studio/design-process-1-framing.png',
      alt: '1. Framing — documenting product requirements',
    },
    {
      src: '/media/render-studio/design-process-2-alignments.png',
      alt: '2. Alignments — workshops and product vision',
    },
    {
      src: '/media/render-studio/design-process-3-ideation.png',
      alt: '3. Design ideation — flows and early concepts',
    },
    {
      src: '/media/render-studio/design-process-4-prototyping.png',
      alt: '4. Prototyping — wireframes to high-fidelity UI',
    },
  ],
  flow: [
    `${CDN}/1771076246840-UGL6L4A2KPZ5LLSAMZA6/Frame+892BasicFlow.png`,
    `${CDN}/1771076247840-UAZAHLLOPVMQQY9V8T3H/Frame+893BasicFlow.png`,
    `${CDN}/1771076251125-W2VNIC7G3XGM7WSVY1HN/Frame+894BasicFlow.png`,
    `${CDN}/1771076252252-2AJ8QIISI723XTPD1VOX/Frame+895BasicFlow.png`,
    `${CDN}/1771076256883-00DNZHULH6YUWFQ727IW/Frame+896BasicFlow.png`,
    `${CDN}/1771076257888-0PBENSVJ70HX78I7FHQE/Frame+897BasicFlow.png`,
    `${CDN}/1771076260491-NDW1P602JXJPDKTTXHQR/Frame+898BasicFlow.png`,
  ],
  pmVsMe: '/media/render-studio/pm-vs-me.png',
  dataTrackingPlan: '/media/render-studio/data-tracking-plan.png',
  dataDashboard: '/media/render-studio/data-dashboard.png',
  decision: '/media/render-studio/decision-8pct.png',
  batch: '/media/render-studio/batch-rendering.gif',
}

const videos = {
  walkthrough: {
    src: '/media/render-studio/product-walkthrough.mp4',
    poster: '/media/render-studio/product-walkthrough-poster.jpg',
  },
  outputs: {
    src: '/media/render-studio/output-types.mp4',
    poster: '/media/render-studio/output-types-poster.jpg',
  },
}

/* Lucide icon paths (ISC) — stroke icons matching the site's line weight */
const industryIcons: Record<string, ReactNode> = {
  automotive: (
    <>
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <path d="M9 17h6" />
      <circle cx="17" cy="17" r="2" />
    </>
  ),
  toy: (
    <>
      <rect width="18" height="12" x="3" y="8" rx="1" />
      <path d="M10 8V5c0-.6-.4-1-1-1H6a1 1 0 0 0-1 1v3" />
      <path d="M19 8V5c0-.6-.4-1-1-1h-3a1 1 0 0 0-1 1v3" />
    </>
  ),
  furniture: (
    <>
      <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3" />
      <path d="M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z" />
      <path d="M5 18v2" />
      <path d="M19 18v2" />
    </>
  ),
  defense: (
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
  ),
  luxury: (
    <>
      <path d="M6 3h12l4 6-10 13L2 9Z" />
      <path d="M11 3 8 9l4 13 4-13-3-6" />
      <path d="M2 9h20" />
    </>
  ),
  aerospace: (
    <>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </>
  ),
  design: (
    <>
      <path d="M15.707 21.293a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 1 0-1.414l5.586-5.586a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414z" />
      <path d="m18 13-1.375-6.874a1 1 0 0 0-.746-.776L3.235 2.028a1 1 0 0 0-1.207 1.207L5.35 15.879a1 1 0 0 0 .776.746L13 18" />
      <path d="m2.3 2.3 7.286 7.286" />
      <circle cx="11" cy="11" r="2" />
    </>
  ),
  footwear: (
    <>
      <path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z" />
      <path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z" />
      <path d="M16 17h4" />
      <path d="M4 13h4" />
    </>
  ),
  eyewear: (
    <>
      <circle cx="6" cy="15" r="4" />
      <circle cx="18" cy="15" r="4" />
      <path d="M14 15a2 2 0 0 0-2-2 2 2 0 0 0-2 2" />
      <path d="M2.5 13 5 7c.7-1.3 1.4-2 3-2" />
      <path d="M21.5 13 19 7c-.7-1.3-1.5-2-3-2" />
    </>
  ),
  construction: (
    <>
      <path d="m15 12-8.373 8.373a1 1 0 1 1-3-3L12 9" />
      <path d="m18 15 4-4" />
      <path d="M21.5 11.5 19.586 9.586A2 2 0 0 1 19 8.172V7l-2.26-2.26a6 6 0 0 0-4.202-1.756L9 2.96l.92.82A6.18 6.18 0 0 1 12 8.4V10l2 2h1.172a2 2 0 0 1 1.414.586L18.5 14.5" />
    </>
  ),
}

const industries = [
  { id: 'automotive', label: 'Automotive', origin: true },
  { id: 'toy', label: 'Toy' },
  { id: 'furniture', label: 'Furniture' },
  { id: 'defense', label: 'Defense' },
  { id: 'luxury', label: 'Luxury' },
  { id: 'aerospace', label: 'Aerospace' },
  { id: 'design', label: 'Design' },
  { id: 'footwear', label: 'Footwear' },
  { id: 'eyewear', label: 'Eyewear' },
  { id: 'construction', label: 'Construction' },
]

const flowAlts = [
  '1. Import Product',
  '2. Configure Product',
  '3. Configuration',
  '4. Adjust Shot Settings',
  '5. Create Shot',
  '6. Create More Shots',
  '7. Reuse Shots',
]

export function RenderStudioPage() {
  return (
    <CaseStudyLayout
      brand="Render Studio"
      title="Render Studio"
      toc={toc}
      heroImage={img.hero}
      lede="A runtime 3D creation tool for marketing teams — professional imagery from the source-of-truth model."
    >
      <section id="overview" className="section">
        <p className="section__label">Product Overview</p>
        <Figure
          src={img.ui}
          alt="Main view of Render Studio"
          caption="Main view of Render Studio"
        />
        <p>
          Render Studio is a runtime 3D creation tool that lets marketing teams
          generate professional imagery and interactive assets from a
          source-of-truth model — dramatically improving consistency for overseas
          collaboration while cutting production time and cost.
        </p>
        <p>
          Forma Editor connected factory models to sales configurators. Render
          Studio closed the next gap: marketing still needed images, videos, and
          turntables that stayed true to the same 3D model.
        </p>
        <h3>Contributions</h3>
        <p>
          As founding designer I defined the product with Eng, Sales, and Product
          leadership, owned 0–1 design end to end for non-technical marketers,
          introduced usage tracking so iterations were grounded in data, and later
          hired and mentored designers to scale beyond the first release.
        </p>
      </section>

      <section id="users" className="section">
        <p className="section__label">Target Users</p>
        <h3>Regional sales and marketing teams</h3>
        <p>
          Less technical teams who need to create content from the
          source-of-truth model, without waiting on HQ or relying on agencies
          that drift from sales rules.
        </p>
        <ul>
          <li>No existing tool to create from the source-of-truth model</li>
          <li>Agency content often misaligned with HQ sales rules</li>
          <li>Long wait for HQ to distribute assets</li>
        </ul>
      </section>

      <section id="problem" className="section">
        <p className="section__label">The Problem</p>
        <p className="section__kicker">The marketing production drain</p>
        <p>
          Teams already had accurate 3D data — but no way for marketing to create
          from it. Assets drifted from sales rules, and HQ-driven production meant
          long waits and high agency spend.
        </p>
        <p>
          Take Sarah, who runs marketing for a global bike brand. Each bike has
          thousands of regional configs, and every year she needs a huge library
          of turntables and images across resolutions. Without in-house rendering
          skills she depends on agencies — expensive, slow, and hard to keep
          product-correct. When a part changes mid-season, static files go stale
          and the cycle starts over.
        </p>
      </section>

      <section id="solution" className="section">
        <p className="section__label">The Solution</p>
        <p className="section__kicker">Render Studio</p>
        <p>
          With Render Studio, Sarah turns one digital twin into an in-house
          content pipeline. A no-code interface lets her stage and shoot like a
          virtual photographer; renders pull from factory data so configs stay
          product-correct; and saved shot setups can be reused when the model
          updates — refreshing a catalog in minutes instead of weeks.
        </p>
        <CaseStudyVideo
          src={videos.walkthrough.src}
          poster={videos.walkthrough.poster}
          label="Render Studio product walkthrough"
          caption="Product walkthrough"
        />
      </section>

      <section id="process" className="section">
        <p className="section__label">Design Process</p>
        <p>
          I kicked off product-definition workshops, framed and documented the
          requirements, then moved through wireframes and prototype iterations.
        </p>
        <div
          className="media-cluster media-cluster--process"
          role="list"
          aria-label="Design process steps"
        >
          {img.process.map((item) => (
            <Figure key={item.src} src={item.src} alt={item.alt} />
          ))}
        </div>
      </section>

      <section id="workflow" className="section">
        <p className="section__label">Basic Workflow</p>
        <p className="section__kicker">Create shots with configurable models</p>
        <p>
          3D content creation is rarely linear. Here’s the basic path from import
          to reusable shots — scroll sideways for the sequence.
        </p>
        <div className="filmstrip" role="list" aria-label="Basic workflow steps">
          {img.flow.map((src, i) => (
            <figure className="figure filmstrip__item" key={src} role="listitem">
              <img src={src} alt={flowAlts[i]} loading="lazy" />
            </figure>
          ))}
        </div>

        <h3>Output types</h3>
        <p>
          One shot setup can export 64K images, ecommerce turntables, AOV layers
          for post, and 360 images for VR.
        </p>
        <CaseStudyVideo
          src={videos.outputs.src}
          poster={videos.outputs.poster}
          label="Render Studio output types demo"
          caption="Outputs from a single shot setup"
        />
      </section>

      <section id="culture" className="section">
        <p className="section__label">Design Culture Impact</p>

        <h3>More or less?</h3>
        <p>
          Should the inspector ship packed with advanced controls for technical
          users, or a smaller set of essentials for marketers? PM favored the
          former; I favored the latter. We settled it with data.
        </p>
        <Figure
          src={img.pmVsMe}
          alt="PM vs Me — 59 advanced controls versus 36 essential settings"
        />

        <h3>Making design data-driven</h3>
        <p>
          I defined the tracking plan for Render Studio — research questions,
          events, cadence, and dashboards — so the post-processing panel and
          future decisions could rest on usage, not opinion.
        </p>
        <Figure
          src={img.dataTrackingPlan}
          alt="Data tracking plan — define goals through dashboard and workshops"
          className="figure--fit"
        />
        <Figure
          src={img.dataDashboard}
          alt="Internal Render Studio data analytics dashboard"
          className="figure--crop"
        />
        <p>
          With the full advanced controls shipped in testing, only 8% of created
          assets used them. We went with the simpler direction for our less
          technical users.
        </p>
        <Figure
          src={img.decision}
          alt="Decision — only 8% used advanced settings, so we shipped the simplified direction"
        />

        <h3>Batch rendering</h3>
        <p>
          Analytics showed the same shot setups repeating at scale. Follow-up
          interviews confirmed why: marketing managers needed hundreds of product
          variants across three camera angles and four scenes — thousands of
          images from one configuration. Batch rendering was designed from that
          insight — a new pattern with no precedent, and one of the most
          rewarding problems I worked on.
        </p>
        <Figure
          src={img.batch}
          alt="Batch rendering in Render Studio — generating many product images from shared camera angles and scenes"
          className="figure--compact"
        />
      </section>

      <section id="outcome" className="section section--last">
        <p className="section__label">Outcome</p>
        <p className="section__kicker">Built for automotive. Scaled further.</p>
        <p>
          We started with automotive and heavy machinery — huge configuration
          spaces — then grew through research and customer work into furniture,
          apparel, retail, and more.
        </p>
        <ul className="industry-grid" aria-label="Industries served">
          {industries.map((item) => (
            <li
              key={item.id}
              className={[
                'industry-chip',
                item.origin ? 'industry-chip--origin' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {industryIcons[item.id]}
              </svg>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
        <CaseStudyVideo
          src={videos.walkthrough.src}
          poster={videos.walkthrough.poster}
          label="Render Studio closing walkthrough"
        />
      </section>
    </CaseStudyLayout>
  )
}
