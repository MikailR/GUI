import { APP_IDS, type AppId } from './types'

export interface Location {
  appId: AppId
  route: string
}

function isAppId(value: string): value is AppId {
  return (APP_IDS as readonly string[]).includes(value)
}

/** Parses `#/writing/some-slug` → `{ appId: 'writing', route: 'some-slug' }`. */
export function parseHash(hash: string): Location | null {
  const trimmed = hash.replace(/^#\/?/, '')
  if (!trimmed) return null
  const [appId, ...rest] = trimmed.split('/')
  if (!appId || !isAppId(appId)) return null
  return { appId, route: rest.map(decodeURIComponent).join('/') }
}

export function toHash(location: Location | null): string {
  if (!location) return '#/'
  const route = location.route ? `/${location.route.split('/').map(encodeURIComponent).join('/')}` : ''
  return `#/${location.appId}${route}`
}

/** Writes the hash without triggering a scroll or a new history entry. */
export function replaceHash(location: Location | null): void {
  const next = toHash(location)
  if (window.location.hash === next) return
  history.replaceState(history.state, '', next)
}

export function pushHash(location: Location | null, state?: unknown): void {
  const next = toHash(location)
  history.pushState(state ?? null, '', next)
}
