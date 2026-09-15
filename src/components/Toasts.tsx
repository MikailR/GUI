import { useOS } from '../os/store'
import { AppIcon } from './Icons'

export function Toasts() {
  const os = useOS()
  return (
    <div className="toasts" aria-live="polite">
      {os.state.toasts.map((t) => (
        <div key={t.id} className="toast" onClick={() => os.untoast(t.id)}>
          <AppIcon id={t.icon ?? 'sysinfo'} size={34} />
          <div style={{ minWidth: 0 }}>
            <div className="tt">{t.title}</div>
            {t.body && <div className="tb">{t.body}</div>}
          </div>
        </div>
      ))}
    </div>
  )
}
