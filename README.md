# Mikail OS

A personal site that behaves like a small operating system: dusk wallpaper, draggable smoked-glass windows, a magnifying dock, a launcher, a terminal, and a phone shell built from stacked sheets. Pure front-end, no login, window layout persisted to `localStorage`.

## Run

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build into dist/
npm run preview   # serve the build
```

Requires Node 20+.

## Using it

**Desktop (≥ 768px)**

- Double-click a desktop icon or click a dock tile to open an app.
- Drag by the title bar; drag the right, bottom, left edges or the corner to resize. Double-click the title bar to maximise.
- Traffic lights: close · minimise (to dock) · maximise.
- Menu bar: **Mikail OS** (settings, terminal, close all), app menu, **Go** (all apps), **Window** (tile, cycle, reset, list of open windows), **Help**.
- Keyboard: `⌘/Ctrl K` launcher · `Esc` or `⌘/Ctrl W` close · `⌘/Ctrl M` minimise · `⌘/Ctrl ↑` maximise · `` ⌘/Ctrl ` `` cycle windows · `Alt 1–7` open n-th dock app · `⌘/Ctrl T` terminal · `?` shortcut sheet.
- Terminal commands: `help`, `ls`, `open lab`, `wall night`, `neofetch`, `hack`, `posts`, `cat about.md`.

**Mobile (< 768px)**

- Home screen with an app grid and a glass tab bar.
- Apps open as full-height sheets that stack; drag the sheet header down or tap **Home** to return without closing.
- The right-most tab-bar button opens the app switcher: live scaled previews, swipe up to close.

Window positions, wallpaper, motion preference and trash contents are remembered per browser. **Settings → Forget everything & reboot** clears them.

## Stack

Vite 7 · React 19 · TypeScript · framer-motion (springs, presence, dock magnification, sheet gestures). Everything else is hand-rolled CSS: `oklch` tokens, container queries inside every window, `backdrop-filter` glass, a CSS-only wallpaper (layered gradients, `repeating-radial-gradient` contours, SVG-turbulence grain).

## Layout

```
src/
  App.tsx            boot → desktop or mobile shell
  styles.css         tokens, wallpaper, window chrome, dock, launcher, mobile shell
  apps.css           in-window typography, cards, lab demos, terminal
  os/
    store.tsx        window-manager reducer + persistence (open/close/focus/drag/resize/tile/cycle)
    Desktop.tsx      desktop shell + keyboard shortcuts
    Window.tsx       draggable / resizable / maximisable glass window
    Dock.tsx         magnifying dock with running indicators
    MenuBar.tsx      menu bar with working menus and clock
    Launcher.tsx     ⌘K launcher (apps, essays, settings, commands)
    Mobile.tsx       home screen, stacked sheets, app switcher, tab bar
    Wallpaper.tsx    layered CSS wallpaper with pointer parallax
    Boot.tsx         boot splash
  apps/
    registry.ts      app metadata (title, code, hue, default size)
    About / Hackathons / Writing / Lab / Papers / Trash / Terminal / Settings
  data/content.ts    placeholder content
```
