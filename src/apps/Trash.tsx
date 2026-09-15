import { useState } from 'react'
import { useOS } from '../os/store'
import type { TrashItem } from '../os/types'
import { fmtDate } from '../os/hooks'
import { AppIcon } from '../components/Icons'

const KIND_ICON: Record<TrashItem['kind'], string> = { doc: '📄', folder: '📁', image: '🖼️', code: '🧩', app: '📦' }

export default function Trash() {
  const os = useOS()
  const items = os.state.trash
  const [sel, setSel] = useState<string | null>(null)
  const [confirm, setConfirm] = useState(false)
  const [emptying, setEmptying] = useState(false)

  const putBack = (it: TrashItem) => {
    os.trashRestore(it.id)
    os.toast('Put back', `${it.name} is back on the desktop. Metaphorically.`, 'trash')
    setSel(null)
  }
  const empty = () => {
    setConfirm(false)
    setEmptying(true)
    window.setTimeout(() => {
      os.trashEmpty()
      setEmptying(false)
      os.toast('Trash emptied', 'Nothing of value was lost. Probably.', 'trash')
    }, 500)
  }

  return (
    <div className="app" style={{ flexDirection: 'column', position: 'relative' }}>
      <div className="toolbar">
        <span>{items.length} item{items.length === 1 ? '' : 's'}</span>
        <span className="grow" />
        <button className="btn small" disabled={!sel} style={{ opacity: sel ? 1 : 0.5 }} onClick={() => { const it = items.find((i) => i.id === sel); if (it) putBack(it) }}>Put Back</button>
        <button className="btn small danger" disabled={!items.length} style={{ opacity: items.length ? 1 : 0.5 }} onClick={() => setConfirm(true)}>Empty…</button>
      </div>
      <div className="app-main scroll" onClick={() => setSel(null)}>
        {items.length === 0 ? (
          <div className="empty">
            <div>
              <AppIcon id="trash" size={72} />
              <p style={{ marginTop: 10 }}>Trash is empty.</p>
              <p style={{ fontSize: 12 }}>A clean conscience, briefly.</p>
            </div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ color: 'var(--text-3)', fontSize: 11, textAlign: 'left' }}>
                <th style={{ padding: '8px 18px', fontWeight: 600 }}>Name</th>
                <th style={{ padding: '8px 12px', fontWeight: 600 }}>Size</th>
                <th style={{ padding: '8px 12px', fontWeight: 600 }}>Deleted</th>
                <th style={{ padding: '8px 12px', fontWeight: 600 }}>Note</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, i) => (
                <tr
                  key={it.id}
                  onClick={(e) => { e.stopPropagation(); setSel(it.id) }}
                  onDoubleClick={() => putBack(it)}
                  style={{
                    background: sel === it.id ? 'var(--sel)' : i % 2 ? 'var(--card)' : 'transparent',
                    cursor: 'default',
                    transition: 'opacity 0.4s, transform 0.4s',
                    opacity: emptying ? 0 : 1,
                    transform: emptying ? `translateY(${20 + i * 6}px) scale(0.98)` : 'none',
                    transitionDelay: emptying ? `${i * 40}ms` : '0ms',
                  }}
                >
                  <td style={{ padding: '7px 18px', whiteSpace: 'nowrap' }}><span style={{ marginRight: 8 }}>{KIND_ICON[it.kind]}</span>{it.name}</td>
                  <td style={{ padding: '7px 12px', color: 'var(--text-2)', whiteSpace: 'nowrap' }} className="stat">{it.size}</td>
                  <td style={{ padding: '7px 12px', color: 'var(--text-2)', whiteSpace: 'nowrap' }}>{fmtDate(it.deleted)}</td>
                  <td style={{ padding: '7px 12px', color: 'var(--text-3)', fontStyle: 'italic' }}>{it.note ?? ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {confirm && (
        <div className="dialog-scrim" onClick={() => setConfirm(false)}>
          <div className="dialog" onClick={(e) => e.stopPropagation()} role="alertdialog">
            <AppIcon id="trash" size={56} />
            <h3>Empty Trash?</h3>
            <p>All {items.length} items will be permanently deleted. You cannot undo this action, but you can refresh the page.</p>
            <div className="row">
              <button className="btn" onClick={() => setConfirm(false)} autoFocus>Cancel</button>
              <button className="btn danger" onClick={empty}>Empty Trash</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
