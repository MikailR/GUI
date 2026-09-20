import type { AppId } from './types'

export interface AppMeta {
  id: AppId
  title: string
  /** Short line under the icon on the phone / in Spotlight. */
  subtitle: string
  defaultSize: { w: number; h: number }
  minSize: { w: number; h: number }
  /** Appears as a desktop icon. */
  onDesktop: boolean
  /** Appears in the macOS Dock. */
  inDock: boolean
  /** Appears in the iOS home grid (Trash lives in the grid; Settings too). */
  onHome: boolean
  /** Appears in the iOS dock. */
  inPhoneDock: boolean
  /** ⌘ + digit shortcut on the desktop. */
  shortcutDigit: number | null
}

export const APPS: Record<AppId, AppMeta> = {
  about: {
    id: 'about',
    title: 'About',
    subtitle: 'Who, where, what now',
    defaultSize: { w: 720, h: 540 },
    minSize: { w: 360, h: 320 },
    onDesktop: true,
    inDock: true,
    onHome: true,
    inPhoneDock: true,
    shortcutDigit: 1,
  },
  work: {
    id: 'work',
    title: 'Hackathons',
    subtitle: 'Six weekends, six prototypes',
    defaultSize: { w: 860, h: 600 },
    minSize: { w: 380, h: 340 },
    onDesktop: true,
    inDock: true,
    onHome: true,
    inPhoneDock: false,
    shortcutDigit: 2,
  },
  writing: {
    id: 'writing',
    title: 'Writing',
    subtitle: 'Essays on materials and motion',
    defaultSize: { w: 900, h: 620 },
    minSize: { w: 380, h: 360 },
    onDesktop: true,
    inDock: true,
    onHome: true,
    inPhoneDock: true,
    shortcutDigit: 3,
  },
  lab: {
    id: 'lab',
    title: 'Lab',
    subtitle: 'Playable experiments',
    defaultSize: { w: 940, h: 660 },
    minSize: { w: 400, h: 380 },
    onDesktop: true,
    inDock: true,
    onHome: true,
    inPhoneDock: true,
    shortcutDigit: 4,
  },
  papers: {
    id: 'papers',
    title: 'Papers',
    subtitle: 'Analyses, talks, field notes',
    defaultSize: { w: 780, h: 580 },
    minSize: { w: 360, h: 320 },
    onDesktop: true,
    inDock: true,
    onHome: true,
    inPhoneDock: true,
    shortcutDigit: 5,
  },
  settings: {
    id: 'settings',
    title: 'Settings',
    subtitle: 'Appearance, wallpaper, glass',
    defaultSize: { w: 640, h: 520 },
    minSize: { w: 340, h: 320 },
    onDesktop: false,
    inDock: true,
    onHome: true,
    inPhoneDock: false,
    shortcutDigit: 6,
  },
  trash: {
    id: 'trash',
    title: 'Trash',
    subtitle: 'Regrets, safely contained',
    defaultSize: { w: 700, h: 480 },
    minSize: { w: 360, h: 300 },
    onDesktop: true,
    inDock: true,
    onHome: true,
    inPhoneDock: false,
    shortcutDigit: 7,
  },
}

export const APP_LIST: AppMeta[] = Object.values(APPS)

export const DESKTOP_APPS = APP_LIST.filter((a) => a.onDesktop)
export const DOCK_APPS = APP_LIST.filter((a) => a.inDock && a.id !== 'trash')
export const HOME_APPS = APP_LIST.filter((a) => a.onHome && !a.inPhoneDock)
export const PHONE_DOCK_APPS = APP_LIST.filter((a) => a.inPhoneDock)

export function appByDigit(digit: number): AppMeta | undefined {
  return APP_LIST.find((a) => a.shortcutDigit === digit)
}
