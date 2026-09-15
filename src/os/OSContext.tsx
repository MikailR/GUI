import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import { APP_META } from "../data/content";
import { APP_ORDER, type AccentId, type AppId, type OsState, type WallpaperId, type Win } from "../types";

const MENUBAR = 32;
const DOCK = 92;
const MARGIN = 10;

const initial: OsState = {
  booted: false,
  windows: [],
  focusedId: null,
  nextZ: 1,
  wallpaper: "helios",
  accent: "ember",
  spotlight: false,
  selectedIcons: [],
  contextMenu: null,
  trashEmptied: false,
  toast: null,
  dialog: null,
  magnify: true,
  clockOpen: false,
  heliosMenu: false,
};

type Action =
  | { type: "BOOT_DONE" }
  | { type: "REBOOT" }
  | { type: "OPEN"; appId: AppId; vw: number; vh: number }
  | { type: "CLOSE"; id: AppId }
  | { type: "FOCUS"; id: AppId }
  | { type: "MINIMIZE"; id: AppId }
  | { type: "TOGGLE_MAX"; id: AppId; vw: number; vh: number }
  | { type: "MOVE"; id: AppId; x: number; y: number }
  | { type: "RESIZE"; id: AppId; x: number; y: number; w: number; h: number }
  | { type: "CYCLE" }
  | { type: "SET_WALLPAPER"; wallpaper: WallpaperId }
  | { type: "SET_ACCENT"; accent: AccentId }
  | { type: "SPOTLIGHT"; open: boolean }
  | { type: "SELECT_ICONS"; ids: string[] }
  | { type: "CONTEXT"; menu: OsState["contextMenu"] }
  | { type: "TOAST"; text: string | null }
  | { type: "DIALOG"; dialog: OsState["dialog"] }
  | { type: "EMPTY_TRASH" }
  | { type: "RESTORE_TRASH" }
  | { type: "SET_MAGNIFY"; on: boolean }
  | { type: "CLOCK"; open: boolean }
  | { type: "HELIOS_MENU"; open: boolean };

function clampWin(w: Win, vw: number, vh: number): Win {
  const minW = 360;
  const minH = 260;
  const maxW = Math.max(minW, vw - MARGIN * 2);
  const maxH = Math.max(minH, vh - MENUBAR - 20);
  const width = Math.min(Math.max(w.w, minW), maxW);
  const height = Math.min(Math.max(w.h, minH), maxH);
  const x = Math.min(Math.max(w.x, MARGIN), Math.max(MARGIN, vw - width - MARGIN));
  const y = Math.min(Math.max(w.y, MENUBAR + 6), Math.max(MENUBAR + 6, vh - 80));
  return { ...w, x, y, w: width, h: height };
}

function placeNew(appId: AppId, count: number, vw: number, vh: number): Win {
  const meta = APP_META[appId];
  const offset = (count % 5) * 28;
  const w = Math.min(meta.w, vw - 40);
  const h = Math.min(meta.h, vh - MENUBAR - DOCK - 20);
  return clampWin(
    {
      id: appId,
      appId,
      title: meta.title,
      x: 118 + offset,
      y: MENUBAR + 28 + offset,
      w,
      h,
      z: 0,
      minimized: false,
      maximized: false,
    },
    vw,
    vh,
  );
}

function focus(state: OsState, id: AppId): OsState {
  const z = state.nextZ;
  return {
    ...state,
    focusedId: id,
    nextZ: z + 1,
    windows: state.windows.map((w) => (w.id === id ? { ...w, z, minimized: false } : w)),
    spotlight: false,
    contextMenu: null,
    clockOpen: false,
    heliosMenu: false,
  };
}

function reduce(state: OsState, action: Action): OsState {
  switch (action.type) {
    case "BOOT_DONE":
      return { ...state, booted: true, toast: "Welcome back. ⌘ Space opens Spotlight." };
    case "REBOOT":
      return { ...initial, wallpaper: state.wallpaper, accent: state.accent, magnify: state.magnify };
    case "OPEN": {
      const existing = state.windows.find((w) => w.appId === action.appId);
      if (existing) return focus(state, existing.id);
      const win = placeNew(action.appId, state.windows.length, action.vw, action.vh);
      win.z = state.nextZ;
      return {
        ...state,
        windows: [...state.windows, win],
        focusedId: win.id,
        nextZ: state.nextZ + 1,
        spotlight: false,
        contextMenu: null,
        selectedIcons: [],
        clockOpen: false,
        heliosMenu: false,
      };
    }
    case "CLOSE": {
      const windows = state.windows.filter((w) => w.id !== action.id);
      const top = [...windows].sort((a, b) => b.z - a.z).find((w) => !w.minimized);
      return { ...state, windows, focusedId: top?.id ?? null };
    }
    case "FOCUS":
      return focus(state, action.id);
    case "MINIMIZE": {
      const windows = state.windows.map((w) =>
        w.id === action.id ? { ...w, minimized: true, maximized: false } : w,
      );
      const top = [...windows].sort((a, b) => b.z - a.z).find((w) => !w.minimized);
      return { ...state, windows, focusedId: top?.id ?? null };
    }
    case "TOGGLE_MAX": {
      return {
        ...state,
        windows: state.windows.map((w) => {
          if (w.id !== action.id) return w;
          if (w.maximized) {
            const r = w.restore ?? { x: 80, y: 72, w: 640, h: 480 };
            return clampWin({ ...w, ...r, maximized: false, restore: undefined, minimized: false }, action.vw, action.vh);
          }
          return {
            ...w,
            restore: { x: w.x, y: w.y, w: w.w, h: w.h },
            maximized: true,
            minimized: false,
            x: 0,
            y: MENUBAR,
            w: action.vw,
            h: action.vh - MENUBAR - 76,
          };
        }),
        focusedId: action.id,
      };
    }
    case "MOVE":
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id && !w.maximized ? { ...w, x: action.x, y: action.y } : w,
        ),
      };
    case "RESIZE":
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id && !w.maximized
            ? { ...w, x: action.x, y: action.y, w: action.w, h: action.h }
            : w,
        ),
      };
    case "CYCLE": {
      const live = state.windows.filter((w) => !w.minimized).sort((a, b) => a.z - b.z);
      if (live.length === 0) return state;
      const idx = live.findIndex((w) => w.id === state.focusedId);
      const next = live[(idx + 1) % live.length];
      return focus(state, next.id);
    }
    case "SET_WALLPAPER":
      return { ...state, wallpaper: action.wallpaper };
    case "SET_ACCENT":
      return { ...state, accent: action.accent };
    case "SPOTLIGHT":
      return {
        ...state,
        spotlight: action.open,
        contextMenu: null,
        clockOpen: false,
        heliosMenu: false,
      };
    case "SELECT_ICONS":
      return { ...state, selectedIcons: action.ids, contextMenu: null };
    case "CONTEXT":
      return { ...state, contextMenu: action.menu, clockOpen: false, heliosMenu: false };
    case "TOAST":
      return { ...state, toast: action.text };
    case "DIALOG":
      return { ...state, dialog: action.dialog };
    case "EMPTY_TRASH":
      return { ...state, trashEmptied: true, dialog: null, toast: "Trash emptied." };
    case "RESTORE_TRASH":
      return { ...state, trashEmptied: false, toast: "Put back." };
    case "SET_MAGNIFY":
      return { ...state, magnify: action.on };
    case "CLOCK":
      return { ...state, clockOpen: action.open, heliosMenu: false, contextMenu: null };
    case "HELIOS_MENU":
      return { ...state, heliosMenu: action.open, clockOpen: false, contextMenu: null };
    default:
      return state;
  }
}

type OsApi = OsState & {
  isMobile: boolean;
  openApp: (appId: AppId) => void;
  closeWindow: (id: AppId) => void;
  focusWindow: (id: AppId) => void;
  minimize: (id: AppId) => void;
  toggleMax: (id: AppId) => void;
  moveWindow: (id: AppId, x: number, y: number) => void;
  resizeWindow: (id: AppId, x: number, y: number, w: number, h: number) => void;
  cycle: () => void;
  setWallpaper: (w: WallpaperId) => void;
  setAccent: (a: AccentId) => void;
  setSpotlight: (open: boolean) => void;
  selectIcons: (ids: string[]) => void;
  setContext: (menu: OsState["contextMenu"]) => void;
  toastMsg: (text: string | null) => void;
  askEmptyTrash: () => void;
  confirmDialog: () => void;
  cancelDialog: () => void;
  restoreTrash: () => void;
  setMagnify: (on: boolean) => void;
  setClock: (open: boolean) => void;
  setHeliosMenu: (open: boolean) => void;
  bootDone: () => void;
  reboot: () => void;
  dockToggle: (appId: AppId) => void;
};

const Ctx = createContext<OsApi | null>(null);

function useMobile() {
  const get = () =>
    typeof window !== "undefined" &&
    (window.innerWidth < 820 || window.matchMedia("(pointer: coarse)").matches && window.innerWidth < 1024);
  const ref = useRef(get());
  const [, bump] = useReducer((n: number) => n + 1, 0);
  useEffect(() => {
    const on = () => {
      const next = get();
      if (next !== ref.current) {
        ref.current = next;
        bump();
      }
    };
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return ref.current;
}

export function OSProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reduce, initial);
  const isMobile = useMobile();
  const vw = () => window.innerWidth;
  const vh = () => window.innerHeight;

  const openApp = useCallback(
    (appId: AppId) => dispatch({ type: "OPEN", appId, vw: vw(), vh: vh() }),
    [],
  );
  const closeWindow = useCallback((id: AppId) => dispatch({ type: "CLOSE", id }), []);
  const focusWindow = useCallback((id: AppId) => dispatch({ type: "FOCUS", id }), []);
  const minimize = useCallback((id: AppId) => dispatch({ type: "MINIMIZE", id }), []);
  const toggleMax = useCallback(
    (id: AppId) => dispatch({ type: "TOGGLE_MAX", id, vw: vw(), vh: vh() }),
    [],
  );
  const moveWindow = useCallback(
    (id: AppId, x: number, y: number) => dispatch({ type: "MOVE", id, x, y }),
    [],
  );
  const resizeWindow = useCallback(
    (id: AppId, x: number, y: number, w: number, h: number) =>
      dispatch({ type: "RESIZE", id, x, y, w, h }),
    [],
  );
  const cycle = useCallback(() => dispatch({ type: "CYCLE" }), []);
  const dockToggle = useCallback(
    (appId: AppId) => {
      const existing = state.windows.find((w) => w.appId === appId);
      if (!existing) {
        openApp(appId);
        return;
      }
      if (existing.minimized) {
        focusWindow(appId);
        return;
      }
      if (state.focusedId === appId && !isMobile) {
        minimize(appId);
        return;
      }
      focusWindow(appId);
    },
    [state.windows, state.focusedId, isMobile, openApp, focusWindow, minimize],
  );

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.accent = state.accent;
    root.dataset.wallpaper = state.wallpaper;
  }, [state.accent, state.wallpaper]);

  useEffect(() => {
    if (!state.toast) return;
    const t = window.setTimeout(() => dispatch({ type: "TOAST", text: null }), 4200);
    return () => window.clearTimeout(t);
  }, [state.toast]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!state.booted) {
        if (e.key === "Enter" || e.key === " ") dispatch({ type: "BOOT_DONE" });
        return;
      }
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      const meta = e.metaKey || e.ctrlKey;

      if (e.key === "Escape") {
        if (state.dialog) {
          dispatch({ type: "DIALOG", dialog: null });
          e.preventDefault();
          return;
        }
        if (state.spotlight) {
          dispatch({ type: "SPOTLIGHT", open: false });
          e.preventDefault();
          return;
        }
        if (state.contextMenu) {
          dispatch({ type: "CONTEXT", menu: null });
          return;
        }
        if (state.clockOpen) {
          dispatch({ type: "CLOCK", open: false });
          return;
        }
        if (state.heliosMenu) {
          dispatch({ type: "HELIOS_MENU", open: false });
          return;
        }
        if (state.focusedId) {
          closeWindow(state.focusedId);
          e.preventDefault();
        }
        return;
      }

      if (meta && e.key.toLowerCase() === "w") {
        if (state.focusedId) closeWindow(state.focusedId);
        e.preventDefault();
        return;
      }
      if (meta && e.key.toLowerCase() === "m") {
        if (state.focusedId) minimize(state.focusedId);
        e.preventDefault();
        return;
      }
      if (meta && e.key === "`") {
        cycle();
        e.preventDefault();
        return;
      }
      if (meta && (e.key === " " || e.key.toLowerCase() === "k")) {
        dispatch({ type: "SPOTLIGHT", open: !state.spotlight });
        e.preventDefault();
        return;
      }
      if (meta && e.key >= "1" && e.key <= "8") {
        const app = APP_ORDER[Number(e.key) - 1];
        if (app) openApp(app);
        e.preventDefault();
        return;
      }
      if (typing) return;
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    state.booted,
    state.focusedId,
    state.spotlight,
    state.dialog,
    state.contextMenu,
    state.clockOpen,
    state.heliosMenu,
    closeWindow,
    minimize,
    cycle,
    openApp,
  ]);

  const api = useMemo<OsApi>(
    () => ({
      ...state,
      isMobile,
      openApp,
      closeWindow,
      focusWindow,
      minimize,
      toggleMax,
      moveWindow,
      resizeWindow,
      cycle,
      setWallpaper: (wallpaper) => dispatch({ type: "SET_WALLPAPER", wallpaper }),
      setAccent: (accent) => dispatch({ type: "SET_ACCENT", accent }),
      setSpotlight: (open) => dispatch({ type: "SPOTLIGHT", open }),
      selectIcons: (ids) => dispatch({ type: "SELECT_ICONS", ids }),
      setContext: (menu) => dispatch({ type: "CONTEXT", menu }),
      toastMsg: (text) => dispatch({ type: "TOAST", text }),
      askEmptyTrash: () =>
        dispatch({
          type: "DIALOG",
          dialog: {
            title: "Empty Trash?",
            body: "Discarded ideas will be gone from this machine.",
            confirm: "Empty Trash",
            danger: true,
            action: "empty-trash",
          },
        }),
      confirmDialog: () => {
        if (state.dialog?.action === "empty-trash") dispatch({ type: "EMPTY_TRASH" });
      },
      cancelDialog: () => dispatch({ type: "DIALOG", dialog: null }),
      restoreTrash: () => dispatch({ type: "RESTORE_TRASH" }),
      setMagnify: (on) => dispatch({ type: "SET_MAGNIFY", on }),
      setClock: (open) => dispatch({ type: "CLOCK", open }),
      setHeliosMenu: (open) => dispatch({ type: "HELIOS_MENU", open }),
      bootDone: () => dispatch({ type: "BOOT_DONE" }),
      reboot: () => dispatch({ type: "REBOOT" }),
      dockToggle,
    }),
    [
      state,
      isMobile,
      openApp,
      closeWindow,
      focusWindow,
      minimize,
      toggleMax,
      moveWindow,
      resizeWindow,
      cycle,
      dockToggle,
    ],
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useOS() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useOS outside provider");
  return ctx;
}
