import { useMemo, useState } from 'react'
import { Switch } from '../../components/controls'
import { fallbackRadius, squirclePath } from '../../icons/squircle'
import { CodeBlock, ControlStrip, CopyButton, Param } from '../LabControls'
import type { ExperimentProps } from '../registry'

export default function SquircleStudio({ compact }: ExperimentProps) {
  const [exponent, setExponent] = useState(5)
  const [showRounded, setShowRounded] = useState(true)
  const [showComb, setShowComb] = useState(false)
  const size = compact ? 220 : 280
  const path = useMemo(() => squirclePath(size, exponent, 32), [size, exponent])
  const radius = fallbackRadius(size)

  // Curvature comb: κ along the superellipse, drawn as normals scaled by curvature.
  const comb = useMemo(() => {
    if (!showComb) return []
    const n = exponent
    const r = size / 2
    const lines: string[] = []
    const steps = 160
    for (let i = 0; i < steps; i += 1) {
      const t = (i / steps) * Math.PI * 2
      const c = Math.cos(t)
      const s = Math.sin(t)
      const ac = Math.max(Math.abs(c), 1e-6)
      const as = Math.max(Math.abs(s), 1e-6)
      const x = Math.sign(c) * ac ** (2 / n)
      const y = Math.sign(s) * as ** (2 / n)
      // derivatives w.r.t. t
      const dx = Math.sign(c) * (2 / n) * ac ** (2 / n - 1) * -s
      const dy = Math.sign(s) * (2 / n) * as ** (2 / n - 1) * c
      const ddx = Math.sign(c) * (2 / n) * ((2 / n - 1) * ac ** (2 / n - 2) * s * s * Math.sign(c) * Math.sign(c) - ac ** (2 / n - 1) * c)
      const ddy = Math.sign(s) * (2 / n) * ((2 / n - 1) * as ** (2 / n - 2) * c * c - as ** (2 / n - 1) * s)
      const speed = Math.hypot(dx, dy)
      if (speed < 1e-6) continue
      const kappa = Math.abs(dx * ddy - dy * ddx) / speed ** 3
      const len = Math.min(48, kappa * 22)
      const nx = -dy / speed
      const ny = dx / speed
      const px = r + x * r
      const py = r + y * r
      lines.push(`M${px.toFixed(1)} ${py.toFixed(1)}L${(px + nx * len).toFixed(1)} ${(py + ny * len).toFixed(1)}`)
    }
    return lines
  }, [exponent, showComb, size])

  const code = `<!-- superellipse, n = ${exponent.toFixed(1)} -->\n<path d="${squirclePath(100, exponent, 16)}" />\n\n/* CSS fallback */\nborder-radius: ${((radius / size) * 100).toFixed(2)}%;\n@supports (corner-shape: squircle) {\n  corner-shape: superellipse(${(exponent / 3).toFixed(2)});\n}`

  return (
    <div className="lab-experiment squircle-studio" data-compact={compact || undefined}>
      <div className="squircle-stage">
        <svg width={size + 64} height={size + 64} viewBox={`-32 -32 ${size + 64} ${size + 64}`} role="img" aria-label="Squircle preview">
          <defs>
            <linearGradient id="sq-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#7cc6ff" />
              <stop offset="1" stopColor="#5b3cf5" />
            </linearGradient>
          </defs>
          <path d={path} fill="url(#sq-grad)" />
          {showRounded ? (
            <rect x="0" y="0" width={size} height={size} rx={radius} fill="none" stroke="#ff3b30" strokeWidth="1.5" strokeDasharray="5 4" />
          ) : null}
          {comb.length > 0 ? (
            <g stroke="rgba(255,255,255,0.85)" strokeWidth="1">
              {comb.map((d, i) => (
                <path key={i} d={d} />
              ))}
            </g>
          ) : null}
        </svg>
        <div className="squircle-legend">
          <span>
            <i className="squircle-key" style={{ background: 'linear-gradient(135deg,#7cc6ff,#5b3cf5)' }} /> superellipse n = {exponent.toFixed(1)}
          </span>
          {showRounded ? (
            <span>
              <i className="squircle-key" style={{ border: '1.5px dashed #ff3b30' }} /> border-radius {((radius / size) * 100).toFixed(1)}%
            </span>
          ) : null}
        </div>
      </div>

      <ControlStrip>
        <Param label="Exponent" value={exponent} min={2} max={12} step={0.1} onChange={setExponent} format={(v) => v.toFixed(1)} />
        <label className="lab-toggle">
          <span>Show rounded rect</span>
          <Switch checked={showRounded} onChange={setShowRounded} label="Show rounded rectangle" />
        </label>
        <label className="lab-toggle">
          <span>Curvature comb</span>
          <Switch checked={showComb} onChange={setShowComb} label="Show curvature comb" />
        </label>
      </ControlStrip>

      <p className="lab-note">
        At n = 2 the shape is a circle, at n ≈ 5 it is the iOS icon silhouette, past 10 it is a box with nervous corners. The comb
        shows curvature: a rounded rectangle would jump from zero to a plateau; the superellipse ramps.
      </p>

      <div className="lab-output">
        <div className="lab-output-head">
          <span>Path + CSS</span>
          <CopyButton text={code} label="Copy" />
        </div>
        <CodeBlock code={code} />
      </div>
    </div>
  )
}
