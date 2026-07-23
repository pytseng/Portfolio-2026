import { CaseStudyLayout, Figure } from '../components/CaseStudyLayout'
import { CaseStudyVideo } from '../components/CaseStudyVideo'
import { assets, tocItems } from '../data/formaCaseStudy'

const formaVideos = {
  overview: {
    src: '/media/forma-editor/hero-overview.mp4',
    poster: '/media/forma-editor/hero-overview-poster.jpg',
  },
  mvp: {
    src: '/media/forma-editor/mvp-run-through.mp4',
    poster: '/media/forma-editor/mvp-run-through-poster.jpg',
  },
}

export function FormaEditorPage() {
  return (
    <CaseStudyLayout
      brand="Forma Editor"
      title="Unity Forma Editor"
      toc={tocItems}
      heroImage="/media/forma-editor/hero.jpg"
      lede="Turning complex 3D product data into interactive configurators for automotive and manufacturing."
    >
      <section id="overview" className="section">
        <p className="section__label">Product Overview</p>
        <CaseStudyVideo
          src={formaVideos.overview.src}
          poster={formaVideos.overview.poster}
          label="Forma Editor product overview"
        />
        <p>
          Forma helps 3D specialists in automotive and manufacturing turn
          product data into <strong>interactive configurators</strong>. Teams
          build variants, cameras, and scenes in a no-code editor, then export
          for sales and marketing. It launched in December 2020 with early trust
          from Volkswagen and Airbus.
        </p>
        <h3>Contributions</h3>
        <p>
          As sole designer I took Forma Editor from concept to a multi-platform
          authoring suite. Discovery work unlocked early adopters. Across the
          manufacturing vertical I also set up how we tested and iterated with
          data.
        </p>
      </section>

      <section id="discovery" className="section">
        <p className="section__label">Initial Discovery</p>
        <p>
          I joined right before the holidays. Instead of waiting for more
          context, I interviewed industry contacts at Nio and Honda. I pushed for
          international onsite studies that brought back reports and partners.
          Across 50+ SME sessions I opened the format to eng and sales so the
          whole team could make sharper calls.
        </p>
      </section>

      <section id="journey" className="section">
        <p className="section__label">Journey Mapping</p>
        <p className="section__kicker">
          How OEMs move from 3D models to configurators
        </p>
        <Figure src={assets.journeyMap} alt="Journey map" />

        <div className="copy-media copy-media--top">
          <div className="copy-media__copy">
            <h3>1. Concept to shape</h3>
            <p>
              A new model line starts with sketches and clay, then a class A
              surface that becomes the master for engineering.
            </p>
          </div>
          <div className="copy-media__media">
            <Figure src={assets.conceptToShape} alt="Concept to shape" />
          </div>
        </div>

        <div className="copy-media copy-media--top">
          <div className="copy-media__copy">
            <h3>2. CMF development</h3>
            <p>
              Color, material, and finish work adds interior and exterior data to
              the same car model.
            </p>
          </div>
          <div className="copy-media__media">
            <Figure src={assets.cmf} alt="CMF development" />
          </div>
        </div>

        <div className="copy-media copy-media--top">
          <div className="copy-media__copy">
            <h3>3. Optimized 3D model</h3>
            <p>
              Manufacture-ready CAD goes downstream. In parallel, a lighter model
              and material library get ready for sales and marketing.
            </p>
          </div>
          <div className="copy-media__media">
            <Figure src={assets.optimized} alt="Optimized 3D model" />
          </div>
        </div>

        <div className="copy-media copy-media--top">
          <div className="copy-media__copy">
            <h3>4. Sales-ready assets</h3>
            <p>
              Teams shoot HDRIs or build 3D stages so the product can be staged
              for customers.
            </p>
          </div>
          <div className="copy-media__media">
            <Figure src={assets.salesAssets} alt="Sales-ready assets" />
          </div>
        </div>

        <div className="copy-media copy-media--top">
          <div className="copy-media__copy">
            <h3>5. Sales configurator</h3>
            <p>
              Models, materials, and environments become the live configurator.
              Cameras and interactions go in. PMs check that options match sales
              rules, like unlocking a limited paint only when a V8 is selected.
            </p>
          </div>
          <div className="copy-media__media">
            <Figure src={assets.configurator} alt="Sales configurator" />
          </div>
        </div>
      </section>

      <section id="users" className="section">
        <p className="section__label">Target Users</p>
        <div className="user-grid">
          <div>
            <h3>Technical artist</h3>
            <ul>
              <li>Shapes the 3D experience</li>
              <li>Comfortable in 3D tools</li>
              <li>Cares about speed</li>
            </ul>
          </div>
          <div>
            <h3>Product manager</h3>
            <ul>
              <li>Owns model correctness</li>
              <li>Lives in BOM and spreadsheet UIs</li>
              <li>Manages sales content</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="problem" className="section">
        <p className="section__label">Main Problem</p>
        <p>
          At the sales configurator stage, brands lean on costly agencies or slow
          in-house builds that are hard to maintain. Without the right tool, that
          spend keeps coming back.
        </p>
      </section>

      <section id="metrics" className="section">
        <p className="section__label">Success Metrics</p>
        <p>
          Early success was not a vanity percentage. Landing target industry
          leaders was the bar, and we hit it soon after launch.
        </p>
      </section>

      <section id="process" className="section">
        <p className="section__label">Design Process</p>
        <div className="media-cluster media-cluster--tiles">
          <Figure src={assets.framing} alt="Framing" caption="Framing" />
          <Figure
            src={assets.stakeholder}
            alt="Stakeholder alignment"
            caption="Stakeholder alignment"
          />
          <Figure
            src={assets.ideation}
            alt="Design ideation"
            caption="Design ideation"
          />
          <Figure
            src={assets.production}
            alt="Production"
            caption="Production"
          />
        </div>
      </section>

      <section id="feature" className="section">
        <p className="section__label">Feature deep dive</p>
        <h3>Rule engine</h3>
        <p>
          The rule engine lets manufacturing managers encode what can be built.
          Pick a region and the cockpit flips to right-hand drive. Pick Premium
          and the safety pack unlocks. The UI only shows configurations that can
          actually ship.
        </p>
        <blockquote>
          Selecting New Zealand switches the cockpit to right-hand drive and
          unlocks regional paints. Choosing Premium unlocks the advanced safety
          pack.
        </blockquote>
        <div className="option">
          <h3>Option 1 · Spreadsheets</h3>
          <Figure src={assets.ruleIt1} alt="Rule engine spreadsheet option" />
          <p>👍 Easy to stack and sort, great for simple rules</p>
          <p>👎 Difficult to create nested rules</p>
        </div>
        <div className="option">
          <h3>Option 2 · Blocks</h3>
          <Figure src={assets.ruleIt2} alt="Rule engine block option" />
          <p>👍 Able to create deeply nested rules</p>
          <p>👎 Easily gets messy for a single rule set</p>
        </div>
        <div className="option">
          <h3>Option 3 · Hybrid</h3>
          <Figure src={assets.ruleIt3} alt="Rule engine hybrid option" />
          <p>👍 Easy to view and organize</p>
          <p>👎 Not yet polished</p>
        </div>
        <div className="option">
          <h3>Finalized</h3>
          <Figure src={assets.ruleFinalize} alt="Finalized rule engine" />
          <Figure
            src={assets.ruleDetails}
            alt="Rule engine interaction details"
          />
          <p>✅ Aligns with Unity Design System</p>
          <p>✅ Clear connections between conditions</p>
          <p>✅ Designed for detail interactions and edge cases</p>
        </div>
      </section>

      <section id="constraints" className="section">
        <p className="section__label">Working with Constraints</p>
        <h3>Growing the design system</h3>
        <p>
          Unity&apos;s framework is built for dense editor UIs. Forma needed
          something more inviting. I worked with the core design system team on
          those gaps and added patterns so the system could grow with us.
        </p>
        <div className="media-cluster media-cluster--tiles">
          <Figure src={assets.designSystem1} alt="Design system exploration" />
          <Figure src={assets.designSystem2} alt="Design system exploration" />
          <Figure src={assets.designSystem3} alt="Design system exploration" />
          <Figure src={assets.designSystem4} alt="Design system exploration" />
        </div>
      </section>

      <section id="interface" className="section">
        <p className="section__label">Forma Interface</p>
        <article className="feature-block">
          <h3>From months to hours</h3>
          <p>
            Before Forma, artists and engineers spent months on a configurator.
            Forma does the heavy lifting so a build can land in hours.
          </p>
          <CaseStudyVideo
            src={formaVideos.mvp.src}
            poster={formaVideos.mvp.poster}
            label="MVP run through"
            caption="MVP run through"
          />
        </article>
        <article className="feature-block">
          <h3>Variants in seconds</h3>
          <p>
            Drag from the outline, materials, or scene into the variant table. No
            code required.
          </p>
          <Figure
            src={assets.productTab}
            alt="Product Tab"
            caption="Product Tab"
          />
        </article>
        <article className="feature-block">
          <h3>WYSIWYG collaboration</h3>
          <p>
            Teams review the real scene instead of wireframes and long docs. That
            cut a large share of cross-team back and forth.
          </p>
          <Figure
            src={assets.wysiwyg}
            alt="Runtime template in preview mode"
            caption="Runtime template in preview mode"
          />
        </article>
        <article className="feature-block">
          <h3>One source of truth</h3>
          <p>
            Rendering methods, models, environments, and materials for each
            platform live in one place. Less recursive spend across channels.
          </p>
          <Figure
            src={assets.profile}
            alt="Profile window"
            caption="Profile window"
          />
        </article>
        <article className="feature-block">
          <h3>An easy entry to virtual photography</h3>
          <p>
            Forma Editor provides powerful camera systems to set up interactive
            3D configurator experiences.
          </p>
          <Figure src={assets.camera} alt="Camera Tab" caption="Camera Tab" />
        </article>
        <article className="feature-block">
          <h3>Iterate compositions on the fly</h3>
          <p>
            Creating compositions in RT3D is much faster. Reuse environments and
            fine-tune look and feel so brand identity stays consistent across
            scenes.
          </p>
          <Figure
            src={assets.environment}
            alt="Environment Tab"
            caption="Environment Tab"
          />
        </article>
        <article className="feature-block">
          <h3>True-to-sales rules in a few clicks</h3>
          <p>
            Import rules from code or edit product variations in a simple UI. No
            more comparing thousands of lines of rule code and spreadsheets
            across two monitors.
          </p>
          <Figure src={assets.ruleTab} alt="Rule Tab" caption="Rule Tab" />
        </article>
        <article className="feature-block">
          <h3>An innovation of workflow</h3>
          <p>
            Forma saves time at each step. Create an immersive experience and
            export to multiple channels in RT3D with no code required, from small
            retailers to large companies moving into 3D content creation.
          </p>
          <Figure src={assets.exportTab} alt="Export Tab" caption="Export Tab" />
        </article>
      </section>

      <section id="shipping" className="section">
        <p className="section__label">Shipping and Beyond</p>
        <p>
          Volkswagen was among the first early adopters, alongside Airbus,
          Stellantis, Arksen, and others.
        </p>
        <div className="media-frame">
          <iframe
            title="Unity Forma Editor demo"
            src={assets.youtubeEmbed}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="media-cluster media-cluster--3 media-cluster--results">
          <Figure
            src="/media/forma-editor/result-licenses.png"
            alt="500 licenses sold"
          />
          <Figure
            src="/media/forma-editor/result-revenue.png"
            alt="$2.8M revenue"
          />
          <Figure
            src="/media/forma-editor/result-team.png"
            alt="3X team expansion"
          />
        </div>
        <div className="media-cluster media-cluster--brands">
          <Figure src="/media/forma-editor/brand-airbus.png" alt="Airbus" />
          <Figure src="/media/forma-editor/brand-vw.png" alt="Volkswagen" />
          <Figure
            src="/media/forma-editor/brand-stellantis.png"
            alt="Stellantis"
          />
          <Figure src="/media/forma-editor/brand-arksen.png" alt="Arksen" />
        </div>
      </section>

      <section id="validation" className="section">
        <p className="section__label">Post-launch validation</p>
        <p className="section__kicker">
          A runtime template that fits more devices
        </p>
        <p>
          We shipped for desktop first. Studies quickly showed demand for mobile
          configurators, so we had to stretch the runtime UI across phones and
          large screens with limited eng capacity.
        </p>

        <div className="copy-media copy-media--top">
          <div className="copy-media__copy">
            <h3>The constraint</h3>
            <p>
              Unity UI had no web-style columns or media queries. We were not
              building classic responsive or adaptive layouts. The job was a
              generic template that could detect orientation and hold up from a
              TV down to an iPhone SE.
            </p>
          </div>
          <div className="copy-media__media">
            <Figure
              src={assets.runtimePreview}
              alt="Runtime UI in preview"
              caption="Runtime preview before the mobile pass"
            />
          </div>
        </div>

        <div className="copy-media copy-media--top">
          <div className="copy-media__copy">
            <h3>Structure first</h3>
            <p>
              I mapped finite pieces like logo and product name into fixed slots,
              and indefinite lists like variants into scrollable regions so the
              layout could absorb whatever the user created.
            </p>
          </div>
          <div className="copy-media__media">
            <Figure
              src={assets.mobileAnalysis}
              alt="Mobile UI layout analysis"
            />
          </div>
        </div>

        <div className="copy-media copy-media--top">
          <div className="copy-media__copy">
            <h3>Wireframe</h3>
            <p>
              Scene on top, controls below. That pattern showed up across auto
              game UIs and configurators, and it presents cars cleanly.
            </p>
          </div>
          <div className="copy-media__media">
            <Figure src={assets.mobileWireframe} alt="Mobile wireframe" />
          </div>
        </div>

        <div className="media-cluster media-cluster--2">
          <Figure
            src={assets.landscapePortrait}
            alt="Landscape and portrait mockups"
            caption="Landscape and portrait"
          />
          <Figure
            src={assets.layoutCompare}
            alt="Layout comparison"
            caption="Layout options"
          />
        </div>
        <p>
          After PM review we needed more than cars, so I moved to a squarer
          scene ratio and kept iterating until the layout needed few code
          branches but still worked for other products.
        </p>

        <div className="copy-media copy-media--top">
          <div className="copy-media__copy">
            <h3>Final layout</h3>
            <p>
              Portrait and landscape stay close. The control sheet stays
              vertical. Navbar and header are shared. Cards only change scroll
              direction. Price sits centered under the scene. The UI toggle stays
              top right.
            </p>
          </div>
          <div className="copy-media__media">
            <Figure src={assets.decision} alt="Final layout decision" />
          </div>
        </div>

        <Figure
          src={assets.allScale}
          alt="UI tested across screen sizes"
          caption="Same UI from phone to desktop. Beyond 4K, eng scales the UI by 2×."
        />
      </section>

      <section id="takeaway" className="section">
        <p className="section__label">Takeaway</p>
        <h2>Building empathy as a team</h2>
        <p>
          Building for specialists is hard when the team lacks context. Weekly
          reviews with eng and business walked real workflows and research
          together. Developers started asking whether the code solved the user
          problem. Once everyone shared the why, decisions got faster and more
          autonomous.
        </p>
      </section>

      <section id="testimony" className="section section--last">
        <p className="section__label">Testimony</p>
        <div className="quotes">
          <blockquote>
            <img src={assets.vwLogo} alt="Volkswagen" className="quote-logo" />
            <p>
              “Volkswagen constantly seeks new paths to delight the user when
              experiencing our cars. Unity Forma comes with features that will
              help us to provide faster and higher quality real-time content like
              configurable product visualization.”
            </p>
            <cite>Head of Global Digital Marketing, VW</cite>
          </blockquote>
          <blockquote>
            <img src={assets.texelLogo} alt="Texel Logic" className="quote-logo" />
            <p>
              “Unity Forma has the potential to be the leading industry standard
              tool for product configuration. It is an easy-to-pick-up toolkit
              and will save time building complex configurations. We are excited
              to continue to use the tool!“
            </p>
            <cite>Studio Manager, Texel Logic</cite>
          </blockquote>
          <blockquote>
            <img
              src={assets.designoryLogo}
              alt="Designory"
              className="quote-logo"
            />
            <p>
              Our clients understand the importance of integrating real-time
              rendering tools into their CG pipeline, and Unity Forma helps get
              us there quicker than any other tool in the market.
            </p>
            <cite>Technology Director, Designory</cite>
          </blockquote>
        </div>
      </section>
    </CaseStudyLayout>
  )
}
