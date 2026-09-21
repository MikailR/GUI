import type { AppId } from './types'

export interface AppMeta {
  id: AppId
  name: string
  /** One-line description used in Spotlight, tooltips and Launchpad. */
  subtitle: string
  /** Default window size on the desktop. */
  size: { w: number; h: number }
  minSize: { w: number; h: number }
  /** Shows in the macOS Dock. Trash always renders at the far end. */
  inDock: boolean
  /** Shows as a desktop icon on the right edge. */
  onDesktop: boolean
  /** Shows in the iOS home grid (as opposed to only in the iOS dock). */
  onHome: boolean
  /** Shows in the iOS dock. */
  inPhoneDock: boolean
  /** ⌥ + digit shortcut. */
  shortcut: number
}

export const APPS: readonly AppMeta[] = [
  {
    id: 'about',
    name: 'About',
    subtitle: 'Who I am, what I do, where to find me',
    size: { w: 760, h: 540 },
    minSize: { w: 420, h: 360 },
    inDock: true,
    onDesktop: true,
    onHome: true,
    inPhoneDock: true,
    shortcut: 1,
  },
  {
    id: 'hackathons',
    name: 'Hackathons',
    subtitle: 'Weekends, prototypes and placements',
    size: { w: 900, h: 600 },
    minSize: { w: 520, h: 380 },
    inDock: true,
    onDesktop: true,
    onHome: true,
    inPhoneDock: false,
    shortcut: 2,
  },
  {
    id: 'writing',
    name: 'Writing',
    subtitle: 'Essays on materials, motion and performance',
    size: { w: 960, h: 640 },
    minSize: { w: 520, h: 400 },
    inDock: true,
    onDesktop: true,
    onHome: true,
    inPhoneDock: true,
    shortcut: 3,
  },
  {
    id: 'lab',
    name: 'Lab',
    subtitle: 'Playable experiments in glass, springs and squircles',
    size: { w: 980, h: 660 },
    minSize: { w: 560, h: 420 },
    inDock: true,
    onDesktop: true,
    onHome: true,
    inPhoneDock: true,
    shortcut: 4,
  },
  {
    id: 'papers',
    name: 'Papers',
    subtitle: 'Analyses, talks and field notes',
    size: { w: 820, h: 600 },
    minSize: { w: 460, h: 380 },
    inDock: true,
    onDesktop: true,
    onHome: true,
    inPhoneDock: false,
    shortcut: 5,
  },
  {
    id: 'settings',
    name: 'Settings',
    subtitle: 'Appearance, wallpaper, accent, accessibility',
    size: { w: 760, h: 540 },
    minSize: { w: 480, h: 400 },
    inDock: true,
    onDesktop: false,
    onHome: true,
    inPhoneDock: true,
    shortcut: 6,
  },
  {
    id: 'trash',
    name: 'Trash',
    subtitle: 'Regrets, safely deletable',
    size: { w: 720, h: 480 },
    minSize: { w: 440, h: 320 },
    inDock: true,
    onDesktop: true,
    onHome: true,
    inPhoneDock: false,
    shortcut: 7,
  },
]

const BY_ID: Record<AppId, AppMeta> = Object.fromEntries(APPS.map((app) => [app.id, app])) as Record<
  AppId,
  AppMeta
>

export function appMeta(id: AppId): AppMeta {
  return BY_ID[id]
}

export function appByShortcut(digit: number): AppMeta | undefined {
  return APPS.find((app) => app.shortcut === digit)
}
