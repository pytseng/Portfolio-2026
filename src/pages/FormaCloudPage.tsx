import { CaseStudyLayout, Figure } from '../components/CaseStudyLayout'
import { VideoPlaceholder } from '../components/VideoPlaceholder'
import type { TocItem } from '../data/formaCaseStudy'
import { CDN } from '../data/projects'

const toc: TocItem[] = [
  { id: 'contributions', label: 'Contributions' },
  { id: 'overview', label: 'Product Overview' },
  { id: 'problem', label: 'The Problem' },
  { id: 'solution', label: 'The Solution' },
  { id: 'influence', label: 'High level Influence' },
  { id: 'walkthrough', label: 'Product Walkthrough' },
  { id: 'result', label: 'Result' },
]

const img = {
  hero: `${CDN}/4ad9baa1-7c22-4248-b9d9-1edd63c43516/Thumbnail.png`,
  overview: `${CDN}/d7ebb4e6-2e1d-46e5-b463-f5720d9cd159/FormaCloudProductOverview.png`,
  e2e: `${CDN}/17584ee0-c35c-4edc-a815-746e1e0a6fd1/FormaCloudE2EChart.png`,
  config: `${CDN}/1759858777266-C6Q2W8CM59XAN1CZ5CO5/Content+Management+-+Configurator.png`,
  assets1: `${CDN}/1759858777777-BFRO6AMVDFDD8086F9LI/Content+Management+-+Other+Assets-1.png`,
  assets2: `${CDN}/1759858779474-QH1O4GVEIZEFBOTF526A/Content+Management+-+Other+Assets-2.png`,
  assets3: `${CDN}/1759858780019-BEW0SMYLN6R1AZJ4XR85/Content+Management+-+Other+Assets-3.png`,
  assets4: `${CDN}/1759858780804-VPLN8DV2R9OJQVZPUDYP/Content+Management+-+Other+Assets.png`,
  render: `${CDN}/1759858781580-DE72FV7Z4CJPZDGVLQZ1/Content+Management+-+Render.png`,
  install1: `${CDN}/1759858781833-WIO0DXZNTXEPTI3N7SC8/Installation+-+Get+Started-1.png`,
  install2: `${CDN}/1759858783280-WEQLR432MFW9N6V1FN3R/Installation+-+Get+Started.png`,
  landing: `${CDN}/1759858783336-1NTITGINIME1Y58054FZ/Landing.png`,
}

export function FormaCloudPage() {
  return (
    <CaseStudyLayout
      brand="Forma Cloud"
      title="Forma Cloud"
      toc={toc}
      heroImage={img.hero}
      lede="A web SaaS hub connecting industrial 3D design to global digital commerce."
    >
      <section id="contributions" className="section">
        <p className="section__label">Contributions</p>
        <ol className="rich-list">
          <li>
            <strong>Strategic Scaling & Market Fit:</strong> Created a system
            connecting desktop, mobile, web platform, unlocking 3D content
            creation pipeline for eCommerce. I was the domain expert at Unity and
            was able to single handedly design the entire ecosystem and also led
            the research that identified the most valuable use cases, secured
            product-market fit.
          </li>
          <li>
            <strong>Executive Strategy & Leadership:</strong> Reported to the
            Design Director and spearheaded strategy workshops with VPs and
            Directors across Sales, Product, and Engineering. These sessions
            served as the catalyst for the organization, aligning cross-functional
            leadership on the Digital Twin vision and roadmap.
          </li>
        </ol>
      </section>

      <section id="overview" className="section">
        <p className="section__label">Product Overview</p>
        <p>
          Forma Cloud is a web-based SaaS platform that bridges the gap between
          industrial 3D design and global digital commerce by serving as a
          central management and distribution hub. It enables brands to link
          factory-grade 3D data authored in Forma Editor, Render Studio or other
          3D softwares, create a digital twin presence that could be distributed
          to eCommerce platforms like Shopify and Salesforce. Forma Cloud
          empowers marketing teams to effortlessly publish, version control, and
          analyze any live updates, synchronizing product models and marketing
          endpoints.
        </p>
        <Figure src={img.overview} alt="Forma Cloud product overview" />
      </section>

      <section id="problem" className="section">
        <p className="section__label">The Problem</p>
        <ul>
          <li>
            <strong>Disconnected data:</strong> Currently, 3D content is
            typically &quot;one-off&quot; manual project that is completely
            disconnected from factory data, without the synchronization, any
            product update immediately obsoletes the content what consumers see.
          </li>
          <li>
            <strong>Management Bottlenecks:</strong> Current ecosystems requires
            expensive experts to handle complex versioning and &quot;source of
            truth&quot; management for thousands of product variations, which
            small/medium business usually could not afford.
          </li>
          <li>
            <strong>Invisible Performance:</strong> Without integrated analytics,
            brands cannot see how their 3D models are performing or how users are
            interacting with different product variants.
          </li>
        </ul>
      </section>

      <section id="solution" className="section">
        <p className="section__label">The Solution</p>
        <p>
          Forma Cloud solves the fragmentation problem by providing an end-to-end
          pipeline that carries factory data all the way to the consumer&apos;s
          screen. It moves 3D from a static design file to a live, managed
          service that stays connected to the brand’s industrial data and
          eCommerce performance metrics.
        </p>
        <ul>
          <li>
            <strong>Web-Based Central Hub:</strong> A single &quot;source of
            truth&quot; to manage complicated versioning and instant updates
            across all global digital touchpoints simultaneously.
          </li>
          <li>
            <strong>Turnkey eCommerce Integration:</strong> Push 3D variations
            and interactive content to platforms like Shopify and Salesforce with
            simplified deployment tools.
          </li>
          <li>
            <strong>Interactive Analytics:</strong> Gain insights into model
            performance, tracking user interactions and variant popularity to
            drive better business decisions.
          </li>
        </ul>
        <Figure
          src={img.e2e}
          alt="Forma Cloud end-to-end overview chart"
          caption="Forma Cloud end-to-end overview"
        />
        <VideoPlaceholder id="VIDEO::forma-cloud::e2e-walkthrough" />
      </section>

      <section id="influence" className="section">
        <p className="section__label">High level Influence</p>
        <p>
          I was collaborated with PM to transform early research into a
          compelling product vision that captured executive attention and secured
          resource for a full product team. From there, I transitioned from solo
          designer to a leadership role helping recruit the team
          (design/eng/pm/doc) while designing the entire end-to-end 3D ecosystem
          for the automotive & manufacturing vertical.
        </p>
      </section>

      <section id="walkthrough" className="section">
        <p className="section__label">Product Walkthrough</p>
        <div className="image-row">
          <Figure src={img.landing} alt="Landing" caption="Landing" />
          <Figure src={img.install2} alt="Installation" caption="Installation - Get Started" />
          <Figure src={img.install1} alt="Installation" caption="Installation - Get Started" />
          <Figure src={img.config} alt="Configurator management" caption="Content Management - Configurator" />
          <Figure src={img.render} alt="Render management" caption="Content Management - Render" />
          <Figure src={img.assets4} alt="Other assets" caption="Content Management - Other Assets" />
          <Figure src={img.assets1} alt="Other assets" />
          <Figure src={img.assets2} alt="Other assets" />
          <Figure src={img.assets3} alt="Other assets" />
        </div>
      </section>

      <section id="result" className="section section--last">
        <p className="section__label">Result</p>
        <p>
          Forma Cloud was sold as part of the industrial solution to big name
          manufacturers(Hoka, Nike, Piaget Watch, Luxottica) and later on became
          the backbone of Unity Digital Twin Portal which I led the design. In
          simple term, I joined and grew with the Unity’s push on most industrial
          use cases and became the key design leadership that scaled multiple
          products from zero to an entire ecosystem.
        </p>
      </section>
    </CaseStudyLayout>
  )
}
