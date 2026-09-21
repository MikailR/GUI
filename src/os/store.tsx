import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import { TRASH_ITEMS } from '../content/data'
import { appMeta } from './apps'
import type { AppId, OsState, Overlay, Rect, Settings, Toast, TrashItem, WindowState } from './types'

/* -------------------------------------------------------------- Settings */

const SETTINGS_KEY = 'mikail-os-v2.settings'

const DEFAULT_SETTINGS: Settings = {
  appearance: 'auto',
  wallpaper: 'tahoe',
  accent: 'blue',
  reduceTransparency: false,
  reduceMotion: false,
  liveWallpaper: true,
  dockMagnification: true,
}

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return DEFAULT_SETTINGS
    const parsed = JSON.parse(raw) as Partial<Settings>
    return { ...DEFAULT_SETTINGS, ...parsed }
  } catch {
    return DEFAULT_SETTINGS
  }
}

/* --------------------------------------------------------------- Actions */

export type Action =
  | { type: 'open'; appId: AppId; route?: string; viewport: { w: number; h: number } }
  | { type: 'close'; appId: AppId }
  | { type: 'focus'; appId: AppId }
  | { type: 'minimize'; appId: AppId }
  | { type: 'restore'; appId: AppId }
  | { type: 'zoom'; appId: AppId; viewport: { w: number; h: number } }
  | { type: 'setRect'; appId: AppId; rect: Rect }
  | { type: 'setRoute'; appId: AppId; route: string }
  | { type: 'tile'; viewport: { w: number; h: number } }
  | { type: 'gather'; viewport: { w: number; h: number } }
  | { type: 'showDesktop' }
  | { type: 'closeAll' }
  | { type: 'settings'; patch: Partial<Settings> }
  | { type: 'trashDelete'; ids: string[] }
  | { type: 'trashEmpty' }
  | { type: 'trashUndo' }
  | { type: 'toast'; toast: Omit<Toast, 'id'> }
  | { type: 'dismissToast'; id: number }
  | { type: 'overlay'; overlay: Overlay }

const MENU_BAR = 28
const DOCK_RESERVE = 96

let toastSeq = 1

function placeWindow(state: OsState, appId: AppId, viewport: { w: number; h: number }): Rect {
  const meta = appMeta(appId)
  const w = Math.min(meta.size.w, viewport.w - 32)
  const h = Math.min(meta.size.h, viewport.h - MENU_BAR - DOCK_RESERVE)
  const openCount = state.windows.filter((win) => !win.minimized).length
  // Cascade new windows down-right so stacked windows stay distinguishable.
  const offset = (openCount % 5) * 40
  const x = Math.max(16, Math.min(viewport.w - w - 16, Math.round((viewport.w - w) / 2 + offset - 80)))
  const y = Math.max(MENU_BAR + 12, Math.min(viewport.h - DOCK_RESERVE - h, Math.round((viewport.h - DOCK_RESERVE - h) / 2 + offset - 40)))
  return { x, y, w, h }
}

function bringToFront(state: OsState, appId: AppId): OsState {
  const z = state.nextZ
  return {
    ...state,
    focused: appId,
    nextZ: z + 1,
    windows: state.windows.map((win) => (win.id === appId ? { ...win, z, minimized: false } : win)),
  }
}

function topVisible(windows: WindowState[]): AppId | null {
  const visible = windows.filter((win) => !win.minimized)
  if (visible.length === 0) return null
  return visible.reduce((best, win) => (win.z > best.z ? win : best)).id
}

function reducer(state: OsState, action: Action): OsState {
  switch (action.type) {
    case 'open': {
      const existing = state.windows.find((win) => win.id === action.appId)
      if (existing) {
        const next = bringToFront(state, action.appId)
        if (action.route !== undefined) {
          next.windows = next.windows.map((win) =>
            win.id === action.appId ? { ...win, route: action.route ?? win.route } : win,
          )
        }
        return next
      }
      const rect = placeWindow(state, action.appId, action.viewport)
      const win: WindowState = {
        id: action.appId,
        ...rect,
        z: state.nextZ,
        minimized: false,
        zoomed: false,
        route: action.route ?? '',
      }
      return {
        ...state,
        windows: [...state.windows, win],
        focused: action.appId,
        nextZ: state.nextZ + 1,
        launchTick: { ...state.launchTick, [action.appId]: (state.launchTick[action.appId] ?? 0) + 1 },
      }
    }
    case 'close': {
      const windows = state.windows.filter((win) => win.id !== action.appId)
      return { ...state, windows, focused: state.focused === action.appId ? topVisible(windows) : state.focused }
    }
    case 'focus': {
      if (!state.windows.some((win) => win.id === action.appId)) return state
      return bringToFront(state, action.appId)
    }
    case 'minimize': {
      const windows = state.windows.map((win) => (win.id === action.appId ? { ...win, minimized: true } : win))
      return { ...state, windows, focused: topVisible(windows) }
    }
    case 'restore':
      return bringToFront(state, action.appId)
    case 'zoom': {
      const windows = state.windows.map((win): WindowState => {
        if (win.id !== action.appId) return win
        if (win.zoomed && win.restoreRect) {
          return { ...win, ...win.restoreRect, zoomed: false, restoreRect: undefined }
        }
        const rect: Rect = {
          x: 12,
          y: MENU_BAR + 8,
          w: action.viewport.w - 24,
          h: action.viewport.h - MENU_BAR - DOCK_RESERVE + 4,
        }
        return { ...win, ...rect, zoomed: true, restoreRect: { x: win.x, y: win.y, w: win.w, h: win.h } }
      })
      return bringToFront({ ...state, windows }, action.appId)
    }
    case 'setRect':
      return {
        ...state,
        windows: state.windows.map((win) =>
          win.id === action.appId ? { ...win, ...action.rect, zoomed: false, restoreRect: undefined } : win,
        ),
      }
    case 'setRoute':
      return {
        ...state,
        windows: state.windows.map((win) => (win.id === action.appId ? { ...win, route: action.route } : win)),
      }
    case 'tile': {
      const visible = state.windows.filter((win) => !win.minimized)
      if (visible.length === 0) return state
      const cols = Math.ceil(Math.sqrt(visible.length))
      const rows = Math.ceil(visible.length / cols)
      const gap = 12
      const areaW = action.viewport.w - gap * (cols + 1)
      const areaH = action.viewport.h - MENU_BAR - DOCK_RESERVE - gap * (rows + 1) + 8
      const cellW = Math.floor(areaW / cols)
      const cellH = Math.floor(areaH / rows)
      const ordered = [...visible].sort((a, b) => a.z - b.z)
      const rects = new Map<AppId, Rect>()
      ordered.forEach((win, index) => {
        const col = index % cols
        const row = Math.floor(index / cols)
        rects.set(win.id, {
          x: gap + col * (cellW + gap),
          y: MENU_BAR + gap + row * (cellH + gap),
          w: cellW,
          h: cellH,
        })
      })
      return {
        ...state,
        windows: state.windows.map((win) => {
          const rect = rects.get(win.id)
          return rect ? { ...win, ...rect, zoomed: false, restoreRect: undefined } : win
        }),
      }
    }
    case 'gather': {
      let index = 0
      return {
        ...state,
        windows: state.windows.map((win) => {
          if (win.minimized) return win
          const meta = appMeta(win.id)
          const w = Math.min(meta.size.w, action.viewport.w - 32)
          const h = Math.min(meta.size.h, action.viewport.h - MENU_BAR - DOCK_RESERVE)
          const offset = index * 28
          index += 1
          return {
            ...win,
            x: Math.max(16, Math.round((action.viewport.w - w) / 2 + offset - 40)),
            y: Math.max(MENU_BAR + 12, Math.round((action.viewport.h - DOCK_RESERVE - h) / 2 + offset - 20)),
            w,
            h,
            zoomed: false,
            restoreRect: undefined,
          }
        }),
      }
    }
    case 'showDesktop':
      return { ...state, windows: state.windows.map((win) => ({ ...win, minimized: true })), focused: null }
    case 'closeAll':
      return { ...state, windows: [], focused: null }
    case 'settings':
      return { ...state, settings: { ...state.settings, ...action.patch } }
    case 'trashDelete': {
      const removed = state.trash.filter((item) => action.ids.includes(item.id))
      if (removed.length === 0) return state
      return {
        ...state,
        trash: state.trash.filter((item) => !action.ids.includes(item.id)),
        trashUndo: removed,
      }
    }
    case 'trashEmpty':
      if (state.trash.length === 0) return state
      return { ...state, trash: [], trashUndo: state.trash }
    case 'trashUndo': {
      if (!state.trashUndo) return state
      const restored = [...state.trash, ...state.trashUndo]
      const order = new Map(TRASH_ITEMS.map((item, index) => [item.id, index]))
      restored.sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0))
      return { ...state, trash: restored, trashUndo: null }
    }
    case 'toast': {
      const toast: Toast = { id: toastSeq++, ...action.toast }
      return { ...state, toasts: [...state.toasts.slice(-2), toast] }
    }
    case 'dismissToast':
      return { ...state, toasts: state.toasts.filter((toast) => toast.id !== action.id) }
    case 'overlay':
      return { ...state, overlay: action.overlay }
    default: {
      const exhaustive: never = action
      return exhaustive
    }
  }
}

/* --------------------------------------------------------------- Context */

interface StoreValue {
  state: OsState
  dispatch: (action: Action) => void
}

const StoreContext = createContext<StoreValue | null>(null)

function initialState(): OsState {
  return {
    settings: loadSettings(),
    windows: [],
    focused: null,
    nextZ: 10,
    trash: TRASH_ITEMS,
    trashUndo: null,
    toasts: [],
    overlay: 'none',
    launchTick: {},
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState)

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings))
    } catch {
      /* private mode etc. */
    }
  }, [state.settings])

  const value = useMemo(() => ({ state, dispatch }), [state])
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): StoreValue {
  const value = useContext(StoreContext)
  if (!value) throw new Error('useStore must be used inside <StoreProvider>')
  return value
}

export function useSettings(): Settings {
  return useStore().state.settings
}

export function useTrash(): { items: TrashItem[]; canUndo: boolean } {
  const { state } = useStore()
  return { items: state.trash, canUndo: state.trashUndo !== null }
}
