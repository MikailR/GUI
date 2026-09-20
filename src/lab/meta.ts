/** Metadata for Lab experiments (no component imports, so Spotlight can index cheaply). */

export type ExperimentId = 'spring' | 'type' | 'glass' | 'lens' | 'curves' | 'ripples' | 'concentric' | 'dock'

export interface ExperimentMeta {
  id: ExperimentId
  title: string
  blurb: string
  tags: string[]
  /** Accent hue for the tile. */
  hue: number
  /** Short instruction shown above the canvas. */
  hint: string
}

export const LAB_EXPERIMENTS: ExperimentMeta[] = [
  {
    id: 'spring',
    title: 'Spring toy',
    blurb: 'Throw a glass orb. Tune stiffness and damping, watch the trace.',
    tags: ['physics', 'pointer'],
    hue: 212,
    hint: 'Drag the orb and let go.',
  },
  {
    id: 'glass',
    title: 'Glass workbench',
    blurb: 'Dial in blur, tint, rim and refraction on a draggable pane.',
    tags: ['material', 'css'],
    hue: 262,
    hint: 'Drag the pane; adjust the material below.',
  },
  {
    id: 'lens',
    title: 'Liquid lens',
    blurb: 'A magnifying droplet that follows the pointer over a paragraph.',
    tags: ['optics', 'clip-path'],
    hue: 190,
    hint: 'Move over the text. Click to pin.',
  },
  {
    id: 'type',
    title: 'Type studio',
    blurb: 'Weight, tracking and size on a large headline. Letters flinch under the cursor.',
    tags: ['typography', 'variable'],
    hue: 30,
    hint: 'Hover the headline; use the sliders.',
  },
  {
    id: 'curves',
    title: 'Motion curves',
    blurb: 'Drag bezier handles, or bake a real spring into linear().',
    tags: ['easing', 'motion'],
    hue: 330,
    hint: 'Drag the two handles, then press play.',
  },
  {
    id: 'ripples',
    title: 'Ripples',
    blurb: 'Tap to disturb a still glass surface. Waves interfere and fade.',
    tags: ['canvas', 'motion'],
    hue: 160,
    hint: 'Tap or click anywhere.',
  },
  {
    id: 'concentric',
    title: 'Concentric corners',
    blurb: 'Why inner radius = outer radius − padding, and what happens when it isn’t.',
    tags: ['geometry', 'radius'],
    hue: 280,
    hint: 'Adjust radius and padding; toggle naive mode.',
  },
  {
    id: 'dock',
    title: 'Dock curve',
    blurb: 'The Gaussian behind the Dock’s magnification, with σ and peak exposed.',
    tags: ['math', 'motion'],
    hue: 8,
    hint: 'Move along the row of pills.',
  },
]

export function experimentById(id: string | null): ExperimentMeta | undefined {
  return LAB_EXPERIMENTS.find((e) => e.id === id)
}
