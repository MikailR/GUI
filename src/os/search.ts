import { HACKATHONS, PAPERS, POSTS } from '../content/data'
import { LAB_EXPERIMENTS } from '../lab/meta'
import { APP_LIST } from './apps'
import type { AppId, Appearance, WallpaperId } from './types'
import { WALLPAPER_LIST } from '../desktop/wallpapers'

export type SearchGroup = 'Apps' | 'Writing' | 'Hackathons' | 'Lab' | 'Papers' | 'Actions'

export type SearchAction =
  | { kind: 'open'; appId: AppId; route?: string }
  | { kind: 'appearance'; appearance: Appearance }
  | { kind: 'wallpaper'; wallpaper: WallpaperId }
  | { kind: 'toggle-transparency' }
  | { kind: 'sheet'; sheet: 'shortcuts' | 'about-mac' }

export interface SearchItem {
  id: string
  group: SearchGroup
  title: string
  subtitle: string
  keywords: string
  /** Which app icon to draw. */
  icon: AppId
  action: SearchAction
}

/** Static index; built once. */
export const SEARCH_INDEX: SearchItem[] = [
  ...APP_LIST.map<SearchItem>((app) => ({
    id: `app:${app.id}`,
    group: 'Apps',
    title: app.title,
    subtitle: app.subtitle,
    keywords: `${app.title} ${app.subtitle} app open`,
    icon: app.id,
    action: { kind: 'open', appId: app.id },
  })),
  ...POSTS.map<SearchItem>((post) => ({
    id: `post:${post.slug}`,
    group: 'Writing',
    title: post.title,
    subtitle: `${post.tag} · ${post.readMins} min`,
    keywords: `${post.title} ${post.summary} ${post.tag}`,
    icon: 'writing',
    action: { kind: 'open', appId: 'writing', route: post.slug },
  })),
  ...HACKATHONS.map<SearchItem>((h) => ({
    id: `hack:${h.id}`,
    group: 'Hackathons',
    title: h.project,
    subtitle: `${h.event} · ${h.place}`,
    keywords: `${h.project} ${h.event} ${h.blurb} ${h.stack.join(' ')}`,
    icon: 'work',
    action: { kind: 'open', appId: 'work', route: h.id },
  })),
  ...LAB_EXPERIMENTS.map<SearchItem>((exp) => ({
    id: `lab:${exp.id}`,
    group: 'Lab',
    title: exp.title,
    subtitle: exp.blurb,
    keywords: `${exp.title} ${exp.blurb} ${exp.tags.join(' ')} experiment`,
    icon: 'lab',
    action: { kind: 'open', appId: 'lab', route: exp.id },
  })),
  ...PAPERS.map<SearchItem>((paper) => ({
    id: `paper:${paper.id}`,
    group: 'Papers',
    title: paper.title,
    subtitle: `${paper.venue} · ${paper.year}`,
    keywords: `${paper.title} ${paper.abstract} ${paper.tags.join(' ')}`,
    icon: 'papers',
    action: { kind: 'open', appId: 'papers', route: paper.id },
  })),
  {
    id: 'act:light',
    group: 'Actions',
    title: 'Appearance: Light',
    subtitle: 'Switch the chrome to light glass',
    keywords: 'light mode appearance theme',
    icon: 'settings',
    action: { kind: 'appearance', appearance: 'light' },
  },
  {
    id: 'act:dark',
    group: 'Actions',
    title: 'Appearance: Dark',
    subtitle: 'Switch the chrome to dark glass',
    keywords: 'dark mode appearance theme night',
    icon: 'settings',
    action: { kind: 'appearance', appearance: 'dark' },
  },
  {
    id: 'act:auto',
    group: 'Actions',
    title: 'Appearance: Automatic',
    subtitle: 'Follow the system setting',
    keywords: 'auto appearance system theme',
    icon: 'settings',
    action: { kind: 'appearance', appearance: 'auto' },
  },
  ...WALLPAPER_LIST.map<SearchItem>((wp) => ({
    id: `act:wp:${wp.id}`,
    group: 'Actions',
    title: `Wallpaper: ${wp.name}`,
    subtitle: wp.description,
    keywords: `wallpaper background ${wp.name} ${wp.description}`,
    icon: 'settings',
    action: { kind: 'wallpaper', wallpaper: wp.id },
  })),
  {
    id: 'act:transparency',
    group: 'Actions',
    title: 'Toggle Reduce Transparency',
    subtitle: 'Solid surfaces instead of glass',
    keywords: 'transparency glass opaque accessibility',
    icon: 'settings',
    action: { kind: 'toggle-transparency' },
  },
  {
    id: 'act:shortcuts',
    group: 'Actions',
    title: 'Keyboard Shortcuts',
    subtitle: 'Everything you can do without a mouse',
    keywords: 'keyboard shortcuts help hotkeys',
    icon: 'settings',
    action: { kind: 'sheet', sheet: 'shortcuts' },
  },
]

const GROUP_ORDER: SearchGroup[] = ['Apps', 'Writing', 'Hackathons', 'Lab', 'Papers', 'Actions']

/** Simple ranked search: prefix > word-start > substring, on title then keywords. */
export function searchIndex(query: string, limit = 12): SearchItem[] {
  const q = query.trim().toLowerCase()
  if (!q) {
    return SEARCH_INDEX.filter((item) => item.group === 'Apps')
  }
  const scored: { item: SearchItem; score: number }[] = []
  for (const item of SEARCH_INDEX) {
    const title = item.title.toLowerCase()
    const keywords = item.keywords.toLowerCase()
    let score = 0
    if (title.startsWith(q)) score = 100
    else if (title.split(/\s+/).some((w) => w.startsWith(q))) score = 80
    else if (title.includes(q)) score = 60
    else if (keywords.includes(q)) score = 30
    else {
      // All query words present somewhere?
      const words = q.split(/\s+/).filter(Boolean)
      if (words.length > 1 && words.every((w) => keywords.includes(w))) score = 20
    }
    if (score > 0) scored.push({ item, score: score - GROUP_ORDER.indexOf(item.group) })
  }
  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, limit).map((s) => s.item)
}
