import { useRef, useState } from 'react';
import { trashItems } from '../content';
import { AppIcon, FileIcon } from '../os/icons';
import { useSettings } from '../os/settings';
import { useOS } from '../os/store';
import { formatDate, usePayload } from './shared';

export function Trash() {
  const os = useOS();
  const { settings, set, reducedMotion } = useSettings();
  const [selected, setSelected] = useState<string | null>(null);
  const [look, setLook] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);
  const [emptying, setEmptying] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const empty = settings.trashEmptied;

  usePayload((p) => p === 'empty' && !empty && setConfirm(true));

  const doEmpty = () => {
    setConfirm(false);
    setLook(null);
    setEmptying(true);
    const rows = listRef.current?.querySelectorAll<HTMLElement>('.trash-row') ?? [];
    const anims = [...rows].map((row, i) =>
      row.animate(
        [
          { transform: 'none', opacity: 1, filter: 'blur(0)' },
          { transform: reducedMotion ? 'none' : `translate(${(i % 2 ? 1 : -1) * 30}px, 40px) rotate(${(i % 2 ? 1 : -1) * 8}deg) scale(.6)`, opacity: 0, filter: 'blur(3px)' },
        ],
        { duration: reducedMotion ? 120 : 420, delay: reducedMotion ? 0 : i * 55, easing: 'cubic-bezier(.5,0,.75,0)', fill: 'forwards' },
      ),
    );
    Promise.all(anims.map((a) => a.finished)).then(() => {
      set('trashEmptied', true);
      setEmptying(false);
      os.notify({ title: 'Trash emptied', body: `${trashItems.length} regrets permanently deleted. Well, until you restore them.`, app: 'trash' });
    });
  };

  const item = trashItems.find((t) => t.id === look);

  return (
    <div className="trash" onKeyDown={(e) => e.key === ' ' && selected && (e.preventDefault(), setLook(look ? null : selected))}>
      <div className="toolbar">
        <div className="toolbar__doc">
          <strong>Trash</strong>
          <span className="mono">{empty ? 'empty' : `${trashItems.length} items · 1.83 GB`}</span>
        </div>
        <div className="toolbar__spacer" />
        {empty ? (
          <button className="btn btn--ghost" onClick={() => set('trashEmptied', false)}>
            Put Everything Back
          </button>
        ) : (
          <button className="btn btn--danger" onClick={() => setConfirm(true)} disabled={emptying}>
            Empty
          </button>
        )}
      </div>

      {empty ? (
        <div className="trash__empty">
          <AppIcon app="trash" size={96} />
          <h3>Trash is empty</h3>
          <p>Everything left is perfect. Obviously.</p>
        </div>
      ) : (
        <div className="trash__list" ref={listRef} role="grid" aria-label="Trash items">
          <div className="trash-row trash-row--head" role="row">
            <span>Name</span>
            <span>Date Deleted</span>
            <span>Size</span>
          </div>
          {trashItems.map((t) => (
            <div
              key={t.id}
              role="row"
              tabIndex={0}
              className={`trash-row ${selected === t.id ? 'is-selected' : ''}`}
              onClick={() => setSelected(t.id)}
              onDoubleClick={() => setLook(t.id)}
              onFocus={() => setSelected(t.id)}
              onKeyDown={(e) => e.key === 'Enter' && setLook(t.id)}
            >
              <span className="trash-row__name">
                <FileIcon kind={t.kind} size={24} />
                {t.name}
              </span>
              <span className="mono">{formatDate(t.deleted)}</span>
              <span className="mono">{t.size}</span>
            </div>
          ))}
          <p className="trash__hint">Double-click or press space for Quick Look.</p>
        </div>
      )}

      {item && (
        <div className="quicklook glass" role="dialog" aria-label={`Quick Look: ${item.name}`}>
          <FileIcon kind={item.kind} size={72} />
          <div>
            <h3>{item.name}</h3>
            <p className="mono">
              {item.size} · deleted {formatDate(item.deleted)}
            </p>
            <p className="quicklook__note">{item.note}</p>
          </div>
          <button className="btn btn--ghost" onClick={() => setLook(null)}>
            Close
          </button>
        </div>
      )}

      {confirm && (
        <div className="sheet-dialog-scrim">
          <div className="sheet-dialog glass" role="alertdialog" aria-label="Empty trash">
            <AppIcon app="trash" size={52} full />
            <h3>Permanently erase {trashItems.length} items?</h3>
            <p>You can’t undo this action. (You can, actually — it’s a prototype.)</p>
            <div className="sheet-dialog__actions">
              <button className="btn btn--ghost" onClick={() => setConfirm(false)}>
                Cancel
              </button>
              <button className="btn btn--danger" onClick={doEmpty} autoFocus>
                Empty Trash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
