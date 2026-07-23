import { Link } from 'react-router-dom'
import { CaseStudyLayout, Figure } from '../components/CaseStudyLayout'
import { CaseStudyVideo } from '../components/CaseStudyVideo'
import type { TocItem } from '../data/formaCaseStudy'
import { CDN } from '../data/projects'

const toc: TocItem[] = [
  { id: 'summary', label: 'Summary' },
  { id: 'challenge', label: 'Challenge' },
  { id: 'process', label: 'Process' },
  { id: 'thoughts', label: 'Final Thoughts' },
  { id: 'explore', label: 'More To Explore' },
]

const img = {
  hero: `${CDN}/7ba24a44-912f-44ac-acf7-e62751ff8d3f/u3369982172_httpss.mj.runrm4Iv7qL894_httpss.mj.runSyQC41kO9QM_782df3cd-7b02-4b40-a85c-e7457435f480_1.png`,
  workflow: `${CDN}/6157684e-53b2-400a-9ec1-243b45f7a47d/WorkFlow.png`,
  genWorkflow: `${CDN}/5304b751-6264-4563-9ff4-deab3bc630a9/GenWorkflow.png`,
  prototype: `${CDN}/e8f35592-46fb-4eb8-b874-3cde17f3a4a3/Prototype+workflow+horizontal.png`,
  combined01: `${CDN}/e5f6117d-7d69-4dcd-aa48-2b39b8471b67/combined01.png`,
  combined02: `${CDN}/55c08784-e716-4cff-9d43-899643963690/combined02.png`,
}

const videos = {
  /** CapCut “Render Studio brief.mov” ↔ Squarespace 42f8a7e4… (~70.7s) */
  walkthrough: {
    src: '/media/gen-ai/walkthrough.mp4',
    poster: '/media/gen-ai/walkthrough-poster.jpg',
  },
  /** CapCut gen ai study part 1 ↔ Squarespace c9557773… (~26.5s) */
  comparativeAudit: {
    src: '/media/gen-ai/comparative-audit.mp4',
    poster: '/media/gen-ai/comparative-audit-poster.jpg',
  },
  /** CapCut gen ai study part 2 ↔ Squarespace a9c7a5b4… (~20.5s) */
  meshWorkflow: {
    src: '/media/gen-ai/mesh-workflow.mp4',
    poster: '/media/gen-ai/mesh-workflow-poster.jpg',
  },
  /** CapCut gen ai study part 3 ↔ Squarespace 37859fb1… (~32.2s) */
  manualUi: {
    src: '/media/gen-ai/manual-ui.mp4',
    poster: '/media/gen-ai/manual-ui-poster.jpg',
  },
  /** CapCut “claudcowork render studio.mov” ↔ Squarespace 63f56e7b… (~66.9s) */
  claudePrototype: {
    src: '/media/gen-ai/claude-prototype.mp4',
    poster: '/media/gen-ai/claude-prototype-poster.jpg',
  },
  /** CapCut 0403.mov ↔ Squarespace 29499140… (~10.7s) */
  designDecision: {
    src: '/media/gen-ai/design-decision.mp4',
    poster: '/media/gen-ai/design-decision-poster.jpg',
  },
}

const reports = {
  comparative: '/media/gen-ai/reports/comparative-analysis.html',
  meshy: '/media/gen-ai/reports/meshy-workflow-analysis.html',
}

export function GenAIPage() {
  return (
    <CaseStudyLayout
      brand="Gen AI"
      title="Gen AI in Render Studio"
      toc={toc}
      heroImage={img.hero}
      lede="AI assisted design process and the AI background generation feature."
    >
      <section id="summary" className="section">
        <p className="section__label">Summary</p>
        <p>
          In this project page, I pull out AI assisted design process and the AI
          background generation feature to show case AI literacy and how it had
          impact my design process. For the complete product cycle, check out{' '}
          <Link to="/render-studio">Render Studio</Link>.
        </p>
        <p>
          Render Studio is a tool created for the marketing specialists in the
          manufacturing businesses managing complex products (e.g. A car of
          trims, parts, thousands of different combination that must have
          accurate marketing material based on regional markets). It uses factory
          3D model to create accurate and high-res marketing content, all
          imageries created contains product configuration and 3D scene
          composition data that could be instantly reused and shared. It is not a
          tool to make general images.
        </p>
        <CaseStudyVideo
          src={videos.walkthrough.src}
          poster={videos.walkthrough.poster}
          label="Video walkthrough of Render Studio"
          caption="Video walkthough of Render Studio"
        />
      </section>

      <section id="challenge" className="section">
        <p className="section__label">Challenge</p>
        <h2>
          How to use AI to generate backgrounds in Render Studio in order to
          create resuable Shots?
        </h2>
      </section>

      <section id="process" className="section">
        <p className="section__label">Process</p>
        <Figure src={img.workflow} alt="Comparative analysis workflow" />

        <h3>Comparative Analysis</h3>
        <p>
          I used Claude Cowork to rapidly audit representative 2D, 3D, and HDRI
          background tools, shifting my time from manual data collection to
          high-level analysis.
        </p>
        <p>
          See the{' '}
          <a href={reports.comparative} target="_blank" rel="noreferrer">
            comparative analysis report
          </a>
        </p>
        <CaseStudyVideo
          src={videos.comparativeAudit.src}
          poster={videos.comparativeAudit.poster}
          label="Create a high-level audit report of 8 products using Claude Cowork"
          caption="Create a high-level audit report of 8 products using Claude Cowork"
        />

        <h3>Target UI study</h3>
        <p>
          From the result of the Audit, I am able to deep dives into products and
          use Claude Cowork to create step by step interaction breakdown reports.
        </p>
        <p>
          See a report for{' '}
          <a href={reports.meshy} target="_blank" rel="noreferrer">
            meshy.ai
          </a>
          .
        </p>
        <CaseStudyVideo
          src={videos.meshWorkflow.src}
          poster={videos.meshWorkflow.poster}
          label="Claude Cowork step-by-step workflow breakdown of Mesh.ai"
          caption="Using Claude Cowork to create a step-to-step workflow breakdown report of Mesh.ai"
        />

        <h3>Manual UI Research</h3>
        <p>
          I still do manual study for specific interactions and get how it feels
          to use the product as a human. After the overall research of existing
          Gen-AI tools, I made the intentional choice to strip away granular
          settings like model selection and output formats, as these technical
          levers created unnecessary friction for our specific Render Studio use
          case.
        </p>
        <CaseStudyVideo
          src={videos.manualUi.src}
          poster={videos.manualUi.poster}
          label="Manual study on high-interest interactions"
          caption="Manual study on high-interest interactions"
        />

        <h3>Defining Background Generation Flow</h3>
        <p>
          After all study, I collected enough insights to define the actual
          workflow of using AI to generate background in Render Studio, the
          thought process behind is to minimize steps needed and parameter
          required to not overwhelm users with AI features.
        </p>
        <Figure src={img.genWorkflow} alt="Background generation workflow" />

        <h3>AI Assisted Prototype</h3>
        <p>
          With the workflow blueprints, existing Render Studio design system, and
          design references. I create a more comprehensive prompt that I used
          through the best-in-the-field AI assisted design tools (Google AI
          Studio, Claude Cowork, Figma Make, V0, and UX Pilot) to generate static
          and interactive design prototypes.
        </p>
        <Figure src={img.prototype} alt="Prototype workflow" />

        <h3>Prototype Tool Pick</h3>
        <p>
          From the testing using the same prompts, Claude Cowork result in the
          most interactable prototype and also matching the design reference
          mostly even though not having direct Figma connection as in UX Pilot.
          V0 has it’s downside of not able to easily create 3D scene like in AI
          Studio or Claude. Figma Make has details in UI making, but slow to
          iterate and wasn’t respecting the style reference even though having
          native Figma design integration. The most I value in prototype is about
          quick and cheap disposable prototypes instead of being code ready.
          Claude Cowork result is great from the design perspective in such case.
        </p>
        <CaseStudyVideo
          src={videos.claudePrototype.src}
          poster={videos.claudePrototype.poster}
          label="Interactive prototype created from Claude Cowork"
          caption="interactive prototype created from Claude Cowork"
        />

        <h3>Design Decision</h3>
        <p>
          Most AI image generation tools go with the heavy UI that allows users
          to select model types, image format, style reference, style level,
          negative prompts, and many more. However, the main goal isn’t
          generating image as those tools, our main goal is to create a
          background asset (2D image, HDRI, or 3D scene) that could be composite
          with configurable product model, and the background generation is
          merely part of the workflow. Thus, I deliberately decided to not giving
          the AI feature the spotlight and went for the clean design which AI
          integrated seamlessly to existing workflow.
        </p>
        <CaseStudyVideo
          src={videos.designDecision.src}
          poster={videos.designDecision.poster}
          label="Design Decision section video"
        />
      </section>

      <section id="thoughts" className="section">
        <p className="section__label">Final Thoughts</p>
        <p>
          The interactive prototype built with Claude Cowork can’t efficiently
          create the exact interaction of AI-generated backgrounds yet. but it
          does the job of communicating the concept while I finalize the design.
          A few things I took away from the whole AI assisted design process:
        </p>
        <ul>
          <li>
            <strong>Agentic AI is a workflow upgrade:</strong> Generative AI is
            great for analyzing ideas, but using agentic tools like Claude Code
            to map the product landscape and auto-generate shareable HTML reports
            is a genuine step-change and has became part of my process if needed.
          </li>
          <li>
            <strong>Wireframing has become optional:</strong> With detailed
            prompts, a solid design system, and style references ready to go, I
            don’t find strong incentives to wireframing anymore. The time savings
            just aren&apos;t there like they used to be.
          </li>
          <li>
            <strong>Faster hi-fi mockups:</strong> UX Pilot is my go-to for
            quickly iterate higher fidelity mockups. Because it plugs directly
            into Figma and respects my design system, the output is actually
            usable and far better than raw prompts or generic sketch-to-visual
            tools.
          </li>
          <li>
            <strong>Interactive demos without the code:</strong> For interactive
            prototypes, I found Google AI Studio or Claude Cowork having the best
            result. These are perfect for getting a prototype to 80% fidelity
            quickly. They might not be &quot;production-ready,&quot; but easy to
            tell story with and get stakeholders on board. V0 and Figma Make lack
            the ability to create 3D viewport.
          </li>
          <li>
            <strong>The bigger picture:</strong> AI is currently great for linear
            mobile apps flows and small desktop modules. But for complex system,
            I use these tools for disposable prototypes to test specific
            interaction before manually create more accurate designs, with AI
            tools in video creation, visualizing product ideas have became easier
            than ever.
          </li>
        </ul>
        <Figure src={img.combined01} alt="Finalized AI background generation design" />
        <Figure
          src={img.combined02}
          alt="The finalized design of AI background generating in Render Studio"
          caption="The finalized design of AI background generating in Render Studio"
        />
      </section>

      <section id="explore" className="section section--last">
        <p className="section__label">More To Explore</p>
        <p>
          There are still a few things that I personally would like to explore
          more:
        </p>
        <ul>
          <li>
            <strong>Indeterminate Indicators:</strong> The processing time of 3D
            asset and the higher quality HDRI would requires wait time that we
            need the transition state to reduce user cognitive load.
          </li>
          <li>
            <strong>Preview generated background:</strong> Previewing the asset
            should be something that doesn’t add an additional layer and also not
            to interfere with the main 3D scene. It should be able to done when
            the background is generating.
          </li>
          <li>
            <strong>Fine tuning background with AI:</strong> I personally do not
            think the current standard of having area selection of image would be
            a good way to fix HDRI or 3D assets, it is only doable to 2D image
            backplate. This would require a lot more thought and research to
            understand what is available yet the process should also be easy
            enough that doesn’t bloat the workflow.
          </li>
        </ul>
      </section>
    </CaseStudyLayout>
  )
}
