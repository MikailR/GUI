import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { renderApp } from '../apps'
import { Wallpaper } from '../components/Wallpaper'
import { appByShortcut } from '../os/apps'
import { useViewport } from '../os/hooks'
import { parseHash, replaceHash } from '../os/routes'
import { useStore } from '../os/store'
import type { AppId, Overlay } from '../os/types'
import { ControlCenter } from './ControlCenter'
import { DesktopIcons } from './DesktopIcons'
import { Dock } from './Dock'
import { MenuBar } from './MenuBar'
import { buildMenus, type MenuCommands } from './menus'
import { Notifications } from './Notifications'
import { AboutMacSheet, ShortcutsSheet } from './Sheets'
import { Spotlight } from './Spotlight'
import { Window } from './Window'

export function DesktopShell() {
  const { state, dispatch } = useStore()
  const viewport = useViewport()
  const [asleep, setAsleep] = useState(false)

  /* ---- commands ---- */
  const openApp = useCallback(
    (appId: AppId, route?: string) => dispatch({ type: 'open', appId, route, viewport }),
    [dispatch, viewport],
  )
  const setOverlay = useCallback((overlay: Overlay) => dispatch({ type: 'overlay', overlay }), [dispatch])
  const closeOverlay = useCallback(() => dispatch({ type: 'overlay', overlay: 'none' }), [dispatch])

  const onClose = useCallback((appId: AppId) => dispatch({ type: 'close', appId }), [dispatch])
  const onMinimize = useCallback((appId: AppId) => dispatch({ type: 'minimize', appId }), [dispatch])
  const onFocus = useCallback((appId: AppId) => dispatch({ type: 'focus', appId }), [dispatch])
  const onZoom = useCallback((appId: AppId) => dispatch({ type: 'zoom', appId, viewport }), [dispatch, viewport])
  const onRect = useCallback(
    (appId: AppId, rect: { x: number; y: number; w: number; h: number }) => dispatch({ type: 'setRect', appId, rect }),
    [dispatch],
  )

  const cycleWindows = useCallback(() => {
    const visible = [...state.windows].sort((a, b) => a.z - b.z)
    if (visible.length < 2) return
    const next = visible[0]
    dispatch({ type: 'restore', appId: next.id })
  }, [dispatch, state.windows])

  const commands = useMemo<MenuCommands>(
    () => ({
      openApp,
      closeFocused: () => state.focused && dispatch({ type: 'close', appId: state.focused }),
      closeAll: () => dispatch({ type: 'closeAll' }),
      minimizeFocused: () => state.focused && dispatch({ type: 'minimize', appId: state.focused }),
      zoomFocused: () => state.focused && dispatch({ type: 'zoom', appId: state.focused, viewport }),
      cycleWindows,
      tile: () => dispatch({ type: 'tile', viewport }),
      gather: () => dispatch({ type: 'gather', viewport }),
      showDesktop: () => dispatch({ type: 'showDesktop' }),
      focusWindow: (appId) => dispatch({ type: 'restore', appId }),
      setAppearance: (appearance) => dispatch({ type: 'settings', patch: { appearance } }),
      setWallpaper: (wallpaper) => dispatch({ type: 'settings', patch: { wallpaper } }),
      toggleTransparency: () =>
        dispatch({ type: 'settings', patch: { reduceTransparency: !state.settings.reduceTransparency } }),
      toggleMotion: () => dispatch({ type: 'settings', patch: { reduceMotion: !state.settings.reduceMotion } }),
      toggleLiveWallpaper: () => dispatch({ type: 'settings', patch: { liveWallpaper: !state.settings.liveWallpaper } }),
      openSpotlight: () => setOverlay('spotlight'),
      openAboutMac: () => setOverlay('about-mac'),
      openShortcuts: () => setOverlay('shortcuts'),
      sleep: () => setAsleep(true),
      restart: () => {
        dispatch({ type: 'closeAll' })
        dispatch({ type: 'toast', toast: { title: 'Restarted', body: 'All windows closed. Settings kept.' } })
      },
    }),
    [openApp, state.focused, state.settings, dispatch, viewport, cycleWindows, setOverlay],
  )

  const menus = useMemo(() => buildMenus(state, commands), [state, commands])

  /* ---- keyboard ---- */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const typing = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOverlay(state.overlay === 'spotlight' ? 'none' : 'spotlight')
        return
      }
      if (typing) return
      if (event.key === '?' && !event.altKey) {
        event.preventDefault()
        setOverlay('shortcuts')
        return
      }
      if (event.key === 'Escape' && state.overlay === 'none' && state.focused) {
        dispatch({ type: 'close', appId: state.focused })
        return
      }
      if (!event.altKey || event.metaKey || event.ctrlKey) return
      const digit = Number(event.code.replace('Digit', ''))
      if (event.code.startsWith('Digit') && digit >= 1 && digit <= 9) {
        const meta = appByShortcut(digit)
        if (meta) {
          event.preventDefault()
          openApp(meta.id)
        }
        return
      }
      switch (event.code) {
        case 'KeyW':
          event.preventDefault()
          commands.closeFocused()
          break
        case 'KeyM':
          event.preventDefault()
          commands.minimizeFocused()
          break
        case 'Enter':
          event.preventDefault()
          commands.zoomFocused()
          break
        case 'Backquote':
          event.preventDefault()
          commands.cycleWindows()
          break
        case 'KeyT':
          event.preventDefault()
          commands.tile()
          break
        case 'KeyG':
          event.preventDefault()
          commands.gather()
          break
        case 'KeyD':
          event.preventDefault()
          commands.showDesktop()
          break
        case 'Comma':
          event.preventDefault()
          openApp('settings')
          break
        default:
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [commands, dispatch, openApp, setOverlay, state.focused, state.overlay])

  /* ---- deep links ---- */
  useEffect(() => {
    const apply = () => {
      const location = parseHash(window.location.hash)
      if (location) openApp(location.appId, location.route)
    }
    apply()
    window.addEventListener('hashchange', apply)
    return () => window.removeEventListener('hashchange', apply)
    // Run once on mount and on hash changes; openApp identity changes with viewport only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const focused = state.windows.find((win) => win.id === state.focused && !win.minimized)
    replaceHash(focused ? { appId: focused.id, route: focused.route } : null)
  }, [state.focused, state.windows])

  /* ---- dock open ---- */
  const onDockOpen = useCallback(
    (appId: AppId) => {
      const win = state.windows.find((w) => w.id === appId)
      if (win) dispatch({ type: 'restore', appId })
      else openApp(appId)
    },
    [dispatch, openApp, state.windows],
  )

  const trashFull = state.trash.length > 0

  return (
    <div className="mac" data-shell="mac" data-asleep={asleep || undefined}>
      <Wallpaper className="mac-wallpaper" />
      <MenuBar
        menus={menus}
        controlCenterOpen={state.overlay === 'control-center'}
        onToggleControlCenter={() => setOverlay(state.overlay === 'control-center' ? 'none' : 'control-center')}
        onSpotlight={() => setOverlay('spotlight')}
      />
      <DesktopIcons trashFull={trashFull} onOpen={openApp} />

      <div className="mac-windows">
        {state.windows
          .filter((win) => !win.minimized)
          .map((win) => (
            <Window
              key={win.id}
              win={win}
              focused={state.focused === win.id}
              viewport={viewport}
              onFocus={onFocus}
              onClose={onClose}
              onMinimize={onMinimize}
              onZoom={onZoom}
              onRect={onRect}
            >
              <Suspense fallback={<div className="app-loading">Loading…</div>}>
                {renderApp(win.id, {
                  shell: 'mac',
                  route: win.route,
                  onRoute: (route) => dispatch({ type: 'setRoute', appId: win.id, route }),
                  openApp,
                })}
              </Suspense>
            </Window>
          ))}
      </div>

      <Dock
        windows={state.windows}
        trashFull={trashFull}
        magnify={state.settings.dockMagnification && !state.settings.reduceMotion}
        launchTick={state.launchTick}
        onOpen={onDockOpen}
      />

      <Notifications placement="mac" />

      {state.overlay === 'control-center' ? (
        <ControlCenter
          onClose={closeOverlay}
          onOpenSettings={() => {
            closeOverlay()
            openApp('settings', 'appearance')
          }}
        />
      ) : null}
      {state.overlay === 'spotlight' ? <Spotlight onClose={closeOverlay} onOpen={openApp} /> : null}
      {state.overlay === 'about-mac' ? <AboutMacSheet onClose={closeOverlay} /> : null}
      {state.overlay === 'shortcuts' ? <ShortcutsSheet onClose={closeOverlay} /> : null}

      {asleep ? (
        <button type="button" className="mac-sleep" onClick={() => setAsleep(false)} aria-label="Wake">
          <span>Click anywhere to wake</span>
        </button>
      ) : null}
    </div>
  )
}
