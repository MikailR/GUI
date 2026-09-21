import { HACKATHONS, PAPERS, POSTS } from '../content/data'
import { EXPERIMENTS } from '../lab/registry'
import { APPS } from './apps'
import type { AppId } from './types'

export type ResultGroup = 'Apps' | 'Essays' | 'Hackathons' | 'Experiments' | 'Papers' | 'Settings'

export interface SearchResult {
  id: string
  group: ResultGroup
  title: string
  subtitle?: string
  appId: AppId
  route: string
  keywords: string
}

const GROUP_ORDER: ResultGroup[] = ['Apps', 'Essays', 'Hackathons', 'Experiments', 'Papers', 'Settings']

const INDEX: SearchResult[] = [
  ...APPS.map((app) => ({
    id: `app-${app.id}`,
    group: 'Apps' as const,
    title: app.name,
    subtitle: app.subtitle,
    appId: app.id,
    route: '',
    keywords: `${app.name} ${app.subtitle}`,
  })),
  ...POSTS.map((post) => ({
    id: `post-${post.slug}`,
    group: 'Essays' as const,
    title: post.title,
    subtitle: `${post.tag} · ${post.readMins} min`,
    appId: 'writing' as const,
    route: post.slug,
    keywords: `${post.title} ${post.tag} ${post.summary}`,
  })),
  ...HACKATHONS.map((hack) => ({
    id: `hack-${hack.id}`,
    group: 'Hackathons' as const,
    title: hack.project,
    subtitle: `${hack.event} · ${hack.place}`,
    appId: 'hackathons' as const,
    route: hack.id,
    keywords: `${hack.project} ${hack.event} ${hack.place} ${hack.blurb} ${hack.stack.join(' ')}`,
  })),
  ...EXPERIMENTS.map((experiment) => ({
    id: `lab-${experiment.id}`,
    group: 'Experiments' as const,
    title: experiment.name,
    subtitle: experiment.tagline,
    appId: 'lab' as const,
    route: experiment.id,
    keywords: `${experiment.name} ${experiment.tagline} ${experiment.tags.join(' ')}`,
  })),
  ...PAPERS.map((paper) => ({
    id: `paper-${paper.id}`,
    group: 'Papers' as const,
    title: paper.title,
    subtitle: `${paper.venue} · ${paper.year}`,
    appId: 'papers' as const,
    route: paper.id,
    keywords: `${paper.title} ${paper.venue} ${paper.kind} ${paper.tags.join(' ')}`,
  })),
  { id: 'set-appearance', group: 'Settings', title: 'Appearance', subtitle: 'Light, dark or automatic', appId: 'settings', route: 'appearance', keywords: 'appearance light dark mode theme' },
  { id: 'set-wallpaper', group: 'Settings', title: 'Wallpaper', subtitle: 'Tahoe, Sequoia, Sonoma, Graphite', appId: 'settings', route: 'wallpaper', keywords: 'wallpaper background desktop' },
  { id: 'set-accent', group: 'Settings', title: 'Accent colour', subtitle: 'Tint controls and highlights', appId: 'settings', route: 'appearance', keywords: 'accent colour color tint highlight' },
  { id: 'set-a11y', group: 'Settings', title: 'Accessibility', subtitle: 'Reduce transparency and motion', appId: 'settings', route: 'accessibility', keywords: 'accessibility reduce transparency motion' },
]

function score(result: SearchResult, query: string): number {
  const q = query.toLowerCase()
  const title = result.title.toLowerCase()
  if (title === q) return 100
  if (title.startsWith(q)) return 80
  if (title.includes(q)) return 60
  if (result.keywords.toLowerCase().includes(q)) return 30
  return 0
}

export interface GroupedResults {
  group: ResultGroup
  results: SearchResult[]
}

export function search(query: string, limit = 12): GroupedResults[] {
  const trimmed = query.trim()
  const scored = (trimmed
    ? INDEX.map((result) => ({ result, s: score(result, trimmed) })).filter((entry) => entry.s > 0)
    : INDEX.filter((result) => result.group === 'Apps').map((result) => ({ result, s: 1 }))
  )
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)

  const groups = new Map<ResultGroup, { best: number; results: SearchResult[] }>()
  scored.forEach(({ result, s }) => {
    const entry = groups.get(result.group) ?? { best: 0, results: [] }
    entry.best = Math.max(entry.best, s)
    entry.results.push(result)
    groups.set(result.group, entry)
  })
  return [...groups.entries()]
    .sort((a, b) => b[1].best - a[1].best || GROUP_ORDER.indexOf(a[0]) - GROUP_ORDER.indexOf(b[0]))
    .map(([group, entry]) => ({ group, results: entry.results }))
}
