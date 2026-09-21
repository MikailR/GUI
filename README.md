# Mikail OS — Liquid Glass v2

A personal site built as a small operating system, committed fully to Apple's chrome on both form factors.

- **Laptop → macOS.** A transparent menu bar with working menus, traffic-light windows with continuous corners and a glass sidebar, a floating Dock with Gaussian magnification, Control Center, Spotlight, notification banners, a lock/sleep screen.
- **Phone (≤ 820px) → iOS.** A Lock Screen you swipe up from, a status bar with Dynamic Island, glass widgets, a squircle Home Screen with a translucent Dock, and full-screen apps with **‹ Back**, large titles that collapse into the nav bar, inset grouped lists and action sheets. Not a shrunk desktop, not an Android launcher.

Same content, same apps, two shells. Vite 8 · React 19 · TypeScript, no UI libraries.

> This branch (`liquid-glass-v2`) is one entry in the [GUI bakeoff](https://github.com/MikailR/GUI). It is a from-scratch rebuild of the visual system after feedback that [`liquid-glass`](https://github.com/MikailR/GUI/tree/liquid-glass) read "too Android". `previews/`, `COMPARISON.md`, `live-urls.md` and `comparison-board.html` are inherited from `main`'s comparison host and are not part of this app.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc -b && vite build → dist/ (base './', works from any subpath)
npm run preview    # serve dist/
```

`dist/` is committed so the branch can be previewed by extracting it onto any static host; rebuild before committing changes.

## What changed from v1

| v1 feedback | v2 |
| --- | --- |
| Icons read as Android adaptive icons (round discs, thin outline glyphs) | Every icon redrawn as an Apple **squircle** (superellipse, n = 5): edge-to-edge gradient, **filled** SF-style glyph with a contact shadow, top-light sheen, hairline specular rim. Notes-style Writing, Files-style Papers, gear Settings, wire-basket Trash. Dock icons get extra depth. |
| Glass looked like a single white blur | Five-layer material: fill + accent tint → `blur() saturate() brightness()` → sheen + pointer-tracking caustic → masked 1px specular rim with a light angle → colour-aware shadow. Windows use a **glass sidebar over a calm content pane**, not one frosted rectangle. |
| Phone felt like a launcher | iOS **Lock Screen**, Dynamic Island, widgets, Search pill, page dots, 60pt icons with vibrant labels, translucent Dock, spring zoom from the tapped icon, `UINavigationController`-style push/pop, inset grouped tables, iOS action sheets, home indicator swipe. |
| Generic system chrome | macOS menu bar (`Finder`-style bold app name, status glyphs, `Mon Sep 21  12:36 PM`), exact traffic-light colours, System Settings layout, Control Center tiles, Spotlight. |

## Apps

| App | macOS | iOS |
| --- | --- | --- |
| **About** | Identity pane with avatar, "Now" list and links | Contacts-style card with action buttons |
| **Hackathons** | Sidebar of six events → detail pane with hero, stats and stack | Inset list → pushed detail |
| **Writing** | Essays sidebar → reader with pull quotes and code | Card list → full-screen reader |
| **Lab** | Experiment sidebar → live stage | List → full-screen experiment |
| **Papers** | Toolbar segmented filter, expandable abstracts | Segmented filter + expandable cards |
| **Trash** | Finder-like columns, Empty… alert, Undo banner | Grouped list, iOS action sheet, Undo banner |
| **Settings** | System Settings: sidebar with coloured icons → panes | iOS Settings: profile row, quick toggles, drill-downs |

Deep links: `#/<app>` or `#/<app>/<route>` (e.g. `#/writing/dock-math`, `#/lab/squircle`). Both shells read the hash on load and mirror navigation back into it.

## Lab (7 playable experiments)

| id | Piece | What you play with |
| --- | --- | --- |
| `glass` | **Glass Bench** | Drag a pane over a loud backdrop; blur, saturation, fill, rim, edge thickness, radius. Copy the CSS. |
| `squircle` | **Squircle Studio** | Superellipse exponent 2 → 12 over a dashed `border-radius` box, with a curvature comb. Copy the path. |
| `icon` | **Icon Forge** | Hues, glyph, glyph size, light angle, gradient/white/black base. Rendered at App Store, Home Screen and Dock sizes. Download SVG. |
| `dock` | **Dock Physics** | σ and peak of the magnification Gaussian, plotted live under a row of icons that follow the pointer. |
| `spring` | **Spring Lab** | Throw a glass orb; stiffness/damping/mass, ζ readout, presets, and a baked `linear()` easing to copy. |
| `island` | **Dynamic Island** | Compact → timer → now playing → call, morphing with the OS spring. Auto-cycle or tap. |
| `ripples` | **Ripples** | Tap to disturb glass; crest/trough rings with a specular arc, ambient drops when idle. |

## Desktop (macOS)

- Menu bar: OS mark (About This Mac, Settings, Shortcuts, Sleep, Restart), app menu, File (Open ▸, Search, Close), View (Appearance ▸, Wallpaper ▸, Live Wallpaper, Reduce Transparency, Reduce Motion), Window (Minimize, Zoom, Cycle, Tile, Bring All to Center, Show Desktop, window list), Help. Arrow keys move between open menus.
- Control Center: Wi‑Fi / Bluetooth / AirDrop, Focus, Light/Dark, Glass, Display and Sound sliders, wallpaper swatches.
- Dock: Gaussian magnification (`1 + 0.62·e^(−d²/2σ²)`, σ = 1.35 icons), width animates with scale so neighbours slide, running dots, launch bounce, glass tooltips, Trash fills up.
- Windows: pointer-capture drag (transform during the gesture, rect committed on release), 8-direction resize, focus, minimize toward the Dock icon, zoom, Esc to close, cascade placement, tile/gather.
- Spotlight `⌘K`/`Ctrl K`: apps, essays, hackathons, experiments, papers, settings; grouped results, arrow keys + Enter.
- Keyboard: `⌥1–7` open apps · `⌥W` close · `⌥M` minimize · `⌥↩` zoom · `` ⌥` `` cycle · `⌥T` tile · `⌥G` gather · `⌥D` show desktop · `⌥,` settings · `?` shortcuts sheet.

## Phone (iOS, ≤ 820px)

- Lock Screen on first visit per session (skipped for deep links): thin 88pt clock, glass notifications, flashlight/camera pills, swipe up or tap to open.
- Home: clock + latest-essay widgets in smoked glass, 4-column squircle grid (apps plus web-clip shortcuts to GitHub, Mail and two Lab experiments), Trash badge, page dots, Search pill, translucent Dock.
- Apps zoom out of their icon with the OS spring; the Home Screen recedes and blurs behind them.
- Nav bar: `‹ Home` on root screens, `‹ AppName` on pushed screens; large title collapses into a glass bar on scroll. Browser back/forward mirror the stack.
- Home indicator: tap or swipe up to return home. All tap targets ≥ 44pt.

## Material

`src/styles/glass.css` composes each pane from five layers (fill · backdrop · lens · rim · shadow); `src/styles/tokens.css` holds Apple's system palette, the SF-like type stack, two `linear()` springs and the light/dark/reduced-transparency/reduced-motion switches (`data-*` on `<html>`, honouring `prefers-color-scheme`, `prefers-reduced-motion` and `prefers-reduced-transparency`).

The wallpaper is generative: saturated colour fields on `screen`, glassy ribbons on `soft-light` with a bright crest, and a vignette, painted at 420px wide and upscaled. Four palettes (Tahoe, Sequoia, Sonoma, Graphite), each with light and dark variants; it drifts slowly and pauses when hidden or when motion is reduced.

## Project layout

```
src/
  App.tsx              picks DesktopShell or PhoneShell at 820px
  os/                  store (reducer + context), app registry, hooks, routes, search index, wallpapers
  desktop/             DesktopShell, MenuBar (+menus), Dock, Window, DesktopIcons, ControlCenter,
                       Spotlight, Notifications, Sheets
  phone/               PhoneShell, LockScreen, StatusBar, HomeScreen (+shortcuts), PhoneNavContext
  apps/                shell-agnostic app screens + AppFrame (mac split view / iOS nav stack)
  lab/                 registry, shared controls, seven experiments
  icons/               squircle geometry, IconShell, AppIcon, GlyphIcon, SF-like Symbol set
  components/          Wallpaper, controls (Switch, Segmented, Slider, Button, Group, Row), pickers
  content/data.ts      all placeholder content
  styles/              tokens · base · glass · controls · desktop · phone · apps · lab
```

See [PROTOTYPE.md](./PROTOTYPE.md) for the design direction, the icon and glass recipes, and reviewer notes.
