import { useEffect, useState } from 'react'
import { APPS, type AppId } from '../apps/registry'
import { useOS } from './store'
import { AppIcon } from './AppIcon'

export function DesktopIcons() {
  const os = useOS()
  const [sel, setSel] = useState<AppId | null>(null)
  const coarse = window.matchMedia('(pointer: coarse)').matches

  useEffect(() => {
    const clear = (e: PointerEvent) => {
      if (!(e.target as HTMLElement).closest('.icon')) setSel(null)
    }
    window.addEventListener('pointerdown', clear)
    return () => window.removeEventListener('pointerdown', clear)
  }, [])

  return (
    <div className="icons">
      {APPS.filter((a) => a.desktop).map((a) => (
        <button
          key={a.id}
          className={`icon ${sel === a.id ? 'sel' : ''}`}
          onClick={() => (coarse ? os.open(a.id) : setSel(a.id))}
          onDoubleClick={() => os.open(a.id)}
          onKeyDown={(e) => e.key === 'Enter' && os.open(a.id)}
          title={coarse ? undefined : 'Double-click to open'}
        >
          <AppIcon id={a.id} size={50} />
          <span>{a.title}</span>
        </button>
      ))}
    </div>
  )
}
