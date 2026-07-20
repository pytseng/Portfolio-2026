import { CaseStudyLayout, Figure } from '../components/CaseStudyLayout'
import type { TocItem } from '../data/formaCaseStudy'
import { CDN } from '../data/projects'

const toc: TocItem[] = [
  { id: 'contributions', label: 'Contributions' },
  { id: 'overview', label: 'Product Overview' },
  { id: 'problem', label: 'The Problem' },
  { id: 'solution', label: 'The Solution' },
  { id: 'zero-to-one', label: 'Bringing Product from 0 to 1' },
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
  flow1: `${CDN}/1771076246840-UGL6L4A2KPZ5LLSAMZA6/Frame+892BasicFlow.png`,
  flow2: `${CDN}/1771076247840-UAZAHLLOPVMQQY9V8T3H/Frame+893BasicFlow.png`,
  flow3: `${CDN}/1771076251125-W2VNIC7G3XGM7WSVY1HN/Frame+894BasicFlow.png`,
  flow4: `${CDN}/1771076252252-2AJ8QIISI723XTPD1VOX/Frame+895BasicFlow.png`,
  flow5: `${CDN}/1771076256883-00DNZHULH6YUWFQ727IW/Frame+896BasicFlow.png`,
  flow6: `${CDN}/1771076257888-0PBENSVJ70HX78I7FHQE/Frame+897BasicFlow.png`,
  flow7: `${CDN}/1771076260491-NDW1P602JXJPDKTTXHQR/Frame+898BasicFlow.png`,
  outputs: `${CDN}/f4aed763-b5dc-4332-91ec-ffce4b6195ba/Screenshot+2026-02-15+at+3.37.50%E2%80%AFPM.png`,
  dashboard: `${CDN}/5f60a119-580f-4e8b-8686-13b0c8be6602/DataAnalyticsDashboard.png`,
  batch: `${CDN}/1f255611-750b-4553-867a-17861fcd24a5/batch+rendering.gif`,
  balance: `${CDN}/4e70f3c4-ae6e-478e-b75d-bd3eb817bd8b/Gemini_Generated_Image_mlwtx0mlwtx0mlwt.png`,
  post: `${CDN}/89b991dd-6ba8-485b-94ae-e9d67a783fee/postprocessing.png`,
  customers: `${CDN}/2c9a8fd0-403d-43e6-8ce6-77beea2ab4a4/Customer.png`,
}

export function RenderStudioPage() {
  return (
    <CaseStudyLayout
      brand="Render Studio"
      title="Render Studio"
      toc={toc}
      heroImage={img.hero}
      lede="A Unity editor expansion and web tool that turns configurable product models into professional marketing imagery."
    >
      <section id="contributions" className="section">
        <p className="section__label">Contributions</p>
        <ol className="rich-list">
          <li>
            <strong>Product Strategy & Definition:</strong> As the founding
            designer, I initiated and led workshops with leadership from
            Engineering, Sales, and Product to define the roadmap. I was
            responsible for shaping the product requirements and the core vision
            from zero.
          </li>
          <li>
            <strong>0–1 Design Ownership:</strong> Owned the end-to-end design
            for Forma Render, taking it from a concept to a market-ready product.
            I acted as the primary design authority, ensuring the high-level
            business goals were translated into a seamless user experience.
          </li>
          <li>
            <strong>Establishing Data-Driven Culture:</strong> Established a
            culture of evidence-based design. with my experience in data
            engineering, I worked closely with developers to define quantitative
            data collection plan and ensure design iterations was backed by real
            user data. Also ran data workshops for designers, strengthen overall
            design culture.
          </li>
          <li>
            <strong>Design Leadership & Management:</strong> After the 0–1
            launch, I transitioned into a leadership role where I hired and
            managed a team of designers. I provided the mentorship and creative
            direction needed to scale the product beyond its initial release.
          </li>
        </ol>
      </section>

      <section id="overview" className="section">
        <p className="section__label">Product Overview</p>
        <p>
          Render Studio, a Unity editor expansion (and later-on a standalone
          web-based tool) that empowers marketing teams to easily generate large
          volumes of professional imagery and interactables using configurable
          product models — streamlining content creation, ensuring consistency,
          and dramatically reducing production time and cost.
        </p>
        <Figure
          src={img.ui}
          alt="Main View of Render Studio"
          caption="Main View of Render Studio (Add a few output type at the bottom right)"
        />
      </section>

      <section id="problem" className="section">
        <p className="section__label">The Problem: The Marketing Production Drain</p>
        <p>
          Sarah manages marketing for a global bike brand, and each bike has
          thousands of product configurations for each region. Every year, she is
          stuck in a cycle of high costs and missed deadlines as she tries to
          produce a massive library of marketing assets—360° turntables, images
          in dozens of resolutions across platforms from mobile to VR.
        </p>
        <ul>
          <li>
            <strong>The Technical Barrier:</strong> High-end rendering and
            traditional photography production normally require specialized
            technical skills. Because Sarah&apos;s team lacks these in-house
            experts, they have to rely on expensive external agencies for every
            single visual asset, driving up costs and stripping away creative
            control.
          </li>
          <li>
            <strong>The Review Cycle Bottleneck:</strong> Verifying
            &quot;product-correct&quot; configurations for each region builds
            (e.g., UK vs Germany brake orientation or available trims) are prone
            to human error.
          </li>
          <li>
            <strong>The Fragile Asset Lifecycle:</strong> Traditional renders are
            &quot;static&quot; files. If a derailleur or cable routing changes
            mid-season, every existing photo becomes instantly obsolete. Sarah
            has to pay the agency to restart the entire creative process from
            scratch because the old assets cannot be easily updated.
          </li>
        </ul>
      </section>

      <section id="solution" className="section">
        <p className="section__label">The Solution: Render Studio</p>
        <p>
          Sarah uses Forma Render to turn a single &quot;Digital Twin&quot; of
          the bike into an automated content factory, delivering perfect,
          platform-ready assets at a fraction of the time and cost.
        </p>
        <ul>
          <li>
            <strong>No-Code Empowerment:</strong> The &quot;no-code&quot;
            interface allows Sarah to act as a virtual photographer. She can
            stage products against local backdrops and adjust creation herself,
            bringing production in-house.
          </li>
          <li>
            <strong>Automated Accuracy:</strong> The system pulls directly from
            factory data. If the spec is in the system, the render is 100%
            product correct.
          </li>
          <li>
            <strong>Reusable Logic (Recall States):</strong> When a new frame
            design launches, simply swap the 3D model. All your lighting, angles,
            and settings stay, updating entire catalog in minutes.
          </li>
        </ul>
      </section>

      <section id="zero-to-one" className="section">
        <p className="section__label">Bringing Product from 0 to 1</p>
        <p>
          As a founding designer, I acted as a strategic catalyst across the
          entire product lifecycle, moving beyond the pixels to align product
          vision with market-fit through collaborative leadership and
          cross-functional workshops. The following highlights provide a
          high-level summary of this systemic influence across the product
          lifecycle.
        </p>
        <Figure src={img.strategic} alt="Strategic Influence" caption="Strategic Influence" />
        <p>
          Through Product Kickoff and workshops at each stage that involve
          Product, Eng, Design, Sales leadership, successfully drive product
          vision alignment and share user knowledge, finding product-market fit,
          highly impacting the overall product strategy of Render Studio.
        </p>
        <Figure
          src={img.research}
          alt="Product Research and Iterations"
          caption="Product Research and Iterations"
        />
        <p>
          Design and execute user research plans, direct collaboration with
          target users, turning valuable product-wedges into scalable design.
        </p>
        <Figure src={img.culture} alt="Design Culture Impact" caption="Design Culture Impact" />
        <p>
          Arrange and instruct data design workshop to the bigger design org and
          data team. Helped created and the maturing of new Unity design systems.
        </p>
      </section>

      <section id="workflow" className="section">
        <p className="section__label">Basic Workflow: Create Shots with Configurable Models</p>
        <p>
          Content creation tools in 3D is never as linear as the common
          web/mobile experience, this is a simplified version to showcase the
          most basic steps performed in Render Studio to capture shots for output
        </p>
        <div className="image-row">
          <Figure src={img.flow1} alt="Basic flow step" />
          <Figure src={img.flow2} alt="Basic flow step" />
          <Figure src={img.flow3} alt="Basic flow step" />
          <Figure src={img.flow4} alt="Basic flow step" />
          <Figure src={img.flow5} alt="Basic flow step" />
          <Figure src={img.flow6} alt="Basic flow step" />
          <Figure src={img.flow7} alt="Basic flow step" />
        </div>
        <h3>Basic Output types</h3>
        <p>
          Shots can be exported into various format from 64K images to product
          turntables that are used in eCommerce or AOV layers for more
          professional post-processing, and 360 images for VR experiences.
        </p>
        <Figure src={img.outputs} alt="Basic output types" />
        <Figure src={img.post} alt="Post-processing outputs" />
      </section>

      <section id="culture" className="section">
        <p className="section__label">Design Culture Impact</p>
        <p>
          Leveraging my background in data engineering, I integrated analytics
          into Render Studio to transform how we evaluate design decisions. By
          defining and implementing research plan with the product team, I
          directly influenced the development of core features such as Batch
          Rendering and Simplified Camera Controls while providing the
          data-backed evidence for broader business strategies. To scale this
          impact, I spearheaded organization-wide workshops, building shared data
          literacy across the design organization.
        </p>
        <Figure
          src={img.dashboard}
          alt="Internal data dashboard"
          caption="Internal data dashboard designed for Render Studio data collections, research finding help reduced helped reduced 33% of the processing settings that are way less used then the others. improving the overall usability of Render Studio."
        />
        <h3>Batch Rendering</h3>
        <p>
          We derive the need of batch rendering from our data analytics leads and
          followup by interviews. We found marketing manager needs to create
          imagieries of hundreds of product type using the same three camera
          angels and in 4 different scenes resulting in thousands of images. This
          is a ground breaking feature with no pre-existing design pattern that I
          enjoy working on.
        </p>
        <Figure src={img.batch} alt="Batch rendering" />
        <h3>Balanced Complexity by User Testing</h3>
        <p>
          Besides using data, I also invited industry experts to co-work on new
          feature sets, and host usability internal/external testing. We are able
          to maintain the balance of complexity and usability of the Environment
          settings and Camera settings, grouping the features that meet users
          expectation and ensure the clarity of the UI.
        </p>
        <Figure src={img.balance} alt="Balanced complexity" />
      </section>

      <section id="outcome" className="section section--last">
        <p className="section__label">Outcome</p>
        <p>
          Render Studio was originally created for automotive and heavy machinery
          brands that each product contains large amount of configurations.
          However, through continuous user research (led by me, with curated
          study protocols) and actively participation in customer engagement
          meetings, we expanded our product reach to manufacturers with large
          SKUs (high volume of unique products) such as furniture, clothing,
          retails. Here are some of our early adopters.
        </p>
        <Figure src={img.customers} alt="Early adopters" />
      </section>
    </CaseStudyLayout>
  )
}
