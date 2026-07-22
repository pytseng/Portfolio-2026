import { CaseStudyLayout, Figure } from '../components/CaseStudyLayout'
import { CaseStudyVideo } from '../components/CaseStudyVideo'
import type { TocItem } from '../data/formaCaseStudy'
import { CDN } from '../data/projects'

const toc: TocItem[] = [
  { id: 'overview', label: 'Product Overview' },
  { id: 'problem', label: 'The Problem' },
  { id: 'solution', label: 'The Solution' },
  { id: 'zero-to-one', label: '0 to 1' },
  { id: 'workflow', label: 'Basic Workflow' },
  { id: 'culture', label: 'Design Culture Impact' },
  { id: 'outcome', label: 'Outcome' },
]

const img = {
  hero: `${CDN}/1622387590296-0547A2FO0Q310CSC2RE7/Concept%2BMock%2B-%2BRS%2BCloud.jpg`,
  ui: `${CDN}/22af694b-7ab7-4064-a5e2-0685095b2816/UI+Overview.png`,
  strategic: `${CDN}/75532229-4d14-479d-90d1-0533616d81d2/Frame+901.png`,
  research: `${CDN}/53429d54-9842-4bc7-9032-c3bd7a2b0218/Frame+900.png`,
  culture: `${CDN}/95f6e728-03a8-4b45-a95d-acf3569b5223/Frame+899.png`,
  flow: [
    `${CDN}/1771076246840-UGL6L4A2KPZ5LLSAMZA6/Frame+892BasicFlow.png`,
    `${CDN}/1771076247840-UAZAHLLOPVMQQY9V8T3H/Frame+893BasicFlow.png`,
    `${CDN}/1771076251125-W2VNIC7G3XGM7WSVY1HN/Frame+894BasicFlow.png`,
    `${CDN}/1771076252252-2AJ8QIISI723XTPD1VOX/Frame+895BasicFlow.png`,
    `${CDN}/1771076256883-00DNZHULH6YUWFQ727IW/Frame+896BasicFlow.png`,
    `${CDN}/1771076257888-0PBENSVJ70HX78I7FHQE/Frame+897BasicFlow.png`,
    `${CDN}/1771076260491-NDW1P602JXJPDKTTXHQR/Frame+898BasicFlow.png`,
  ],
  outputsStill: `${CDN}/f4aed763-b5dc-4332-91ec-ffce4b6195ba/Screenshot+2026-02-15+at+3.37.50%E2%80%AFPM.png`,
  dashboard: `${CDN}/5f60a119-580f-4e8b-8686-13b0c8be6602/DataAnalyticsDashboard.png`,
  batch: `${CDN}/1f255611-750b-4553-867a-17861fcd24a5/batch+rendering.gif`,
  balance: `${CDN}/4e70f3c4-ae6e-478e-b75d-bd3eb817bd8b/Gemini_Generated_Image_mlwtx0mlwtx0mlwt.png`,
  post: `${CDN}/89b991dd-6ba8-485b-94ae-e9d67a783fee/postprocessing.png`,
  customers: `${CDN}/2c9a8fd0-403d-43e6-8ce6-77beea2ab4a4/Customer.png`,
  openPm: '/media/render-studio/open-pm.png',
  openMine: '/media/render-studio/open-mine.png',
}

const videos = {
  /** CapCut “Render Studio brief.mov” ↔ Squarespace 42f8a7e4… (~70.7s) */
  walkthrough: {
    src: '/media/render-studio/product-walkthrough.mp4',
    poster: '/media/render-studio/product-walkthrough-poster.jpg',
  },
  /** CapCut RenderStudioOutput.mov ↔ Squarespace 0b3fa169… (~11.3s) */
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
      lede="Let data speak — a Unity editor expansion and web tool that turns configurable product models into professional marketing imagery."
    >
      <section id="overview" className="section">
        <p className="section__label">Product Overview</p>
        <Figure
          src={img.ui}
          alt="Main view of Render Studio"
          caption="Main View of Render Studio"
        />
        <p>
          Render Studio is a Unity editor expansion (and later a standalone
          web-based tool) that empowers marketing teams to generate large volumes
          of professional imagery and interactables from configurable product
          models — streamlining content creation, ensuring consistency, and
          dramatically reducing production time and cost.
        </p>
        <p>
          Forma Editor bridged factory models to sales configurators. Render
          Studio answered the next gap: marketing and sales still needed more
          output types — images, videos, turntables — all true to the same
          source-of-truth 3D model.
        </p>
        <h3>Contributions</h3>
        <ol className="rich-list">
          <li>
            <strong>Product Strategy & Definition:</strong> As the founding
            designer, I initiated and led workshops with leadership from
            Engineering, Sales, and Product to define the roadmap. I shaped the
            product requirements and core vision from zero.
          </li>
          <li>
            <strong>0–1 Design Ownership:</strong> Owned end-to-end design for
            Forma Render, from concept to a market-ready product. Sole designer
            with full ownership of translating business goals into a usable
            experience for non-technical marketing teams.
          </li>
          <li>
            <strong>Establishing Data-Driven Culture:</strong> With a background
            in data engineering, I worked with developers to define quantitative
            collection plans so design iterations were backed by real usage — and
            ran data workshops that strengthened literacy across the design org.
          </li>
          <li>
            <strong>Design Leadership & Management:</strong> After the 0–1
            launch, I hired and managed designers, providing mentorship and
            creative direction to scale the product beyond the first release.
          </li>
        </ol>
      </section>

      <section id="problem" className="section">
        <p className="section__label">The Problem</p>
        <p className="section__kicker">
          The Marketing Production Drain
        </p>
        <p>
          Ready 3D data existed — but sales and marketing teams had no tool to
          create content from that single source of truth. Assets often drifted
          from sales rules, and HQ distribution meant long waits.
        </p>
        <p>
          Sarah manages marketing for a global bike brand, and each bike has
          thousands of product configurations per region. Every year she is stuck
          in a cycle of high costs and missed deadlines producing a massive
          library of marketing assets — 360° turntables, images across dozens of
          resolutions, from mobile to VR.
        </p>
        <ul className="rich-list">
          <li>
            <strong>The Technical Barrier:</strong> High-end rendering and
            traditional photography normally require specialized skills.
            Without in-house experts, Sarah’s team relies on expensive agencies
            for every visual — driving up cost and stripping creative control.
          </li>
          <li>
            <strong>The Review Cycle Bottleneck:</strong> Verifying
            “product-correct” configurations for each regional build (e.g. UK vs
            Germany brake orientation or available trims) is prone to human
            error.
          </li>
          <li>
            <strong>The Fragile Asset Lifecycle:</strong> Traditional renders are
            static files. If a derailleur or cable routing changes mid-season,
            every existing photo becomes obsolete — and the agency process
            restarts from scratch.
          </li>
        </ul>
      </section>

      <section id="solution" className="section">
        <p className="section__label">The Solution</p>
        <p className="section__kicker">Render Studio</p>
        <p>
          Sarah uses Forma Render to turn a single digital twin of the bike into
          an automated content factory — delivering platform-ready assets at a
          fraction of the time and cost.
        </p>
        <ul className="rich-list">
          <li>
            <strong>No-Code Empowerment:</strong> A no-code interface lets Sarah
            act as a virtual photographer — staging products against local
            backdrops and adjusting creation herself, bringing production
            in-house.
          </li>
          <li>
            <strong>Automated Accuracy:</strong> The system pulls directly from
            factory data. If the spec is in the system, the render is 100%
            product-correct.
          </li>
          <li>
            <strong>Reusable Logic (Recall States):</strong> When a new frame
            design launches, swap the 3D model. Lighting, angles, and settings
            stay — updating an entire catalog in minutes.
          </li>
        </ul>
        <CaseStudyVideo
          src={videos.walkthrough.src}
          poster={videos.walkthrough.poster}
          label="Render Studio product walkthrough"
          caption="Video walkthrough of Render Studio"
        />
      </section>

      <section id="zero-to-one" className="section">
        <p className="section__label">Bringing Product from 0 to 1</p>
        <p>
          As founding designer I acted as a strategic catalyst across the product
          lifecycle — moving beyond pixels to align vision with market fit
          through collaborative leadership and cross-functional workshops. The
          arc ran from framing and alignment, through ideation and prototyping,
          into iteration backed by real usage data.
        </p>
        <Figure
          src={img.strategic}
          alt="Strategic influence across the product lifecycle"
          caption="Strategic Influence — Product Kickoff and workshops with Product, Eng, Design, and Sales leadership aligned vision and uncovered product-market fit."
        />
        <Figure
          src={img.research}
          alt="Product research and iterations"
          caption="Product Research and Iterations — Design and execute research plans, collaborate directly with target users, and turn product wedges into scalable design."
        />
        <Figure
          src={img.culture}
          alt="Design culture impact"
          caption="Design Culture Impact — Data design workshops for the broader design org and data team; helped create and mature Unity design systems."
        />
      </section>

      <section id="workflow" className="section">
        <p className="section__label">Basic Workflow</p>
        <p className="section__kicker">
          Create shots with configurable models
        </p>
        <p>
          Content creation in 3D is rarely as linear as common web or mobile
          flows. This is a simplified path through the most basic steps in Render
          Studio to capture shots for export — swipe or scroll sideways to move
          through the sequence.
        </p>
        <div className="filmstrip" role="list" aria-label="Basic workflow steps">
          {img.flow.map((src, i) => (
            <figure className="figure filmstrip__item" key={src} role="listitem">
              <img src={src} alt={flowAlts[i]} loading="lazy" />
            </figure>
          ))}
        </div>

        <h3>Basic output types</h3>
        <p>
          Shots export into formats from 64K images to product turntables for
          eCommerce, AOV layers for professional post-processing, and 360 images
          for VR experiences.
        </p>
        <CaseStudyVideo
          src={videos.outputs.src}
          poster={videos.outputs.poster}
          label="Render Studio output types demo"
          caption="Output types from a single shot setup"
        />
        <Figure src={img.post} alt="Post-processing and AOV outputs" />
      </section>

      <section id="culture" className="section">
        <p className="section__label">Design Culture Impact</p>
        <p className="section__kicker">Decide with data</p>
        <p>
          Leveraging a data-engineering background, I integrated analytics into
          Render Studio so we could evaluate design decisions with evidence —
          what to track, how to log it, and how to visualize it for both product
          and design. Defining the research plan with the product team directly
          influenced features such as Batch Rendering and simplified camera
          controls, and provided data-backed proof for broader strategy. To scale
          the impact, I ran organization-wide workshops that built shared data
          literacy across design.
        </p>
        <Figure
          src={img.outputsStill}
          alt="Example Render Studio output stills"
        />
        <Figure
          src={img.dashboard}
          alt="Internal data dashboard for Render Studio"
          caption="Internal data dashboard for Render Studio collections. Research found advanced settings were rarely used — helping cut ~33% of low-value processing controls and improve overall usability."
        />

        <h3>More controls vs. less friction</h3>
        <p>
          A core product tension: ship a fully equipped inspector that signals
          maturity to technical users, or polish a smaller set of essential
          settings for non-technical marketers. Usage data settled it — less than
          11% of assets used even one advanced setting — which let us consolidate
          direction, unload engineering, and keep the UI learnable.
        </p>
        <div className="compare-row">
          <Figure
            src={img.openPm}
            alt="Post-processing panel with dense advanced controls"
            caption="PM direction — 59 controls across 9 sections. Fully equipped, advanced settings."
          />
          <Figure
            src={img.openMine}
            alt="Simplified post-processing panel with essential controls"
            caption="Design direction — 36 controls across 7 sections. Essential settings only."
          />
        </div>

        <h3>Batch Rendering</h3>
        <p>
          Batch rendering came from analytics leads, then follow-up interviews.
          Marketing managers needed imagery for hundreds of product types across
          the same few camera angles and several scenes — thousands of images
          from one setup. It was a breakthrough feature with no ready-made
          pattern to copy.
        </p>
        <Figure src={img.batch} alt="Batch rendering in Render Studio" />

        <h3>Balanced complexity by user testing</h3>
        <p>
          Beyond telemetry, I invited industry experts to co-work on feature sets
          and hosted internal and external usability tests. That kept Environment
          and Camera settings balanced — grouping what users expect without
          burying clarity under unused power.
        </p>
        <Figure
          src={img.balance}
          alt="Balancing complexity and usability in Render Studio settings"
        />
      </section>

      <section id="outcome" className="section section--last">
        <p className="section__label">Outcome</p>
        <p className="section__kicker">Built for automotive. Scaled to more.</p>
        <p>
          Render Studio began for automotive and heavy-machinery brands whose
          products carry huge configuration spaces. Through continuous research
          (study protocols I led) and active customer engagement, we expanded to
          manufacturers with large SKUs — furniture, clothing, retail, and beyond
          into toy, defense, luxury, aerospace, footwear, eyewear, and
          construction.
        </p>
        <Figure src={img.customers} alt="Early adopter customers" />
        <CaseStudyVideo
          src={videos.walkthrough.src}
          poster={videos.walkthrough.poster}
          label="Render Studio closing walkthrough"
        />
      </section>
    </CaseStudyLayout>
  )
}
