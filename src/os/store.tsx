import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import { APPS, APP_BY_ID, type AppId } from '../apps/registry'
import { trashSeed, type TrashItem } from '../data/content'

export interface Win {
  id: AppId
  x: number
  y: number
  w: number
  h: number
  z: number
  min: boolean
  max: boolean
}

export type Wallpaper = 'dusk' | 'night' | 'dawn'
export interface Settings {
  wallpaper: Wallpaper
  motion: boolean
}

export interface State {
  wins: Win[]
  z: number
  focus: AppId | null
  settings: Settings
  trash: TrashItem[]
  /** mobile: sheets hidden, home screen visible */
  home: boolean
  launcher: boolean
  help: boolean
  switcher: boolean
  menu: string | null
}

type Action =
  | { type: 'open'; id: AppId }
  | { type: 'close'; id: AppId }
  | { type: 'closeAll' }
  | { type: 'focus'; id: AppId }
  | { type: 'minimize'; id: AppId }
  | { type: 'toggleMax'; id: AppId }
  | { type: 'move'; id: AppId; x: number; y: number }
  | { type: 'resize'; id: AppId; w: number; h: number }
  | { type: 'cycle'; dir: 1 | -1 }
  | { type: 'tile' }
  | { type: 'resetLayout' }
  | { type: 'settings'; patch: Partial<Settings> }
  | { type: 'trashRestore'; id: string }
  | { type: 'trashEmpty' }
  | { type: 'home'; value: boolean }
  | { type: 'launcher'; value: boolean }
  | { type: 'help'; value: boolean }
  | { type: 'switcher'; value: boolean }
  | { type: 'menu'; value: string | null }

const STORAGE = 'mikail-os:v1'
export const MENUBAR_H = 30
export const DOCK_H = 92

function viewport() {
  return { w: window.innerWidth, h: window.innerHeight }
}

function clampWin(w: Win): Win {
  const vp = viewport()
  const meta = APP_BY_ID[w.id]
  const width = Math.max(meta.min[0], Math.min(w.w, vp.w - 16))
  const height = Math.max(meta.min[1], Math.min(w.h, vp.h - MENUBAR_H - DOCK_H))
  const x = Math.max(-width + 120, Math.min(w.x, vp.w - 120))
  const y = Math.max(MENUBAR_H, Math.min(w.y, vp.h - DOCK_H - 40))
  return { ...w, x, y, w: width, h: height }
}

function place(id: AppId, n: number): Win {
  const meta = APP_BY_ID[id]
  const vp = viewport()
  const w = Math.min(meta.size[0], vp.w - 32)
  const h = Math.min(meta.size[1], vp.h - MENUBAR_H - DOCK_H - 16)
  const baseX = Math.max(24, (vp.w - w) / 2 - 120)
  const baseY = MENUBAR_H + 36
  return clampWin({ id, x: baseX + (n % 6) * 38, y: baseY + (n % 6) * 30, w, h, z: 0, min: false, max: false })
}

function topWin(wins: Win[]) {
  return wins.filter((w) => !w.min).sort((a, b) => b.z - a.z)[0] ?? null
}

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'open': {
      const existing = s.wins.find((w) => w.id === a.id)
      const z = s.z + 1
      if (existing) {
        return {
          ...s,
          z,
          focus: a.id,
          home: false,
          wins: s.wins.map((w) => (w.id === a.id ? { ...w, z, min: false } : w)),
        }
      }
      const win = { ...place(a.id, s.wins.length), z }
      return { ...s, z, focus: a.id, home: false, wins: [...s.wins, win] }
    }
    case 'close': {
      const wins = s.wins.filter((w) => w.id !== a.id)
      return { ...s, wins, focus: s.focus === a.id ? topWin(wins)?.id ?? null : s.focus }
    }
    case 'closeAll':
      return { ...s, wins: [], focus: null }
    case 'focus': {
      if (s.focus === a.id && !s.wins.find((w) => w.id === a.id)?.min) return s
      const z = s.z + 1
      return { ...s, z, focus: a.id, home: false, wins: s.wins.map((w) => (w.id === a.id ? { ...w, z, min: false } : w)) }
    }
    case 'minimize': {
      const wins = s.wins.map((w) => (w.id === a.id ? { ...w, min: true } : w))
      return { ...s, wins, focus: topWin(wins)?.id ?? null }
    }
    case 'toggleMax': {
      const z = s.z + 1
      return { ...s, z, focus: a.id, wins: s.wins.map((w) => (w.id === a.id ? { ...w, max: !w.max, min: false, z } : w)) }
    }
    case 'move':
      return { ...s, wins: s.wins.map((w) => (w.id === a.id ? { ...w, x: a.x, y: a.y } : w)) }
    case 'resize':
      return { ...s, wins: s.wins.map((w) => (w.id === a.id ? { ...w, w: a.w, h: a.h } : w)) }
    case 'cycle': {
      const order = [...s.wins].sort((x, y) => x.z - y.z)
      if (order.length < 2) return s
      // dir 1: bring the bottom-most window to the top; dir -1: send top to bottom
      const target = a.dir === 1 ? order[0] : order[order.length - 2]
      const z = s.z + 1
      return { ...s, z, focus: target.id, wins: s.wins.map((w) => (w.id === target.id ? { ...w, z, min: false } : w)) }
    }
    case 'tile': {
      const vp = viewport()
      const open = [...s.wins].filter((w) => !w.min).sort((x, y) => x.z - y.z)
      if (!open.length) return s
      const cols = open.length === 1 ? 1 : open.length <= 4 ? 2 : 3
      const rows = Math.ceil(open.length / cols)
      const gap = 10
      const areaW = vp.w - gap * (cols + 1)
      const areaH = vp.h - MENUBAR_H - DOCK_H - gap * (rows + 1)
      const cw = Math.floor(areaW / cols)
      const ch = Math.floor(areaH / rows)
      const laid = open.map((w, i) => ({
        ...w,
        max: false,
        x: gap + (i % cols) * (cw + gap),
        y: MENUBAR_H + gap + Math.floor(i / cols) * (ch + gap),
        w: cw,
        h: ch,
      }))
      return { ...s, wins: s.wins.map((w) => laid.find((l) => l.id === w.id) ?? w) }
    }
    case 'resetLayout': {
      const wins = s.wins.map((w, i) => ({ ...place(w.id, i), z: w.z }))
      return { ...s, wins }
    }
    case 'settings':
      return { ...s, settings: { ...s.settings, ...a.patch } }
    case 'trashRestore':
      return { ...s, trash: s.trash.filter((t) => t.id !== a.id) }
    case 'trashEmpty':
      return { ...s, trash: [] }
    case 'home':
      return { ...s, home: a.value, switcher: false }
    case 'launcher':
      return { ...s, launcher: a.value, help: false, menu: null }
    case 'help':
      return { ...s, help: a.value, launcher: false, menu: null }
    case 'switcher':
      return { ...s, switcher: a.value }
    case 'menu':
      return { ...s, menu: a.value }
  }
}

/** `#about,writing` opens those apps on load (shareable window links). */
function hashApps(): AppId[] {
  return location.hash
    .slice(1)
    .split(',')
    .filter((id): id is AppId => id in APP_BY_ID)
}

function withHash(s: State): State {
  const ids = hashApps()
  if (!ids.length) return s
  return ids.reduce((acc, id) => reducer(acc, { type: 'open', id }), s)
}

function load(mobile: boolean): State {
  return withHash(loadBase(mobile))
}

function loadBase(mobile: boolean): State {
  const base: State = {
    wins: [],
    z: 1,
    focus: null,
    settings: { wallpaper: 'dusk', motion: !window.matchMedia('(prefers-reduced-motion: reduce)').matches },
    trash: trashSeed,
    home: true,
    launcher: false,
    help: false,
    switcher: false,
    menu: null,
  }
  try {
    const raw = localStorage.getItem(STORAGE)
    if (raw) {
      const saved = JSON.parse(raw) as Partial<State>
      const wins = (saved.wins ?? []).filter((w) => APP_BY_ID[w.id]).map(clampWin)
      const z = Math.max(1, ...wins.map((w) => w.z))
      return {
        ...base,
        wins,
        z,
        focus: topWin(wins)?.id ?? null,
        settings: { ...base.settings, ...saved.settings },
        trash: saved.trash ?? base.trash,
        home: mobile,
      }
    }
  } catch {
    /* corrupt storage: fall through to defaults */
  }
  if (!mobile) {
    const about = { ...place('about', 0), z: 2 }
    return { ...base, wins: [about], z: 2, focus: 'about', home: false }
  }
  return base
}

interface OS {
  state: State
  mobile: boolean
  open: (id: AppId) => void
  close: (id: AppId) => void
  closeAll: () => void
  focus: (id: AppId) => void
  minimize: (id: AppId) => void
  toggleMax: (id: AppId) => void
  move: (id: AppId, x: number, y: number) => void
  resize: (id: AppId, w: number, h: number) => void
  cycle: (dir: 1 | -1) => void
  tile: () => void
  resetLayout: () => void
  setSettings: (patch: Partial<Settings>) => void
  trashRestore: (id: string) => void
  trashEmpty: () => void
  setHome: (v: boolean) => void
  setLauncher: (v: boolean) => void
  setHelp: (v: boolean) => void
  setSwitcher: (v: boolean) => void
  setMenu: (v: string | null) => void
}

const Ctx = createContext<OS | null>(null)

export function OSProvider({ children, mobile }: { children: ReactNode; mobile: boolean }) {
  const [state, dispatch] = useReducer(reducer, mobile, load)

  useEffect(() => {
    const { wins, settings, trash } = state
    localStorage.setItem(STORAGE, JSON.stringify({ wins, settings, trash }))
  }, [state.wins, state.settings, state.trash, state])

  useEffect(() => {
    document.documentElement.dataset.wallpaper = state.settings.wallpaper
    document.documentElement.dataset.motion = state.settings.motion ? 'on' : 'off'
  }, [state.settings])

  const api = useMemo<OS>(
    () => ({
      state,
      mobile,
      open: (id) => dispatch({ type: 'open', id }),
      close: (id) => dispatch({ type: 'close', id }),
      closeAll: () => dispatch({ type: 'closeAll' }),
      focus: (id) => dispatch({ type: 'focus', id }),
      minimize: (id) => dispatch({ type: 'minimize', id }),
      toggleMax: (id) => dispatch({ type: 'toggleMax', id }),
      move: (id, x, y) => dispatch({ type: 'move', id, x, y }),
      resize: (id, w, h) => dispatch({ type: 'resize', id, w, h }),
      cycle: (dir) => dispatch({ type: 'cycle', dir }),
      tile: () => dispatch({ type: 'tile' }),
      resetLayout: () => dispatch({ type: 'resetLayout' }),
      setSettings: (patch) => dispatch({ type: 'settings', patch }),
      trashRestore: (id) => dispatch({ type: 'trashRestore', id }),
      trashEmpty: () => dispatch({ type: 'trashEmpty' }),
      setHome: (value) => dispatch({ type: 'home', value }),
      setLauncher: (value) => dispatch({ type: 'launcher', value }),
      setHelp: (value) => dispatch({ type: 'help', value }),
      setSwitcher: (value) => dispatch({ type: 'switcher', value }),
      setMenu: (value) => dispatch({ type: 'menu', value }),
    }),
    [state, mobile],
  )

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export function useOS() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useOS outside provider')
  return v
}

export { APPS }
