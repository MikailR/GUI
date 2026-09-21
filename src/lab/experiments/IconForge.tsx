import { useId, useRef, useState } from 'react'
import { Button, Segmented } from '../../components/controls'
import { ICON_BOX, ICON_SQUIRCLE } from '../../icons/squircle'
import { Symbol, type SymbolName } from '../../icons/Symbol'
import { ControlStrip, Param } from '../LabControls'
import type { ExperimentProps } from '../registry'

type Base = 'gradient' | 'white' | 'black'

const GLYPHS: SymbolName[] = ['person', 'trophy', 'flask', 'gear', 'star', 'sparkles', 'book', 'clock', 'photo', 'moon']

interface Forge {
  hueA: number
  hueB: number
  glyph: SymbolName
  glyphSize: number
  light: number
  base: Base
}

export default function IconForge({ compact }: ExperimentProps) {
  const [forge, setForge] = useState<Forge>({ hueA: 205, hueB: 250, glyph: 'sparkles', glyphSize: 58, light: 135, base: 'gradient' })
  const svgRef = useRef<SVGSVGElement | null>(null)
  const set = <K extends keyof Forge>(key: K) => (value: Forge[K]) => setForge((f) => ({ ...f, [key]: value }))

  const download = () => {
    const svg = svgRef.current
    if (!svg) return
    const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `icon-${forge.glyph}.svg`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="lab-experiment icon-forge" data-compact={compact || undefined}>
      <div className="icon-forge-stage">
        <div className="icon-forge-preview">
          <ForgeIcon forge={forge} size={compact ? 150 : 180} ref={svgRef} />
          <span>App Store</span>
        </div>
        <div className="icon-forge-preview">
          <ForgeIcon forge={forge} size={60} />
          <span>Home Screen</span>
        </div>
        <div className="icon-forge-preview">
          <ForgeIcon forge={forge} size={40} />
          <span>Dock</span>
        </div>
        <div className="icon-forge-preview icon-forge-dark">
          <ForgeIcon forge={forge} size={60} />
          <span>On dark</span>
        </div>
      </div>

      <ControlStrip>
        <Param label="Hue A" value={forge.hueA} min={0} max={360} onChange={set('hueA')} format={(v) => `${v}°`} />
        <Param label="Hue B" value={forge.hueB} min={0} max={360} onChange={set('hueB')} format={(v) => `${v}°`} />
        <Param label="Glyph size" value={forge.glyphSize} min={36} max={80} onChange={set('glyphSize')} />
        <Param label="Light angle" value={forge.light} min={0} max={360} onChange={set('light')} format={(v) => `${v}°`} />
        <div className="lab-param">
          <span className="lab-param-label">Base</span>
          <Segmented<Base>
            value={forge.base}
            onChange={set('base')}
            label="Icon base"
            size="small"
            options={[
              { value: 'gradient', label: 'Gradient' },
              { value: 'white', label: 'White' },
              { value: 'black', label: 'Black' },
            ]}
          />
        </div>
      </ControlStrip>

      <div className="icon-forge-glyphs" role="radiogroup" aria-label="Glyph">
        {GLYPHS.map((glyph) => (
          <button
            key={glyph}
            type="button"
            role="radio"
            aria-checked={forge.glyph === glyph}
            className="icon-forge-glyph"
            onClick={() => set('glyph')(glyph)}
            aria-label={glyph}
          >
            <Symbol name={glyph} size={18} weight={2.2} />
          </button>
        ))}
        <Button size="small" variant="tinted" icon="arrow.up" onClick={download}>
          Download SVG
        </Button>
      </div>
    </div>
  )
}

interface ForgeIconProps {
  forge: Forge
  size: number
  ref?: React.Ref<SVGSVGElement>
}

function ForgeIcon({ forge, size, ref }: ForgeIconProps) {
  const uid = useId().replace(/:/g, '')
  const rad = ((forge.light - 90) * Math.PI) / 180
  const x2 = 0.5 + Math.cos(rad) * 0.5
  const y2 = 0.5 + Math.sin(rad) * 0.5
  const x1 = 1 - x2
  const y1 = 1 - y2

  const from = forge.base === 'gradient' ? `hsl(${forge.hueA} 92% 68%)` : forge.base === 'white' ? '#ffffff' : '#2c2c2e'
  const to = forge.base === 'gradient' ? `hsl(${forge.hueB} 85% 48%)` : forge.base === 'white' ? '#e6eaf2' : '#0a0a0c'
  const glyphColor = forge.base === 'white' ? `hsl(${forge.hueA} 80% 50%)` : '#ffffff'
  const glyphScale = forge.glyphSize / 24
  const glyphOffset = (ICON_BOX - 24 * glyphScale) / 2

  return (
    <svg ref={ref} width={size} height={size} viewBox={`0 0 ${ICON_BOX} ${ICON_BOX}`} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <clipPath id={`c${uid}`}>
          <path d={ICON_SQUIRCLE} />
        </clipPath>
        <linearGradient id={`g${uid}`} x1={x1} y1={y1} x2={x2} y2={y2}>
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
        <linearGradient id={`s${uid}`} x1={x1} y1={y1} x2={x2} y2={y2}>
          <stop offset="0" stopColor="#fff" stopOpacity="0.32" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.04" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`r${uid}`} x1={x1} y1={y1} x2={x2} y2={y2}>
          <stop offset="0" stopColor="#fff" stopOpacity="0.75" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.1" />
        </linearGradient>
        <filter id={`d${uid}`} x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="1.6" stdDeviation="1.4" floodColor="#000" floodOpacity={forge.base === 'white' ? 0.12 : 0.25} />
        </filter>
      </defs>
      <g clipPath={`url(#c${uid})`}>
        <rect width={ICON_BOX} height={ICON_BOX} fill={`url(#g${uid})`} />
        <g
          transform={`translate(${glyphOffset} ${glyphOffset}) scale(${glyphScale})`}
          filter={`url(#d${uid})`}
          fill="none"
          stroke={glyphColor}
          strokeWidth={2.1}
          strokeLinecap="round"
          strokeLinejoin="round"
          color={glyphColor}
        >
          <Symbol name={forge.glyph} size={24} weight={2.1} style={{ overflow: 'visible' }} />
        </g>
        <rect width={ICON_BOX} height={ICON_BOX} fill={`url(#s${uid})`} />
      </g>
      <path d={ICON_SQUIRCLE} fill="none" stroke={`url(#r${uid})`} strokeWidth="1.6" transform="translate(60 60) scale(0.987) translate(-60 -60)" />
    </svg>
  )
}
