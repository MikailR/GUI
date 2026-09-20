/**
 * Superellipse ("squircle") path generator for app icons.
 * Apple's icon silhouette is close to a superellipse with exponent ≈ 5.
 * Points are sampled once per (size, exponent) and cached.
 */

const cache = new Map<string, string>()

export function squirclePath(size: number, exponent = 5, steps = 96): string {
  const key = `${size}:${exponent}:${steps}`
  const cached = cache.get(key)
  if (cached) return cached

  const half = size / 2
  const points: string[] = []
  for (let i = 0; i < steps; i++) {
    const t = (i / steps) * Math.PI * 2
    const cosT = Math.cos(t)
    const sinT = Math.sin(t)
    const x = half + Math.sign(cosT) * half * Math.abs(cosT) ** (2 / exponent)
    const y = half + Math.sign(sinT) * half * Math.abs(sinT) ** (2 / exponent)
    points.push(`${x.toFixed(2)},${y.toFixed(2)}`)
  }
  const path = `M${points.join('L')}Z`
  cache.set(key, path)
  return path
}
