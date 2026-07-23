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
  industries: [
    { src: '/media/render-studio/industry-automotive.png', alt: 'Automotive' },
    { src: '/media/render-studio/industry-toy.png', alt: 'Toy' },
    { src: '/media/render-studio/industry-furniture.png', alt: 'Furniture' },
    { src: '/media/render-studio/industry-defense.png', alt: 'Defense' },
    { src: '/media/render-studio/industry-luxury.png', alt: 'Luxury' },
    { src: '/media/render-studio/industry-aerospace.png', alt: 'Aerospace' },
    { src: '/media/render-studio/industry-design.png', alt: 'Design' },
    { src: '/media/render-studio/industry-footwear.png', alt: 'Footwear' },
    { src: '/media/render-studio/industry-eyewear.png', alt: 'Eyewear' },
    { src: '/media/render-studio/industry-construction.png', alt: 'Construction' },
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
        />
        <Figure
          src={img.dataDashboard}
          alt="Internal Render Studio data analytics dashboard"
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
        <div className="media-cluster media-cluster--industries">
          {img.industries.map((item) => (
            <Figure key={item.src} src={item.src} alt={item.alt} />
          ))}
        </div>
        <CaseStudyVideo
          src={videos.walkthrough.src}
          poster={videos.walkthrough.poster}
          label="Render Studio closing walkthrough"
        />
      </section>
    </CaseStudyLayout>
  )
}
