import { memo, useEffect, useLayoutEffect, useRef, type ReactNode } from 'react';
import { spring } from '../lib/motion';
import { APPS } from './meta';
import { iconRegistry } from './registry';
import { useSettings } from './settings';
import { desktopBounds, MENUBAR_H, useOS, WinContext } from './store';
import type { Rect, Win } from './types';
import { AppIcon } from './icons';

export type SnapZone = 'left' | 'right' | 'max' | null;

interface Props {
  win: Win;
  z: number;
  focused: boolean;
  onSnapPreview: (zone: SnapZone) => void;
  children: ReactNode;
}

const DIRS = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'] as const;
type Dir = (typeof DIRS)[number];

function zoneRect(zone: Exclude<SnapZone, null>): Rect {
  const b = desktopBounds();
  const pad = 8;
  if (zone === 'max') return b;
  const half = Math.round((b.w - pad * 3) / 2);
  return { x: zone === 'left' ? pad : pad * 2 + half, y: b.y + pad, w: half, h: b.h - pad * 2 };
}

function applyRect(el: HTMLElement, r: Rect) {
  el.style.transform = `translate3d(${r.x}px, ${r.y}px, 0)`;
  el.style.width = `${r.w}px`;
  el.style.height = `${r.h}px`;
}

function flyTransform(from: Rect, to: Rect) {
  const sx = from.w / to.w;
  const sy = from.h / to.h;
  const dx = from.x + from.w / 2 - (to.x + to.w / 2);
  const dy = from.y + from.h / 2 - (to.y + to.h / 2);
  return `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
}

export const Window = memo(function Window({ win, z, focused, onSnapPreview, children }: Props) {
  const os = useOS();
  const { reducedMotion } = useSettings();
  const posRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef(win.rect);
  const meta = APPS[win.id];
  const prevMin = useRef(win.minimized);
  const prevMax = useRef(win.maximized);

  // keep the live rect in sync with committed state
  useLayoutEffect(() => {
    rectRef.current = win.rect;
    if (posRef.current) applyRect(posRef.current, win.rect);
  }, [win.rect]);

  // animate geometry changes that come from maximize / snap (not from drags)
  useLayoutEffect(() => {
    if (prevMax.current === win.maximized) return;
    prevMax.current = win.maximized;
    const el = posRef.current;
    if (!el || reducedMotion) return;
    el.classList.add('win-pos--tween');
    const t = setTimeout(() => el.classList.remove('win-pos--tween'), 360);
    return () => clearTimeout(t);
  }, [win.maximized, reducedMotion]);

  // open: zoom out of the icon that launched it
  useLayoutEffect(() => {
    const el = frameRef.current!;
    if (reducedMotion) {
      el.animate({ opacity: [0, 1] }, { duration: 140, easing: 'ease-out' });
      return;
    }
    const s = spring(260, 22);
    const from = win.origin ? flyTransform(win.origin, win.rect) : 'translateY(14px) scale(.94)';
    el.animate(
      [
        { transform: from, opacity: 0, filter: 'blur(6px)' },
        { opacity: 1, filter: 'blur(0px)', offset: 0.35 },
        { transform: 'none', opacity: 1, filter: 'blur(0px)' },
      ],
      { duration: s.duration, easing: s.easing },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // close
  useEffect(() => {
    if (!win.closing) return;
    const el = frameRef.current!;
    el.getAnimations().forEach((a) => a.cancel());
    const anim = el.animate(
      [
        { transform: 'none', opacity: 1 },
        { transform: reducedMotion ? 'none' : 'scale(.94) translateY(6px)', opacity: 0 },
      ],
      { duration: reducedMotion ? 120 : 180, easing: 'cubic-bezier(.4,0,1,1)', fill: 'forwards' },
    );
    anim.onfinish = () => os.remove(win.id);
    return () => {
      anim.onfinish = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [win.closing]);

  // minimize → fly into the dock icon, restore → fly back out
  useLayoutEffect(() => {
    if (prevMin.current === win.minimized) return;
    prevMin.current = win.minimized;
    const el = frameRef.current!;
    const pos = posRef.current!;
    const target = iconRegistry.rect(`dock:${win.id}`) ?? { x: window.innerWidth / 2 - 20, y: window.innerHeight - 40, w: 40, h: 40 };
    el.getAnimations().forEach((a) => a.cancel());
    if (win.minimized) {
      const anim = el.animate(
        [
          { transform: 'none', opacity: 1, filter: 'blur(0px)' },
          { transform: reducedMotion ? 'none' : flyTransform(target, rectRef.current), opacity: 0, filter: reducedMotion ? 'none' : 'blur(4px)' },
        ],
        { duration: reducedMotion ? 120 : 420, easing: 'cubic-bezier(.55,0,.85,.35)', fill: 'forwards' },
      );
      anim.onfinish = () => (pos.style.visibility = 'hidden');
    } else {
      pos.style.visibility = '';
      const s = spring(240, 24);
      el.animate(
        [
          { transform: reducedMotion ? 'none' : flyTransform(target, rectRef.current), opacity: 0 },
          { opacity: 1, offset: 0.3 },
          { transform: 'none', opacity: 1 },
        ],
        { duration: reducedMotion ? 120 : s.duration, easing: reducedMotion ? 'ease-out' : s.easing },
      );
    }
  }, [win.minimized, win.id, reducedMotion]);

  // ---- dragging (direct DOM writes, one React commit on release) ----
  const startDrag = (e: React.PointerEvent) => {
    if (e.button !== 0 || (e.target as HTMLElement).closest('button, input, [data-no-drag]')) return;
    os.focus(win.id);
    const el = posRef.current!;
    const handle = e.currentTarget as HTMLElement;
    handle.setPointerCapture(e.pointerId);
    const startX = e.clientX;
    const startY = e.clientY;
    let base = { ...rectRef.current };
    let moved = false;
    let frame = 0;
    let zone: SnapZone = null;

    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      if (!moved && Math.hypot(dx, dy) < 4) return;
      if (!moved) {
        moved = true;
        document.body.classList.add('is-dragging');
        if (win.maximized) {
          // pop out of maximized under the cursor, keeping relative grab point
          const restore = win.prevRect ?? { ...base, w: meta.size[0], h: meta.size[1] };
          const ratio = (startX - base.x) / base.w;
          base = { x: startX - restore.w * ratio, y: base.y, w: restore.w, h: restore.h };
          os.unmaximize(win.id, base);
        }
      }
      const b = desktopBounds();
      const next = {
        ...base,
        x: Math.min(Math.max(base.x + dx, -base.w + 120), b.w - 120),
        y: Math.min(Math.max(base.y + dy, MENUBAR_H), window.innerHeight - 60),
      };
      rectRef.current = next;
      const nz: SnapZone = ev.clientY <= MENUBAR_H + 2 ? 'max' : ev.clientX <= 3 ? 'left' : ev.clientX >= window.innerWidth - 4 ? 'right' : null;
      if (nz !== zone) {
        zone = nz;
        onSnapPreview(zone);
      }
      frame ||= requestAnimationFrame(() => {
        applyRect(el, rectRef.current);
        frame = 0;
      });
    };
    const up = () => {
      handle.removeEventListener('pointermove', move);
      handle.removeEventListener('pointerup', up);
      handle.removeEventListener('pointercancel', up);
      cancelAnimationFrame(frame);
      document.body.classList.remove('is-dragging');
      if (!moved) return;
      applyRect(el, rectRef.current);
      if (zone) {
        onSnapPreview(null);
        if (!reducedMotion) {
          el.classList.add('win-pos--tween');
          setTimeout(() => el.classList.remove('win-pos--tween'), 360);
        }
        os.snap(win.id, zoneRect(zone), zone === 'max');
      } else {
        os.setRect(win.id, rectRef.current);
      }
    };
    handle.addEventListener('pointermove', move);
    handle.addEventListener('pointerup', up);
    handle.addEventListener('pointercancel', up);
  };

  const startResize = (dir: Dir) => (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    os.focus(win.id);
    const el = posRef.current!;
    const handle = e.currentTarget as HTMLElement;
    handle.setPointerCapture(e.pointerId);
    const sx = e.clientX;
    const sy = e.clientY;
    const base = { ...rectRef.current };
    const [minW, minH] = meta.min;
    let frame = 0;
    document.body.classList.add('is-dragging');

    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - sx;
      const dy = ev.clientY - sy;
      const r = { ...base };
      if (dir.includes('e')) r.w = Math.max(minW, base.w + dx);
      if (dir.includes('s')) r.h = Math.max(minH, base.h + dy);
      if (dir.includes('w')) {
        r.w = Math.max(minW, base.w - dx);
        r.x = base.x + base.w - r.w;
      }
      if (dir.includes('n')) {
        const maxUp = base.y - MENUBAR_H;
        r.h = Math.max(minH, Math.min(base.h - dy, base.h + maxUp));
        r.y = base.y + base.h - r.h;
      }
      rectRef.current = r;
      frame ||= requestAnimationFrame(() => {
        applyRect(el, rectRef.current);
        frame = 0;
      });
    };
    const up = () => {
      handle.removeEventListener('pointermove', move);
      handle.removeEventListener('pointerup', up);
      cancelAnimationFrame(frame);
      document.body.classList.remove('is-dragging');
      applyRect(el, rectRef.current);
      if (win.maximized) os.unmaximize(win.id, rectRef.current);
      else os.setRect(win.id, rectRef.current);
    };
    handle.addEventListener('pointermove', move);
    handle.addEventListener('pointerup', up);
  };

  return (
    <div
      ref={posRef}
      className="win-pos"
      style={{ zIndex: z, transform: `translate3d(${win.rect.x}px, ${win.rect.y}px, 0)`, width: win.rect.w, height: win.rect.h }}
      onPointerDownCapture={() => !focused && os.focus(win.id)}
    >
      <section
        ref={frameRef}
        className={`win ${focused ? 'is-focused' : ''} ${win.maximized ? 'is-max' : ''}`}
        role="dialog"
        aria-label={meta.title}
        data-app={win.id}
      >
        <header className="win__bar" onPointerDown={startDrag} onDoubleClick={(e) => !(e.target as HTMLElement).closest('button') && os.toggleMaximize(win.id)}>
          <div className="traffic" data-no-drag>
            <button className="traffic__btn traffic__btn--close" aria-label="Close window" onClick={() => os.close(win.id)}>
              <svg viewBox="0 0 10 10"><path d="m3 3 4 4M7 3 3 7" /></svg>
            </button>
            <button className="traffic__btn traffic__btn--min" aria-label="Minimize window" onClick={() => os.minimize(win.id)}>
              <svg viewBox="0 0 10 10"><path d="M2.5 5h5" /></svg>
            </button>
            <button className="traffic__btn traffic__btn--max" aria-label="Zoom window" onClick={() => os.toggleMaximize(win.id)}>
              <svg viewBox="0 0 10 10"><path d="M3 6.5V3h3.5M7 3.5V7H3.5" /></svg>
            </button>
          </div>
          <div className="win__title">
            <AppIcon app={win.id} size={16} />
            <span>{meta.title}</span>
          </div>
          <div className="win__bar-spacer" />
        </header>
        <div className="win__body">
          <WinContext.Provider value={{ id: win.id, payload: win.payload, payloadSeq: win.payloadSeq, mobile: false }}>{children}</WinContext.Provider>
        </div>
      </section>
      {!win.maximized &&
        DIRS.map((d) => <div key={d} className={`win__resize win__resize--${d}`} onPointerDown={startResize(d)} aria-hidden />)}
    </div>
  );
});
