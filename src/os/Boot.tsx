import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const LINES = [
  'mounting /home/mikail … ok',
  'loading wallpaper: dusk (topographic)',
  'restoring window layout from localStorage',
  'starting dock, menubar, 8 apps',
  'no login required. welcome.',
]

export function Boot({ onDone }: { onDone: () => void }) {
  const [n, setN] = useState(1)
  useEffect(() => {
    const timers = LINES.map((_, i) => setTimeout(() => setN(i + 1), 220 + i * 240))
    const done = setTimeout(onDone, 1750)
    const skip = () => onDone()
    window.addEventListener('keydown', skip)
    window.addEventListener('pointerdown', skip)
    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(done)
      window.removeEventListener('keydown', skip)
      window.removeEventListener('pointerdown', skip)
    }
  }, [onDone])

  return (
    <motion.div className="boot" initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.5 } }}>
      <motion.div className="boot-inner" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="boot-logo">
          Mikail <em>OS</em>
        </div>
        <div className="boot-bar">
          <i />
        </div>
        <div className="boot-log" aria-live="polite">
          {LINES.slice(0, n).map((l) => (
            <div key={l}>{l}</div>
          ))}
        </div>
        <div className="boot-hint">press any key to skip</div>
      </motion.div>
    </motion.div>
  )
}
