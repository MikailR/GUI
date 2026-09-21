import { useCallback, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { Symbol } from '../../icons/Symbol'
import { CodeBlock, ControlStrip, CopyButton, Param } from '../LabControls'
import type { ExperimentProps } from '../registry'

interface Material {
  blur: number
  saturate: number
  fill: number
  rim: number
  radius: number
  edge: number
}

const DEFAULT: Material = { blur: 22, saturate: 1.9, fill: 0.36, rim: 0.9, radius: 28, edge: 10 }

export default function GlassBench({ compact }: ExperimentProps) {
  const [material, setMaterial] = useState<Material>(DEFAULT)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const drag = useRef<{ startX: number; startY: number; baseX: number; baseY: number } | null>(null)

  const set = <K extends keyof Material>(key: K) => (value: Material[K]) => setMaterial((m) => ({ ...m, [key]: value }))

  const onDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      drag.current = { startX: event.clientX, startY: event.clientY, baseX: offset.x, baseY: offset.y }
      event.currentTarget.setPointerCapture(event.pointerId)
    },
    [offset],
  )
  const onMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d) return
    setOffset({ x: d.baseX + event.clientX - d.startX, y: d.baseY + event.clientY - d.startY })
  }, [])
  const onUp = useCallback(() => {
    drag.current = null
  }, [])

  const css = `.pane {
  background: rgba(255, 255, 255, ${material.fill.toFixed(2)});
  backdrop-filter: blur(${material.blur}px) saturate(${material.saturate.toFixed(2)});
  border-radius: ${material.radius}px;
  box-shadow: inset 0 1px 0 rgba(255,255,255,${(material.rim * 0.7).toFixed(2)}),
              0 24px 60px -18px rgba(12,24,60,.42);
}
.pane::before { /* specular rim */
  content: ''; position: absolute; inset: 0; border-radius: inherit; padding: 1px;
  background: linear-gradient(135deg, rgba(255,255,255,${material.rim.toFixed(2)}),
              rgba(255,255,255,.25) 30%, rgba(255,255,255,.25) 65%, rgba(255,255,255,${(material.rim * 0.6).toFixed(2)}));
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask-composite: exclude;
}`

  const paneStyle = {
    '--b': `${material.blur}px`,
    '--sat': material.saturate,
    '--fill': material.fill,
    '--rim': material.rim,
    '--radius': `${material.radius}px`,
    '--edge': `${material.edge}px`,
    transform: `translate(${offset.x}px, ${offset.y}px)`,
  } as CSSProperties

  return (
    <div className="lab-experiment glass-bench" data-compact={compact || undefined}>
      <div className="glass-bench-stage">
        <div className="glass-bench-backdrop" aria-hidden="true">
          <div className="glass-bench-stripes" />
          <p className="glass-bench-text">
            Behind the pane: saturated colour, hard edges and small type. Good glass keeps the colour, kills the detail,
            and tells you where its edge is.
          </p>
          <div className="glass-bench-dots" />
        </div>
        <div
          className="glass-bench-pane"
          style={paneStyle}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          role="img"
          aria-label="Draggable glass pane"
        >
          <span className="glass-bench-pane-edge" aria-hidden="true" />
          <div className="glass-bench-pane-content">
            <Symbol name="square.stack" size={22} weight={2} />
            <strong>Liquid Glass</strong>
            <small>drag me</small>
          </div>
        </div>
      </div>

      <ControlStrip>
        <Param label="Blur" value={material.blur} min={0} max={48} onChange={set('blur')} format={(v) => `${v}px`} />
        <Param label="Saturation" value={material.saturate} min={1} max={2.6} step={0.05} onChange={set('saturate')} format={(v) => v.toFixed(2)} />
        <Param label="Fill" value={material.fill} min={0} max={0.9} step={0.02} onChange={set('fill')} format={(v) => `${Math.round(v * 100)}%`} />
        <Param label="Rim" value={material.rim} min={0} max={1} step={0.05} onChange={set('rim')} format={(v) => v.toFixed(2)} />
        <Param label="Edge" value={material.edge} min={0} max={28} onChange={set('edge')} format={(v) => `${v}px`} />
        <Param label="Radius" value={material.radius} min={6} max={64} onChange={set('radius')} format={(v) => `${v}px`} />
      </ControlStrip>

      <div className="lab-output">
        <div className="lab-output-head">
          <span>Generated CSS</span>
          <CopyButton text={css} />
        </div>
        <CodeBlock code={css} />
      </div>
    </div>
  )
}
