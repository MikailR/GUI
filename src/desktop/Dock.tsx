import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { AppIcon, appGlow } from '../icons/AppIcon'
import { DOCK_APPS } from '../os/apps'
import { useReducedMotion } from '../os/hooks'
import { useOs } from '../os/store'
import type { AppId } from '../os/types'

const BASE = 52 // icon size in px
const MAX_MAG = 0.5 // +50% at the cursor
const SIGMA = BASE * 1.6

interface DockProps {
  onActivate: (appId: AppId) => void
  /** App ids that should play a launch bounce. */
  bouncing: ReadonlySet<AppId>
}

/**
 * Floating glass Dock with continuous Gaussian magnification:
 * every icon scales by 1 + MAX·e^(−d²/2σ²) where d is its distance to the pointer.
 * Scales are written straight to CSS variables (no React re-render per move).
 */
export function Dock({ onActivate, bouncing }: DockProps) {
  const { state } = useOs()
  const reducedMotion = useReducedMotion()
  const itemRefs = useRef<Map<AppId, HTMLButtonElement>>(new Map())
  const dockRef = useRef<HTMLDivElement | null>(null)
  const [hovered, setHovered] = useState<AppId | null>(null)
  const [resting, setResting] = useState(true)

  const items: AppId[] = [...DOCK_APPS.map((a) => a.id), 'trash']

  const applyScales = useCallback(
    (pointerX: number | null) => {
      for (const [, el] of itemRefs.current) {
        if (pointerX === null || reducedMotion) {
          el.style.setProperty('--s', '1')
          continue
        }
        const rect = el.getBoundingClientRect()
        const center = rect.left + rect.width / 2
        const d = pointerX - center
        const scale = 1 + MAX_MAG * Math.exp(-(d * d) / (2 * SIGMA * SIGMA))
        el.style.setProperty('--s', scale.toFixed(3))
      }
    },
    [reducedMotion],
  )

  const onPointerMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    if (resting) setResting(false)
    applyScales(e.clientX)
  }
  const onPointerLeave = () => {
    setResting(true)
    setHovered(null)
    applyScales(null)
  }

  useEffect(() => {
    applyScales(null)
  }, [applyScales])

  return (
    <div className="dock-wrap">
      <div
        ref={dockRef}
        className={`glass dock ${resting ? 'is-resting' : ''}`}
        role="toolbar"
        aria-label="Dock"
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        {items.map((appId, index) => {
          const win = state.windows[appId]
          const running = Boolean(win)
          const isTrash = appId === 'trash'
          const label = isTrash ? (state.trash.length ? `Trash (${state.trash.length} items)` : 'Trash (empty)') : titleOf(appId)
          return (
            <div key={appId} className="dock__slot" style={{ '--i': index } as CSSProperties}>
              {isTrash ? <div className="dock__sep" aria-hidden="true" /> : null}
              <button
                ref={(el) => {
                  if (el) itemRefs.current.set(appId, el)
                  else itemRefs.current.delete(appId)
                }}
                type="button"
                className={`dock__item ${bouncing.has(appId) ? 'is-bouncing' : ''} ${running ? 'is-running' : ''}`}
                style={{ '--glow': appGlow(appId) } as CSSProperties}
                data-dock-app={appId}
                aria-label={label}
                onClick={() => onActivate(appId)}
                onPointerEnter={() => setHovered(appId)}
                onFocus={() => setHovered(appId)}
                onBlur={() => setHovered(null)}
              >
                <span className="dock__icon">
                  <AppIcon appId={appId} size={BASE} full={isTrash && state.trash.length > 0} />
                </span>
                <span className={`dock__dot ${running ? 'is-on' : ''} ${win?.minimized ? 'is-minimized' : ''}`} aria-hidden="true" />
                {hovered === appId ? (
                  <span className="glass glass--thin dock__tooltip" role="tooltip">
                    {label}
                  </span>
                ) : null}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function titleOf(appId: AppId): string {
  const found = DOCK_APPS.find((a) => a.id === appId)
  return found ? found.title : appId
}
