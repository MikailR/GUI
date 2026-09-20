import type { ReactNode } from 'react'

interface LabFrameProps {
  hint: string
  /** The interactive surface. */
  stage: ReactNode
  /** Sliders, toggles, readouts. */
  controls?: ReactNode
  /** Extra footer content (e.g. generated CSS). */
  footer?: ReactNode
  stageClassName?: string
}

/** Common layout for experiments: stage on top, controls beneath, an optional footer. */
export function LabFrame({ hint, stage, controls, footer, stageClassName }: LabFrameProps) {
  return (
    <div className="lab-frame">
      <p className="lab-frame__hint">{hint}</p>
      <div className={`lab-stage ${stageClassName ?? ''}`}>{stage}</div>
      {controls ? <div className="lab-controls">{controls}</div> : null}
      {footer ? <div className="lab-footer">{footer}</div> : null}
    </div>
  )
}

/** Small monospace readout chip. */
export function Readout({ label, value }: { label: string; value: string }) {
  return (
    <span className="readout">
      <span className="readout__label">{label}</span>
      <code>{value}</code>
    </span>
  )
}

export function CopyButton({ text }: { text: string }) {
  return (
    <button
      type="button"
      className="glass-btn"
      onClick={() => {
        navigator.clipboard?.writeText(text).catch(() => undefined)
      }}
    >
      Copy CSS
    </button>
  )
}
