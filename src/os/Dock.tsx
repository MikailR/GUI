import { useRef, useState } from 'react';
import { APPS, DOCK_APPS } from './meta';
import { iconRegistry } from './registry';
import { useSettings } from './settings';
import { useOS } from './store';
import { AppIcon } from './icons';
import type { AppId } from './types';

const BASE = 50;
const MAX = 84;
const RANGE = 150;

export function Dock() {
  const os = useOS();
  const { settings, reducedMotion } = useSettings();
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [bouncing, setBouncing] = useState<AppId | null>(null);
  const itemRefs = useRef(new Map<AppId, HTMLElement>());
  const centers = useRef(new Map<AppId, number>());

  const magnify = settings.magnify && !reducedMotion;

  const sizeFor = (id: AppId) => {
    if (!magnify || mouseX === null) return BASE;
    const c = centers.current.get(id);
    if (c === undefined) return BASE;
    const d = Math.abs(mouseX - c);
    if (d > RANGE) return BASE;
    // cosine falloff reads smoother than a gaussian at the edges
    return BASE + (MAX - BASE) * (Math.cos((d / RANGE) * Math.PI) + 1) / 2;
  };

  const measure = () => {
    // measure resting centres once per hover so the dock doesn't chase itself
    if (mouseX !== null) return;
    itemRefs.current.forEach((el, id) => {
      const r = el.getBoundingClientRect();
      centers.current.set(id, r.left + r.width / 2);
    });
  };

  const launch = (id: AppId, e: React.MouseEvent) => {
    const w = os.state.wins[id];
    if (w && !w.closing) {
      if (w.minimized || os.state.focused !== id) os.focus(id);
      else os.minimize(id);
      return;
    }
    if (!reducedMotion) {
      setBouncing(id);
      setTimeout(() => setBouncing(null), 700);
    }
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    os.open(id, { origin: { x: r.left, y: r.top, w: r.width, h: r.height } });
  };

  const trashFull = !settings.trashEmptied;
  const items: (AppId | '|')[] = [...DOCK_APPS, '|', 'trash'];

  return (
    <nav
      className="dock"
      aria-label="Dock"
      onPointerEnter={(e) => {
        if (e.pointerType !== 'mouse') return;
        measure();
        setMouseX(e.clientX);
      }}
      onPointerMove={(e) => e.pointerType === 'mouse' && setMouseX(e.clientX)}
      onPointerLeave={() => setMouseX(null)}
    >
      <div className="dock__shelf" />
      {items.map((id, i) =>
        id === '|' ? (
          <div key={`sep${i}`} className="dock__sep" />
        ) : (
          <button
            key={id}
            ref={(el) => {
              if (el) itemRefs.current.set(id, el);
              iconRegistry.set(`dock:${id}`, el);
            }}
            className={`dock__item ${bouncing === id ? 'is-bouncing' : ''}`}
            style={{ '--s': `${sizeFor(id)}px` } as React.CSSProperties}
            onClick={(e) => launch(id, e)}
            aria-label={APPS[id].title}
          >
            <span className="dock__label">{APPS[id].short ?? APPS[id].title}</span>
            <AppIcon app={id} size={MAX} full={id === 'trash' ? trashFull : undefined} className="dock__icon" />
            <span className={`dock__dot ${os.state.wins[id] ? 'is-on' : ''}`} />
          </button>
        ),
      )}
    </nav>
  );
}
