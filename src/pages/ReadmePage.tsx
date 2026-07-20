import { Link } from 'react-router-dom'
import { CaseStudyLayout, Figure } from '../components/CaseStudyLayout'
import { CDN } from '../data/projects'
import type { TocItem } from '../data/formaCaseStudy'

const toc: TocItem[] = [
  { id: 'hi', label: 'Hi' },
  { id: 'designed', label: 'Designed' },
  { id: 'managed', label: 'Managed' },
  { id: 'cheers', label: 'Cheers!' },
]

const img = {
  hero: `${CDN}/d89d07cb-f684-45f8-a2d3-0fc2a05fb34f/u3369982172_A_simple_approachablesoothing_3d_cheeseburger_in__5e62d7d0-9941-4177-9b66-d68acf7f203a_0.png`,
  studio: `${CDN}/a8d46749-25db-4522-9290-75418d0eba79/overall-product-studio.png`,
  rs: `${CDN}/5deaa0e8-6c79-42e1-9bac-f0bc220ceed2/overall-rs.png`,
  cloud: `${CDN}/d5068be3-43d2-4a4b-8262-ec18fb5388f6/overall-forma-cloud.png`,
  editor: `${CDN}/59684092-7a98-40aa-8062-c259ebbd3958/overall-forma-editor.png`,
  vr: `${CDN}/a0c543f9-f674-40be-992e-20a732f1defd/overall-forma-vr.png`,
  exp: `${CDN}/a1a04e67-63c7-4d23-ae1f-6d905b19868e/overall-forma-expbuilder.png`,
  mobile: `${CDN}/3538d079-61fb-4634-aad7-6aa9971d737b/overall-forma-mobile.png`,
  hmi: `${CDN}/6aa71e6e-4f92-418a-984f-ea0a11642fa1/overall-HMI.png`,
  sim: `${CDN}/b7dc7858-c39e-47b4-a864-4b2f3054167c/overall-simulation.png`,
  pixyz: `${CDN}/02e9357e-db60-458a-b99d-05dd9dc9fcbe/overall-Pixyz.png`,
  dt: `${CDN}/bc865662-d429-430a-ba2b-6ed18b5818d4/overall-dtapp.png`,
}

export function ReadmePage() {
  return (
    <CaseStudyLayout
      brand="README.md"
      title="README.md"
      toc={toc}
      heroImage={img.hero}
      lede="User guide"
    >
      <section id="hi" className="section">
        <p className="section__label">Hi</p>
        <p>
          Po here, I specialize in turning conceptual ideas into reality, with a
          knack for deep-diving into complex problems, I’m pretty good at the
          messy early stages of emerging tech. Previous role at Unity, I designed
          and shipped nearly every product for the Automotive and Manufacturing
          verticals, and led design for the digital twin authoring team. After a
          sabbatical for family reason and personal growth, I’m ready for new
          challenges.
        </p>
        <p>
          For Gen AI design and AI assisted design process, check out{' '}
          <Link to="/gen-ai">Gen AI in Render Studio</Link>
        </p>
        <p>
          For design and strategic impact, check out{' '}
          <Link to="/render-studio">Render Studio</Link> and{' '}
          <Link to="/forma-cloud">Forma Cloud</Link>
        </p>
        <p>
          To see thorough (and lengthy) 0 - 1 design process check out{' '}
          <Link to="/forma-editor">Forma Editor</Link>
        </p>
      </section>

      <section id="designed" className="section">
        <p className="section__label">Designed</p>
        <p>
          Here are the products I designed, full ownership, zero to launched. It
          began with one product and scaled to multiple and formed an ecosystem
          of 3D content creation in the industrial space : )
        </p>
        <div className="image-row">
          <Figure src={img.studio} alt="Web-based Creation Tool" caption="Web-based Creation Tool" />
          <Figure src={img.rs} alt="Desktop-based Runtime Creation Tool" caption="Desktop-based Runtime Creation Tool" />
          <Figure src={img.cloud} alt="Web-based Content Management Hub" caption="Web-based Content Management Hub" />
          <Figure src={img.editor} alt="Unity-based Editor Tool" caption="Unity-based Editor Tool" />
          <Figure src={img.vr} alt="HMD-based VR Viewer" caption="HMD-based VR Viewer" />
          <Figure src={img.exp} alt="Web-based Creation Tool" caption="Web-based Creation Tool" />
          <Figure src={img.mobile} alt="Mobile-based Viewer" caption="Mobile-based Viewer" />
        </div>
      </section>

      <section id="managed" className="section">
        <p className="section__label">Managed</p>
        <p>
          The execution and core design decisions were owned by the talented
          designers I managed while being the Design Lead. I did the talking,
          design crits, and overarching product strategy maintenance.
        </p>
        <div className="image-row">
          <Figure src={img.hmi} alt="Unity-based Editor Tool" caption="Unity-based Editor Tool" />
          <Figure src={img.sim} alt="Unity-based Editor Tool" caption="Unity-based Editor Tool" />
          <Figure src={img.pixyz} alt="Desktop-based Creation Tool" caption="Desktop-based Creation Tool" />
          <Figure src={img.dt} alt="Mobile-based Creation Tool" caption="Mobile-based Creation Tool" />
        </div>
      </section>

      <section id="cheers" className="section section--last">
        <p className="section__label">Cheers!</p>
        <p>Inspired by Randy Bobandy, the legend</p>
      </section>
    </CaseStudyLayout>
  )
}
