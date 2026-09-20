import { APP_IDS, type AppId } from './types'

export interface DeepLink {
  appId: AppId
  route: string | null
}

function isAppId(value: string): value is AppId {
  return (APP_IDS as readonly string[]).includes(value)
}

/** `#/writing/dock-math` → { appId: 'writing', route: 'dock-math' }. */
export function parseHash(hash: string): DeepLink | null {
  const clean = hash.replace(/^#\/?/, '')
  if (!clean) return null
  const [app, ...rest] = clean.split('/')
  if (!isAppId(app)) return null
  const route = rest.length ? decodeURIComponent(rest.join('/')) : null
  return { appId: app, route }
}

export function formatHash(link: DeepLink | null): string {
  if (!link) return '#/'
  return link.route ? `#/${link.appId}/${encodeURIComponent(link.route)}` : `#/${link.appId}`
}
