import { CaseStudyLayout, Figure } from '../components/CaseStudyLayout'
import { assets, tocItems } from '../data/formaCaseStudy'

export function FormaEditorPage() {
  return (
    <CaseStudyLayout
      brand="Forma Editor"
      title="Unity Forma Editor"
      toc={tocItems}
      heroImage={assets.heroPoster}
      lede="A UX design case study on turning complex 3D product data into interactive configurators for automotive and manufacturing."
    >
      <section id="overview" className="section">
        <p className="section__label">Product Overview</p>
        <div className="media-frame">
          <iframe
            title="Unity Forma Editor demo"
            src={assets.youtubeEmbed}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <p>
          Forma is a software suite that helps 3d specialist in the automotive
          and manufacturing industries to turn complex 3D product data into{' '}
          <strong>interactive product configurators</strong> and more. Users make
          product variations, create interactive cameras, visualize designs, and
          export results in a non-coding required interface. Forma launched in
          December 2020, trusted by industry leaders such as Volkswagen and
          Airbus.
        </p>
        <h3>Contributions</h3>
        <ol className="rich-list">
          <li>
            <strong>0-1 Product Design:</strong> Sole designer, scaling Forma
            Editor from a concept into a multi-platform 3D authoring suite.
          </li>
          <li>
            <strong>Strategic Discovery & Product-Market Fit:</strong> Conducted
            foundational user studies that led to breakthrough findings, directly
            resulting in the acquisition of the early adopters.
          </li>
          <li>
            <strong>Operational Leadership:</strong> Served as the design key
            person of the entire manufacturing vertical, established the
            vertical&apos;s data-driven design culture, implementing frameworks
            for testing and iterative development.
          </li>
        </ol>
      </section>

      <section id="discovery" className="section">
        <p className="section__label">Initial Discovery</p>
        <ol className="rich-list">
          <li>
            <strong>Holiday Calls:</strong> I was hired right before the holiday
            season, instead of expecting more context from the team, I used my
            own connections and set up interviews with industry experts from Nio
            and Honda Motor in East Asia.
          </li>
          <li>
            <strong>Onsite Studies:</strong> Fought for resource to conduct
            international onsite-studies and brought back user reports and
            partnerships.
          </li>
          <li>
            <strong>SME Interviews:</strong> Ran 50+ rounds of interviews and
            established a format that devs, sales or anyone on the team are
            invited so the team grew together and make better autonomous calls.
          </li>
        </ol>
      </section>

      <section id="journey" className="section">
        <p className="section__label">Journey Mapping</p>
        <p className="section__kicker">
          How OEMs use 3D models to create configurators
        </p>
        <Figure src={assets.journeyMap} alt="Journey map" />
        <div className="step">
          <h3>1.Concept to Shape</h3>
          <p>
            To start a new model line, in-house designers create hundreds of
            sketches, clay, and finally lands a class A surface model that will
            be the master model for engineering.
          </p>
          <Figure src={assets.conceptToShape} alt="Concept to shape" />
        </div>
        <div className="step">
          <h3>2. CMF Development</h3>
          <p>
            During the Color, Material, and Feel development phase, more parts
            and data for interior and exterior design would be added to the car
            model.
          </p>
          <Figure src={assets.cmf} alt="CMF development" />
        </div>
        <div className="step">
          <h3>3. Optimized 3D Model</h3>
          <p>
            A Manufacture-ready CAD model will be created and outsourced to
            downstream factories. In the meantime, a digital material library for
            this model would be created along side the optimized 3D model that
            has lighter poly counts for sales and marketing platforms.
          </p>
          <Figure src={assets.optimized} alt="Optimized 3D model" />
        </div>
        <div className="step">
          <h3>4. Sales-ready Assets</h3>
          <p>
            Associate teams would shoot HDRI in traditional photography or create
            3D stages to host the product.
          </p>
          <Figure src={assets.salesAssets} alt="Sales-ready assets" />
        </div>
        <div className="step">
          <h3>5. Sales Configurator</h3>
          <p>
            In-house or third-party collaboration, optimized 3D model, materials,
            environments, all digital assets will be organized to create the end
            configurator. Cameras and other interactivity will be added. PM will
            review configuration options ensure they are true to sales rules. For
            example, if a user chooses a V8 engineer, a limited edition car paint
            should be available.
          </p>
          <Figure src={assets.configurator} alt="Sales configurator" />
        </div>
      </section>

      <section id="users" className="section">
        <p className="section__label">Target Users</p>
        <div className="user-grid">
          <div>
            <h3>Technical Artist</h3>
            <ul>
              <li>The narrator of 3D experience</li>
              <li>Comfortable with 3D tools</li>
              <li>Efficiency matters</li>
            </ul>
          </div>
          <div>
            <h3>Projuct Manager</h3>
            <ul>
              <li>The gatekeeper of model correctness</li>
              <li>Uses text-heavy UI like BOM, Excel</li>
              <li>Manage sales content</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="problem" className="section">
        <p className="section__label">Main Problem</p>
        <p>
          In the Sales Configurator development stage, auto brands rely heavily
          on expensive manual agency works or slow in-house development for
          difficult-to-maintain solutions due to the absence of proper tools.
          High recursive cost result in companies searching for better solutions.
        </p>
      </section>

      <section id="metrics" className="section">
        <p className="section__label">Success Metrics</p>
        <p>
          Instead of “growing X by Y percent” approach, the success metrics of
          the early stage is simple, as long as we onboard targeted industry
          leaders, it’s a win, which we completed the milestone soon after
          release.
        </p>
      </section>

      <section id="process" className="section">
        <p className="section__label">Design Process - Overall</p>
        <div className="process-grid">
          <article>
            <h3>Framing</h3>
            <Figure src={assets.framing} alt="Framing" />
          </article>
          <article>
            <h3>2. Stakeholder Alignment</h3>
            <p>Mapping features into Information Architecture Diagram</p>
            <Figure src={assets.stakeholder} alt="Stakeholder alignment" />
          </article>
          <article>
            <h3>3. Design Ideation</h3>
            <p>Translate requirement into features</p>
            <Figure src={assets.ideation} alt="Design ideation" />
          </article>
          <article>
            <h3>4. Production</h3>
            <Figure src={assets.production} alt="Production" />
          </article>
        </div>
      </section>

      <section id="feature" className="section">
        <p className="section__label">Design Process - Feature</p>
        <h3>Example Feature - Rule Engine</h3>
        <p>
          Rule Engine is created to help manufacturing managers set up rules for
          complex 3D product models. It handles the logic behind the scenes, so
          doing something like selecting a specific region automatically unlocks
          the right features and filters out unavailable options. It keeps the
          data completely accurate and ensures users can only configure products
          that can actually be built.
        </p>
        <blockquote>
          Selecting &quot;New Zealand&quot; in context automatically switches the
          cockpit to right-hand drive and unlocks regional paint colors or
          choosing the Premium trim unlocks the advanced safety tech pack.
        </blockquote>
        <div className="option">
          <h3>Option.1 Spreadsheets</h3>
          <Figure src={assets.ruleIt1} alt="Rule engine spreadsheet option" />
          <p>👍 : Easy to stack and sort, great for simple rules</p>
          <p>👎 : Difficult to create nested Rules</p>
        </div>
        <div className="option">
          <h3>Option.2 Block</h3>
          <Figure src={assets.ruleIt2} alt="Rule engine block option" />
          <p>👍 : Able to create deeply nested rules</p>
          <p>👎 : Easily get messy and chunky for a single rule set</p>
        </div>
        <div className="option">
          <h3>Option.3 Hybrid</h3>
          <Figure src={assets.ruleIt3} alt="Rule engine hybrid option" />
          <p>👍 : Easy to view and organize</p>
          <p>👎 : Not yet polished</p>
        </div>
        <div className="option">
          <h3>Finalized</h3>
          <Figure src={assets.ruleFinalize} alt="Finalized rule engine" />
          <Figure src={assets.ruleDetails} alt="Rule engine interaction details" />
          <p>✅ : Align with Unity Design System</p>
          <p>✅ : Clear Connection between conditions</p>
          <p>✅ : Designed for detail interactions and edge cases</p>
        </div>
      </section>

      <section id="constraints" className="section">
        <p className="section__label">Working with Constraints</p>
        <h3>Growing Design System</h3>
        <p>
          Unity’s design framework handles packed UIs well, but the clutter
          clashed with Forma’s need for an inviting interface. I collaborated
          with the core design system team to ensure new use cases are addressed
          and also created new patterns to help grow the design system.
        </p>
        <div className="image-row">
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
            Before Forma exist, it requires a teams of 3d artists and engineers
            months to create configurators. Now, Forma does all the heavy
            lifting, making a configurator is only a matter of hours.
          </p>
          <p className="caption">MVP run through</p>
        </article>
        <article className="feature-block">
          <h3>Create product variations in seconds</h3>
          <p>
            Users could create product variations simply by dragging elements
            from the product outline, materials, or the object in the scene and
            dropping them to the variant table, there’s no need to code a single
            line to create product variations.
          </p>
          <Figure src={assets.productTab} alt="Product Tab" caption="Product Tab" />
        </article>
        <article className="feature-block">
          <h3>WYSIWYG, saving 73% communication overhead</h3>
          <p>
            In Forma, what you see is what you get, now teams could visualize and
            collaborate on the exact scene instead of talking through wireframes
            or long documents, saving hundred hours of communication costs across
            different department.
          </p>
          <Figure
            src={assets.wysiwyg}
            alt="Runtime template in preview mode"
            caption="Runtime template in preview mode"
          />
        </article>
        <article className="feature-block">
          <h3>Single-source of truth model management</h3>
          <p>
            Scaling for multiple platform became easy. Set up rendering methods,
            models, environment, and material for target platform all in one
            place. Saving companies millions on recursive spending, a true budget
            saver.
          </p>
          <Figure src={assets.profile} alt="Profile window" caption="Profile window" />
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
            It’s 20 times faster to create compositions in RT3D, Alyx could reuse
            environment and fine tune look and feel to create a consistent brand
            identity across scene.
          </p>
          <Figure
            src={assets.environment}
            alt="Environment Tab"
            caption="Environment Tab"
          />
        </article>
        <article className="feature-block">
          <h3>True-to-sales rules is a few clicks away</h3>
          <p>
            Creating rules true to sales is easier than ever, simply import from
            code or use our simple UI to edit product variation. No need for
            compare thousands line of rule code and excel sheets on two monitors
            and sending screenshots and emails back and force with the engineers.
          </p>
          <Figure src={assets.ruleTab} alt="Rule Tab" caption="Rule Tab" />
        </article>
        <article className="feature-block">
          <h3>An innovation of workflow</h3>
          <p>
            Forma saves hundreds hours in each step of the workflow. Users can
            create an immersive experience and export them into multi-channels
            all in RT3D with no code required. It is true workflow innovation
            that help small retailers to big companies making their transition
            into 3D content creation.
          </p>
          <Figure src={assets.exportTab} alt="Export Tab" caption="Export Tab" />
        </article>
      </section>

      <section id="shipping" className="section">
        <p className="section__label">Shipping and Beyond</p>
        <p>
          Volkswagen ends up being one of the first batches of early adopters of
          Unity Forma alongside various industry leaders including Airbus,
          Stellantis, Arksen and many more.
        </p>
        <Figure src={assets.result} alt="Shipping results and early adopters" />
      </section>

      <section id="validation" className="section">
        <p className="section__label">
          Post-launch Validation - Improved Template to Support More Device Types
        </p>
        <h3>Earlier Runtime UI isn’t mobile friendly enough</h3>
        <p>
          In the beginning, we were only targeting desktop users. Through user
          studies, we found there’s strong demand to build configurators for
          mobile devices.
        </p>
        <Figure
          src={assets.runtimePreview}
          alt="Runtime UI in preview"
          caption="Challenge"
        />
        <h3>Challenge: Expanding use case in the last minute</h3>
        <p>
          With limited engineering power, we need a generic UI that detects
          device orientation and will work from a large TV screen to a small
          i-phone SE screen.
        </p>
        <p>
          *** We are neither building a responsive UI nor an adaptive UI here!
          Neither UGUI nor UI Element provides an easy way to create responsive
          UI that is so common in the web/mobile world. There’s no column
          systems, media query, sorts of things that make engineering responsive
          layout easy. Therefore, to maximize the outcome with the least time
        </p>
        <p>
          What I did first is to analyze the configurator, identify finite and
          indefinite elements so we know how to create a layout that consumes and
          displays data well. For finite elements like logo and product name,
          there’s always one of each in a configurator, therefore, a fixed
          container would work well. On the other hand, for an indefinite list
          like product variants which users could make as many as the PC could
          handle, we need to define a container with a scrollable area.
        </p>
        <Figure src={assets.mobileAnalysis} alt="Mobile UI layout analysis" />
        <p>
          Then I moved on to wireframe the basic structural interactions. The
          reason I used a layout where the scene is on top and the control sheet
          at the bottom is based on my research on multiple automotive game UI
          and configurators, this layout is optimal for car presentations.
        </p>
        <Figure src={assets.mobileWireframe} alt="Mobile wireframe" />
        <h3>Explore scalable solution in a tight timeline</h3>
        <p>
          Next step, I created mockups for both landscape and portrait views.
        </p>
        <Figure
          src={assets.landscapePortrait}
          alt="Landscape and portrait mockups"
        />
        <p>
          After discussion with the PM, we think our template should serve more
          products besides cars, therefore, I decided to use a more squared ratio
          scene. Also, I iterated on several different layouts to get to a UI
          that needs the least conditions in code but still works well for any
          sort of product.
        </p>
        <Figure src={assets.layoutCompare} alt="Layout comparison" />
        <h3>
          Understand engineering to create efficient designs that balanced
          flexibility and usability
        </h3>
        <p>
          Below is the final layout, the difference between portrait and
          landscape is minimized:
        </p>
        <Figure src={assets.decision} alt="Final layout decision" />
        <ul>
          <li>The control sheet is always vertical</li>
          <li>Using same navbar and header</li>
          <li>
            Using a card list so the behavior difference only lies in the
            scrolling direction.
          </li>
          <li>Price tag always centered at the bottom of the scene</li>
          <li>UI toggle always stays on the top-right</li>
        </ul>
        <p>
          I tested out the design on multiple screen-sized as follows. with the
          same pixels (under the premise all UI runs on default system, scaling
          factors) The UI works fine from small smartphone screens to desktops.
          To run beyond a 4K screen, in the engineering end just need to specify
          multiplication by 2 for the UI.
        </p>
        <Figure src={assets.allScale} alt="UI tested across screen sizes" />
      </section>

      <section id="takeaway" className="section">
        <p className="section__label">TAKEAWAY</p>
        <h2>Building empathy as a team</h2>
        <p>
          Building products for specialized experts is difficult. Early on, we
          noticed the team was making technical decisions that didn&apos;t quite
          fit our users&apos; needs because they lacked the right context. To fix
          this, I started weekly product reviews with everyone from engineering
          to business. We walked through workflows and shared research findings
          together. This changed how our developers worked—they began actively
          evaluating if their code actually solved the user’s problem. Because
          the whole team understood the &apos;why&apos; behind every feature,
          they became faster and were able to make smart decisions on their own.
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
            <cite>— Head of Global Digital Marketing, VW</cite>
          </blockquote>
          <blockquote>
            <img src={assets.texelLogo} alt="Texel Logic" className="quote-logo" />
            <p>
              “Unity Forma has the potential to be the leading industry standard
              tool for product configuration. It is an easy-to-pick-up toolkit
              and will save time building complex configurations. We are excited
              to continue to use the tool!“
            </p>
            <cite>— Studio Manager, Texel Logic</cite>
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
            <cite>— Technology Director, Designory</cite>
          </blockquote>
        </div>
      </section>
    </CaseStudyLayout>
  )
}
