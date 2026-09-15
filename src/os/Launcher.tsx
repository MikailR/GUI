import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { APPS, type AppId } from '../apps/registry'
import { posts } from '../data/content'
import { useOS } from './store'
import { AppIcon } from './AppIcon'

interface Item {
  key: string
  title: string
  sub: string
  kind: string
  icon: AppId
  run: () => void
}

export function Launcher() {
  const os = useOS()
  const [q, setQ] = useState('')
  const [i, setI] = useState(0)
  const input = useRef<HTMLInputElement>(null)

  useEffect(() => input.current?.focus(), [])

  const items = useMemo<Item[]>(() => {
    const all: Item[] = [
      ...APPS.map((a) => ({ key: a.id, title: a.title, sub: a.blurb, kind: 'app', icon: a.id, run: () => os.open(a.id) })),
      ...posts.map((p) => ({ key: p.slug, title: p.title, sub: p.dek, kind: 'essay', icon: 'writing' as AppId, run: () => os.open('writing') })),
      { key: 'wall-dusk', title: 'Wallpaper: Dusk', sub: 'Warm violet to ember', kind: 'setting', icon: 'settings', run: () => os.setSettings({ wallpaper: 'dusk' }) },
      { key: 'wall-night', title: 'Wallpaper: Night', sub: 'Indigo with a pale moon', kind: 'setting', icon: 'settings', run: () => os.setSettings({ wallpaper: 'night' }) },
      { key: 'wall-dawn', title: 'Wallpaper: Dawn', sub: 'Blue-grey to gold', kind: 'setting', icon: 'settings', run: () => os.setSettings({ wallpaper: 'dawn' }) },
      { key: 'tile', title: 'Tile windows', sub: 'Arrange open windows in a grid', kind: 'command', icon: 'settings', run: () => os.tile() },
      { key: 'closeall', title: 'Close all windows', sub: 'Clean desk', kind: 'command', icon: 'trash', run: () => os.closeAll() },
    ]
    const s = q.trim().toLowerCase()
    if (!s) return all.slice(0, 8)
    return all.filter((it) => (it.title + ' ' + it.sub + ' ' + it.kind).toLowerCase().includes(s)).slice(0, 9)
  }, [q, os])

  useEffect(() => setI(0), [q])

  const go = (it: Item | undefined) => {
    if (!it) return
    it.run()
    os.setLauncher(false)
  }

  return (
    <motion.div className="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.14 }} onPointerDown={(e) => e.target === e.currentTarget && os.setLauncher(false)}>
      <motion.div
        className="launcher"
        role="dialog"
        aria-label="Launcher"
        initial={{ scale: 0.96, y: -8 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.97, y: -6 }}
        transition={{ type: 'spring', stiffness: 500, damping: 36 }}
      >
        <input
          ref={input}
          value={q}
          placeholder="Open an app, an essay, a setting…"
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              setI((v) => Math.min(items.length - 1, v + 1))
            } else if (e.key === 'ArrowUp') {
              e.preventDefault()
              setI((v) => Math.max(0, v - 1))
            } else if (e.key === 'Enter') go(items[i])
          }}
        />
        <ul>
          {items.map((it, idx) => (
            <li key={it.key} className={idx === i ? 'active' : ''}>
              <button onClick={() => go(it)} onPointerMove={() => setI(idx)}>
                <AppIcon id={it.icon} />
                <div>
                  <div className="l-title">{it.title}</div>
                  <div className="l-sub">{it.sub}</div>
                </div>
                <span className="l-kind">{it.kind}</span>
              </button>
            </li>
          ))}
          {!items.length && <li className="empty">Nothing on this machine matches that.</li>}
        </ul>
      </motion.div>
    </motion.div>
  )
}
