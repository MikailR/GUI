import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { APPS, type AppId } from '../apps/registry'
import { useOS } from './store'
import { AppIcon } from './AppIcon'

const BASE = 50
const PEAK = 74

function DockItem({ id, mouseX }: { id: AppId; mouseX: MotionValue<number> }) {
  const os = useOS()
  const ref = useRef<HTMLButtonElement>(null)
  const [hover, setHover] = useState(false)
  const meta = APPS.find((a) => a.id === id)!
  const win = os.state.wins.find((w) => w.id === id)

  const dist = useTransform(mouseX, (v) => {
    const b = ref.current?.getBoundingClientRect()
    return b ? v - b.left - b.width / 2 : Infinity
  })
  const size = useSpring(useTransform(dist, [-150, 0, 150], [BASE, PEAK, BASE]), { mass: 0.1, stiffness: 180, damping: 14 })

  return (
    <motion.button
      ref={ref}
      className={`dock-item ${win ? 'running' : ''} ${win?.min ? 'minimized' : ''}`}
      style={{ width: size, height: size }}
      onClick={() => os.open(id)}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      whileTap={{ y: 2 }}
      aria-label={meta.title}
    >
      <AppIcon id={id} />
      <span className="dock-dot" />
      {hover && (
        <motion.span className="dock-tip" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
          {meta.title}
        </motion.span>
      )}
    </motion.button>
  )
}

export function Dock() {
  const mouseX = useMotionValue(Infinity)
  const main = APPS.filter((a) => a.dock && a.id !== 'trash')
  return (
    <div className="dock-wrap">
      <motion.div className="dock" onPointerMove={(e) => mouseX.set(e.clientX)} onPointerLeave={() => mouseX.set(Infinity)}>
        {main.map((a) => (
          <DockItem key={a.id} id={a.id} mouseX={mouseX} />
        ))}
        <div className="dock-sep" />
        <DockItem id="trash" mouseX={mouseX} />
      </motion.div>
    </div>
  )
}
