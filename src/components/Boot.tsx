import { useEffect, useState } from 'react'
import { Ico } from './Icons'

export function Boot({ onDone }: { onDone: () => void }) {
  const [done, setDone] = useState(false)
  useEffect(() => {
    const t = window.setTimeout(() => setDone(true), 1750)
    return () => window.clearTimeout(t)
  }, [])
  useEffect(() => {
    if (!done) return
    const t = window.setTimeout(onDone, 700)
    return () => window.clearTimeout(t)
  }, [done, onDone])
  return (
    <div className={`boot ${done ? 'done' : ''}`} onClick={() => setDone(true)} role="presentation">
      <div className="boot-inner">
        <div className="boot-logo">
          <Ico.Logo size={84} />
        </div>
        <div className="boot-bar">
          <i />
        </div>
        <div className="boot-hint">click to skip</div>
      </div>
    </div>
  )
}
