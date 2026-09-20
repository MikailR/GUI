import { useState, type CSSProperties } from 'react'
import { Slider, Switch } from '../../components/controls'
import { LabFrame, Readout } from '../LabFrame'

/**
 * Three nested panes. In concentric mode each inner radius is outer − padding so the corner arcs
 * share a centre; in naive mode every layer reuses the same radius and the corners visibly drift.
 */
export default function Concentric() {
  const [radius, setRadius] = useState(48)
  const [padding, setPadding] = useState(18)
  const [naive, setNaive] = useState(false)
  const [guides, setGuides] = useState(true)

  const r0 = radius
  const r1 = naive ? radius : Math.max(0, radius - padding)
  const r2 = naive ? radius : Math.max(0, radius - padding * 2)

  const style = {
    '--r0': `${r0}px`,
    '--r1': `${r1}px`,
    '--r2': `${r2}px`,
    '--pad': `${padding}px`,
  } as CSSProperties

  return (
    <LabFrame
      hint="Adjust radius and padding; toggle naive mode."
      stage={
        <div className={`conc ${guides ? 'has-guides' : ''}`} style={style}>
          <div className="glass conc__l0">
            <div className="conc__l1">
              <div className="conc__l2">
                <span className="conc__label">{naive ? 'same radius everywhere' : 'r − padding at each step'}</span>
              </div>
            </div>
          </div>
          {guides ? (
            <div className="conc__guides" aria-hidden="true">
              <span className="conc__guide conc__guide--0" />
              <span className="conc__guide conc__guide--1" />
              <span className="conc__guide conc__guide--2" />
            </div>
          ) : null}
        </div>
      }
      controls={
        <>
          <Slider label="Outer radius" value={radius} min={0} max={96} step={2} onChange={setRadius} format={(v) => `${v}px`} />
          <Slider label="Padding" value={padding} min={4} max={48} step={2} onChange={setPadding} format={(v) => `${v}px`} />
          <label className="row row--inline">
            <span className="row__label">Naive (same radius)</span>
            <Switch label="Naive mode" checked={naive} onChange={setNaive} />
          </label>
          <label className="row row--inline">
            <span className="row__label">Corner guides</span>
            <Switch label="Corner guides" checked={guides} onChange={setGuides} />
          </label>
          <div className="readouts">
            <Readout label="r₀" value={`${r0}px`} />
            <Readout label="r₁" value={`${r1}px`} />
            <Readout label="r₂" value={`${r2}px`} />
          </div>
        </>
      }
    />
  )
}
