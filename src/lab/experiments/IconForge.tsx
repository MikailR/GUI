import { useRef, useState } from 'react'
import { Button, Segmented } from '../../components/controls'
import { GlyphIcon } from '../../icons/GlyphIcon'
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
  const [forge, setForge] = useState<Forge>({ hueA: 205, hueB: 250, glyph: 'sparkles', glyphSize: 58, light: 150, base: 'gradient' })
  const previewRef = useRef<HTMLDivElement | null>(null)
  const set = <K extends keyof Forge>(key: K) => (value: Forge[K]) => setForge((f) => ({ ...f, [key]: value }))

  const download = () => {
    const svg = previewRef.current?.querySelector('svg')
    if (!svg) return
    const clone = svg.cloneNode(true) as SVGSVGElement
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    clone.setAttribute('width', '1024')
    clone.setAttribute('height', '1024')
    const blob = new Blob([clone.outerHTML], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `icon-${forge.glyph}.svg`
    link.click()
    URL.revokeObjectURL(url)
  }

  const from = forge.base === 'gradient' ? `hsl(${forge.hueA} 92% 68%)` : forge.base === 'white' ? '#ffffff' : '#2c2c2e'
  const to = forge.base === 'gradient' ? `hsl(${forge.hueB} 85% 48%)` : forge.base === 'white' ? '#e6eaf2' : '#0a0a0c'
  const glyphColor = forge.base === 'white' ? `hsl(${forge.hueA} 80% 50%)` : '#ffffff'
  const icon = (size: number) => (
    <GlyphIcon symbol={forge.glyph} from={from} to={to} glyphColor={glyphColor} glyphSize={forge.glyphSize} lightAngle={forge.light} size={size} />
  )

  return (
    <div className="lab-experiment icon-forge" data-compact={compact || undefined}>
      <div className="icon-forge-stage">
        <div className="icon-forge-preview" ref={previewRef}>
          {icon(compact ? 150 : 180)}
          <span>App Store</span>
        </div>
        <div className="icon-forge-preview">
          {icon(60)}
          <span>Home Screen</span>
        </div>
        <div className="icon-forge-preview">
          {icon(40)}
          <span>Dock</span>
        </div>
        <div className="icon-forge-preview icon-forge-dark">
          {icon(60)}
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
