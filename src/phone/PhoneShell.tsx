import { useCallback, useEffect, useState } from 'react'
import { Spotlight } from '../desktop/Spotlight'
import { Wallpaper } from '../desktop/Wallpaper'
import { formatHash, parseHash } from '../os/deeplink'
import type { SearchAction } from '../os/search'
import { useOs } from '../os/store'
import type { AppId } from '../os/types'
import { AppScreen, type PhoneScreenState } from './AppScreen'
import { HomeScreen } from './HomeScreen'
import { StatusBar } from './StatusBar'

/**
 * The iOS shell (≤ 820px). Home screen of icons → one full-screen app at a time.
 * The URL hash mirrors navigation so the browser's back button behaves like iOS back.
 */
export default function PhoneShell() {
  const { state, dispatch } = useOs()
  const [screen, setScreen] = useState<PhoneScreenState | null>(() => {
    const link = parseHash(window.location.hash)
    return link ? { appId: link.appId, route: link.route, routeVersion: 0 } : null
  })
  const [closing, setClosing] = useState(false)

  // Mirror navigation into the hash so the browser back button acts like iOS back.
  useEffect(() => {
    const target = formatHash(screen ? { appId: screen.appId, route: screen.route } : null)
    if (window.location.hash === target) return
    if (!window.location.hash) history.replaceState(null, '', target)
    else history.pushState(null, '', target)
  }, [screen])

  // Browser back/forward → sync screen.
  useEffect(() => {
    const onPop = () => {
      const link = parseHash(window.location.hash)
      setClosing(false)
      setScreen((prev) => {
        if (!link) return null
        if (prev && prev.appId === link.appId) return { ...prev, route: link.route, routeVersion: prev.routeVersion + 1 }
        return { appId: link.appId, route: link.route, routeVersion: 0 }
      })
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const openApp = useCallback((appId: AppId, route: string | null = null) => {
    setClosing(false)
    setScreen((prev) =>
      prev && prev.appId === appId ? { ...prev, route, routeVersion: prev.routeVersion + 1 } : { appId, route, routeVersion: 0 },
    )
  }, [])

  const goHome = useCallback(() => {
    if (!screen) return
    setClosing(true)
  }, [screen])

  const onClosed = useCallback(() => {
    setClosing(false)
    setScreen(null)
  }, [])

  const onRoute = useCallback((route: string | null) => {
    setScreen((prev) => (prev ? { ...prev, route, routeVersion: prev.routeVersion + 1 } : prev))
  }, [])

  const onSearchAction = useCallback(
    (action: SearchAction) => {
      switch (action.kind) {
        case 'open':
          openApp(action.appId, action.route ?? null)
          break
        case 'appearance':
          dispatch({ type: 'SET_SETTINGS', patch: { appearance: action.appearance } })
          break
        case 'wallpaper':
          dispatch({ type: 'SET_SETTINGS', patch: { wallpaper: action.wallpaper } })
          break
        case 'toggle-transparency':
          dispatch({ type: 'SET_SETTINGS', patch: { reduceTransparency: !state.settings.reduceTransparency } })
          break
        case 'sheet':
          openApp('settings')
          break
        default: {
          const exhaustive: never = action
          return exhaustive
        }
      }
    },
    [openApp, dispatch, state.settings.reduceTransparency],
  )

  return (
    <div className="phone" data-shell="phone">
      <Wallpaper animate={false} className="wallpaper--phone" />
      {!screen ? <StatusBar tone="light" /> : null}
      <HomeScreen onOpen={openApp} onSearch={() => dispatch({ type: 'SPOTLIGHT', open: true })} behind={Boolean(screen)} />
      {screen ? (
        <AppScreen key={screen.appId} screen={screen} closing={closing} onClosed={onClosed} onRoute={onRoute} onHome={goHome} openApp={openApp} />
      ) : null}
      <Spotlight open={state.spotlightOpen} onClose={() => dispatch({ type: 'SPOTLIGHT', open: false })} onAction={onSearchAction} />
    </div>
  )
}
