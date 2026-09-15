import { useEffect, useRef, useState, type PointerEvent as PE, type ReactNode } from "react";
import { cx } from "../lib/cx";
import type { Win } from "../types";
import { useOS } from "./OSContext";

const HANDLES = ["n", "s", "e", "w", "ne", "nw", "se", "sw"] as const;
type Handle = (typeof HANDLES)[number];

export function WindowFrame({ win, children }: { win: Win; children: ReactNode }) {
  const {
    focusedId,
    closeWindow,
    focusWindow,
    minimize,
    toggleMax,
    moveWindow,
    resizeWindow,
    isMobile,
  } = useOS();
  const elRef = useRef<HTMLDivElement>(null);
  const [entering, setEntering] = useState(true);
  useEffect(() => {
    const t = window.setTimeout(() => setEntering(false), 480);
    return () => window.clearTimeout(t);
  }, []);
  const drag = useRef<{ ox: number; oy: number; sx: number; sy: number } | null>(null);
  const resize = useRef<{
    handle: Handle;
    sx: number;
    sy: number;
    x: number;
    y: number;
    w: number;
    h: number;
  } | null>(null);
  const focused = focusedId === win.id;

  const onTitleDown = (e: PE<HTMLElement>) => {
    if (isMobile || win.maximized) return;
    if ((e.target as HTMLElement).closest("button")) return;
    focusWindow(win.id);
    const el = elRef.current;
    if (!el) return;
    el.classList.remove("enter");
    drag.current = { ox: win.x, oy: win.y, sx: e.clientX, sy: e.clientY };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onTitleMove = (e: PE<HTMLElement>) => {
    if (!drag.current || !elRef.current) return;
    const dx = e.clientX - drag.current.sx;
    const dy = e.clientY - drag.current.sy;
    elRef.current.style.transform = `translate(${dx}px, ${dy}px)`;
  };

  const onTitleUp = (e: PE<HTMLElement>) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.sx;
    const dy = e.clientY - drag.current.sy;
    const y = Math.max(32, drag.current.oy + dy);
    moveWindow(win.id, drag.current.ox + dx, y);
    if (elRef.current) elRef.current.style.transform = "";
    drag.current = null;
  };

  const onResizeDown = (handle: Handle) => (e: PE<HTMLElement>) => {
    if (isMobile || win.maximized) return;
    e.stopPropagation();
    focusWindow(win.id);
    resize.current = {
      handle,
      sx: e.clientX,
      sy: e.clientY,
      x: win.x,
      y: win.y,
      w: win.w,
      h: win.h,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onResizeMove = (e: PE<HTMLElement>) => {
    const r = resize.current;
    const el = elRef.current;
    if (!r || !el) return;
    const dx = e.clientX - r.sx;
    const dy = e.clientY - r.sy;
    let { x, y, w, h } = r;
    const minW = 360;
    const minH = 260;
    if (r.handle.includes("e")) w = Math.max(minW, r.w + dx);
    if (r.handle.includes("s")) h = Math.max(minH, r.h + dy);
    if (r.handle.includes("w")) {
      w = Math.max(minW, r.w - dx);
      x = r.x + (r.w - w);
    }
    if (r.handle.includes("n")) {
      h = Math.max(minH, r.h - dy);
      y = Math.max(32, r.y + (r.h - h));
    }
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.width = `${w}px`;
    el.style.height = `${h}px`;
    el.dataset.live = JSON.stringify({ x, y, w, h });
  };

  const onResizeUp = () => {
    const el = elRef.current;
    if (!el?.dataset.live) {
      resize.current = null;
      return;
    }
    const live = JSON.parse(el.dataset.live) as { x: number; y: number; w: number; h: number };
    resizeWindow(win.id, live.x, live.y, live.w, live.h);
    delete el.dataset.live;
    resize.current = null;
  };

  if (win.minimized && !isMobile) return null;

  if (isMobile) {
    if (!focused) return null;
    return (
      <section
        className={cx("sheet", entering && "enter")}
        role="dialog"
        aria-label={win.title}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <header className="sheet-bar">
          <span className="sheet-grab" />
          <span className="sheet-title">{win.title}</span>
          <button type="button" className="sheet-close" onClick={() => closeWindow(win.id)}>
            Done
          </button>
        </header>
        <div className="window-body">{children}</div>
      </section>
    );
  }

  const style = win.maximized
    ? { left: 0, top: 32, width: "100vw", height: "calc(100dvh - 108px)", zIndex: win.z }
    : { left: win.x, top: win.y, width: win.w, height: win.h, zIndex: win.z };

  return (
    <section
      ref={elRef}
      className={cx("window", entering && "enter", focused && "is-focused", win.maximized && "is-max")}
      style={style}
      role="dialog"
      aria-label={win.title}
      onPointerDown={(e) => {
        e.stopPropagation();
        focusWindow(win.id);
      }}
    >
      <header
        className="titlebar"
        onPointerDown={onTitleDown}
        onPointerMove={onTitleMove}
        onPointerUp={onTitleUp}
        onDoubleClick={() => toggleMax(win.id)}
      >
        <div className="traffic">
          <button
            type="button"
            className="tl close"
            aria-label="Close"
            onClick={() => closeWindow(win.id)}
          />
          <button
            type="button"
            className="tl min"
            aria-label="Minimize"
            onClick={() => minimize(win.id)}
          />
          <button
            type="button"
            className="tl max"
            aria-label="Zoom"
            onClick={() => toggleMax(win.id)}
          />
        </div>
        <h2 className="titlebar-name">{win.title}</h2>
        <span className="titlebar-spacer" />
      </header>
      <div className="window-body">{children}</div>
      {!win.maximized &&
        HANDLES.map((h) => (
          <i
            key={h}
            className={`resize ${h}`}
            onPointerDown={onResizeDown(h)}
            onPointerMove={onResizeMove}
            onPointerUp={onResizeUp}
          />
        ))}
    </section>
  );
}
