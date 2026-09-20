import { lazy, type ComponentType, type LazyExoticComponent } from 'react'
import type { AppId, AppScreenProps } from '../os/types'

type AppComponent = LazyExoticComponent<ComponentType<AppScreenProps>>

/** Code-split app screens. Each is shell-agnostic and renders in a window or full-screen. */
export const APP_COMPONENTS: Record<AppId, AppComponent> = {
  about: lazy(() => import('./About')),
  work: lazy(() => import('./Work')),
  writing: lazy(() => import('./Writing')),
  lab: lazy(() => import('./Lab')),
  papers: lazy(() => import('./Papers')),
  trash: lazy(() => import('./Trash')),
  settings: lazy(() => import('./Settings')),
}

export function AppLoading() {
  return (
    <div className="app-loading" aria-busy="true" aria-live="polite">
      <span className="app-loading__dot" />
      <span className="app-loading__dot" />
      <span className="app-loading__dot" />
    </div>
  )
}
