import { useEffect } from 'react'
import { useOs } from '../os/store'
import type { Toast } from '../os/types'

interface ToastsProps {
  onAction: (actionId: NonNullable<Toast['action']>['actionId']) => void
}

/** Glass notifications, top-right, auto-dismiss after 4.5s. */
export function Toasts({ onAction }: ToastsProps) {
  const { state, dispatch } = useOs()

  useEffect(() => {
    if (state.toasts.length === 0) return
    const newest = state.toasts[state.toasts.length - 1]
    const timer = window.setTimeout(() => dispatch({ type: 'TOAST_DISMISS', id: newest.id }), 4500)
    return () => window.clearTimeout(timer)
  }, [state.toasts, dispatch])

  if (state.toasts.length === 0) return null

  return (
    <div className="toasts" role="status" aria-live="polite">
      {state.toasts.map((toast) => (
        <div key={toast.id} className="glass toast">
          <div className="toast__text">
            <strong>{toast.title}</strong>
            {toast.body ? <span>{toast.body}</span> : null}
          </div>
          {toast.action ? (
            <button
              type="button"
              className="glass-btn"
              onClick={() => {
                onAction(toast.action!.actionId)
                dispatch({ type: 'TOAST_DISMISS', id: toast.id })
              }}
            >
              {toast.action.label}
            </button>
          ) : null}
          <button type="button" className="toast__close" aria-label="Dismiss" onClick={() => dispatch({ type: 'TOAST_DISMISS', id: toast.id })}>
            ×
          </button>
        </div>
      ))}
    </div>
  )
}
