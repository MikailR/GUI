import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from 'react'
import type { AppId, Rect, Theme, Toast, TrashItem, WallpaperKind, Win } from './types'
import { APPS } from './apps'
import { TRASH_ITEMS } from '../content/data'

export interface OSState {
  windows: Win[]
  nextZ: number
  theme: Theme
  wallpaper: WallpaperKind
  reduceMotion: boolean
  toasts: Toast[]
  spotlight: boolean
  trash: TrashItem[]
  bootKey: number
  asleep: boolean
}

type Action =
  | { type: 'OPEN'; app: AppId; payload?: unknown; rect: Rect }
  | { type: 'CLOSE'; id: string }
  | { type: 'REMOVE'; id: string }
  | { type: 'FOCUS'; id: string }
  | { type: 'MOVE'; id: string; x: number; y: number }
  | { type: 'RESIZE'; id: string; rect: Rect }
  | { type: 'MINIMIZE'; id: string }
  | { type: 'MINIMIZED'; id: string }
  | { type: 'RESTORE'; id: string }
  | { type: 'OPENED'; id: string }
  | { type: 'TOGGLE_MAX'; id: string; full: Rect }
  | { type: 'MINIMIZE_ALL' }
  | { type: 'CLOSE_ALL' }
  | { type: 'SET_THEME'; theme: Theme }
  | { type: 'SET_WALLPAPER'; wallpaper: WallpaperKind }
  | { type: 'SET_MOTION'; reduce: boolean }
  | { type: 'TOAST'; toast: Toast }
  | { type: 'UNTOAST'; id: number }
  | { type: 'SPOTLIGHT'; open: boolean }
  | { type: 'TRASH_RESTORE'; id: string }
  | { type: 'TRASH_EMPTY' }
  | { type: 'REBOOT' }
  | { type: 'SLEEP'; asleep: boolean }

const initial: OSState = {
  windows: [],
  nextZ: 10,
  theme: (localStorage.getItem('mos:theme') as Theme) || 'dusk',
  wallpaper: (localStorage.getItem('mos:wallpaper') as WallpaperKind) || 'aurora',
  reduceMotion: localStorage.getItem('mos:motion') === 'reduce',
  toasts: [],
  spotlight: false,
  trash: TRASH_ITEMS,
  bootKey: 0,
  asleep: false,
}

function reducer(s: OSState, a: Action): OSState {
  switch (a.type) {
    case 'OPEN': {
      const existing = s.windows.find((w) => w.app === a.app)
      if (existing) {
        return {
          ...s,
          nextZ: s.nextZ + 1,
          windows: s.windows.map((w) =>
            w.id === existing.id
              ? {
                  ...w,
                  z: s.nextZ,
                  minimized: false,
                  phase: w.minimized ? 'opening' : w.phase === 'closing' ? 'opening' : w.phase,
                  payload: a.payload ?? w.payload,
                }
              : w,
          ),
        }
      }
      const win: Win = {
        id: `${a.app}-${Date.now().toString(36)}`,
        app: a.app,
        z: s.nextZ,
        rect: a.rect,
        minimized: false,
        maximized: false,
        phase: 'opening',
        payload: a.payload,
        openedAt: Date.now(),
      }
      return { ...s, nextZ: s.nextZ + 1, windows: [...s.windows, win] }
    }
    case 'CLOSE':
      return { ...s, windows: s.windows.map((w) => (w.id === a.id ? { ...w, phase: 'closing' } : w)) }
    case 'REMOVE':
      return { ...s, windows: s.windows.filter((w) => w.id !== a.id) }
    case 'FOCUS': {
      const top = topWindow(s.windows)
      if (top?.id === a.id) return s
      return { ...s, nextZ: s.nextZ + 1, windows: s.windows.map((w) => (w.id === a.id ? { ...w, z: s.nextZ } : w)) }
    }
    case 'MOVE':
      return { ...s, windows: s.windows.map((w) => (w.id === a.id ? { ...w, rect: { ...w.rect, x: a.x, y: a.y } } : w)) }
    case 'RESIZE':
      return { ...s, windows: s.windows.map((w) => (w.id === a.id ? { ...w, rect: a.rect } : w)) }
    case 'MINIMIZE':
      return { ...s, windows: s.windows.map((w) => (w.id === a.id ? { ...w, phase: 'minimizing' } : w)) }
    case 'MINIMIZED':
      return { ...s, windows: s.windows.map((w) => (w.id === a.id ? { ...w, minimized: true, phase: 'open' } : w)) }
    case 'RESTORE':
      return {
        ...s,
        nextZ: s.nextZ + 1,
        windows: s.windows.map((w) => (w.id === a.id ? { ...w, minimized: false, phase: 'opening', z: s.nextZ } : w)),
      }
    case 'OPENED':
      return { ...s, windows: s.windows.map((w) => (w.id === a.id && w.phase === 'opening' ? { ...w, phase: 'open' } : w)) }
    case 'TOGGLE_MAX':
      return {
        ...s,
        windows: s.windows.map((w) => {
          if (w.id !== a.id) return w
          if (w.maximized) return { ...w, maximized: false, rect: w.prevRect ?? w.rect, prevRect: undefined }
          return { ...w, maximized: true, prevRect: w.rect, rect: a.full }
        }),
      }
    case 'MINIMIZE_ALL':
      return { ...s, windows: s.windows.map((w) => (w.minimized ? w : { ...w, phase: 'minimizing' })) }
    case 'CLOSE_ALL':
      return { ...s, windows: [] }
    case 'SET_THEME':
      return { ...s, theme: a.theme }
    case 'SET_WALLPAPER':
      return { ...s, wallpaper: a.wallpaper }
    case 'SET_MOTION':
      return { ...s, reduceMotion: a.reduce }
    case 'TOAST':
      return { ...s, toasts: [...s.toasts.slice(-3), a.toast] }
    case 'UNTOAST':
      return { ...s, toasts: s.toasts.filter((t) => t.id !== a.id) }
    case 'SPOTLIGHT':
      return { ...s, spotlight: a.open }
    case 'TRASH_RESTORE':
      return { ...s, trash: s.trash.filter((t) => t.id !== a.id) }
    case 'TRASH_EMPTY':
      return { ...s, trash: [] }
    case 'REBOOT':
      return { ...initial, theme: s.theme, wallpaper: s.wallpaper, reduceMotion: s.reduceMotion, trash: s.trash, bootKey: s.bootKey + 1 }
    case 'SLEEP':
      return { ...s, asleep: a.asleep }
  }
}

export function topWindow(windows: Win[]): Win | undefined {
  let top: Win | undefined
  for (const w of windows) {
    if (w.minimized || w.phase === 'closing' || w.phase === 'minimizing') continue
    if (!top || w.z > top.z) top = w
  }
  return top
}

let toastSeq = 1

export interface OSApi {
  state: OSState
  focused: Win | undefined
  open: (app: AppId, payload?: unknown) => void
  close: (id: string) => void
  remove: (id: string) => void
  focus: (id: string) => void
  move: (id: string, x: number, y: number) => void
  resize: (id: string, rect: Rect) => void
  minimize: (id: string) => void
  minimized: (id: string) => void
  restore: (id: string) => void
  opened: (id: string) => void
  toggleMax: (id: string) => void
  minimizeAll: () => void
  closeAll: () => void
  cycleFocus: (dir?: 1 | -1) => void
  setTheme: (t: Theme) => void
  setWallpaper: (w: WallpaperKind) => void
  setMotion: (reduce: boolean) => void
  toast: (title: string, body?: string, icon?: AppId) => void
  untoast: (id: number) => void
  setSpotlight: (open: boolean) => void
  trashRestore: (id: string) => void
  trashEmpty: () => void
  reboot: () => void
  sleep: (asleep: boolean) => void
}

const Ctx = createContext<OSApi | null>(null)

export const MENUBAR_H = 28
export const DOCK_H = 84

function viewport() {
  return { vw: window.innerWidth, vh: window.innerHeight }
}

/** The rect a zoomed window fills: under the menu bar, above the dock. */
export function fullRect(): Rect {
  const { vw, vh } = viewport()
  return { x: 0, y: MENUBAR_H, w: vw, h: vh - MENUBAR_H - DOCK_H }
}

export function OSProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial)

  useEffect(() => {
    document.documentElement.dataset.theme = state.theme
    localStorage.setItem('mos:theme', state.theme)
    const meta = document.querySelector('meta[name=theme-color]')
    meta?.setAttribute('content', state.theme === 'dusk' ? '#0b0b12' : '#f4f1ea')
  }, [state.theme])
  useEffect(() => {
    localStorage.setItem('mos:wallpaper', state.wallpaper)
  }, [state.wallpaper])
  useEffect(() => {
    document.documentElement.dataset.motion = state.reduceMotion ? 'reduce' : 'full'
    localStorage.setItem('mos:motion', state.reduceMotion ? 'reduce' : 'full')
  }, [state.reduceMotion])

  // latest state readable from stable callbacks
  const stateRef = useRef(state)
  stateRef.current = state

  const open = useCallback((app: AppId, payload?: unknown) => {
    const def = APPS[app]
    const { vw, vh } = viewport()
    const w = Math.min(def.w, vw - 24)
    const h = Math.min(def.h, vh - MENUBAR_H - DOCK_H - 12)
    const n = stateRef.current.windows.filter((x) => !x.minimized).length % 7
    const x = Math.max(12, Math.round((vw - w) / 2 + (n - 2) * 34))
    const y = Math.max(MENUBAR_H + 8, Math.round((vh - DOCK_H - h) / 2 + n * 26))
    dispatch({ type: 'OPEN', app, payload, rect: { x, y, w, h } })
  }, [])

  const api = useMemo<OSApi>(() => {
    const focused = topWindow(state.windows)
    return {
      state,
      focused,
      open,
      close: (id) => dispatch({ type: 'CLOSE', id }),
      remove: (id) => dispatch({ type: 'REMOVE', id }),
      focus: (id) => dispatch({ type: 'FOCUS', id }),
      move: (id, x, y) => dispatch({ type: 'MOVE', id, x, y }),
      resize: (id, rect) => dispatch({ type: 'RESIZE', id, rect }),
      minimize: (id) => dispatch({ type: 'MINIMIZE', id }),
      minimized: (id) => dispatch({ type: 'MINIMIZED', id }),
      restore: (id) => dispatch({ type: 'RESTORE', id }),
      opened: (id) => dispatch({ type: 'OPENED', id }),
      toggleMax: (id) => dispatch({ type: 'TOGGLE_MAX', id, full: fullRect() }),
      minimizeAll: () => dispatch({ type: 'MINIMIZE_ALL' }),
      closeAll: () => dispatch({ type: 'CLOSE_ALL' }),
      cycleFocus: (dir = 1) => {
        const live = state.windows.filter((w) => !w.minimized && w.phase !== 'closing').sort((a, b) => a.z - b.z)
        if (live.length < 2) return
        // next = the lowest window (dir 1) — brings the back-most forward, like a stack rotate
        const next = dir === 1 ? live[0] : live[live.length - 2]
        dispatch({ type: 'FOCUS', id: next.id })
      },
      setTheme: (theme) => dispatch({ type: 'SET_THEME', theme }),
      setWallpaper: (wallpaper) => dispatch({ type: 'SET_WALLPAPER', wallpaper }),
      setMotion: (reduce) => dispatch({ type: 'SET_MOTION', reduce }),
      toast: (title, body, icon) => {
        const id = toastSeq++
        dispatch({ type: 'TOAST', toast: { id, title, body, icon } })
        window.setTimeout(() => dispatch({ type: 'UNTOAST', id }), 4200)
      },
      untoast: (id) => dispatch({ type: 'UNTOAST', id }),
      setSpotlight: (open) => dispatch({ type: 'SPOTLIGHT', open }),
      trashRestore: (id) => dispatch({ type: 'TRASH_RESTORE', id }),
      trashEmpty: () => dispatch({ type: 'TRASH_EMPTY' }),
      reboot: () => dispatch({ type: 'REBOOT' }),
      sleep: (asleep) => dispatch({ type: 'SLEEP', asleep }),
    }
  }, [state, open])

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export function useOS(): OSApi {
  const v = useContext(Ctx)
  if (!v) throw new Error('useOS outside OSProvider')
  return v
}
