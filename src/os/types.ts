export type AppId = 'about' | 'hackathons' | 'writing' | 'lab' | 'papers' | 'trash' | 'terminal' | 'settings';

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Win {
  id: AppId;
  rect: Rect;
  prevRect?: Rect;
  minimized: boolean;
  maximized: boolean;
  closing: boolean;
  origin: Rect | null;
  payload?: string;
  /** bumped whenever an already-open window is asked to show a new payload */
  payloadSeq: number;
}

export interface AppMeta {
  id: AppId;
  title: string;
  short?: string;
  size: [number, number];
  min: [number, number];
  blurb: string;
}

export type ThemeName = 'dawn' | 'day' | 'dusk' | 'night';
