import { Suspense, useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { renderApp } from '../apps'
import { Wallpaper } from '../components/Wallpaper'
import { Notifications } from '../desktop/Notifications'
import { Spotlight } from '../desktop/Spotlight'
import { parseHash, pushHash, replaceHash, type Location } from '../os/routes'
import { useStore } from '../os/store'
import type { AppId } from '../os/types'
import { HomeScreen } from './HomeScreen'
import { LockScreen } from './LockScreen'
import { PhoneNavContext, type PhoneNav } from './PhoneNavContext'
import { StatusBar } from './StatusBar'

type Screen = Location | null

/**
 * iOS shell. Owns one screen at a time; the app's AppFrame owns its own
 * navigation stack (root ⇄ detail). Browser history mirrors the hash so the
 * hardware back button behaves like iOS back.
 */
export function PhoneShell() {
  const { state, dispatch } = useStore()
  const initial = useMemo(() => parseHash(window.location.hash), [])
  const [screen, setScreen] = useState<Screen>(initial)
  const [locked, setLocked] = useState(initial === null && sessionStorage.getItem('mikail-os.unlocked') !== '1')
  const [origin, setOrigin] = useState({ x: 50, y: 50 })
  const [closing, setClosing] = useState(false)

  const unlock = useCallback(() => {
    sessionStorage.setItem('mikail-os.unlocked', '1')
    setLocked(false)
  }, [])

  const openApp = useCallback(
    (appId: AppId, route?: string, at?: { x: number; y: number }) => {
      if (at) setOrigin(at)
      setClosing(false)
      const next: Location = { appId, route: route ?? '' }
      setScreen(next)
      pushHash(next)
    },
    [],
  )

  const goHome = useCallback(() => {
    if (!screen) return
    const reduced = document.documentElement.dataset.motion === 'reduced'
    if (reduced) {
      setScreen(null)
      replaceHash(null)
      return
    }
    setClosing(true)
    window.setTimeout(() => {
      setClosing(false)
      setScreen(null)
      replaceHash(null)
    }, 260)
  }, [screen])

  const setRoute = useCallback(
    (route: string) => {
      if (!screen) return
      const next = { appId: screen.appId, route }
      setScreen(next)
      pushHash(next)
    },
    [screen],
  )

  useEffect(() => {
    const onPop = () => {
      const location = parseHash(window.location.hash)
      setClosing(false)
      setScreen(location)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  /* Swipe-up on the home indicator returns home. */
  const swipe = useRef<number | null>(null)
  const onIndicatorDown = (event: PointerEvent<HTMLButtonElement>) => {
    swipe.current = event.clientY
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  const onIndicatorUp = (event: PointerEvent<HTMLButtonElement>) => {
    if (swipe.current !== null && swipe.current - event.clientY > 24) goHome()
    swipe.current = null
  }

  const nav = useMemo<PhoneNav>(() => ({ goHome }), [goHome])
  const trashCount = state.trash.length
  const spotlight = state.overlay === 'spotlight'

  return (
    <PhoneNavContext.Provider value={nav}>
      <div className="ios" data-shell="ios" data-locked={locked || undefined}>
        <Wallpaper className="ios-wallpaper" />
        <StatusBar tone={screen && !closing ? 'dark' : 'light'} />

        <HomeScreen
          trashCount={trashCount}
          receded={screen !== null && !closing}
          onOpen={(appId, route, at) => openApp(appId, route, at)}
          onSearch={() => dispatch({ type: 'overlay', overlay: 'spotlight' })}
        />

        {screen ? (
          <div
            key={screen.appId}
            className="ios-app"
            data-closing={closing || undefined}
            style={{ '--ox': `${origin.x}px`, '--oy': `${origin.y}px` } as CSSProperties}
          >
            <Suspense fallback={<div className="app-loading">Loading…</div>}>
              {renderApp(screen.appId, {
                shell: 'ios',
                route: screen.route,
                onRoute: setRoute,
                openApp: (appId, route) => openApp(appId, route),
              })}
            </Suspense>
          </div>
        ) : null}

        {screen ? (
          <button
            type="button"
            className="ios-home-indicator ios-home-indicator-button"
            aria-label="Go to Home Screen"
            onPointerDown={onIndicatorDown}
            onPointerUp={onIndicatorUp}
            onClick={goHome}
          />
        ) : null}

        <Notifications placement="ios" />

        {spotlight ? (
          <Spotlight compact onClose={() => dispatch({ type: 'overlay', overlay: 'none' })} onOpen={(appId, route) => openApp(appId, route)} />
        ) : null}

        {locked ? <LockScreen onUnlock={unlock} /> : null}
      </div>
    </PhoneNavContext.Provider>
  )
}
