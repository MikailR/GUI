import { motion } from 'framer-motion'
import { useOS } from './store'
import { MOD_LABEL } from './MenuBar'

const K = ({ children }: { children: React.ReactNode }) => <kbd className="key">{children}</kbd>

export function Help() {
  const os = useOS()
  return (
    <motion.div className="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.14 }} onPointerDown={(e) => e.target === e.currentTarget && os.setHelp(false)}>
      <motion.div className="help" role="dialog" aria-label="Keyboard shortcuts" initial={{ scale: 0.96, y: -8 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.97, y: -6 }} transition={{ type: 'spring', stiffness: 500, damping: 36 }}>
        <h2>
          Keys for <em>Mikail OS</em>
        </h2>
        <dl>
          <dt>
            <K>{MOD_LABEL}</K>
            <K>K</K>
          </dt>
          <dd>Open the launcher</dd>
          <dt>
            <K>Esc</K>
          </dt>
          <dd>Close the focused window (or this panel)</dd>
          <dt>
            <K>{MOD_LABEL}</K>
            <K>W</K>
          </dt>
          <dd>Close the focused window</dd>
          <dt>
            <K>{MOD_LABEL}</K>
            <K>M</K>
          </dt>
          <dd>Minimise to dock</dd>
          <dt>
            <K>{MOD_LABEL}</K>
            <K>↑</K>
          </dt>
          <dd>Maximise / restore</dd>
          <dt>
            <K>{MOD_LABEL}</K>
            <K>`</K>
          </dt>
          <dd>Cycle focus through open windows</dd>
          <dt>
            <K>Alt</K>
            <K>1–7</K>
          </dt>
          <dd>Open the n-th dock app</dd>
          <dt>
            <K>{MOD_LABEL}</K>
            <K>T</K>
          </dt>
          <dd>Terminal</dd>
          <dt>
            <K>?</K>
          </dt>
          <dd>This panel</dd>
        </dl>
        <p>Double-click a title bar to maximise. Drag edges to resize. Window positions are remembered between visits.</p>
      </motion.div>
    </motion.div>
  )
}
