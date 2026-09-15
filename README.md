# Mikail OS

A personal site that behaves like a small operating system: draggable, resizable windows, a magnifying dock, a menu bar with working menus, Spotlight-style search, a fake terminal, generative wallpapers, and a phone-style shell on narrow screens.

Built with **Vite + React 19 + TypeScript** and no other runtime dependencies.

## Run

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build → dist/
npm run preview   # serve the build locally
```

## Try

| Action | How |
| --- | --- |
| Open an app | Double-click a desktop icon, click the dock, or `⌘K` / `Ctrl+K` then type |
| Close / minimize / zoom | Traffic lights, `Esc`, `⌘M`, double-click the title bar |
| Cycle windows | `` ⌘` `` |
| Launch dock app *n* | `⌘1` … `⌘7` |
| Settings | `⌘,` or the  menu |
| Select several icons | Drag a marquee on the desktop |
| Context menus | Right-click the desktop or an icon |
| Terminal | `help`, `ls`, `cat about.md`, `neofetch`, `open lab`, `theme dawn` |
| Phone mode | Shrink the window under 720px wide |

`⌘W` is also wired up, but most browsers reserve it for closing the tab, so `Esc` is the reliable way to close a window.

## Layout

```
src/
  os/          types, window-manager store (useReducer), app registry, hooks
  components/  Wallpaper (canvas), Boot, MenuBar, Desktop, Window, Dock,
               Spotlight, Toasts, ContextMenu, MobileShell
  apps/        About, Writing, Hackathons, Lab, Papers, Trash, Terminal,
               Settings, Readme, SysInfo
  content/     placeholder essays, hackathon record, experiments, papers
  styles/      global.css (themes, chrome, app primitives, mobile shell)
```

Theme, wallpaper, and reduced-motion choices persist in `localStorage`.
