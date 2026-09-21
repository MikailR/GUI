import { useState } from 'react'
import { AppIcon } from '../icons/AppIcon'
import { APPS } from '../os/apps'
import type { AppId } from '../os/types'

interface DesktopIconsProps {
  trashFull: boolean
  onOpen: (appId: AppId) => void
}

const DESKTOP_APPS = APPS.filter((app) => app.onDesktop)

/** Finder-style desktop icons: right-aligned column, single click selects, double click opens. */
export function DesktopIcons({ trashFull, onOpen }: DesktopIconsProps) {
  const [selected, setSelected] = useState<AppId | null>(null)
  return (
    <div className="mac-desktop-icons" onPointerDown={(event) => event.target === event.currentTarget && setSelected(null)}>
      {DESKTOP_APPS.map((app) => (
        <button
          key={app.id}
          type="button"
          className="mac-desktop-icon"
          data-selected={selected === app.id || undefined}
          onClick={() => setSelected(app.id)}
          onDoubleClick={() => onOpen(app.id)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') onOpen(app.id)
          }}
          aria-label={`${app.name} (double-click to open)`}
        >
          <span className="mac-desktop-icon-art">
            <AppIcon appId={app.id} size={60} variant="mac" full={app.id === 'trash' && trashFull} />
          </span>
          <span className="mac-desktop-icon-label on-wallpaper">{app.name}</span>
        </button>
      ))}
    </div>
  )
}
