import { useState } from 'react'
import { Glyph } from '../icons/Glyph'
import { useOs, useOsActions } from '../os/store'
import type { AppScreenProps, TrashItem } from '../os/types'
import { AppPage, EmptyState } from './shared'

const KIND_LABEL: Record<TrashItem['kind'], string> = {
  image: 'Media',
  folder: 'Folder',
  code: 'Source',
  doc: 'Document',
  app: 'Application',
  design: 'Design file',
}

export default function Trash({ shell }: AppScreenProps) {
  const { state, dispatch } = useOs()
  const { toast } = useOsActions()
  const [confirming, setConfirming] = useState(false)
  const items = state.trash

  const emptyTrash = () => {
    const count = items.length
    dispatch({ type: 'TRASH_EMPTY' })
    setConfirming(false)
    toast({
      title: 'Trash emptied',
      body: `${count} item${count === 1 ? '' : 's'} gone. Probably fine.`,
      action: { label: 'Undo', actionId: 'restore-trash' },
    })
  }

  const toolbar = (
    <button type="button" className="glass-btn" disabled={items.length === 0} onClick={() => setConfirming(true)}>
      Empty…
    </button>
  )

  return (
    <>
      <AppPage shell={shell} title="Trash" eyebrow={items.length ? `${items.length} items` : 'Empty'} toolbar={toolbar}>
        {items.length === 0 ? (
          <EmptyState
            title="Trash is empty"
            body="Everything regrettable has been dealt with."
            action={
              <button type="button" className="glass-btn" onClick={() => dispatch({ type: 'TRASH_RESTORE_ALL' })}>
                Bring it all back
              </button>
            }
          />
        ) : (
          <ul className="trash">
            {items.map((item) => (
              <li key={item.id} className="trash__row">
                <span className={`trash__kind trash__kind--${item.kind}`} aria-hidden="true">
                  <Glyph name={item.kind === 'folder' ? 'grid' : item.kind === 'app' ? 'sparkle' : 'link'} size={16} />
                </span>
                <span className="trash__text">
                  <span className="trash__name">{item.name}</span>
                  <span className="trash__meta">
                    {KIND_LABEL[item.kind]} · {item.size} · deleted {item.deleted}
                    {item.note ? <em> — {item.note}</em> : null}
                  </span>
                </span>
                <button
                  type="button"
                  className="trash__delete"
                  aria-label={`Delete ${item.name} permanently`}
                  onClick={() => dispatch({ type: 'TRASH_REMOVE', id: item.id })}
                >
                  <Glyph name="close" size={14} strokeWidth={2.5} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </AppPage>

      {confirming ? (
        <div className="confirm-backdrop" onPointerDown={() => setConfirming(false)}>
          <div className="glass glass--thick confirm" role="alertdialog" aria-modal="true" onPointerDown={(e) => e.stopPropagation()}>
            <h3>Empty Trash?</h3>
            <p>
              {items.length} item{items.length === 1 ? '' : 's'} will be gone for good. You get one Undo.
            </p>
            <div className="confirm__actions">
              <button type="button" className="glass-btn" onClick={() => setConfirming(false)}>
                Cancel
              </button>
              <button type="button" className="glass-btn is-active" onClick={emptyTrash}>
                Empty Trash
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
