import { useRef, useState, type PointerEvent } from "react";
import { IconFor } from "../apps/icons";
import { APP_META } from "../data/content";
import type { AppId } from "../types";
import { cx } from "../lib/cx";
import { useOS } from "./OSContext";

const DOCK_APPS: AppId[] = [
  "about",
  "hackathons",
  "writing",
  "lab",
  "papers",
  "terminal",
  "settings",
];

export function Dock() {
  const { windows, dockToggle, magnify, isMobile, trashEmptied, focusedId } = useOS();
  const barRef = useRef<HTMLDivElement>(null);
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [tip, setTip] = useState<string | null>(null);

  const running = new Set(windows.map((w) => w.appId));
  const items: AppId[] = isMobile
    ? ["about", "writing", "lab", "hackathons"]
    : [...DOCK_APPS];

  const onMove = (e: PointerEvent) => {
    if (isMobile || !magnify) return;
    const rect = barRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMouseX(e.clientX - rect.left);
  };

  return (
    <div className="dock-wrap">
      <div
        ref={barRef}
        className={cx("dock", isMobile && "is-mobile")}
        onPointerDown={(e) => e.stopPropagation()}
        onPointerMove={onMove}
        onPointerLeave={() => {
          setMouseX(null);
          setTip(null);
        }}
      >
        {items.map((id, i) => {
          const scale = scaleAt(i, mouseX, magnify && !isMobile);
          return (
            <DockButton
              key={id}
              id={id}
              scale={scale}
              running={running.has(id)}
              focused={focusedId === id}
              tip={tip}
              setTip={setTip}
              onOpen={() => dockToggle(id)}
              label={APP_META[id].title}
            />
          );
        })}
        {!isMobile && (
          <>
            <div className="dock-sep" />
            <DockButton
              id="trash"
              scale={scaleAt(items.length + 0.6, mouseX, magnify)}
              running={running.has("trash")}
              focused={focusedId === "trash"}
              tip={tip}
              setTip={setTip}
              onOpen={() => dockToggle("trash")}
              label="Trash"
              empty={trashEmptied}
            />
          </>
        )}
      </div>
    </div>
  );
}

function DockButton({
  id,
  scale,
  running,
  focused,
  tip,
  setTip,
  onOpen,
  label,
  empty,
}: {
  id: AppId;
  scale: number;
  running: boolean;
  focused: boolean;
  tip: string | null;
  setTip: (s: string | null) => void;
  onOpen: () => void;
  label: string;
  empty?: boolean;
}) {
  const lift = (scale - 1) * 36;
  return (
    <button
      type="button"
      className={cx("dock-item", focused && "is-focused")}
      style={{
        transform: `translateY(${-lift}px) scale(${scale})`,
        zIndex: Math.round(scale * 10),
      }}
      onClick={onOpen}
      onPointerEnter={() => setTip(id)}
      aria-label={label}
    >
      <IconFor id={id} empty={empty} />
      {tip === id && <span className="dock-tip">{label}</span>}
      <span className={cx("dock-dot", running && "on")} />
    </button>
  );
}

function scaleAt(index: number, mouseX: number | null, on: boolean) {
  if (!on || mouseX == null) return 1;
  const icon = 52;
  const gap = 8;
  const pad = 14;
  const center = pad + index * (icon + gap) + icon / 2;
  const dist = Math.abs(mouseX - center);
  const t = Math.max(0, 1 - dist / 110);
  return 1 + 0.52 * t * t;
}
