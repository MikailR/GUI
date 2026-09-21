import type { CSSProperties } from 'react'
import { ICON_BOX } from './squircle'
import { IconShell, type IconVariant } from './IconShell'
import { Symbol, type SymbolName } from './Symbol'

interface GlyphIconProps {
  symbol: SymbolName
  from: string
  to: string
  size?: number
  variant?: IconVariant
  /** Glyph colour; defaults to white. */
  glyphColor?: string
  /** Glyph box in icon units (of 120). */
  glyphSize?: number
  lightAngle?: number
  className?: string
  style?: CSSProperties
}

/**
 * A squircle icon built from a UI glyph — used for home-screen shortcuts
 * (links, deep links) that are not full apps but should sit in the same family.
 */
export function GlyphIcon({
  symbol,
  from,
  to,
  size = 60,
  variant = 'ios',
  glyphColor = '#fff',
  glyphSize = 60,
  lightAngle,
  className,
  style,
}: GlyphIconProps) {
  const scale = glyphSize / 24
  const offset = (ICON_BOX - 24 * scale) / 2
  return (
    <IconShell size={size} variant={variant} from={from} to={to} lightAngle={lightAngle} className={className} style={style}>
      {(shadow) => (
        <g transform={`translate(${offset} ${offset}) scale(${scale})`} filter={shadow} color={glyphColor}>
          <Symbol name={symbol} size={24} weight={2.1} style={{ overflow: 'visible' }} />
        </g>
      )}
    </IconShell>
  )
}
