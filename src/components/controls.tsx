import { useId, type CSSProperties, type ReactNode } from 'react'
import { Symbol, type SymbolName } from '../icons/Symbol'

/* ----------------------------------------------------------------- Switch */

interface SwitchProps {
  checked: boolean
  onChange: (next: boolean) => void
  label: string
  disabled?: boolean
}

/** iOS/macOS toggle: green track, white knob, spring travel. */
export function Switch({ checked, onChange, label, disabled }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className="ui-switch"
      data-on={checked || undefined}
      disabled={disabled}
      onClick={() => onChange(!checked)}
    >
      <span className="ui-switch-knob" />
    </button>
  )
}

/* -------------------------------------------------------------- Segmented */

export interface SegmentOption<T extends string> {
  value: T
  label: ReactNode
  title?: string
}

interface SegmentedProps<T extends string> {
  value: T
  options: readonly SegmentOption<T>[]
  onChange: (next: T) => void
  label: string
  size?: 'regular' | 'small'
}

export function Segmented<T extends string>({ value, options, onChange, label, size = 'regular' }: SegmentedProps<T>) {
  const index = Math.max(0, options.findIndex((option) => option.value === value))
  return (
    <div
      className="ui-segmented"
      role="radiogroup"
      aria-label={label}
      data-size={size}
      style={{ '--count': options.length, '--index': index } as CSSProperties}
    >
      <span className="ui-segmented-thumb" aria-hidden="true" />
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={option.value === value}
          title={option.title}
          className="ui-segment"
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

/* ----------------------------------------------------------------- Slider */

interface SliderProps {
  value: number
  min: number
  max: number
  step?: number
  onChange: (next: number) => void
  label: string
  format?: (value: number) => string
  icon?: SymbolName
}

export function Slider({ value, min, max, step = 1, onChange, label, format, icon }: SliderProps) {
  const id = useId()
  const percent = ((value - min) / (max - min)) * 100
  return (
    <div className="ui-slider" style={{ '--p': `${percent}%` } as CSSProperties}>
      {icon ? <Symbol name={icon} size={14} className="ui-slider-icon" /> : null}
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      {format ? (
        <output htmlFor={id} className="ui-slider-value tnum">
          {format(value)}
        </output>
      ) : null}
    </div>
  )
}

/* ----------------------------------------------------------------- Button */

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'plain' | 'filled' | 'tinted' | 'destructive' | 'glass'
  size?: 'regular' | 'small' | 'large'
  icon?: SymbolName
  disabled?: boolean
  title?: string
  className?: string
  type?: 'button' | 'submit'
  ariaLabel?: string
}

export function Button({
  children,
  onClick,
  variant = 'plain',
  size = 'regular',
  icon,
  disabled,
  title,
  className,
  type = 'button',
  ariaLabel,
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`ui-button ${variant === 'glass' ? 'glass glass-thin glass-button' : ''} ${className ?? ''}`}
      data-variant={variant}
      data-size={size}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={ariaLabel}
    >
      {icon ? <Symbol name={icon} size={size === 'small' ? 13 : 15} weight={2.4} /> : null}
      {children}
    </button>
  )
}

/* -------------------------------------------------------------- Inset list */

interface GroupProps {
  title?: ReactNode
  footer?: ReactNode
  children: ReactNode
  className?: string
}

/** iOS inset-grouped / macOS form group. */
export function Group({ title, footer, children, className }: GroupProps) {
  return (
    <section className={`ui-group ${className ?? ''}`}>
      {title ? <h3 className="ui-group-title">{title}</h3> : null}
      <div className="ui-group-body">{children}</div>
      {footer ? <p className="ui-group-footer">{footer}</p> : null}
    </section>
  )
}

interface RowProps {
  label: ReactNode
  detail?: ReactNode
  /** Coloured squircle icon on the leading edge (iOS Settings style). */
  icon?: SymbolName
  iconColor?: string
  children?: ReactNode
  onClick?: () => void
  chevron?: boolean
  selected?: boolean
  className?: string
  /** Stacks label + detail vertically (for long detail text). */
  stacked?: boolean
}

export function Row({ label, detail, icon, iconColor, children, onClick, chevron, selected, className, stacked }: RowProps) {
  const content = (
    <>
      {icon ? (
        <span className="ui-row-icon" style={{ '--icon-color': iconColor ?? 'var(--sys-gray)' } as CSSProperties}>
          <Symbol name={icon} size={15} weight={2.4} />
        </span>
      ) : null}
      <span className="ui-row-text" data-stacked={stacked || undefined}>
        <span className="ui-row-label">{label}</span>
        {detail ? <span className="ui-row-detail">{detail}</span> : null}
      </span>
      {children ? <span className="ui-row-trailing">{children}</span> : null}
      {chevron ? <Symbol name="chevron.right" size={13} weight={2.6} className="ui-row-chevron" /> : null}
    </>
  )
  if (onClick) {
    return (
      <button type="button" className={`ui-row ui-row-button ${className ?? ''}`} onClick={onClick} aria-current={selected || undefined}>
        {content}
      </button>
    )
  }
  return <div className={`ui-row ${className ?? ''}`}>{content}</div>
}

/* ------------------------------------------------------------------ Chips */

export function Chip({ children, tone }: { children: ReactNode; tone?: 'accent' | 'neutral' | 'warm' }) {
  return (
    <span className="ui-chip" data-tone={tone ?? 'neutral'}>
      {children}
    </span>
  )
}

/* ----------------------------------------------------------------- Kbd */

export function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="ui-kbd">{children}</kbd>
}
