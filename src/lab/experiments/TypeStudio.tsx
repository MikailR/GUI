import { useRef, useState, type CSSProperties } from 'react'
import { Slider, Switch } from '../../components/controls'
import { useReducedMotion } from '../../os/hooks'
import { LabFrame, Readout } from '../LabFrame'

const SIGMA_LETTERS = 1.6

/**
 * Variable-weight headline with sliders, and letters that flinch under the cursor using the same
 * Gaussian falloff as the Dock. Optional "glass" fill uses background-clip: text.
 */
export default function TypeStudio() {
  const [text, setText] = useState('Liquid glass, honestly')
  const [weight, setWeight] = useState(650)
  const [tracking, setTracking] = useState(-3)
  const [size, setSize] = useState(64)
  const [glass, setGlass] = useState(true)
  const [serif, setSerif] = useState(false)
  const reducedMotion = useReducedMotion()
  const letterRefs = useRef<HTMLSpanElement[]>([])

  const onMove = (e: React.PointerEvent) => {
    if (reducedMotion) return
    for (const el of letterRefs.current) {
      if (!el) continue
      const r = el.getBoundingClientRect()
      const d = (e.clientX - (r.left + r.width / 2)) / Math.max(1, r.width)
      const bump = Math.exp(-(d * d) / (2 * SIGMA_LETTERS * SIGMA_LETTERS))
      el.style.setProperty('--bump', bump.toFixed(3))
    }
  }
  const onLeave = () => {
    for (const el of letterRefs.current) el?.style.setProperty('--bump', '0')
  }

  const style = {
    '--w': weight,
    '--track': `${tracking / 100}em`,
    '--size': `${size}px`,
    fontFamily: serif ? "'New York', 'Iowan Old Style', Georgia, 'Times New Roman', serif" : 'var(--font-ui)',
  } as CSSProperties

  const letters = Array.from(text)

  return (
    <LabFrame
      hint="Hover the headline; use the sliders."
      stageClassName="lab-stage--type"
      stage={
        <div className={`type-stage ${glass ? 'is-glass' : ''}`} style={style} onPointerMove={onMove} onPointerLeave={onLeave}>
          <h2 className="type-headline" aria-label={text}>
            {letters.map((ch, i) => (
              <span
                key={`${i}-${ch}`}
                ref={(el) => {
                  if (el) letterRefs.current[i] = el
                }}
                className="type-letter"
                aria-hidden="true"
              >
                {ch === ' ' ? '\u00A0' : ch}
              </span>
            ))}
          </h2>
        </div>
      }
      controls={
        <>
          <label className="field">
            <span className="field__label">Text</span>
            <input className="field__input" value={text} maxLength={40} onChange={(e) => setText(e.target.value)} />
          </label>
          <Slider label="Weight" value={weight} min={100} max={900} step={10} onChange={setWeight} />
          <Slider label="Tracking" value={tracking} min={-8} max={12} step={1} onChange={setTracking} format={(v) => `${(v / 100).toFixed(2)}em`} />
          <Slider label="Size" value={size} min={28} max={120} step={2} onChange={setSize} format={(v) => `${v}px`} />
          <label className="row row--inline">
            <span className="row__label">Glass fill</span>
            <Switch label="Glass fill" checked={glass} onChange={setGlass} />
          </label>
          <label className="row row--inline">
            <span className="row__label">Serif</span>
            <Switch label="Serif" checked={serif} onChange={setSerif} />
          </label>
          <div className="readouts">
            <Readout label="font" value={`${weight} ${size}px / ${(tracking / 100).toFixed(2)}em`} />
          </div>
        </>
      }
    />
  )
}
