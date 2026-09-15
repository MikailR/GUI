import { useState } from 'react'
import { useOS } from '../os/store'

export function Trash() {
  const os = useOS()
  const [confirm, setConfirm] = useState(false)
  const items = os.state.trash

  return (
    <div className="app trash">
      <header className="app-head">
        <div>
          <p className="eyebrow">
            {items.length} item{items.length === 1 ? '' : 's'}
          </p>
          <h1 className="display sm">
            Where old projects <em>go to rest.</em>
          </h1>
        </div>
        {items.length > 0 && (
          <div className="row">
            {confirm ? (
              <>
                <button
                  className="btn accent"
                  onClick={() => {
                    os.trashEmpty()
                    setConfirm(false)
                  }}
                >
                  Yes, empty
                </button>
                <button className="btn" onClick={() => setConfirm(false)}>
                  Keep
                </button>
              </>
            ) : (
              <button className="btn" onClick={() => setConfirm(true)}>
                Empty Trash
              </button>
            )}
          </div>
        )}
      </header>
      {items.length ? (
        <table className="tbl">
          <thead>
            <tr>
              <th>Name</th>
              <th>Kind</th>
              <th>Deleted</th>
              <th className="num">Size</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((t) => (
              <tr key={t.id}>
                <td className="name">{t.name}</td>
                <td className="dim">{t.kind}</td>
                <td className="mono dim">{t.deleted}</td>
                <td className="mono dim num">{t.size}</td>
                <td className="act">
                  <button className="btn ghost sm" onClick={() => os.trashRestore(t.id)}>
                    Put back
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="empty-state">
          <p className="display xs">The Trash is empty.</p>
          <p className="dim">Which is how it stays until the next redesign.</p>
        </div>
      )}
    </div>
  )
}
