import type { CSSProperties } from 'react'
import { ABOUT, POSTS } from '../content/data'
import { AppIcon } from '../icons/AppIcon'
import { Glyph } from '../icons/Glyph'
import { LAB_EXPERIMENTS } from '../lab/meta'
import { HOME_APPS, PHONE_DOCK_APPS } from '../os/apps'
import { useClock } from '../os/hooks'
import { useOs } from '../os/store'
import type { AppId } from '../os/types'

interface HomeScreenProps {
  onOpen: (appId: AppId, route?: string | null) => void
  onSearch: () => void
  /** True while an app is open on top: the home screen recedes. */
  behind: boolean
}

/**
 * iOS home: status bar, two glass widgets, the icon grid, the page dot + search pill,
 * and a floating glass dock. Every tap target is ≥ 44pt.
 */
export function HomeScreen({ onOpen, onSearch, behind }: HomeScreenProps) {
  const { state } = useOs()
  const now = useClock()
  const latest = POSTS[0]
  const featured = LAB_EXPERIMENTS[0]

  return (
    <div className={`phone-home ${behind ? 'is-behind' : ''}`} aria-hidden={behind}>
      <div className="phone-home__widgets">
        <button type="button" className="glass widget widget--clock" onClick={() => onOpen('about')} aria-label="Open About">
          <span className="widget__eyebrow">{now.toLocaleDateString(undefined, { weekday: 'long' })}</span>
          <span className="widget__time">{now.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}</span>
          <span className="widget__foot">
            <span className="widget__dot" />
            {ABOUT.location.split(' · ')[0]}
          </span>
        </button>
        <button type="button" className="glass widget widget--now" onClick={() => onOpen('writing', latest.slug)} aria-label={`Read ${latest.title}`}>
          <span className="widget__eyebrow">
            <AppIcon appId="writing" size={16} /> Latest essay
          </span>
          <span className="widget__title">{latest.title}</span>
          <span className="widget__foot">
            {latest.readMins} min · {latest.tag}
          </span>
        </button>
      </div>

      <div className="phone-home__grid" role="list" aria-label="Apps">
        {HOME_APPS.map((app, i) => (
          <button
            key={app.id}
            type="button"
            role="listitem"
            className="home-icon"
            style={{ '--i': i } as CSSProperties}
            onClick={() => onOpen(app.id)}
            aria-label={app.title}
          >
            <span className="home-icon__art">
              <AppIcon appId={app.id} size={62} full={app.id === 'trash' && state.trash.length > 0} />
              {app.id === 'trash' && state.trash.length ? <span className="home-icon__badge">{state.trash.length}</span> : null}
            </span>
            <span className="home-icon__label">{app.title}</span>
          </button>
        ))}
        <button
          type="button"
          role="listitem"
          className="glass widget widget--lab"
          style={{ '--i': HOME_APPS.length } as CSSProperties}
          onClick={() => onOpen('lab', featured.id)}
          aria-label={`Open Lab: ${featured.title}`}
        >
          <span className="widget__eyebrow">
            <AppIcon appId="lab" size={16} /> Lab · {LAB_EXPERIMENTS.length} experiments
          </span>
          <span className="widget__title">{featured.title}</span>
          <span className="widget__foot">{featured.hint}</span>
          <span className="widget__orb" aria-hidden="true" />
        </button>
      </div>

      <div className="phone-home__bottom">
        <button type="button" className="glass glass--thin glass--pill search-pill" onClick={onSearch} aria-label="Search">
          <Glyph name="search" size={14} strokeWidth={2.4} />
          <span>Search</span>
        </button>
        <nav className="glass phone-dock" aria-label="Dock">
          {PHONE_DOCK_APPS.map((app) => (
            <button key={app.id} type="button" className="phone-dock__item" onClick={() => onOpen(app.id)} aria-label={app.title}>
              <AppIcon appId={app.id} size={58} />
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}
