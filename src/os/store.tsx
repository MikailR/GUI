import { createContext, useCallback, useContext, useMemo, useReducer, useState, type ReactNode } from 'react';
import { APPS } from './meta';
import type { AppId, Rect, Win } from './types';

export const MENUBAR_H = 30;
export const DOCK_RESERVE = 92;

interface State {
  wins: Partial<Record<AppId, Win>>;
  /** z-order stack, last = top-most. z-index is derived from this. */
  order: AppId[];
  focused: AppId | null;
}

type Action =
  | { type: 'open'; id: AppId; rect: Rect; origin: Rect | null; payload?: string }
  | { type: 'focus'; id: AppId }
  | { type: 'requestClose'; id: AppId }
  | { type: 'remove'; id: AppId }
  | { type: 'minimize'; id: AppId }
  | { type: 'restore'; id: AppId }
  | { type: 'maximize'; id: AppId; bounds: Rect }
  | { type: 'unmaximize'; id: AppId; rect?: Rect }
  | { type: 'setRect'; id: AppId; rect: Rect }
  | { type: 'snap'; id: AppId; rect: Rect; maximized: boolean }
  | { type: 'home' }
  | { type: 'closeAll' };

function topVisible(order: AppId[], wins: State['wins'], except?: AppId): AppId | null {
  for (let i = order.length - 1; i >= 0; i--) {
    const w = wins[order[i]];
    if (w && order[i] !== except && !w.minimized && !w.closing) return order[i];
  }
  return null;
}

function patch(state: State, id: AppId, p: Partial<Win>): State['wins'] {
  const w = state.wins[id];
  return w ? { ...state.wins, [id]: { ...w, ...p } } : state.wins;
}

function raise(order: AppId[], id: AppId) {
  return [...order.filter((o) => o !== id), id];
}

function reducer(state: State, a: Action): State {
  switch (a.type) {
    case 'open': {
      const existing = state.wins[a.id];
      if (existing && !existing.closing) {
        return {
          wins: patch(state, a.id, {
            minimized: false,
            payload: a.payload ?? existing.payload,
            payloadSeq: a.payload ? existing.payloadSeq + 1 : existing.payloadSeq,
          }),
          order: raise(state.order, a.id),
          focused: a.id,
        };
      }
      const win: Win = {
        id: a.id,
        rect: a.rect,
        minimized: false,
        maximized: false,
        closing: false,
        origin: a.origin,
        payload: a.payload,
        payloadSeq: 0,
      };
      return { wins: { ...state.wins, [a.id]: win }, order: raise(state.order, a.id), focused: a.id };
    }
    case 'focus': {
      const w = state.wins[a.id];
      if (!w || w.closing) return state;
      if (state.focused === a.id && state.order[state.order.length - 1] === a.id && !w.minimized) return state;
      return { wins: patch(state, a.id, { minimized: false }), order: raise(state.order, a.id), focused: a.id };
    }
    case 'requestClose': {
      if (!state.wins[a.id]) return state;
      return { ...state, wins: patch(state, a.id, { closing: true }), focused: topVisible(state.order, state.wins, a.id) };
    }
    case 'remove': {
      const wins = { ...state.wins };
      delete wins[a.id];
      const order = state.order.filter((o) => o !== a.id);
      return { wins, order, focused: state.focused === a.id ? topVisible(order, wins) : state.focused };
    }
    case 'minimize':
      return { ...state, wins: patch(state, a.id, { minimized: true }), focused: topVisible(state.order, state.wins, a.id) };
    case 'restore':
      return { wins: patch(state, a.id, { minimized: false }), order: raise(state.order, a.id), focused: a.id };
    case 'maximize': {
      const w = state.wins[a.id];
      if (!w) return state;
      return { ...state, wins: patch(state, a.id, { maximized: true, prevRect: w.maximized ? w.prevRect : w.rect, rect: a.bounds }) };
    }
    case 'unmaximize': {
      const w = state.wins[a.id];
      if (!w) return state;
      return { ...state, wins: patch(state, a.id, { maximized: false, rect: a.rect ?? w.prevRect ?? w.rect }) };
    }
    case 'setRect':
      return { ...state, wins: patch(state, a.id, { rect: a.rect }) };
    case 'snap': {
      const w = state.wins[a.id];
      if (!w) return state;
      return {
        ...state,
        wins: patch(state, a.id, { rect: a.rect, maximized: a.maximized, prevRect: w.maximized ? w.prevRect : w.rect }),
      };
    }
    case 'home': {
      const wins = { ...state.wins };
      for (const id of state.order) if (wins[id]) wins[id] = { ...wins[id]!, minimized: true };
      return { ...state, wins, focused: null };
    }
    case 'closeAll': {
      const wins = { ...state.wins };
      for (const id of state.order) if (wins[id]) wins[id] = { ...wins[id]!, closing: true };
      return { ...state, wins, focused: null };
    }
  }
}

export interface Toast {
  id: number;
  title: string;
  body: string;
  app?: AppId;
}

interface OSApi {
  state: State;
  open: (id: AppId, opts?: { origin?: Rect | null; payload?: string }) => void;
  close: (id: AppId) => void;
  remove: (id: AppId) => void;
  focus: (id: AppId) => void;
  minimize: (id: AppId) => void;
  toggleMaximize: (id: AppId) => void;
  setRect: (id: AppId, rect: Rect) => void;
  snap: (id: AppId, rect: Rect, maximized: boolean) => void;
  unmaximize: (id: AppId, rect?: Rect) => void;
  home: () => void;
  closeAll: () => void;
  cycle: (dir: 1 | -1) => void;
  toasts: Toast[];
  notify: (t: Omit<Toast, 'id'>) => void;
  dismissToast: (id: number) => void;
  spotlight: boolean;
  setSpotlight: (v: boolean) => void;
  bootCount: number;
  reboot: () => void;
}

const OSContext = createContext<OSApi | null>(null);

export function desktopBounds(): Rect {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  return { x: 0, y: MENUBAR_H, w: vw, h: vh - MENUBAR_H - DOCK_RESERVE };
}

let toastSeq = 0;

export function OSProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { wins: {}, order: [], focused: null });
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [spotlight, setSpotlight] = useState(false);
  const [bootCount, setBootCount] = useState(0);

  const open = useCallback(
    (id: AppId, opts: { origin?: Rect | null; payload?: string } = {}) => {
      const b = desktopBounds();
      const meta = APPS[id];
      const w = Math.min(meta.size[0], b.w - 32);
      const h = Math.min(meta.size[1], b.h - 24);
      // cascade new windows around the optical centre (slightly above middle)
      const n = state.order.length;
      const cx = b.x + (b.w - w) / 2 + ((n % 6) - 1) * 32;
      const cy = b.y + Math.max(12, (b.h - h) * 0.38) + ((n % 6) - 1) * 24;
      const rect = {
        x: Math.round(Math.max(8, Math.min(cx, b.w - w - 8))),
        y: Math.round(Math.max(b.y + 8, Math.min(cy, b.y + b.h - h))),
        w,
        h,
      };
      dispatch({ type: 'open', id, rect, origin: opts.origin ?? null, payload: opts.payload });
    },
    [state.order.length],
  );

  const cycle = useCallback(
    (dir: 1 | -1) => {
      const live = state.order.filter((id) => !state.wins[id]?.closing);
      if (!live.length) return;
      // rotating the bottom-most window to the top walks the whole stack
      const next = dir === 1 || live.length < 2 ? live[0] : live[live.length - 2];
      dispatch({ type: 'focus', id: next });
    },
    [state],
  );

  const toggleMaximize = useCallback(
    (id: AppId) => {
      const w = state.wins[id];
      if (!w) return;
      if (w.maximized) dispatch({ type: 'unmaximize', id });
      else dispatch({ type: 'maximize', id, bounds: desktopBounds() });
    },
    [state.wins],
  );

  const notify = useCallback((t: Omit<Toast, 'id'>) => {
    const id = ++toastSeq;
    setToasts((ts) => [...ts.slice(-3), { ...t, id }]);
    setTimeout(() => setToasts((ts) => ts.filter((x) => x.id !== id)), 5200);
  }, []);

  const api = useMemo<OSApi>(
    () => ({
      state,
      open,
      close: (id) => dispatch({ type: 'requestClose', id }),
      remove: (id) => dispatch({ type: 'remove', id }),
      focus: (id) => dispatch({ type: 'focus', id }),
      minimize: (id) => dispatch({ type: 'minimize', id }),
      toggleMaximize,
      setRect: (id, rect) => dispatch({ type: 'setRect', id, rect }),
      snap: (id, rect, maximized) => dispatch({ type: 'snap', id, rect, maximized }),
      unmaximize: (id, rect) => dispatch({ type: 'unmaximize', id, rect }),
      home: () => dispatch({ type: 'home' }),
      closeAll: () => dispatch({ type: 'closeAll' }),
      cycle,
      toasts,
      notify,
      dismissToast: (id) => setToasts((ts) => ts.filter((x) => x.id !== id)),
      spotlight,
      setSpotlight,
      bootCount,
      reboot: () => {
        dispatch({ type: 'closeAll' });
        setBootCount((c) => c + 1);
      },
    }),
    [state, open, toggleMaximize, cycle, toasts, notify, spotlight, bootCount],
  );

  return <OSContext.Provider value={api}>{children}</OSContext.Provider>;
}

export function useOS() {
  const ctx = useContext(OSContext);
  if (!ctx) throw new Error('useOS outside provider');
  return ctx;
}

/** Per-window context so apps can read their own payload / id. */
export const WinContext = createContext<{ id: AppId; payload?: string; payloadSeq: number; mobile: boolean } | null>(null);
export function useWin() {
  const ctx = useContext(WinContext);
  if (!ctx) throw new Error('useWin outside window');
  return ctx;
}
