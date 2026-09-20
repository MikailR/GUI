import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useSyncExternalStore,
  type Dispatch,
  type ReactNode,
} from 'react'
import { TRASH_ITEMS } from '../content/data'
import { APPS } from './apps'
import type { AppId, Settings, Toast, TrashItem, WindowRect, WindowState } from './types'

/* ------------------------------------------------------------------ state */

export interface OsState {
  windows: Record<string, WindowState>
  /** Currently focused window (front-most, not minimized) or null. */
  focused: AppId | null
  nextZ: number
  settings: Settings
  trash: TrashItem[]
  toasts: Toast[]
  spotlightOpen: boolean
}

const DEFAULT_SETTINGS: Settings = {
  appearance: 'auto',
  wallpaper: 'tahoe',
  tint: 'blue',
  reduceTransparency: false,
  reduceMotion: false,
  liveWallpaper: true,
}

const SETTINGS_KEY = 'mikail-os.liquid-glass.settings.v1'

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

function saveSettings(settings: Settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  } catch {
    /* private mode / quota: ignore */
  }
}

export function createInitialState(): OsState {
  return {
    windows: {},
    focused: null,
    nextZ: 1,
    settings: loadSettings(),
    trash: TRASH_ITEMS,
    toasts: [],
    spotlightOpen: false,
  }
}

/* ---------------------------------------------------------------- actions */

export type OsAction =
  | { type: 'OPEN_APP'; appId: AppId; route?: string | null; viewport: { w: number; h: number } }
  | { type: 'CLOSE'; appId: AppId }
  | { type: 'CLOSE_ALL' }
  | { type: 'FOCUS'; appId: AppId }
  | { type: 'MINIMIZE'; appId: AppId }
  | { type: 'RESTORE'; appId: AppId }
  | { type: 'TOGGLE_ZOOM'; appId: AppId; viewport: { w: number; h: number } }
  | { type: 'SET_RECT'; appId: AppId; rect: WindowRect }
  | { type: 'SET_ROUTE'; appId: AppId; route: string | null }
  | { type: 'CYCLE_FOCUS'; direction: 1 | -1 }
  | { type: 'TILE'; viewport: { w: number; h: number } }
  | { type: 'GATHER'; viewport: { w: number; h: number } }
  | { type: 'SET_SETTINGS'; patch: Partial<Settings> }
  | { type: 'TRASH_REMOVE'; id: string }
  | { type: 'TRASH_EMPTY' }
  | { type: 'TRASH_RESTORE_ALL' }
  | { type: 'TOAST_PUSH'; toast: Omit<Toast, 'id'> }
  | { type: 'TOAST_DISMISS'; id: number }
  | { type: 'SPOTLIGHT'; open: boolean }

let toastSeq = 1

/* ---------------------------------------------------------------- helpers */

const WORK_AREA_TOP = 30 // menu bar
const WORK_AREA_BOTTOM = 84 // dock

function workArea(viewport: { w: number; h: number }): WindowRect {
  return {
    x: 0,
    y: WORK_AREA_TOP,
    w: viewport.w,
    h: Math.max(200, viewport.h - WORK_AREA_TOP - WORK_AREA_BOTTOM),
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

/** Cascade new windows from the top-left of the work area so they never fully overlap. */
function placeNewWindow(appId: AppId, count: number, viewport: { w: number; h: number }): WindowRect {
  const area = workArea(viewport)
  const meta = APPS[appId]
  const w = Math.min(meta.defaultSize.w, area.w - 32)
  const h = Math.min(meta.defaultSize.h, area.h - 24)
  const offset = (count % 6) * 32
  const x = clamp(Math.round((area.w - w) / 2) + offset - 64, 12, area.w - w - 12)
  const y = clamp(area.y + Math.round((area.h - h) / 2) + offset - 48, area.y + 8, area.y + area.h - h - 8)
  return { x, y, w, h }
}

function topWindow(windows: Record<string, WindowState>): WindowState | null {
  let best: WindowState | null = null
  for (const win of Object.values(windows)) {
    if (win.minimized) continue
    if (!best || win.z > best.z) best = win
  }
  return best
}

function visibleWindowsByZ(windows: Record<string, WindowState>): WindowState[] {
  return Object.values(windows)
    .filter((w) => !w.minimized)
    .sort((a, b) => a.z - b.z)
}

/* ---------------------------------------------------------------- reducer */

export function osReducer(state: OsState, action: OsAction): OsState {
  switch (action.type) {
    case 'OPEN_APP': {
      const existing = state.windows[action.appId]
      const z = state.nextZ
      if (existing) {
        const route = action.route === undefined ? existing.route : action.route
        return {
          ...state,
          focused: action.appId,
          nextZ: z + 1,
          spotlightOpen: false,
          windows: {
            ...state.windows,
            [action.appId]: {
              ...existing,
              z,
              minimized: false,
              route,
              routeVersion: action.route === undefined ? existing.routeVersion : existing.routeVersion + 1,
            },
          },
        }
      }
      const count = Object.keys(state.windows).length
      const win: WindowState = {
        appId: action.appId,
        rect: placeNewWindow(action.appId, count, action.viewport),
        z,
        minimized: false,
        zoomed: false,
        restoreRect: null,
        route: action.route ?? null,
        routeVersion: 0,
      }
      return {
        ...state,
        focused: action.appId,
        nextZ: z + 1,
        spotlightOpen: false,
        windows: { ...state.windows, [action.appId]: win },
      }
    }

    case 'CLOSE': {
      if (!state.windows[action.appId]) return state
      const windows = { ...state.windows }
      delete windows[action.appId]
      const next = topWindow(windows)
      return { ...state, windows, focused: next ? next.appId : null }
    }

    case 'CLOSE_ALL':
      return { ...state, windows: {}, focused: null }

    case 'FOCUS': {
      const win = state.windows[action.appId]
      if (!win) return state
      if (state.focused === action.appId && !win.minimized) return state
      const z = state.nextZ
      return {
        ...state,
        focused: action.appId,
        nextZ: z + 1,
        windows: { ...state.windows, [action.appId]: { ...win, z, minimized: false } },
      }
    }

    case 'MINIMIZE': {
      const win = state.windows[action.appId]
      if (!win || win.minimized) return state
      const windows = { ...state.windows, [action.appId]: { ...win, minimized: true } }
      const next = topWindow(windows)
      return { ...state, windows, focused: next ? next.appId : null }
    }

    case 'RESTORE': {
      const win = state.windows[action.appId]
      if (!win) return state
      const z = state.nextZ
      return {
        ...state,
        focused: action.appId,
        nextZ: z + 1,
        windows: { ...state.windows, [action.appId]: { ...win, minimized: false, z } },
      }
    }

    case 'TOGGLE_ZOOM': {
      const win = state.windows[action.appId]
      if (!win) return state
      if (win.zoomed) {
        return {
          ...state,
          windows: {
            ...state.windows,
            [action.appId]: {
              ...win,
              zoomed: false,
              rect: win.restoreRect ?? win.rect,
              restoreRect: null,
            },
          },
        }
      }
      const area = workArea(action.viewport)
      const inset = 10
      return {
        ...state,
        windows: {
          ...state.windows,
          [action.appId]: {
            ...win,
            zoomed: true,
            restoreRect: win.rect,
            rect: { x: inset, y: area.y + inset, w: area.w - inset * 2, h: area.h - inset * 2 },
          },
        },
      }
    }

    case 'SET_RECT': {
      const win = state.windows[action.appId]
      if (!win) return state
      return {
        ...state,
        windows: { ...state.windows, [action.appId]: { ...win, rect: action.rect, zoomed: false, restoreRect: null } },
      }
    }

    case 'SET_ROUTE': {
      const win = state.windows[action.appId]
      if (!win || win.route === action.route) return state
      return { ...state, windows: { ...state.windows, [action.appId]: { ...win, route: action.route } } }
    }

    case 'CYCLE_FOCUS': {
      const ordered = visibleWindowsByZ(state.windows)
      if (ordered.length < 2) return state
      // direction 1: bring the back-most forward. direction -1: send front-most to back.
      const target = action.direction === 1 ? ordered[0] : ordered[ordered.length - 2]
      const z = state.nextZ
      return {
        ...state,
        focused: target.appId,
        nextZ: z + 1,
        windows: { ...state.windows, [target.appId]: { ...target, z } },
      }
    }

    case 'TILE': {
      const ordered = visibleWindowsByZ(state.windows)
      if (ordered.length === 0) return state
      const area = workArea(action.viewport)
      const gap = 12
      const cols = ordered.length === 1 ? 1 : ordered.length <= 4 ? 2 : 3
      const rows = Math.ceil(ordered.length / cols)
      const cellW = (area.w - gap * (cols + 1)) / cols
      const cellH = (area.h - gap * (rows + 1)) / rows
      const windows = { ...state.windows }
      ordered.forEach((win, i) => {
        const col = i % cols
        const row = Math.floor(i / cols)
        windows[win.appId] = {
          ...win,
          zoomed: false,
          restoreRect: null,
          rect: {
            x: Math.round(gap + col * (cellW + gap)),
            y: Math.round(area.y + gap + row * (cellH + gap)),
            w: Math.round(cellW),
            h: Math.round(cellH),
          },
        }
      })
      return { ...state, windows }
    }

    case 'GATHER': {
      const windows = { ...state.windows }
      let i = 0
      for (const win of Object.values(state.windows)) {
        windows[win.appId] = {
          ...win,
          zoomed: false,
          restoreRect: null,
          rect: {
            ...placeNewWindow(win.appId, i, action.viewport),
            w: win.rect.w,
            h: win.rect.h,
          },
        }
        i += 1
      }
      return { ...state, windows }
    }

    case 'SET_SETTINGS': {
      const settings = { ...state.settings, ...action.patch }
      saveSettings(settings)
      return { ...state, settings }
    }

    case 'TRASH_REMOVE':
      return { ...state, trash: state.trash.filter((t) => t.id !== action.id) }

    case 'TRASH_EMPTY':
      return { ...state, trash: [] }

    case 'TRASH_RESTORE_ALL':
      return { ...state, trash: TRASH_ITEMS }

    case 'TOAST_PUSH': {
      const toast: Toast = { ...action.toast, id: toastSeq++ }
      return { ...state, toasts: [...state.toasts.slice(-3), toast] }
    }

    case 'TOAST_DISMISS':
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.id) }

    case 'SPOTLIGHT':
      return { ...state, spotlightOpen: action.open }

    default: {
      const exhaustive: never = action
      return exhaustive
    }
  }
}

/* ---------------------------------------------------------------- context */

interface OsContextValue {
  state: OsState
  dispatch: Dispatch<OsAction>
}

const OsContext = createContext<OsContextValue | null>(null)

export function OsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(osReducer, undefined, createInitialState)
  const value = useMemo(() => ({ state, dispatch }), [state])

  // Reflect settings onto <html> so CSS tokens can respond.
  useEffect(() => {
    const root = document.documentElement
    const { appearance, reduceTransparency, reduceMotion, tint } = state.settings
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => {
      const resolved = appearance === 'auto' ? (media.matches ? 'dark' : 'light') : appearance
      root.dataset.appearance = resolved
    }
    apply()
    root.dataset.transparency = reduceTransparency ? 'reduced' : 'full'
    root.dataset.motion = reduceMotion ? 'reduced' : 'full'
    root.dataset.tint = tint
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [state.settings])

  return <OsContext.Provider value={value}>{children}</OsContext.Provider>
}

export function useOs(): OsContextValue {
  const ctx = useContext(OsContext)
  if (!ctx) throw new Error('useOs must be used inside <OsProvider>')
  return ctx
}

const DARK_QUERY = '(prefers-color-scheme: dark)'
function subscribeDark(callback: () => void) {
  const media = window.matchMedia(DARK_QUERY)
  media.addEventListener('change', callback)
  return () => media.removeEventListener('change', callback)
}
const getSystemDark = () => window.matchMedia(DARK_QUERY).matches

/** Resolved appearance ("light" | "dark"), live-updating when the system scheme flips under "auto". */
export function useResolvedAppearance(): 'light' | 'dark' {
  const { state } = useOs()
  const systemDark = useSyncExternalStore(subscribeDark, getSystemDark, () => false)
  const pref = state.settings.appearance
  return pref === 'auto' ? (systemDark ? 'dark' : 'light') : pref
}

/** Stable helpers bound to the dispatcher for the common cross-app actions. */
export function useOsActions() {
  const { dispatch } = useOs()
  const viewport = () => ({ w: window.innerWidth, h: window.innerHeight })

  const openApp = useCallback(
    (appId: AppId, route?: string | null) => dispatch({ type: 'OPEN_APP', appId, route, viewport: viewport() }),
    [dispatch],
  )
  const closeApp = useCallback((appId: AppId) => dispatch({ type: 'CLOSE', appId }), [dispatch])
  const focusApp = useCallback((appId: AppId) => dispatch({ type: 'FOCUS', appId }), [dispatch])
  const minimizeApp = useCallback((appId: AppId) => dispatch({ type: 'MINIMIZE', appId }), [dispatch])
  const toggleZoom = useCallback(
    (appId: AppId) => dispatch({ type: 'TOGGLE_ZOOM', appId, viewport: viewport() }),
    [dispatch],
  )
  const setSettings = useCallback((patch: Partial<Settings>) => dispatch({ type: 'SET_SETTINGS', patch }), [dispatch])
  const toast = useCallback((toast: Omit<Toast, 'id'>) => dispatch({ type: 'TOAST_PUSH', toast }), [dispatch])

  return { openApp, closeApp, focusApp, minimizeApp, toggleZoom, setSettings, toast }
}
