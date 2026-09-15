export type AppId =
  | "about"
  | "hackathons"
  | "writing"
  | "lab"
  | "papers"
  | "trash"
  | "terminal"
  | "settings";

export type WallpaperId = "helios" | "polar" | "noir";
export type AccentId = "ember" | "violet" | "ice";

export type Win = {
  id: AppId;
  appId: AppId;
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
  restore?: { x: number; y: number; w: number; h: number };
};

export type Dialog = {
  title: string;
  body: string;
  confirm: string;
  danger?: boolean;
  action: "empty-trash";
};

export type OsState = {
  booted: boolean;
  windows: Win[];
  focusedId: AppId | null;
  nextZ: number;
  wallpaper: WallpaperId;
  accent: AccentId;
  spotlight: boolean;
  selectedIcons: string[];
  contextMenu: { x: number; y: number; icon?: string } | null;
  trashEmptied: boolean;
  toast: string | null;
  dialog: Dialog | null;
  magnify: boolean;
  clockOpen: boolean;
  heliosMenu: boolean;
};

export const APP_ORDER: AppId[] = [
  "about",
  "hackathons",
  "writing",
  "lab",
  "papers",
  "terminal",
  "settings",
  "trash",
];
