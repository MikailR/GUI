import { Suspense, useEffect, useRef, useState } from 'react'
import { APP_COMPONENTS, AppLoading } from '../apps'
import { Glyph } from '../icons/Glyph'
import { APPS } from '../os/apps'
import { usePointerDrag } from '../os/hooks'
import { PhoneNavContext, type PhoneNav } from '../os/PhoneNavContext'
import { routeTitle } from '../os/routes'
import type { AppId } from '../os/types'
import { StatusBar } from './StatusBar'

export interface PhoneScreenState {
  appId: AppId
  route: string | null
  routeVersion: number
}

interface AppScreenProps {
  screen: PhoneScreenState
  closing: boolean
  onClosed: () => void
  onRoute: (route: string | null) => void
  onHome: () => void
  openApp: (appId: AppId, route?: string | null) => void
}

/**
 * Full-screen iOS app view. Floating glass nav pills over the content: a back/home pill on the
 * left, the compact title that appears once the large title scrolls away, and a close pill on
 * the right when inside a nested route. The home indicator can be swiped up to leave.
 */
export function AppScreen({ screen, closing, onClosed, onRoute, onHome, openApp }: AppScreenProps) {
  const meta = APPS[screen.appId]
  const Component = APP_COMPONENTS[screen.appId]
  const [compact, setCompact] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const nested = screen.route !== null
  const title = routeTitle(screen.appId, screen.route) ?? meta.title

  const nav: PhoneNav = { setCompactTitle: setCompact }

  useEffect(() => {
    if (!closing) return
    const el = rootRef.current
    if (!el) return
    let done = false
    const finish = () => {
      if (done) return
      done = true
      onClosed()
    }
    el.addEventListener('animationend', finish, { once: true })
    const timer = window.setTimeout(finish, 600)
    return () => {
      el.removeEventListener('animationend', finish)
      window.clearTimeout(timer)
    }
  }, [closing, onClosed])

  // Swipe up on the home indicator to go home.
  const indicator = usePointerDrag({
    threshold: 6,
    onMove: (_dx, dy) => {
      const el = rootRef.current
      if (!el) return
      const lift = Math.min(0, dy)
      const scale = 1 + lift / 2400
      el.style.transform = `translate3d(0, ${lift * 0.35}px, 0) scale(${scale.toFixed(4)})`
      el.style.borderRadius = `${Math.min(36, -lift * 0.3)}px`
    },
    onEnd: (_dx, dy) => {
      const el = rootRef.current
      if (el) {
        el.style.transform = ''
        el.style.borderRadius = ''
      }
      if (dy < -70) onHome()
    },
  })

  return (
    <PhoneNavContext.Provider value={nav}>
      <div ref={rootRef} className={`phone-app ${closing ? 'is-closing' : ''}`} role="dialog" aria-label={`${meta.title} app`}>
        <StatusBar tone="auto-app" />
        <div className="phone-app__nav">
          <button
            type="button"
            className="glass glass--thin glass--pill nav-pill"
            onClick={() => (nested ? onRoute(null) : onHome())}
            aria-label={nested ? `Back to ${meta.title}` : 'Back to Home'}
          >
            <Glyph name="chevron-left" size={18} strokeWidth={2.6} />
            <span>{nested ? meta.title : 'Home'}</span>
          </button>
          <div className={`glass glass--thin glass--pill nav-title ${compact ? 'is-visible' : ''}`} aria-hidden={!compact}>
            <span>{title}</span>
          </div>
          {nested ? (
            <button type="button" className="glass glass--thin glass--pill nav-pill nav-pill--icon" onClick={onHome} aria-label="Close app">
              <Glyph name="close" size={18} strokeWidth={2.6} />
            </button>
          ) : (
            <span className="nav-pill nav-pill--spacer" aria-hidden="true" />
          )}
        </div>

        <div className="phone-app__content">
          <Suspense fallback={<AppLoading />}>
            <Component shell="phone" route={screen.route} routeVersion={screen.routeVersion} onRoute={onRoute} openApp={openApp} />
          </Suspense>
        </div>

        <div className="home-indicator-zone" onPointerDown={indicator.onPointerDown}>
          <button type="button" className="home-indicator" aria-label="Go to Home Screen" onClick={onHome} />
        </div>
      </div>
    </PhoneNavContext.Provider>
  )
}
