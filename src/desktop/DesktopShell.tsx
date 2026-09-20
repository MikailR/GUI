import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { APP_COMPONENTS, AppLoading } from '../apps'
import { appByDigit } from '../os/apps'
import { parseHash } from '../os/deeplink'
import { useViewport } from '../os/hooks'
import { routeTitle } from '../os/routes'
import type { SearchAction } from '../os/search'
import { useOs } from '../os/store'
import type { AppId, Toast } from '../os/types'
import { DesktopIcons } from './DesktopIcons'
import { Dock } from './Dock'
import { MenuBar } from './MenuBar'
import { type DesktopSheet, type MenuCommands } from './menus'
import { DesktopSheets } from './Sheets'
import { Spotlight } from './Spotlight'
import { Toasts } from './Toasts'
import { Wallpaper } from './Wallpaper'
import { Window } from './Window'

type ExitKind = 'closing' | 'minimizing'

/**
 * The macOS shell: wallpaper, menu bar, desktop icons, windows, Dock, Spotlight, sheets, toasts.
 * Owns exit animations (close / minimize) so keyboard, menus and traffic lights share one path.
 */
export default function DesktopShell() {
  const { state, dispatch } = useOs()
  const viewport = useViewport()
  const [exiting, setExiting] = useState<Partial<Record<AppId, ExitKind>>>({})
  const [bouncing, setBouncing] = useState<Set<AppId>>(new Set())
  const [sheet, setSheet] = useState<DesktopSheet | null>(null)
  const [asleep, setAsleep] = useState(false)
  const bounceTimers = useRef<Map<AppId, number>>(new Map())

  const vp = useCallback(() => ({ w: window.innerWidth, h: window.innerHeight }), [])

  /* --------------------------------------------------------- commands */
  const openApp = useCallback(
    (appId: AppId, route?: string | null) => {
      const isNew = !state.windows[appId]
      dispatch({ type: 'OPEN_APP', appId, route, viewport: vp() })
      if (isNew) {
        setBouncing((prev) => new Set(prev).add(appId))
        window.clearTimeout(bounceTimers.current.get(appId))
        bounceTimers.current.set(
          appId,
          window.setTimeout(() => {
            setBouncing((prev) => {
              const next = new Set(prev)
              next.delete(appId)
              return next
            })
          }, 900),
        )
      }
    },
    [dispatch, state.windows, vp],
  )

  const requestExit = useCallback(
    (appId: AppId, kind: ExitKind) => {
      if (!state.windows[appId]) return
      setExiting((prev) => (prev[appId] ? prev : { ...prev, [appId]: kind }))
    },
    [state.windows],
  )

  const onExited = useCallback(
    (appId: AppId, kind: ExitKind) => {
      setExiting((prev) => {
        const next = { ...prev }
        delete next[appId]
        return next
      })
      dispatch(kind === 'closing' ? { type: 'CLOSE', appId } : { type: 'MINIMIZE', appId })
    },
    [dispatch],
  )

  const closeAll = useCallback(() => {
    for (const appId of Object.keys(state.windows) as AppId[]) requestExit(appId, 'closing')
  }, [state.windows, requestExit])

  const showDesktop = useCallback(() => {
    for (const win of Object.values(state.windows)) if (!win.minimized) requestExit(win.appId, 'minimizing')
  }, [state.windows, requestExit])

  const commands: MenuCommands = useMemo(
    () => ({
      openApp,
      requestClose: (appId) => requestExit(appId, 'closing'),
      closeAll,
      minimize: (appId) => requestExit(appId, 'minimizing'),
      toggleZoom: (appId) => dispatch({ type: 'TOGGLE_ZOOM', appId, viewport: vp() }),
      tile: () => dispatch({ type: 'TILE', viewport: vp() }),
      gather: () => dispatch({ type: 'GATHER', viewport: vp() }),
      cycle: () => dispatch({ type: 'CYCLE_FOCUS', direction: 1 }),
      showDesktop,
      restore: (appId) => dispatch({ type: 'RESTORE', appId }),
      focus: (appId) => dispatch({ type: 'FOCUS', appId }),
      setAppearance: (appearance) => dispatch({ type: 'SET_SETTINGS', patch: { appearance } }),
      setWallpaper: (wallpaper) => dispatch({ type: 'SET_SETTINGS', patch: { wallpaper } }),
      toggleTransparency: () =>
        dispatch({ type: 'SET_SETTINGS', patch: { reduceTransparency: !state.settings.reduceTransparency } }),
      toggleLiveWallpaper: () => dispatch({ type: 'SET_SETTINGS', patch: { liveWallpaper: !state.settings.liveWallpaper } }),
      openSpotlight: () => dispatch({ type: 'SPOTLIGHT', open: true }),
      openSheet: setSheet,
      sleep: () => setAsleep(true),
      restart: () => window.location.reload(),
    }),
    [openApp, requestExit, closeAll, showDesktop, dispatch, vp, state.settings.reduceTransparency, state.settings.liveWallpaper],
  )

  const onDockActivate = useCallback(
    (appId: AppId) => {
      const win = state.windows[appId]
      if (!win) openApp(appId)
      else if (win.minimized) dispatch({ type: 'RESTORE', appId })
      else dispatch({ type: 'FOCUS', appId })
    },
    [state.windows, openApp, dispatch],
  )

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
          setSheet(action.sheet)
          break
        default: {
          const exhaustive: never = action
          return exhaustive
        }
      }
    },
    [openApp, dispatch, state.settings.reduceTransparency],
  )

  const onToastAction = useCallback(
    (actionId: NonNullable<Toast['action']>['actionId']) => {
      switch (actionId) {
        case 'restore-trash':
          dispatch({ type: 'TRASH_RESTORE_ALL' })
          break
        default: {
          const exhaustive: never = actionId
          return exhaustive
        }
      }
    },
    [dispatch],
  )

  /* -------------------------------------------------------- keyboard */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const typing = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
      const mod = e.metaKey || e.ctrlKey

      if (mod && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        dispatch({ type: 'SPOTLIGHT', open: !state.spotlightOpen })
        return
      }
      if (asleep) {
        setAsleep(false)
        return
      }
      if (e.key === 'Escape') {
        if (state.spotlightOpen) {
          dispatch({ type: 'SPOTLIGHT', open: false })
          return
        }
        if (sheet) return // handled by the sheet itself
        if (typing) {
          target?.blur()
          return
        }
        if (state.focused) requestExit(state.focused, 'closing')
        return
      }
      if (typing) return

      if (e.key === '?' && !mod) {
        e.preventDefault()
        setSheet('shortcuts')
        return
      }

      if (!e.altKey || mod) return
      const digit = Number(e.code.replace('Digit', ''))
      if (e.code.startsWith('Digit') && digit >= 1 && digit <= 9) {
        const app = appByDigit(digit)
        if (app) {
          e.preventDefault()
          openApp(app.id)
        }
        return
      }
      switch (e.code) {
        case 'KeyW':
          if (state.focused) requestExit(state.focused, 'closing')
          break
        case 'KeyM':
          if (state.focused) requestExit(state.focused, 'minimizing')
          break
        case 'Enter':
          if (state.focused) dispatch({ type: 'TOGGLE_ZOOM', appId: state.focused, viewport: vp() })
          break
        case 'Backquote':
          dispatch({ type: 'CYCLE_FOCUS', direction: e.shiftKey ? -1 : 1 })
          break
        case 'KeyT':
          dispatch({ type: 'TILE', viewport: vp() })
          break
        case 'KeyG':
          dispatch({ type: 'GATHER', viewport: vp() })
          break
        case 'KeyD':
          showDesktop()
          break
        case 'Comma':
          openApp('settings')
          break
        default:
          return
      }
      e.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [state.spotlightOpen, state.focused, sheet, asleep, dispatch, requestExit, openApp, showDesktop, vp])

  // Honour deep links: on first paint and whenever the hash changes (shared URLs, phone → desktop resize).
  const openedFromHash = useRef(false)
  useEffect(() => {
    const openFromHash = () => {
      const link = parseHash(window.location.hash)
      if (link) openApp(link.appId, link.route)
    }
    if (!openedFromHash.current) {
      openedFromHash.current = true
      openFromHash()
    }
    window.addEventListener('hashchange', openFromHash)
    return () => window.removeEventListener('hashchange', openFromHash)
  }, [openApp])

  // Keep windows inside the work area when the viewport shrinks.
  useEffect(() => {
    for (const win of Object.values(state.windows)) {
      const maxX = viewport.w - 80
      const maxY = viewport.h - 60
      if (win.rect.x > maxX || win.rect.y > maxY) {
        dispatch({
          type: 'SET_RECT',
          appId: win.appId,
          rect: { ...win.rect, x: Math.min(win.rect.x, maxX), y: Math.min(win.rect.y, maxY) },
        })
      }
    }
  }, [viewport, state.windows, dispatch])

  const windows = Object.values(state.windows).filter((w) => !w.minimized || exiting[w.appId] === 'minimizing')

  return (
    <div className="desktop" data-shell="desktop">
      <Wallpaper />
      <MenuBar commands={commands} />
      <DesktopIcons onOpen={openApp} />

      <div className="windows" aria-live="off">
        {windows.map((win) => {
          const Component = APP_COMPONENTS[win.appId]
          return (
            <Window
              key={win.appId}
              win={win}
              focused={state.focused === win.appId}
              exit={exiting[win.appId] ?? null}
              onExited={(kind) => onExited(win.appId, kind)}
              onFocus={() => dispatch({ type: 'FOCUS', appId: win.appId })}
              onRequestClose={() => requestExit(win.appId, 'closing')}
              onRequestMinimize={() => requestExit(win.appId, 'minimizing')}
              onToggleZoom={() => dispatch({ type: 'TOGGLE_ZOOM', appId: win.appId, viewport: vp() })}
              onCommitRect={(rect) => dispatch({ type: 'SET_RECT', appId: win.appId, rect })}
              subtitle={routeTitle(win.appId, win.route)}
            >
              <Suspense fallback={<AppLoading />}>
                <Component
                  shell="desktop"
                  route={win.route}
                  routeVersion={win.routeVersion}
                  onRoute={(route) => dispatch({ type: 'SET_ROUTE', appId: win.appId, route })}
                  openApp={openApp}
                />
              </Suspense>
            </Window>
          )
        })}
      </div>

      <Dock onActivate={onDockActivate} bouncing={bouncing} />
      <Toasts onAction={onToastAction} />
      <Spotlight open={state.spotlightOpen} onClose={() => dispatch({ type: 'SPOTLIGHT', open: false })} onAction={onSearchAction} />
      <DesktopSheets sheet={sheet} onClose={() => setSheet(null)} />

      {asleep ? (
        <button type="button" className="sleep" onClick={() => setAsleep(false)} aria-label="Wake">
          <span>Click anywhere to wake</span>
        </button>
      ) : null}
    </div>
  )
}
