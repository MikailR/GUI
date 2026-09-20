import { APP_LIST, APPS } from '../os/apps'
import type { OsState } from '../os/store'
import type { AppId, Appearance } from '../os/types'
import { WALLPAPER_LIST } from './wallpapers'

export type MenuItem =
  | { kind: 'item'; label: string; shortcut?: string; checked?: boolean; disabled?: boolean; onSelect: () => void }
  | { kind: 'separator' }
  | { kind: 'header'; label: string }

export interface Menu {
  id: string
  label: string
  /** Bold, like the active application's menu on macOS. */
  emphasis?: boolean
  items: MenuItem[]
}

export type DesktopSheet = 'about-mac' | 'shortcuts'

export interface MenuCommands {
  openApp: (appId: AppId, route?: string | null) => void
  requestClose: (appId: AppId) => void
  closeAll: () => void
  minimize: (appId: AppId) => void
  toggleZoom: (appId: AppId) => void
  tile: () => void
  gather: () => void
  cycle: () => void
  showDesktop: () => void
  restore: (appId: AppId) => void
  focus: (appId: AppId) => void
  setAppearance: (appearance: Appearance) => void
  setWallpaper: (id: OsState['settings']['wallpaper']) => void
  toggleTransparency: () => void
  toggleLiveWallpaper: () => void
  openSpotlight: () => void
  openSheet: (sheet: DesktopSheet) => void
  sleep: () => void
  restart: () => void
}

/** Human labels for the shortcut chords used across the desktop. */
export const SHORTCUTS = {
  close: 'Esc',
  closeAlt: '⌥W',
  minimize: '⌥M',
  zoom: '⌥↩',
  cycle: '⌥`',
  tile: '⌥T',
  gather: '⌥G',
  showDesktop: '⌥D',
  spotlight: '⌘K',
  settings: '⌥,',
  help: '?',
} as const

/** Build the menu bar contents for the current state. Pure: easy to test and to reuse for the phone "…" menu. */
export function buildMenus(state: OsState, cmd: MenuCommands): Menu[] {
  const focused = state.focused ? state.windows[state.focused] : null
  const focusedMeta = focused ? APPS[focused.appId] : null
  const openWindows = Object.values(state.windows).sort((a, b) => a.appId.localeCompare(b.appId))

  const appleMenu: Menu = {
    id: 'apple',
    label: '',
    items: [
      { kind: 'item', label: 'About This Mac', onSelect: () => cmd.openSheet('about-mac') },
      { kind: 'separator' },
      { kind: 'item', label: 'System Settings…', shortcut: SHORTCUTS.settings, onSelect: () => cmd.openApp('settings') },
      { kind: 'item', label: 'Spotlight…', shortcut: SHORTCUTS.spotlight, onSelect: cmd.openSpotlight },
      { kind: 'separator' },
      { kind: 'item', label: 'Sleep', onSelect: cmd.sleep },
      { kind: 'item', label: 'Restart…', onSelect: cmd.restart },
    ],
  }

  const appMenu: Menu = {
    id: 'app',
    label: focusedMeta ? focusedMeta.title : 'Desktop',
    emphasis: true,
    items: focusedMeta
      ? [
          { kind: 'item', label: `About ${focusedMeta.title}`, onSelect: () => cmd.openApp('about') },
          { kind: 'separator' },
          { kind: 'item', label: 'Settings…', shortcut: SHORTCUTS.settings, onSelect: () => cmd.openApp('settings') },
          { kind: 'separator' },
          { kind: 'item', label: `Hide ${focusedMeta.title}`, shortcut: SHORTCUTS.minimize, onSelect: () => cmd.minimize(focusedMeta.id) },
          { kind: 'item', label: `Quit ${focusedMeta.title}`, shortcut: SHORTCUTS.closeAlt, onSelect: () => cmd.requestClose(focusedMeta.id) },
        ]
      : [
          { kind: 'item', label: 'About Mikail', onSelect: () => cmd.openApp('about') },
          { kind: 'separator' },
          { kind: 'item', label: 'Settings…', shortcut: SHORTCUTS.settings, onSelect: () => cmd.openApp('settings') },
        ],
  }

  const fileMenu: Menu = {
    id: 'file',
    label: 'File',
    items: [
      { kind: 'header', label: 'Open' },
      ...APP_LIST.map<MenuItem>((app) => ({
        kind: 'item',
        label: app.title,
        shortcut: app.shortcutDigit ? `⌥${app.shortcutDigit}` : undefined,
        onSelect: () => cmd.openApp(app.id),
      })),
      { kind: 'separator' },
      {
        kind: 'item',
        label: 'Close Window',
        shortcut: SHORTCUTS.close,
        disabled: !focused,
        onSelect: () => focused && cmd.requestClose(focused.appId),
      },
      { kind: 'item', label: 'Close All', disabled: openWindows.length === 0, onSelect: cmd.closeAll },
    ],
  }

  const viewMenu: Menu = {
    id: 'view',
    label: 'View',
    items: [
      { kind: 'header', label: 'Appearance' },
      ...(['auto', 'light', 'dark'] as Appearance[]).map<MenuItem>((appearance) => ({
        kind: 'item',
        label: appearance === 'auto' ? 'Automatic' : appearance === 'light' ? 'Light' : 'Dark',
        checked: state.settings.appearance === appearance,
        onSelect: () => cmd.setAppearance(appearance),
      })),
      { kind: 'separator' },
      { kind: 'header', label: 'Wallpaper' },
      ...WALLPAPER_LIST.map<MenuItem>((wp) => ({
        kind: 'item',
        label: wp.name,
        checked: state.settings.wallpaper === wp.id,
        onSelect: () => cmd.setWallpaper(wp.id),
      })),
      { kind: 'separator' },
      { kind: 'item', label: 'Live Wallpaper', checked: state.settings.liveWallpaper, onSelect: cmd.toggleLiveWallpaper },
      { kind: 'item', label: 'Reduce Transparency', checked: state.settings.reduceTransparency, onSelect: cmd.toggleTransparency },
    ],
  }

  const windowMenu: Menu = {
    id: 'window',
    label: 'Window',
    items: [
      { kind: 'item', label: 'Minimize', shortcut: SHORTCUTS.minimize, disabled: !focused, onSelect: () => focused && cmd.minimize(focused.appId) },
      { kind: 'item', label: 'Zoom', shortcut: SHORTCUTS.zoom, disabled: !focused, onSelect: () => focused && cmd.toggleZoom(focused.appId) },
      { kind: 'separator' },
      { kind: 'item', label: 'Tile Windows', shortcut: SHORTCUTS.tile, disabled: openWindows.length === 0, onSelect: cmd.tile },
      { kind: 'item', label: 'Gather Windows', shortcut: SHORTCUTS.gather, disabled: openWindows.length === 0, onSelect: cmd.gather },
      { kind: 'item', label: 'Cycle Through Windows', shortcut: SHORTCUTS.cycle, disabled: openWindows.length < 2, onSelect: cmd.cycle },
      { kind: 'item', label: 'Show Desktop', shortcut: SHORTCUTS.showDesktop, disabled: openWindows.length === 0, onSelect: cmd.showDesktop },
      ...(openWindows.length
        ? [
            { kind: 'separator' } as MenuItem,
            ...openWindows.map<MenuItem>((win) => ({
              kind: 'item',
              label: `${APPS[win.appId].title}${win.minimized ? ' (minimized)' : ''}`,
              checked: state.focused === win.appId && !win.minimized,
              onSelect: () => (win.minimized ? cmd.restore(win.appId) : cmd.focus(win.appId)),
            })),
          ]
        : []),
    ],
  }

  const helpMenu: Menu = {
    id: 'help',
    label: 'Help',
    items: [
      { kind: 'item', label: 'Keyboard Shortcuts', shortcut: SHORTCUTS.help, onSelect: () => cmd.openSheet('shortcuts') },
      { kind: 'item', label: 'Search Everything…', shortcut: SHORTCUTS.spotlight, onSelect: cmd.openSpotlight },
      { kind: 'separator' },
      { kind: 'item', label: 'Why is this an OS?', onSelect: () => cmd.openApp('writing', 'why-an-os') },
      { kind: 'item', label: 'Source on GitHub', onSelect: () => window.open('https://github.com/MikailR/GUI/tree/liquid-glass', '_blank', 'noopener') },
    ],
  }

  return [appleMenu, appMenu, fileMenu, viewMenu, windowMenu, helpMenu]
}
