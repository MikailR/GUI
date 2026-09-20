import { useId, useRef, useState, type CSSProperties } from 'react'
import { Slider, Switch } from '../../components/controls'
import { usePointerDrag } from '../../os/hooks'
import { CopyButton, LabFrame } from '../LabFrame'
import { useElementSize } from '../useElementSize'

const PANE_W = 260
const PANE_H = 170

/**
 * A pane of glass you can drag over a busy backdrop while dialling in the material:
 * blur, saturation, fill, rim, corner radius and an edge-refraction layer built from an
 * SVG displacement map applied to a copy of the backdrop.
 */
export default function GlassWorkbench() {
  const stageRef = useRef<HTMLDivElement | null>(null)
  const stageSize = useElementSize(stageRef)
  const [pos, setPos] = useState({ x: 40, y: 40 })
  const dragStart = useRef(pos)
  const filterId = `refract-${useId().replace(/:/g, '')}`

  const [blur, setBlur] = useState(22)
  const [saturate, setSaturate] = useState(170)
  const [fill, setFill] = useState(32)
  const [rim, setRim] = useState(70)
  const [radius, setRadius] = useState(28)
  const [refraction, setRefraction] = useState(45)
  const [dark, setDark] = useState(false)

  const drag = usePointerDrag({
    onStart: () => {
      dragStart.current = pos
    },
    onMove: (dx, dy) => {
      const stage = stageRef.current
      if (!stage) return
      const maxX = stage.clientWidth - PANE_W
      const maxY = stage.clientHeight - PANE_H
      setPos({
        x: Math.max(0, Math.min(maxX, dragStart.current.x + dx)),
        y: Math.max(0, Math.min(maxY, dragStart.current.y + dy)),
      })
    },
  })

  const fillColor = dark ? `rgba(20, 24, 36, ${fill / 100})` : `rgba(255, 255, 255, ${fill / 100})`
  const rimAlpha = rim / 100
  const paneVars = {
    '--pane-x': `${pos.x}px`,
    '--pane-y': `${pos.y}px`,
    '--stage-w': `${stageSize.width}px`,
    '--stage-h': `${stageSize.height}px`,
    '--pane-blur': `${blur}px`,
    '--pane-sat': `${saturate}%`,
    '--pane-fill': fillColor,
    '--pane-rim': `rgba(255,255,255,${rimAlpha})`,
    '--pane-rim-soft': `rgba(255,255,255,${rimAlpha * 0.35})`,
    '--pane-radius': `${radius}px`,
    '--pane-refract': refraction / 100,
    '--pane-text': dark ? 'rgba(255,255,255,0.92)' : 'rgba(0,0,0,0.85)',
  } as CSSProperties

  const css = [
    `.glass {`,
    `  background: ${fillColor};`,
    `  backdrop-filter: blur(${blur}px) saturate(${saturate}%);`,
    `  border-radius: ${radius}px;`,
    `  box-shadow: inset 0 0 0 1px rgba(255,255,255,${rimAlpha.toFixed(2)}),`,
    `              inset 0 1px 0 rgba(255,255,255,${(rimAlpha * 0.6).toFixed(2)}),`,
    `              0 30px 70px -30px rgba(0,0,0,.5);`,
    `}`,
  ].join('\n')

  return (
    <LabFrame
      hint="Drag the pane; adjust the material below."
      stageClassName="lab-stage--tall"
      stage={
        <div className="bench" ref={stageRef}>
          <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
            <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="2" seed="7" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale={refraction * 0.9} xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </svg>

          <div className="bench__backdrop" aria-hidden="true">
            <p className="bench__type">
              Glass is a hierarchy cue. Translucency says this sits above the thing behind it, and the thing behind is still
              there. Take the rim away and it reads as a grey rectangle. Put it back and it reads as an object.
            </p>
          </div>

          <div
            className="bench__pane"
            style={paneVars}
            onPointerDown={drag.onPointerDown}
            role="group"
            aria-label="Draggable glass pane"
          >
            {/* Refraction: a copy of the gradient backdrop, displaced, shown only near the edges. */}
            <div className="bench__refract" style={{ filter: `url(#${filterId})` }} />
            <div className="bench__pane-rim" />
            <div className="bench__pane-content">
              <span className="bench__pane-kicker">Material</span>
              <strong>Liquid Glass</strong>
              <span className="bench__pane-meta">
                blur {blur} · sat {saturate}% · fill {fill}%
              </span>
            </div>
          </div>
        </div>
      }
      controls={
        <>
          <Slider label="Blur" value={blur} min={0} max={48} onChange={setBlur} format={(v) => `${v}px`} />
          <Slider label="Saturation" value={saturate} min={80} max={260} step={10} onChange={setSaturate} format={(v) => `${v}%`} />
          <Slider label="Fill" value={fill} min={0} max={90} onChange={setFill} format={(v) => `${v}%`} />
          <Slider label="Rim" value={rim} min={0} max={100} onChange={setRim} format={(v) => `${v}%`} />
          <Slider label="Radius" value={radius} min={0} max={80} onChange={setRadius} format={(v) => `${v}px`} />
          <Slider label="Edge refraction" value={refraction} min={0} max={100} onChange={setRefraction} format={(v) => `${v}%`} />
          <label className="row row--inline">
            <span className="row__label">Dark glass</span>
            <Switch label="Dark glass" checked={dark} onChange={setDark} />
          </label>
        </>
      }
      footer={
        <div className="css-out">
          <pre>
            <code>{css}</code>
          </pre>
          <CopyButton text={css} />
        </div>
      }
    />
  )
}
