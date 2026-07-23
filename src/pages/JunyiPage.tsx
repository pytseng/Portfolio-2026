import { CaseStudyLayout } from '../components/CaseStudyLayout'
import { MediaPlaceholder } from '../components/MediaPlaceholder'
import { PasswordGate } from '../components/PasswordGate'
import type { TocItem } from '../data/formaCaseStudy'
import { CDN } from '../data/projects'

const toc: TocItem[] = [{ id: 'locked', label: 'Case study' }]

const hero = `${CDN}/1531196261851-H975ZKAG60XRKX9H432D/Asset+3haha.png`

export function JunyiPage() {
  return (
    <PasswordGate storageKey="portfolio-unlock:junyi" title="Junyi Academy">
      <CaseStudyLayout
        brand="Junyi Academy"
        title="Junyi Academy"
        toc={toc}
        heroImage={hero}
        lede="Design for social impact — an open learning platform for K-12 educators and students."
      >
        <section id="locked" className="section section--last">
          <p className="section__label">Case study</p>
          <p>
            Full case study media is still being assembled here. Replace the
            placeholder below once the complete Junyi content is ready to
            publish.
          </p>
          <MediaPlaceholder id="MEDIA::junyi::full-page" />
        </section>
      </CaseStudyLayout>
    </PasswordGate>
  )
}
