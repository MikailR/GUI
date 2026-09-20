import { useRef, useState, type CSSProperties } from 'react'
import { Slider } from '../../components/controls'
import { LabFrame } from '../LabFrame'

const PASSAGE =
  'A real pane of glass is brightest at its edges, where light enters and bends. The material draws a one-pixel gradient ring that catches light on the top-left and bottom-right, plus a soft inner band. Take the rim away and the surface reads as a grey rectangle. Put it back and it reads as an object. Blur radius is a design decision, not a default: twelve pixels says sheet of paper, thirty says thick pane. Keep glass on chrome, keep content opaque, and never blur inside a scroll container.'

/**
 * A magnifying droplet. The lens clips a scaled duplicate of the passage so the text
 * underneath appears refracted; a specular rim and slight chromatic split sell the glass.
 */
export default function LiquidLens() {
  const boxRef = useRef<HTMLDivElement | null>(null)
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)
  const [pinned, setPinned] = useState(false)
  const [mag, setMag] = useState(1.7)
  const [size, setSize] = useState(170)

  const onMove = (e: React.PointerEvent) => {
    if (pinned) return
    const rect = boxRef.current?.getBoundingClientRect()
    if (!rect) return
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const lensStyle: CSSProperties | undefined = pos
    ? ({
        '--lx': `${pos.x}px`,
        '--ly': `${pos.y}px`,
        '--lsize': `${size}px`,
        '--lmag': mag,
        '--box-w': `${boxRef.current?.clientWidth ?? 0}px`,
      } as CSSProperties)
    : undefined

  return (
    <LabFrame
      hint={pinned ? 'Pinned. Click to release.' : 'Move over the text. Click to pin.'}
      stage={
        <div
          className={`lens-box ${pos ? 'has-lens' : ''}`}
          ref={boxRef}
          onPointerMove={onMove}
          onPointerDown={(e) => {
            onMove(e)
            setPinned((p) => !p)
          }}
          onPointerLeave={() => {
            if (!pinned) setPos(null)
          }}
          role="img"
          aria-label="Passage with a magnifying lens following the pointer"
        >
          <p className="lens-text">{PASSAGE}</p>
          {pos ? (
            <div className="lens" style={lensStyle} aria-hidden="true">
              <div className="lens__inner">
                <p className="lens-text lens-text--zoomed">{PASSAGE}</p>
              </div>
              <div className="lens__rim" />
            </div>
          ) : null}
        </div>
      }
      controls={
        <>
          <Slider label="Magnification" value={mag} min={1.1} max={2.6} step={0.1} onChange={setMag} format={(v) => `${v.toFixed(1)}×`} />
          <Slider label="Lens size" value={size} min={100} max={260} step={10} onChange={setSize} format={(v) => `${v}px`} />
        </>
      }
    />
  )
}
