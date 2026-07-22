import { CaseStudyLayout } from '../components/CaseStudyLayout'
import { MediaPlaceholder } from '../components/MediaPlaceholder'
import type { TocItem } from '../data/formaCaseStudy'
import { CDN } from '../data/projects'

const toc: TocItem[] = [{ id: 'locked', label: 'Case study' }]

const hero = `${CDN}/1531196261851-H975ZKAG60XRKX9H432D/Asset+3haha.png`

export function JunyiPage() {
  return (
    <CaseStudyLayout
      brand="Junyi Academy"
      title="Junyi Academy"
      toc={toc}
      heroImage={hero}
      lede="Listed on pytseng.com — full case study is password-protected there, so content is stubbed here until it can be unlocked or exported."
    >
      <section id="locked" className="section section--last">
        <p className="section__label">Case study</p>
        <p>
          The source page at{' '}
          <a href="https://www.pytseng.com/junyi" target="_blank" rel="noreferrer">
            pytseng.com/junyi
          </a>{' '}
          requires a password, so paragraphs, images, GIFs, and videos from that
          project could not be mirrored yet. Replace the placeholder below (and
          expand this page) once the content is available.
        </p>
        <MediaPlaceholder id="MEDIA::junyi::full-page" />
      </section>
    </CaseStudyLayout>
  )
}
