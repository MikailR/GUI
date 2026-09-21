import type { MouseEvent } from 'react'
import { ABOUT, POSTS } from '../content/data'
import { AppIcon } from '../icons/AppIcon'
import { Symbol } from '../icons/Symbol'
import { APPS } from '../os/apps'
import { useClock } from '../os/hooks'
import type { AppId } from '../os/types'

interface HomeScreenProps {
  trashCount: number
  onOpen: (appId: AppId, route: string | undefined, origin: { x: number; y: number }) => void
  onSearch: () => void
  /** Receding transform while an app is open. */
  receded: boolean
}

const HOME_APPS = APPS.filter((app) => app.onHome && !app.inPhoneDock)
const DOCK_APPS = APPS.filter((app) => app.inPhoneDock)

export function HomeScreen({ trashCount, onOpen, onSearch, receded }: HomeScreenProps) {
  const now = useClock()
  const time = now.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }).replace(/\s?[AP]M$/i, '')
  const weekday = now.toLocaleDateString(undefined, { weekday: 'long' })
  const day = now.toLocaleDateString(undefined, { day: 'numeric', month: 'long' })

  const open = (appId: AppId, route?: string) => (event: MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    onOpen(appId, route, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
  }

  return (
    <div className="ios-home" data-receded={receded || undefined} aria-hidden={receded}>
      <div className="ios-home-pages">
        <section className="ios-widgets">
          <button type="button" className="ios-widget ios-widget-medium glass glass-thin" onClick={open('about')} aria-label="About Mikail">
            <span className="ios-widget-clock tnum">{time}</span>
            <span className="ios-widget-date">
              {weekday}, {day}
            </span>
            <span className="ios-widget-foot">
              <Symbol name="location" size={12} /> {ABOUT.location} · {ABOUT.role.split('·')[0].trim()}
            </span>
          </button>
          <button type="button" className="ios-widget ios-widget-small glass glass-thin" onClick={open('writing', POSTS[0].slug)} aria-label="Latest essay">
            <span className="ios-widget-app">
              <AppIcon appId="writing" size={22} /> Writing
            </span>
            <span className="ios-widget-title">{POSTS[0].title}</span>
            <span className="ios-widget-sub">
              {POSTS[0].tag} · {POSTS[0].readMins} min
            </span>
          </button>
        </section>

        <section className="ios-grid" aria-label="Apps">
          {HOME_APPS.map((app) => (
            <button key={app.id} type="button" className="ios-app-icon" onClick={open(app.id)} aria-label={app.name}>
              <span className="ios-app-icon-art">
                <AppIcon appId={app.id} size={60} full={app.id === 'trash' && trashCount > 0} />
                {app.id === 'trash' && trashCount > 0 ? <span className="ios-badge">{trashCount}</span> : null}
              </span>
              <span className="ios-app-label">{app.name}</span>
            </button>
          ))}
        </section>
      </div>

      <div className="ios-page-dots" aria-hidden="true">
        <i data-active="" />
        <i />
      </div>

      <button type="button" className="ios-search glass glass-thin glass-button" onClick={onSearch}>
        <Symbol name="magnifyingglass" size={13} weight={2.6} /> Search
      </button>

      <nav className="ios-dock glass" aria-label="Dock">
        {DOCK_APPS.map((app) => (
          <button key={app.id} type="button" className="ios-dock-icon" onClick={open(app.id)} aria-label={app.name}>
            <AppIcon appId={app.id} size={60} />
          </button>
        ))}
      </nav>
    </div>
  )
}
