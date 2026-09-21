import { lazy, type ComponentType, type LazyExoticComponent, type ReactNode } from 'react'
import type { AppId } from '../os/types'
import type { AppProps } from './types'

const REGISTRY: Record<AppId, LazyExoticComponent<ComponentType<AppProps>>> = {
  about: lazy(() => import('./About')),
  hackathons: lazy(() => import('./Hackathons')),
  writing: lazy(() => import('./Writing')),
  lab: lazy(() => import('./Lab')),
  papers: lazy(() => import('./Papers')),
  trash: lazy(() => import('./Trash')),
  settings: lazy(() => import('./Settings')),
}

/** Renders an app screen for either shell. Wrap in <Suspense>. */
export function renderApp(appId: AppId, props: AppProps): ReactNode {
  const Component = REGISTRY[appId]
  return <Component {...props} />
}
