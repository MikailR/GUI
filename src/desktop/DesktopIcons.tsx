import { useEffect, useRef, useState } from 'react'
import { AppIcon } from '../icons/AppIcon'
import { DESKTOP_APPS } from '../os/apps'
import { useOs } from '../os/store'
import type { AppId } from '../os/types'

interface DesktopIconsProps {
  onOpen: (appId: AppId) => void
}

/**
 * Right-aligned column of desktop icons. Click selects, double-click (or Enter / touch tap) opens.
 * Clicking the empty desktop clears the selection.
 */
export function DesktopIcons({ onOpen }: DesktopIconsProps) {
  const { state } = useOs()
  const [selected, setSelected] = useState<AppId | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setSelected(null)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  return (
    <div className="desktop-icons no-select" ref={containerRef} role="list" aria-label="Desktop">
      {DESKTOP_APPS.map((app) => {
        const isSelected = selected === app.id
        const isTrash = app.id === 'trash'
        return (
          <button
            key={app.id}
            type="button"
            role="listitem"
            className={`desktop-icon ${isSelected ? 'is-selected' : ''}`}
            aria-label={`${app.title}${isTrash ? (state.trash.length ? ` (${state.trash.length} items)` : ' (empty)') : ''}`}
            onClick={() => setSelected(app.id)}
            onDoubleClick={() => onOpen(app.id)}
            onPointerUp={(e) => {
              if (e.pointerType === 'touch') onOpen(app.id)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onOpen(app.id)
              }
            }}
            onFocus={() => setSelected(app.id)}
          >
            <span className="desktop-icon__art">
              <AppIcon appId={app.id} size={64} full={isTrash && state.trash.length > 0} />
            </span>
            <span className="desktop-icon__label">{app.title}</span>
          </button>
        )
      })}
    </div>
  )
}
