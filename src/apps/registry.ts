export type AppId =
  | 'about'
  | 'hackathons'
  | 'writing'
  | 'lab'
  | 'papers'
  | 'terminal'
  | 'settings'
  | 'trash'

export interface AppMeta {
  id: AppId
  title: string
  /** three-letter code shown in chrome, e.g. `abt.app` */
  code: string
  /** oklch hue for the icon tile; null = neutral */
  hue: number | null
  size: [number, number]
  min: [number, number]
  dock: boolean
  desktop: boolean
  blurb: string
}

export const APPS: AppMeta[] = [
  { id: 'about', title: 'About', code: 'abt', hue: 80, size: [640, 500], min: [360, 300], dock: true, desktop: true, blurb: 'Who is Mikail' },
  { id: 'hackathons', title: 'Hackathons', code: 'hck', hue: 40, size: [620, 560], min: [360, 320], dock: true, desktop: true, blurb: 'Wins, finals, and near misses' },
  { id: 'writing', title: 'Writing', code: 'wrt', hue: 300, size: [820, 580], min: [380, 340], dock: true, desktop: true, blurb: 'Essays on interfaces' },
  { id: 'lab', title: 'Lab', code: 'lab', hue: 185, size: [720, 560], min: [360, 320], dock: true, desktop: true, blurb: 'Experiments, mostly CSS' },
  { id: 'papers', title: 'Papers', code: 'ppr', hue: 250, size: [680, 560], min: [360, 320], dock: true, desktop: true, blurb: 'Analyses and reading notes' },
  { id: 'terminal', title: 'Terminal', code: 'trm', hue: null, size: [600, 400], min: [340, 240], dock: true, desktop: false, blurb: 'A shell that mostly humours you' },
  { id: 'settings', title: 'Settings', code: 'set', hue: null, size: [520, 480], min: [340, 320], dock: false, desktop: false, blurb: 'Wallpaper, motion, layout' },
  { id: 'trash', title: 'Trash', code: 'trs', hue: null, size: [600, 420], min: [340, 260], dock: true, desktop: true, blurb: 'Where old projects go' },
]

export const APP_BY_ID = Object.fromEntries(APPS.map((a) => [a.id, a])) as Record<AppId, AppMeta>
