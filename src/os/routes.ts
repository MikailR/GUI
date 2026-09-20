import { HACKATHONS, PAPERS, POSTS } from '../content/data'
import { experimentById } from '../lab/meta'
import type { AppId } from './types'

/** Human title for an app's current deep link, used in window title bars and phone nav pills. */
export function routeTitle(appId: AppId, route: string | null): string | null {
  if (!route) return null
  switch (appId) {
    case 'writing':
      return POSTS.find((p) => p.slug === route)?.title ?? null
    case 'work':
      return HACKATHONS.find((h) => h.id === route)?.project ?? null
    case 'lab':
      return experimentById(route)?.title ?? null
    case 'papers':
      return PAPERS.find((p) => p.id === route)?.title ?? null
    case 'about':
    case 'trash':
    case 'settings':
      return null
    default: {
      const exhaustive: never = appId
      return exhaustive
    }
  }
}
