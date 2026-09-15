import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { load, save } from '../lib/storage';
import { useMediaQuery, useNow } from '../lib/hooks';
import type { ThemeName } from './types';

export interface WallpaperParams {
  levels: number;
  scale: number;
  speed: number;
  lift: number;
}

export interface Settings {
  theme: ThemeName | 'auto';
  accent: string;
  motion: 'system' | 'full' | 'reduced';
  magnify: boolean;
  wallpaper: WallpaperParams;
  trashEmptied: boolean;
  stickyDismissed: boolean;
  grid: boolean;
}

export const ACCENTS = [
  { name: 'Apricot', value: '#f29b62' },
  { name: 'Rose', value: '#ec6f8f' },
  { name: 'Lichen', value: '#a9d46a' },
  { name: 'Glacier', value: '#6cb8ee' },
  { name: 'Iris', value: '#a88cf5' },
];

export const DEFAULT_WALLPAPER: WallpaperParams = { levels: 14, scale: 1, speed: 1, lift: 0.55 };

const DEFAULTS: Settings = {
  theme: 'dusk',
  accent: ACCENTS[0].value,
  motion: 'system',
  magnify: true,
  wallpaper: DEFAULT_WALLPAPER,
  trashEmptied: false,
  stickyDismissed: false,
  grid: true,
};

interface Ctx {
  settings: Settings;
  set: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  reset: () => void;
  theme: ThemeName;
  isLight: boolean;
  reducedMotion: boolean;
  /** live-updating wallpaper params for the canvas loop, without re-renders */
  wallpaperRef: React.RefObject<WallpaperParams>;
}

const SettingsContext = createContext<Ctx | null>(null);

export function themeForHour(h: number): ThemeName {
  if (h >= 5 && h < 9) return 'dawn';
  if (h >= 9 && h < 17) return 'day';
  if (h >= 17 && h < 21) return 'dusk';
  return 'night';
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    const s = load('settings', DEFAULTS);
    return { ...s, wallpaper: { ...DEFAULT_WALLPAPER, ...s.wallpaper } };
  });
  const systemReduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const now = useNow(60_000);
  const wallpaperRef = useRef<WallpaperParams>(settings.wallpaper);
  wallpaperRef.current = settings.wallpaper;

  useEffect(() => save('settings', settings), [settings]);

  const set = useCallback(<K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((s) => ({ ...s, [key]: value }));
  }, []);
  const reset = useCallback(() => setSettings(DEFAULTS), []);

  const theme = settings.theme === 'auto' ? themeForHour(now.getHours()) : settings.theme;
  const isLight = theme === 'day' || theme === 'dawn';
  const reducedMotion = settings.motion === 'reduced' || (settings.motion === 'system' && systemReduced);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.dataset.ui = isLight ? 'light' : 'dark';
    root.dataset.motion = reducedMotion ? 'reduced' : 'full';
    root.style.setProperty('--accent', settings.accent);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', isLight ? '#e9dccb' : '#140f22');
  }, [theme, isLight, reducedMotion, settings.accent]);

  const value = useMemo(
    () => ({ settings, set, reset, theme, isLight, reducedMotion, wallpaperRef }),
    [settings, set, reset, theme, isLight, reducedMotion],
  );
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings outside provider');
  return ctx;
}
