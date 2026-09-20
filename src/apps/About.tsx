import { ABOUT } from '../content/data'
import { Glyph, type GlyphName } from '../icons/Glyph'
import type { AppScreenProps } from '../os/types'
import { AppPage } from './shared'

export default function About({ shell, openApp }: AppScreenProps) {
  return (
    <AppPage shell={shell} title="About" eyebrow={shell === 'phone' ? ABOUT.location : undefined}>
      <div className="about">
        <section className="about__hero">
          <div className="about__avatar" aria-hidden="true">
            <span className="about__avatar-ring" />
            <span className="about__avatar-initial">M</span>
          </div>
          <div className="about__id">
            <h2 className="about__name">{ABOUT.name}</h2>
            <p className="about__role">{ABOUT.role}</p>
            <p className="about__loc">{ABOUT.location}</p>
          </div>
        </section>

        <p className="about__tagline">{ABOUT.tagline}</p>

        <div className="about__grid">
          <section className="card card--glass">
            <h3 className="card__title">Now</h3>
            <dl className="about__now">
              {ABOUT.now.map((item) => (
                <div key={item.label} className="about__now-row">
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="card">
            <h3 className="card__title">Bio</h3>
            <div className="prose prose--compact">
              {ABOUT.bio.map((p) => (
                <p key={p.slice(0, 16)}>{p}</p>
              ))}
            </div>
          </section>

          <section className="card">
            <h3 className="card__title">Toolkit</h3>
            <div className="chips">
              {ABOUT.skills.map((skill) => (
                <span key={skill} className="chip">
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <section className="card">
            <h3 className="card__title">Elsewhere</h3>
            <div className="about__links">
              {ABOUT.links.map((link) => (
                <a key={link.label} className="about__link" href={link.href} target="_blank" rel="noopener noreferrer">
                  <Glyph name={link.glyph as GlyphName} size={16} />
                  <span>{link.label}</span>
                  <Glyph name="chevron-right" size={14} className="about__link-chev" />
                </a>
              ))}
              <button type="button" className="about__link" onClick={() => openApp('writing', 'why-an-os')}>
                <Glyph name="sparkle" size={16} />
                <span>Why is this site an OS?</span>
                <Glyph name="chevron-right" size={14} className="about__link-chev" />
              </button>
            </div>
          </section>
        </div>
      </div>
    </AppPage>
  )
}
