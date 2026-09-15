import { TRASH_ITEMS } from "../data/content";
import { useOS } from "../os/OSContext";

export function Trash() {
  const { trashEmptied, askEmptyTrash, restoreTrash } = useOS();

  if (trashEmptied) {
    return (
      <div className="app-trash empty">
        <p>The Trash is empty.</p>
        <p className="muted">A rare and unstable state.</p>
        <button type="button" className="text-btn" onClick={restoreTrash}>
          Put everything back
        </button>
      </div>
    );
  }

  return (
    <div className="app-trash">
      <header className="trash-bar">
        <span>{TRASH_ITEMS.length} items</span>
        <button type="button" className="text-btn danger-text" onClick={askEmptyTrash}>
          Empty Trash…
        </button>
      </header>
      <ul className="trash-grid">
        {TRASH_ITEMS.map((item) => (
          <li key={item.id} title={item.note}>
            <div className="file-glyph" />
            <strong>{item.name}</strong>
            <span>
              {item.kind} · {item.date}
            </span>
          </li>
        ))}
      </ul>
      <p className="muted trash-note">Hover a file. Each one almost shipped.</p>
    </div>
  );
}
