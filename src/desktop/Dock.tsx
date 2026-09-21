import { useCallback, useEffect, useRef, type PointerEvent } from 'react'
import { AppIcon } from '../icons/AppIcon'
import { APPS, appMeta } from '../os/apps'
import type { AppId, WindowState } from '../os/types'
import { useCaustic } from '../components/useCaustic'

const ICON = 52
const GAP = 6
/** Gaussian magnification parameters (in icon widths). */
const SIGMA = 1.35
const PEAK = 0.62

interface DockProps {
  windows: WindowState[]
  trashFull: boolean
  magnify: boolean
  launchTick: Partial<Record<AppId, number>>
  onOpen: (appId: AppId) => void
}

const DOCK_APPS = APPS.filter((app) => app.inDock && app.id !== 'trash')

export function Dock({ windows, trashFull, magnify, launchTick, onOpen }: DockProps) {
  const trayRef = useRef<HTMLDivElement | null>(null)
  const { onPointerMove: caustic } = useCaustic()

  const items = useCallback(
    () => Array.from(trayRef.current?.querySelectorAll<HTMLElement>('[data-dock-item]') ?? []),
    [],
  )

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      caustic(event)
      if (!magnify || event.pointerType === 'touch') return
      const tray = trayRef.current
      if (!tray) return
      tray.setAttribute('data-live', '')
      const x = event.clientX
      items().forEach((item) => {
        const rect = item.getBoundingClientRect()
        const centre = rect.left + rect.width / 2
        const d = (x - centre) / (ICON + GAP)
        const s = 1 + PEAK * Math.exp(-(d * d) / (2 * SIGMA * SIGMA))
        item.style.setProperty('--s', s.toFixed(3))
      })
    },
    [caustic, items, magnify],
  )

  const onPointerLeave = useCallback(() => {
    const tray = trayRef.current
    if (!tray) return
    tray.removeAttribute('data-live')
    items().forEach((item) => item.style.setProperty('--s', '1'))
  }, [items])

  useEffect(() => {
    if (!magnify) onPointerLeave()
  }, [magnify, onPointerLeave])

  const running = new Set(windows.map((win) => win.id))

  return (
    <nav className="mac-dock" aria-label="Dock">
      <div
        ref={trayRef}
        className="mac-dock-tray glass glass-caustic"
        style={{ '--rim-angle': '160deg' } as React.CSSProperties}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        {DOCK_APPS.map((app) => (
          <DockItem
            key={app.id}
            appId={app.id}
            running={running.has(app.id)}
            launchTick={launchTick[app.id] ?? 0}
            onOpen={onOpen}
          />
        ))}
        <span className="mac-dock-sep" aria-hidden="true" />
        <DockItem appId="trash" running={running.has('trash')} launchTick={launchTick.trash ?? 0} onOpen={onOpen} full={trashFull} />
      </div>
    </nav>
  )
}

interface DockItemProps {
  appId: AppId
  running: boolean
  launchTick: number
  onOpen: (appId: AppId) => void
  full?: boolean
}

function DockItem({ appId, running, launchTick, onOpen, full }: DockItemProps) {
  const ref = useRef<HTMLButtonElement | null>(null)
  const meta = appMeta(appId)

  useEffect(() => {
    if (launchTick === 0) return
    const el = ref.current
    if (!el) return
    el.removeAttribute('data-bounce')
    void el.offsetWidth
    el.setAttribute('data-bounce', '')
    const timer = window.setTimeout(() => el.removeAttribute('data-bounce'), 900)
    return () => window.clearTimeout(timer)
  }, [launchTick])

  return (
    <button
      ref={ref}
      type="button"
      className="mac-dock-item"
      data-dock-item={appId}
      data-running={running || undefined}
      onClick={() => onOpen(appId)}
      aria-label={meta.name}
    >
      <span className="mac-dock-tip glass glass-thin" role="tooltip">
        {meta.name}
      </span>
      <span className="mac-dock-icon">
        <AppIcon appId={appId} size={ICON} variant="mac" full={full} />
      </span>
      <span className="mac-dock-dot" aria-hidden="true" />
    </button>
  )
}
