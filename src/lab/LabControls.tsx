import { useState, type ReactNode } from 'react'
import { Button, Slider } from '../components/controls'

/** Shared controls chrome for experiments: a glass control strip + labelled sliders. */

export function ControlStrip({ children }: { children: ReactNode }) {
  return <div className="lab-controls">{children}</div>
}

interface ParamProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (next: number) => void
  format?: (value: number) => string
}

export function Param({ label, value, min, max, step, onChange, format }: ParamProps) {
  return (
    <label className="lab-param">
      <span className="lab-param-label">{label}</span>
      <Slider value={value} min={min} max={max} step={step} onChange={onChange} label={label} format={format ?? ((v) => String(v))} />
    </label>
  )
}

export function CopyButton({ text, label = 'Copy CSS' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1400)
    } catch {
      /* clipboard unavailable */
    }
  }
  return (
    <Button size="small" variant="tinted" icon={copied ? 'checkmark' : 'doc'} onClick={copy}>
      {copied ? 'Copied' : label}
    </Button>
  )
}

export function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="lab-code selectable">
      <code>{code}</code>
    </pre>
  )
}
