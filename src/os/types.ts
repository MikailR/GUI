export type AppId =
  | 'about'
  | 'hackathons'
  | 'writing'
  | 'lab'
  | 'papers'
  | 'trash'
  | 'terminal'
  | 'settings'
  | 'readme'
  | 'sysinfo'

export type Rect = { x: number; y: number; w: number; h: number }

export type WinPhase = 'opening' | 'open' | 'closing' | 'minimizing'

export interface Win {
  id: string
  app: AppId
  z: number
  rect: Rect
  prevRect?: Rect
  minimized: boolean
  maximized: boolean
  phase: WinPhase
  payload?: unknown
  openedAt: number
}

export interface Toast {
  id: number
  title: string
  body?: string
  icon?: AppId
}

export type Theme = 'dusk' | 'dawn'
export type WallpaperKind = 'aurora' | 'horizon' | 'mono'

export interface TrashItem {
  id: string
  name: string
  kind: 'doc' | 'folder' | 'image' | 'code' | 'app'
  size: string
  deleted: string
  note?: string
}
