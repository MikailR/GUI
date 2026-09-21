import { Chip, Group, Row } from '../components/controls'
import { ABOUT, HACKATHONS, POSTS } from '../content/data'
import { Symbol } from '../icons/Symbol'
import { useClock } from '../os/hooks'
import { AppFrame } from './frame'
import type { AppProps } from './types'

/**
 * About: a Contacts-style card on iOS, an identity pane on macOS.
 */
export default function About({ shell, openApp }: AppProps) {
  const now = useClock()
  const localTime = now.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', timeZone: ABOUT.timeZone })

  return (
    <AppFrame shell={shell} title="About" plainHeader={shell === 'ios'}>
      <div className="about">
        <header className="about-hero">
          <div className="about-avatar squircle" aria-hidden="true">
            <span>{ABOUT.initials}</span>
          </div>
          <h1 className="about-name">{ABOUT.name}</h1>
          <p className="about-role">{ABOUT.role}</p>
          <p className="about-location">
            <Symbol name="location" size={12} /> {ABOUT.location} · {localTime}
          </p>
          <div className="about-actions">
            {ABOUT.links.map((link) => (
              <a key={link.label} className="about-action" href={link.href} target="_blank" rel="noreferrer">
                <span className="about-action-icon">
                  <Symbol name={link.label === 'Email' ? 'doc' : 'link'} size={16} weight={2.4} />
                </span>
                <span>{link.label}</span>
              </a>
            ))}
          </div>
        </header>

        <div className="about-columns">
          <div className="about-main">
            <p className="about-tagline">{ABOUT.tagline}</p>
            {ABOUT.bio.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="about-bio selectable">
                {paragraph}
              </p>
            ))}
            <div className="about-skills">
              {ABOUT.skills.map((skill) => (
                <Chip key={skill}>{skill}</Chip>
              ))}
            </div>
          </div>

          <div className="about-side">
            <Group title="Now">
              {ABOUT.now.map((item) => (
                <Row key={item.label} label={item.label} detail={item.value} stacked />
              ))}
            </Group>
            <Group title="Recently">
              <Row
                icon="trophy"
                iconColor="#ff6a3d"
                label={HACKATHONS[0].project}
                detail={`${HACKATHONS[0].place} · ${HACKATHONS[0].event}`}
                chevron
                onClick={() => openApp('hackathons', HACKATHONS[0].id)}
              />
              <Row
                icon="doc"
                iconColor="#f2b71f"
                label={POSTS[0].title}
                detail={`${POSTS[0].tag} · ${POSTS[0].readMins} min`}
                chevron
                onClick={() => openApp('writing', POSTS[0].slug)}
              />
              <Row icon="flask" iconColor="#8b5cff" label="Lab" detail="Seven playable experiments" chevron onClick={() => openApp('lab')} />
            </Group>
          </div>
        </div>
      </div>
    </AppFrame>
  )
}
