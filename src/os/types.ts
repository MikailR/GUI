/** Identifiers for every app in the OS. Single-instance: one window per app. */
export type AppId = 'about' | 'work' | 'writing' | 'lab' | 'papers' | 'trash' | 'settings'

export const APP_IDS: readonly AppId[] = ['about', 'work', 'writing', 'lab', 'papers', 'trash', 'settings']

export type WallpaperId = 'tahoe' | 'dawn' | 'graphite' | 'solar'
export type Appearance = 'auto' | 'light' | 'dark'
export type TintId = 'blue' | 'purple' | 'pink' | 'orange' | 'green' | 'graphite'

export interface Settings {
  appearance: Appearance
  wallpaper: WallpaperId
  tint: TintId
  reduceTransparency: boolean
  reduceMotion: boolean
  /** Desktop only: animate the wallpaper. */
  liveWallpaper: boolean
}

export interface WindowRect {
  x: number
  y: number
  w: number
  h: number
}

export interface WindowState {
  appId: AppId
  rect: WindowRect
  /** Stacking order; higher is in front. */
  z: number
  minimized: boolean
  zoomed: boolean
  /** Rect to return to when un-zooming. */
  restoreRect: WindowRect | null
  /** Optional in-app deep link (post slug, experiment id, …). */
  route: string | null
  /** Incremented whenever the app is asked to navigate, so identical routes re-trigger. */
  routeVersion: number
}

export interface TrashItem {
  id: string
  name: string
  kind: 'image' | 'folder' | 'code' | 'doc' | 'app' | 'design'
  size: string
  deleted: string
  note?: string
}

export interface Toast {
  id: number
  title: string
  body?: string
  /** Optional action rendered as a pill button. */
  action?: { label: string; actionId: 'restore-trash' }
}

/** Props every content app receives regardless of shell (desktop window or phone screen). */
export interface AppScreenProps {
  /** 'desktop' renders inside a resizable window; 'phone' is a full-screen iOS view. */
  shell: 'desktop' | 'phone'
  route: string | null
  routeVersion: number
  /** Ask the shell to change this app's deep link (keeps Spotlight + history in sync). */
  onRoute: (route: string | null) => void
  /** Open another app (e.g. Trash → Settings). */
  openApp: (appId: AppId, route?: string) => void
}
