# Mikail OS — Liquid Glass

A personal site built as a small operating system. On a laptop it is **macOS with Liquid Glass**: a transparent menu bar, a floating glass Dock with Gaussian magnification, frosted windows with traffic lights, Spotlight, and a Control Center. On a phone (≤ 820px) it becomes **iOS**: a glass home screen with widgets, full-screen apps with large titles and floating nav pills, and a home indicator you can swipe.

Same content, same apps, two shells. Vite + React 19 + TypeScript, no UI libraries.

> This branch (`liquid-glass`) is one entry in the [GUI bakeoff](https://github.com/MikailR/GUI). `previews/`, `COMPARISON.md`, `live-urls.md` and `comparison-board.html` are inherited from `main`'s comparison host and are not part of this app.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc -b && vite build → dist/ (base './', works from any subpath)
npm run preview    # serve dist/
```

`dist/` is committed for easy static hosting; rebuild before committing changes.

## What's inside

| App | What it does |
| --- | --- |
| **About** | Identity card, "Now" list, toolkit chips, links. |
| **Hackathons** | Six weekends with placements; list + detail (two-pane in wide windows, drill-in on narrow ones and on the phone). |
| **Writing** | Five essays with a sidebar reader; container-query layout; deep-linkable (`#/writing/<slug>`). |
| **Lab** | Eight playable experiments: Spring toy, Glass workbench, Liquid lens, Type studio, Motion curves (bezier editor + spring → `linear()` baker), Ripples, Concentric corners, Dock curve. |
| **Papers** | Analyses, talks and field notes with expandable abstracts and a kind filter. |
| **Trash** | Deletable regrets with a confirm sheet, Empty Trash and an Undo toast. |
| **Settings** | Appearance (auto/light/dark), accent tint, four generative wallpapers, reduce transparency, reduce motion, live wallpaper. |

### Desktop (macOS)

- Transparent menu bar with working menus: Apple (About This Mac, Settings, Sleep, Restart), app menu, File (open any app, close), View (appearance, wallpaper, transparency), Window (minimize, zoom, tile, gather, cycle, show desktop, window list), Help (shortcuts).
- Control Center popover with the appearance controls.
- Dock: continuous Gaussian magnification (`1 + 0.5·e^(−d²/2σ²)`), running indicators, launch bounce, glass tooltips, Trash that fills up.
- Windows: pointer-capture drag (transform during the gesture, rect committed on release), 8-direction resize, focus, minimize toward the Dock icon, zoom, close. Esc closes the focused window.
- Spotlight (`⌘K` / `Ctrl+K`) over apps, essays, hackathons, experiments, papers and settings actions, grouped results, keyboard navigation.
- Keyboard: `⌥W` close · `⌥M` minimize · `⌥↩` zoom · `` ⌥` `` cycle · `⌥T` tile · `⌥G` gather · `⌥D` show desktop · `⌥1–7` open apps · `⌥,` settings · `?` shortcut sheet. Option-based so nothing fights the browser.
- Deep links: `#/<app>` or `#/<app>/<route>` opens that app on load or on hash change.

### Phone (iOS, ≤ 820px)

- Status bar, two glass widgets (clock/location, latest essay), 4-column icon grid with a badge on Trash, a wide Lab widget, Search pill, floating glass dock.
- Tapping an icon opens the app full-screen (spring scale-in; the home screen recedes). Floating nav pills: **‹ Home** / **‹ Back**, compact title that appears once the large title scrolls away, **×** close on nested screens. Swipe the home indicator up (or tap it) to go home.
- Browser back/forward mirror navigation through the URL hash.
- All tap targets are ≥ 44pt (compact controls extend their hit areas).

## Material

Everything glass shares one recipe in `src/styles/glass.css`:

- translucent fill + `backdrop-filter: blur() saturate()` for vibrancy (one layer per element; content areas are calmer, near-opaque surfaces);
- a 1px **specular rim** drawn with a masked gradient ring (`mask-composite: exclude`) that catches light top-left and bottom-right;
- an inner **lensing band** (inset shadows + radial highlight) so the pane reads as thick;
- long, soft, colour-aware shadows;
- tokens for light/dark, reduced transparency (surfaces go solid) and reduced motion (durations collapse, springs become `ease-out`).

The wallpaper is generative: soft colour blobs and glass ribbons painted on a low-resolution canvas (upscaling gives the blur for free), drifting slowly, paused when the tab is hidden or motion is reduced. Four palettes: Tahoe, Dawn, Graphite, Solar.

## Project layout

```
src/
  App.tsx              picks DesktopShell or PhoneShell at 820px
  os/                  store (reducer + context), app registry, hooks, search index, deep links
  desktop/             Wallpaper, MenuBar (+menus), Dock, Window, DesktopIcons, Spotlight, Sheets, Toasts
  phone/               PhoneShell, HomeScreen, AppScreen, StatusBar
  apps/                shell-agnostic app screens (About, Work, Writing, Lab, Papers, Trash, Settings)
  lab/                 experiment metadata, registry and the eight experiments
  components/          shared controls (Switch, Segmented, Slider, Row, Group), AppearanceControls
  icons/               squircle AppIcon, UI glyphs
  content/data.ts      all placeholder content
  styles/              tokens · base · glass · desktop · phone · apps · lab
```

See [PROTOTYPE.md](./PROTOTYPE.md) for the design direction, the mobile model and reviewer notes.
