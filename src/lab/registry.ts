import { lazy, type ComponentType, type LazyExoticComponent } from 'react'
import type { SymbolName } from '../icons/Symbol'

export type ExperimentId = 'glass' | 'squircle' | 'icon' | 'dock' | 'spring' | 'island' | 'ripples'

export interface ExperimentProps {
  /** True when rendered in the iOS shell (touch-first layout). */
  compact: boolean
}

export interface Experiment {
  id: ExperimentId
  name: string
  tagline: string
  description: string
  tags: string[]
  /** Hue for the tile gradient. */
  hue: number
  symbol: SymbolName
  Component: LazyExoticComponent<ComponentType<ExperimentProps>>
}

export const EXPERIMENTS: readonly Experiment[] = [
  {
    id: 'glass',
    name: 'Glass Bench',
    tagline: 'Drag a pane over a busy backdrop and tune the material',
    description:
      'Blur, saturation, fill, rim and edge refraction as live sliders. The pane is the same CSS recipe the OS uses; copy it out when it looks right.',
    tags: ['material', 'css', 'backdrop-filter'],
    hue: 212,
    symbol: 'square.stack',
    Component: lazy(() => import('./experiments/GlassBench')),
  },
  {
    id: 'squircle',
    name: 'Squircle Studio',
    tagline: 'Slide a rounded rectangle into an Apple icon',
    description:
      'A superellipse exponent from 2 (circle) to 12 (box), overlaid on a plain border-radius so you can see the curvature difference. Copy the SVG path.',
    tags: ['shape', 'geometry', 'svg'],
    hue: 280,
    symbol: 'grid',
    Component: lazy(() => import('./experiments/SquircleStudio')),
  },
  {
    id: 'icon',
    name: 'Icon Forge',
    tagline: 'Build an iOS-style app icon: gradient, glyph, lighting',
    description:
      'Pick hues, a glyph and a lighting angle; the forge renders the squircle icon at home-screen, Dock and App Store sizes with the same sheen and rim the OS icons use.',
    tags: ['icons', 'gradient', 'svg'],
    hue: 20,
    symbol: 'paintbrush',
    Component: lazy(() => import('./experiments/IconForge')),
  },
  {
    id: 'dock',
    name: 'Dock Physics',
    tagline: 'The magnification Gaussian, exposed',
    description:
      'σ and peak of the Dock’s magnification curve as sliders, with the curve plotted live under a row of icons that follow your pointer.',
    tags: ['motion', 'math', 'dock'],
    hue: 160,
    symbol: 'circle.lefthalf',
    Component: lazy(() => import('./experiments/DockPhysics')),
  },
  {
    id: 'spring',
    name: 'Spring Lab',
    tagline: 'Throw a glass orb, tune stiffness and damping',
    description:
      'A semi-implicit Euler spring with ζ readout, presets for the system’s sheet and window springs, and a baked linear() easing you can copy.',
    tags: ['motion', 'physics', 'easing'],
    hue: 330,
    symbol: 'sparkles',
    Component: lazy(() => import('./experiments/SpringLab')),
  },
  {
    id: 'island',
    name: 'Dynamic Island',
    tagline: 'A pill that morphs between live activities',
    description:
      'Compact, expanded, timer and now-playing states, morphing with the OS spring. Tap to cycle, or let it idle and watch the timer tick.',
    tags: ['ios', 'motion', 'layout'],
    hue: 240,
    symbol: 'clock',
    Component: lazy(() => import('./experiments/DynamicIsland')),
  },
  {
    id: 'ripples',
    name: 'Ripples',
    tagline: 'Tap to disturb a sheet of glass',
    description:
      'Crest and trough rings with a specular arc, rendered on a canvas that sits under real glass so the material refracts the waves.',
    tags: ['canvas', 'material', 'touch'],
    hue: 190,
    symbol: 'hand.tap',
    Component: lazy(() => import('./experiments/Ripples')),
  },
]

export function experimentById(id: string): Experiment | undefined {
  return EXPERIMENTS.find((experiment) => experiment.id === id)
}
