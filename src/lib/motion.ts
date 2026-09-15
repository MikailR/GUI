// Spring physics baked into a CSS `linear()` easing string, so WAAPI animations
// get real overshoot without a JS animation loop.
const cache = new Map<string, { easing: string; duration: number }>();

export const supportsLinearEasing =
  typeof CSS !== 'undefined' && CSS.supports?.('animation-timing-function', 'linear(0, 1)');

export function spring(stiffness = 170, damping = 20, mass = 1) {
  const key = `${stiffness}:${damping}:${mass}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const dt = 1 / 120;
  let x = 0;
  let v = 0;
  const samples: number[] = [];
  let t = 0;
  let settled = 0;
  while (t < 3) {
    const a = (-stiffness * (x - 1) - damping * v) / mass;
    v += a * dt;
    x += v * dt;
    t += dt;
    samples.push(x);
    if (Math.abs(x - 1) < 0.001 && Math.abs(v) < 0.01) {
      if (++settled > 12) break;
    } else settled = 0;
  }
  const step = Math.max(1, Math.floor(samples.length / 48));
  const pts: string[] = ['0'];
  for (let i = step; i < samples.length; i += step) pts.push(samples[i].toFixed(4));
  pts.push('1');
  const result = supportsLinearEasing
    ? { easing: `linear(${pts.join(', ')})`, duration: Math.round(t * 1000) }
    : { easing: 'cubic-bezier(.2,.9,.3,1.15)', duration: 420 };
  cache.set(key, result);
  return result;
}

export function prefersReducedMotion() {
  return typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}
