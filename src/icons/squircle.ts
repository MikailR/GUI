/**
 * Continuous-corner ("squircle") geometry.
 *
 * The iOS/macOS icon silhouette is a superellipse |x/a|ⁿ + |y/b|ⁿ = 1 with n ≈ 5.
 * Unlike a rounded rectangle, curvature rises smoothly from the straight edge into
 * the corner, which is what makes the shape read as "Apple" rather than "CSS".
 */

export const APPLE_EXPONENT = 5

/**
 * Builds an SVG path for a superellipse that fills a `size × size` box.
 * `exponent` 2 → circle, 4–6 → squircle, 12+ → nearly a rectangle.
 * The point count is high enough that no polygon edges are visible at 512px.
 */
export function squirclePath(size: number, exponent = APPLE_EXPONENT, segmentsPerQuadrant = 32): string {
  const radius = size / 2
  const points: string[] = []
  const total = segmentsPerQuadrant * 4
  for (let i = 0; i < total; i += 1) {
    const t = (i / total) * Math.PI * 2
    const c = Math.cos(t)
    const s = Math.sin(t)
    const x = radius + radius * Math.sign(c) * Math.abs(c) ** (2 / exponent)
    const y = radius + radius * Math.sign(s) * Math.abs(s) ** (2 / exponent)
    points.push(`${x.toFixed(3)} ${y.toFixed(3)}`)
  }
  return `M${points.join('L')}Z`
}

/** Icon-space path, reused by every app icon (viewBox 0 0 120 120). */
export const ICON_BOX = 120
export const ICON_SQUIRCLE = squirclePath(ICON_BOX)

/**
 * A `clip-path: path()` value for a squircle that fills a box of `size` px.
 * Useful for DOM elements (widgets, cards) where border-radius would give a
 * rounded rectangle. The path is in px so it must match the element size.
 */
export function squircleClipPath(size: number, exponent = APPLE_EXPONENT): string {
  return `path('${squirclePath(size, exponent, 24)}')`
}

/**
 * Corner radius that visually matches a squircle of the same size when we have
 * to fall back to `border-radius` (≈ 22.37% of the side for Apple icons).
 */
export function fallbackRadius(size: number): number {
  return Math.round(size * 0.2237 * 100) / 100
}
