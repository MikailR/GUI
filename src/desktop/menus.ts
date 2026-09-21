import { APPS } from '../os/apps'
import type { Appearance, AppId, OsState, WallpaperId } from '../os/types'
import { WALLPAPERS } from '../os/wallpapers'

export type MenuItem =
  | { kind: 'item'; label: string; shortcut?: string; disabled?: boolean; checked?: boolean; run: () => void }
  | { kind: 'separator' }
  | { kind: 'submenu'; label: string; items: MenuItem[] }

export interface Menu {
  id: string
  label: string
  /** Rendered bold, like the front app's name. */
  bold?: boolean
  /** Rendered as the OS mark glyph. */
  mark?: boolean
  items: MenuItem[]
}

export interface MenuCommands {
  openApp: (appId: AppId, route?: string) => void
  closeFocused: () => void
  closeAll: () => void
  minimizeFocused: () => void
  zoomFocused: () => void
  cycleWindows: () => void
  tile: () => void
  gather: () => void
  showDesktop: () => void
  focusWindow: (appId: AppId) => void
  setAppearance: (appearance: Appearance) => void
  setWallpaper: (wallpaper: WallpaperId) => void
  toggleTransparency: () => void
  toggleMotion: () => void
  toggleLiveWallpaper: () => void
  openSpotlight: () => void
  openAboutMac: () => void
  openShortcuts: () => void
  sleep: () => void
  restart: () => void
}

const sep: MenuItem = { kind: 'separator' }

export function buildMenus(state: OsState, commands: MenuCommands): Menu[] {
  const focusedMeta = APPS.find((app) => app.id === state.focused)
  const hasWindow = state.windows.length > 0
  const hasFocused = focusedMeta !== undefined
  const appName = focusedMeta?.name ?? 'Finder'

  const mark: Menu = {
    id: 'mark',
    label: 'Mikail OS',
    mark: true,
    items: [
      { kind: 'item', label: 'About This Mac', run: commands.openAboutMac },
      sep,
      { kind: 'item', label: 'System Settings…', shortcut: '⌥,', run: () => commands.openApp('settings') },
      { kind: 'item', label: 'Keyboard Shortcuts', shortcut: '?', run: commands.openShortcuts },
      sep,
      { kind: 'item', label: 'Sleep', run: commands.sleep },
      { kind: 'item', label: 'Restart…', run: commands.restart },
    ],
  }

  const app: Menu = {
    id: 'app',
    label: appName,
    bold: true,
    items: focusedMeta
      ? [
          { kind: 'item', label: `About ${focusedMeta.name}`, run: () => commands.openApp('about') },
          sep,
          { kind: 'item', label: 'Hide Window', shortcut: '⌥M', run: commands.minimizeFocused },
          { kind: 'item', label: 'Close Window', shortcut: '⌥W', run: commands.closeFocused },
        ]
      : [
          { kind: 'item', label: 'About Mikail', run: () => commands.openApp('about') },
          sep,
          { kind: 'item', label: 'Empty Trash…', run: () => commands.openApp('trash') },
        ],
  }

  const file: Menu = {
    id: 'file',
    label: 'File',
    items: [
      {
        kind: 'submenu',
        label: 'Open',
        items: APPS.map((meta) => ({
          kind: 'item' as const,
          label: meta.name,
          shortcut: `⌥${meta.shortcut}`,
          run: () => commands.openApp(meta.id),
        })),
      },
      sep,
      { kind: 'item', label: 'Search', shortcut: '⌘K', run: commands.openSpotlight },
      sep,
      { kind: 'item', label: 'Close Window', shortcut: '⌥W', disabled: !hasFocused, run: commands.closeFocused },
      { kind: 'item', label: 'Close All Windows', disabled: !hasWindow, run: commands.closeAll },
    ],
  }

  const view: Menu = {
    id: 'view',
    label: 'View',
    items: [
      {
        kind: 'submenu',
        label: 'Appearance',
        items: (['auto', 'light', 'dark'] as Appearance[]).map((appearance) => ({
          kind: 'item' as const,
          label: appearance === 'auto' ? 'Auto' : appearance === 'light' ? 'Light' : 'Dark',
          checked: state.settings.appearance === appearance,
          run: () => commands.setAppearance(appearance),
        })),
      },
      {
        kind: 'submenu',
        label: 'Wallpaper',
        items: WALLPAPERS.map((wallpaper) => ({
          kind: 'item' as const,
          label: wallpaper.name,
          checked: state.settings.wallpaper === wallpaper.id,
          run: () => commands.setWallpaper(wallpaper.id),
        })),
      },
      sep,
      { kind: 'item', label: 'Live Wallpaper', checked: state.settings.liveWallpaper, run: commands.toggleLiveWallpaper },
      { kind: 'item', label: 'Reduce Transparency', checked: state.settings.reduceTransparency, run: commands.toggleTransparency },
      { kind: 'item', label: 'Reduce Motion', checked: state.settings.reduceMotion, run: commands.toggleMotion },
    ],
  }

  const windowMenu: Menu = {
    id: 'window',
    label: 'Window',
    items: [
      { kind: 'item', label: 'Minimize', shortcut: '⌥M', disabled: !hasFocused, run: commands.minimizeFocused },
      { kind: 'item', label: 'Zoom', shortcut: '⌥↩', disabled: !hasFocused, run: commands.zoomFocused },
      { kind: 'item', label: 'Cycle Through Windows', shortcut: '⌥`', disabled: state.windows.length < 2, run: commands.cycleWindows },
      sep,
      { kind: 'item', label: 'Tile Windows', shortcut: '⌥T', disabled: !hasWindow, run: commands.tile },
      { kind: 'item', label: 'Bring All to Center', shortcut: '⌥G', disabled: !hasWindow, run: commands.gather },
      { kind: 'item', label: 'Show Desktop', shortcut: '⌥D', disabled: !hasWindow, run: commands.showDesktop },
      ...(hasWindow
        ? [
            sep,
            ...state.windows.map((win) => {
              const meta = APPS.find((app) => app.id === win.id)
              return {
                kind: 'item' as const,
                label: `${meta?.name ?? win.id}${win.minimized ? '  (minimized)' : ''}`,
                checked: state.focused === win.id,
                run: () => commands.focusWindow(win.id),
              }
            }),
          ]
        : []),
    ],
  }

  const help: Menu = {
    id: 'help',
    label: 'Help',
    items: [
      { kind: 'item', label: 'Keyboard Shortcuts', shortcut: '?', run: commands.openShortcuts },
      { kind: 'item', label: 'About This Site', run: () => commands.openApp('writing', 'why-an-os') },
      sep,
      { kind: 'item', label: 'Source on GitHub', run: () => window.open('https://github.com/MikailR/GUI', '_blank', 'noopener') },
    ],
  }

  return [mark, app, file, view, windowMenu, help]
}
