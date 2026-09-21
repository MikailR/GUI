import { useState } from 'react'
import { Button } from '../components/controls'
import { Symbol, type SymbolName } from '../icons/Symbol'
import { useStore, useTrash } from '../os/store'
import type { TrashItem } from '../os/types'
import { AppFrame } from './frame'
import type { AppProps } from './types'

const KIND_ICON: Record<TrashItem['kind'], SymbolName> = {
  design: 'paintbrush',
  folder: 'square.stack',
  code: 'command',
  doc: 'doc',
  app: 'grid',
  image: 'photo',
}

const KIND_COLOR: Record<TrashItem['kind'], string> = {
  design: '#ff6a9d',
  folder: '#4aa3ff',
  code: '#8b5cff',
  doc: '#8e8e93',
  app: '#34c759',
  image: '#ff9f0a',
}

type Pending = { kind: 'one'; item: TrashItem } | { kind: 'all' } | null

export default function Trash({ shell }: AppProps) {
  const { items, canUndo } = useTrash()
  const { dispatch } = useStore()
  const [pending, setPending] = useState<Pending>(null)
  const [selected, setSelected] = useState<string | null>(null)

  const confirm = () => {
    if (!pending) return
    if (pending.kind === 'all') {
      dispatch({ type: 'trashEmpty' })
      dispatch({
        type: 'toast',
        toast: {
          appId: 'trash',
          title: 'Trash emptied',
          body: `${items.length} item${items.length === 1 ? '' : 's'} deleted permanently.`,
          action: { label: 'Undo', actionId: 'undo-trash' },
        },
      })
    } else {
      dispatch({ type: 'trashDelete', ids: [pending.item.id] })
      dispatch({
        type: 'toast',
        toast: {
          appId: 'trash',
          title: 'Deleted',
          body: pending.item.name,
          action: { label: 'Undo', actionId: 'undo-trash' },
        },
      })
    }
    setPending(null)
    setSelected(null)
  }

  const toolbar = (
    <>
      {canUndo ? (
        <Button size="small" icon="undo" onClick={() => dispatch({ type: 'trashUndo' })}>
          Put Back
        </Button>
      ) : null}
      <Button size="small" variant="tinted" disabled={items.length === 0} onClick={() => setPending({ kind: 'all' })}>
        Empty…
      </Button>
    </>
  )

  return (
    <AppFrame shell={shell} title="Trash" toolbar={toolbar}>
      <div className="trash" data-shell={shell}>
        {items.length === 0 ? (
          <div className="trash-empty">
            <Symbol name="trash" size={44} weight={1.6} />
            <h2>Trash is empty</h2>
            <p>Nothing here but the faint smell of shipped regrets.</p>
            {canUndo ? (
              <Button variant="tinted" icon="undo" onClick={() => dispatch({ type: 'trashUndo' })}>
                Put everything back
              </Button>
            ) : null}
          </div>
        ) : (
          <>
            {shell === 'mac' ? (
              <div className="trash-header" aria-hidden="true">
                <span>Name</span>
                <span>Date Deleted</span>
                <span>Size</span>
                <span />
              </div>
            ) : null}
            <ul className="trash-list" role="list">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="trash-row"
                  data-selected={selected === item.id || undefined}
                  onClick={() => setSelected(item.id)}
                >
                  <span className="trash-icon" style={{ '--icon-color': KIND_COLOR[item.kind] } as React.CSSProperties}>
                    <Symbol name={KIND_ICON[item.kind]} size={15} weight={2.4} />
                  </span>
                  <span className="trash-name">
                    <span>{item.name}</span>
                    {item.note ? <small>{item.note}</small> : null}
                  </span>
                  <span className="trash-date tnum">{new Date(item.deleted).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  <span className="trash-size tnum">{item.size}</span>
                  <span className="trash-actions">
                    <Button size="small" variant="destructive" onClick={() => setPending({ kind: 'one', item })} ariaLabel={`Delete ${item.name} immediately`}>
                      Delete
                    </Button>
                  </span>
                </li>
              ))}
            </ul>
            <p className="trash-footer">
              {items.length} item{items.length === 1 ? '' : 's'} · Items are shown here until you empty the Trash.
            </p>
          </>
        )}
      </div>

      {pending ? (
        <div className="alert-backdrop" onPointerDown={(event) => event.target === event.currentTarget && setPending(null)}>
          <div className={`alert glass glass-thick ${shell === 'ios' ? 'is-action-sheet' : ''}`} role="alertdialog" aria-modal="true" aria-labelledby="trash-alert-title">
            <div className="alert-icon">
              <Symbol name="trash" size={28} weight={1.8} />
            </div>
            <h2 id="trash-alert-title">{pending.kind === 'all' ? 'Empty Trash?' : `Delete “${pending.item.name}”?`}</h2>
            <p>
              {pending.kind === 'all'
                ? `All ${items.length} items will be deleted immediately. You can undo from the notification.`
                : 'The item will be deleted immediately. You can undo from the notification.'}
            </p>
            <div className="alert-actions">
              <Button variant="destructive" size={shell === 'ios' ? 'large' : 'regular'} onClick={confirm}>
                {pending.kind === 'all' ? 'Empty Trash' : 'Delete'}
              </Button>
              <Button variant={shell === 'ios' ? 'glass' : 'plain'} size={shell === 'ios' ? 'large' : 'regular'} onClick={() => setPending(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </AppFrame>
  )
}
