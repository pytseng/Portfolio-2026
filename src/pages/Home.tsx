import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { projects } from '../data/projects'

const NeedleMountain = lazy(() =>
  import('../components/home/NeedleMountain').then((m) => ({
    default: m.NeedleMountain,
  })),
)

export function Home() {
  return (
    <div className="home">
      <section className="bio-hero" aria-label="Bio">
        <div className="bio-hero__stage">
          <Suspense fallback={<div className="needle-mount" />}>
            <NeedleMountain />
          </Suspense>
          <div className="bio-hero__veil" aria-hidden="true" />
        </div>

        <div className="bio-hero__content">
          <p className="bio-hero__eyebrow">Portfolio 2026</p>
          <h1 className="bio-hero__name">Po Yen Tseng</h1>
          <p className="bio-hero__tagline">I Design, I Code, I Full-Stack.</p>
          <p className="bio-hero__body">
            Po here, I specialize in turning conceptual ideas into reality, with
            a knack for deep-diving into complex problems, I’m pretty good at
            the messy early stages of emerging tech. Previous role at Unity, I
            designed and shipped nearly every product for the Automotive and
            Manufacturing verticals, and led design for the digital twin
            authoring team. After a sabbatical for family reason and personal
            growth, I’m ready for new challenges.
          </p>
          <a className="bio-hero__cta" href="#works">
            Explore works
            <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      <section className="works" id="works">
        <header className="works__header">
          <p className="works__eyebrow">Works</p>
          <h2>Selected projects</h2>
        </header>
        <ul className="works__list">
          {projects.map((project, index) => (
            <li key={project.slug}>
              <Link className="work-card" to={project.path}>
                <div className="work-card__media">
                  <img src={project.thumbnail} alt="" loading="lazy" />
                </div>
                <div className="work-card__meta">
                  <span className="work-card__index">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3>{project.title}</h3>
                  <p>{project.blurb}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
