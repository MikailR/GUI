# mikailOS

A personal website that behaves like a small, welcoming computer. Built with React, TypeScript, and Vite. No backend, login, remote images, or runtime font requests.

## Run

Requires Node.js 20.19+ (or 22.12+).

```sh
npm install
npm run dev
```

Open the URL printed by Vite. For a production build:

```sh
npm run build
npm run preview
```

`npm run check` runs offline rendering checks for all six apps and the desktop shell at five viewport widths. These checks verify rendering, not browser layout or pointer interactions.

## Explore

- Double-click desktop icons, tap on touch screens, or use the dock.
- Drag title bars; resize from the bottom-right corner.
- The three window buttons close, minimize, and maximize. Double-click a title bar to maximize.
- Click an open app in the dock to minimize it; click again to restore it.
- **Cmd/Ctrl K:** search. **Cmd/Ctrl 1–6:** open an app.
- **Escape / Cmd/Ctrl W:** close the active window. **Alt Tab:** cycle app windows when the browser delivers the shortcut. **?:** help.
- File, View, Window, and Help are working menus. View can reveal the desktop; Window can arrange open windows.
- The control center switches between daylight and dusk wallpapers and toggles desktop widgets.
- On phones, apps become full-width sheets above the dock. Use the bottom home indicator to reveal the home screen.

## Inside

- **About:** introduction, illustrated computer, contact panel, and shortcuts.
- **Hackathons:** three expandable project case studies.
- **Writing:** three complete local essays with a reading view.
- **Lab:** interactive orbital motion study with tempo, palette, and pause controls, plus a tiny click experiment.
- **Papers:** expandable research notes.
- **Trash:** imaginary discarded files; empty and undo.

All projects, research notes, and the `.example` contact address are intentional sample content. Replace them in `src/Content.tsx`. App state lasts for the current page session; reopening a closed app resets it. Reduced-motion preferences are respected. Search and help dialogs trap keyboard focus and restore it when dismissed.

## Structure

- `src/App.tsx` — desktop shell, window state, menus, search, shortcuts, and widgets.
- `src/Content.tsx` — the six apps and their local interactions.
- `src/icons.tsx` — custom illustrated app icons and retro computer.
- `src/ui-icons.tsx` — small inline SVG interface symbols.
- `src/styles.css` — wallpaper, window chrome, content styling, motion, and mobile layouts.
- `public/fonts/` — bundled Nimbus Roman and Nimbus Sans fonts, with licensing.
- `checks/smoke.cjs` — offline rendering checks.

## Verification

`npm install`, `npm run build`, and `npm run check` succeed in the build environment. Live browser/screenshot verification could not run because the execution sandbox blocks socket creation and Chromium startup.
