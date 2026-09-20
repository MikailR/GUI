import { lazy, type ComponentType, type LazyExoticComponent } from 'react'
import type { ExperimentId } from './meta'

/** Code-split experiment components keyed by id. */
export const EXPERIMENT_COMPONENTS: Record<ExperimentId, LazyExoticComponent<ComponentType>> = {
  spring: lazy(() => import('./experiments/SpringToy')),
  glass: lazy(() => import('./experiments/GlassWorkbench')),
  lens: lazy(() => import('./experiments/LiquidLens')),
  type: lazy(() => import('./experiments/TypeStudio')),
  curves: lazy(() => import('./experiments/MotionCurves')),
  ripples: lazy(() => import('./experiments/Ripples')),
  concentric: lazy(() => import('./experiments/Concentric')),
  dock: lazy(() => import('./experiments/DockCurve')),
}
