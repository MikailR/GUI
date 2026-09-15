// A tiny DOM registry so windows know where to fly to / from (dock icons,
// desktop icons, home-screen icons) without prop-drilling refs.
const els = new Map<string, HTMLElement>();

export const iconRegistry = {
  set(key: string, el: HTMLElement | null) {
    if (el) els.set(key, el);
    else els.delete(key);
  },
  rect(key: string) {
    const el = els.get(key);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    if (r.width === 0) return null;
    return { x: r.left, y: r.top, w: r.width, h: r.height };
  },
  el(key: string) {
    return els.get(key) ?? null;
  },
};
