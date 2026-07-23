import { CaseStudyLayout } from '../components/CaseStudyLayout'
import { MediaPlaceholder } from '../components/MediaPlaceholder'
import { PasswordGate } from '../components/PasswordGate'
import type { TocItem } from '../data/formaCaseStudy'
import { CDN } from '../data/projects'

const toc: TocItem[] = [{ id: 'locked', label: 'Case study' }]

const hero = `${CDN}/1531240007005-CNX9B6XJZJA9R8G6GVHU/Asset+1car.png`

export function FordPage() {
  return (
    <PasswordGate
      storageKey="portfolio-unlock:ford"
      title="Ford - Audio Experience"
    >
      <CaseStudyLayout
        brand="Ford"
        title="Ford - Audio Experience"
        toc={toc}
        heroImage={hero}
        lede="Autonomous vehicle dashboard and earcon design."
      >
        <section id="locked" className="section section--last">
          <p className="section__label">Case study</p>
          <p>
            Full case study media is still being assembled here. Replace the
            placeholder below once the complete Ford content is ready to
            publish.
          </p>
          <MediaPlaceholder id="MEDIA::ford::full-page" />
        </section>
      </CaseStudyLayout>
    </PasswordGate>
  )
}
