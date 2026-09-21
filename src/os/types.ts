export type AppId = 'about' | 'hackathons' | 'writing' | 'lab' | 'papers' | 'trash' | 'settings'

export const APP_IDS: readonly AppId[] = ['about', 'hackathons', 'writing', 'lab', 'papers', 'trash', 'settings']

/** Which shell is rendering the app: macOS window or iOS full-screen. */
export type Shell = 'mac' | 'ios'

export type Appearance = 'auto' | 'light' | 'dark'
export type ResolvedAppearance = 'light' | 'dark'

export type WallpaperId = 'tahoe' | 'sequoia' | 'sonoma' | 'graphite'

export type AccentId = 'blue' | 'purple' | 'pink' | 'red' | 'orange' | 'yellow' | 'green' | 'graphite'

export interface Settings {
  appearance: Appearance
  wallpaper: WallpaperId
  accent: AccentId
  reduceTransparency: boolean
  reduceMotion: boolean
  liveWallpaper: boolean
  dockMagnification: boolean
}

export interface TrashItem {
  id: string
  name: string
  kind: 'design' | 'folder' | 'code' | 'doc' | 'app' | 'image'
  size: string
  deleted: string
  note?: string
}

export interface Rect {
  x: number
  y: number
  w: number
  h: number
}

export interface WindowState extends Rect {
  id: AppId
  z: number
  minimized: boolean
  zoomed: boolean
  /** Rect to restore after un-zooming. */
  restoreRect?: Rect
  route: string
}

export interface Toast {
  id: number
  appId?: AppId
  title: string
  body?: string
  action?: { label: string; actionId: 'undo-trash' }
}

export type Overlay = 'none' | 'spotlight' | 'control-center' | 'about-mac' | 'shortcuts'

export interface OsState {
  settings: Settings
  windows: WindowState[]
  focused: AppId | null
  nextZ: number
  trash: TrashItem[]
  /** Last emptied/deleted batch, for Undo. */
  trashUndo: TrashItem[] | null
  toasts: Toast[]
  overlay: Overlay
  /** Increments each time an app is launched so the Dock can bounce it. */
  launchTick: Partial<Record<AppId, number>>
}
