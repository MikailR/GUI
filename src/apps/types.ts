import type { AppId, Shell } from '../os/types'

/** Props every app screen receives from either shell. */
export interface AppProps {
  shell: Shell
  /** Sub-route inside the app, e.g. an essay slug. Empty string = root. */
  route: string
  onRoute: (route: string) => void
  openApp: (appId: AppId, route?: string) => void
}
