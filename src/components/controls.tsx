import type { CSSProperties, ReactNode } from 'react'

/* Small, shared form controls styled like Apple's. All targets ≥ 44px tall on phone via .row. */

interface SwitchProps {
  checked: boolean
  onChange: (next: boolean) => void
  label: string
}

export function Switch({ checked, onChange, label }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className="switch"
      onClick={() => onChange(!checked)}
    />
  )
}

interface SegmentedProps<T extends string> {
  value: T
  options: { value: T; label: ReactNode }[]
  onChange: (value: T) => void
  ariaLabel: string
  className?: string
}

export function Segmented<T extends string>({ value, options, onChange, ariaLabel, className }: SegmentedProps<T>) {
  return (
    <div className={`glass glass--thin glass--flat glass-seg ${className ?? ''}`} role="group" aria-label={ariaLabel}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className="glass-seg__item"
          aria-pressed={opt.value === value}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

interface SliderProps {
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  label: string
  format?: (value: number) => string
}

export function Slider({ value, min, max, step = 1, onChange, label, format }: SliderProps) {
  const fill = `${((value - min) / (max - min)) * 100}%`
  return (
    <label className="slider-row">
      <span className="slider-row__label">
        <span>{label}</span>
        <span className="slider-row__value">{format ? format(value) : value}</span>
      </span>
      <input
        className="slider"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        style={{ '--fill': fill } as CSSProperties}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  )
}

interface RowProps {
  label: ReactNode
  hint?: ReactNode
  children?: ReactNode
  onClick?: () => void
}

/** A settings row: label + optional hint on the left, control on the right. */
export function Row({ label, hint, children, onClick }: RowProps) {
  const inner = (
    <>
      <span className="row__text">
        <span className="row__label">{label}</span>
        {hint ? <span className="row__hint">{hint}</span> : null}
      </span>
      <span className="row__control">{children}</span>
    </>
  )
  if (onClick) {
    return (
      <button type="button" className="row row--button" onClick={onClick}>
        {inner}
      </button>
    )
  }
  return <div className="row">{inner}</div>
}

export function Group({ title, children }: { title?: ReactNode; children: ReactNode }) {
  return (
    <section className="group">
      {title ? <h3 className="group__title">{title}</h3> : null}
      <div className="group__body">{children}</div>
    </section>
  )
}
