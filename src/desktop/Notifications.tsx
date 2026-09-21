import { useEffect } from 'react'
import { AppIcon } from '../icons/AppIcon'
import { Symbol } from '../icons/Symbol'
import { useStore } from '../os/store'
import type { Toast } from '../os/types'

interface NotificationsProps {
  /** iOS shows banners at the top centre; macOS at the top right. */
  placement: 'mac' | 'ios'
}

/** Notification banners, cut from the same glass as everything else. */
export function Notifications({ placement }: NotificationsProps) {
  const { state, dispatch } = useStore()
  return (
    <div className="notifications" data-placement={placement} aria-live="polite">
      {state.toasts.map((toast) => (
        <Banner key={toast.id} toast={toast} onDismiss={() => dispatch({ type: 'dismissToast', id: toast.id })} />
      ))}
    </div>
  )
}

function Banner({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const { dispatch } = useStore()
  useEffect(() => {
    const timer = window.setTimeout(onDismiss, 6000)
    return () => window.clearTimeout(timer)
  }, [onDismiss])

  const runAction = () => {
    if (toast.action?.actionId === 'undo-trash') dispatch({ type: 'trashUndo' })
    onDismiss()
  }

  return (
    <div className="banner glass glass-thick" role="status">
      {toast.appId ? <AppIcon appId={toast.appId} size={34} variant="mac" /> : <Symbol name="os.mark" size={30} />}
      <div className="banner-text">
        <strong>{toast.title}</strong>
        {toast.body ? <span>{toast.body}</span> : null}
      </div>
      {toast.action ? (
        <button type="button" className="banner-action" onClick={runAction}>
          {toast.action.label}
        </button>
      ) : null}
      <button type="button" className="banner-close" onClick={onDismiss} aria-label="Dismiss">
        <Symbol name="xmark" size={10} weight={3} />
      </button>
    </div>
  )
}
