# PROTOTYPE — liquid-glass-v2

**Model:** `claude-fable-5-1` (Claude Fable 5.1) running as a Cursor Cloud Agent.
**Stack:** Vite 8 · React 19 · TypeScript 5.9 · zero UI dependencies.
**Branch:** `liquid-glass-v2` → PR to `main` (do not merge; `main` stays the comparison host).
**Iteration of:** `liquid-glass` (v1). Content and app structure were read for reference; the visual system, icons, shells and Lab were rebuilt from scratch.

## Brief, in one line

Mikail's read on v1: "cool, but too Android." v2 has one job — a two-second glance should say **Apple**: macOS Liquid Glass on the desktop, iOS on the phone, and app icons that belong on an iPhone.

## What "Android" was, and what replaced it

| Signal in v1 | Why it read Android | v2 |
| --- | --- | --- |
| Thin outline glyphs on small gradient tiles | Material "outlined" icon set energy; adaptive-icon proportions | Filled, heavy SF-style glyphs with a contact shadow, on **edge-to-edge** squircles (superellipse n = 5, 32 samples per quadrant). Mixed families like a real Home Screen: coloured (About, Hackathons, Lab), white-based (Notes-style Writing, Files-style Papers), grey utilities (Settings gear, wire-basket Trash). |
| Washed-out wallpaper, one blur value everywhere | Blur with nothing to refract reads as flat grey cards | Saturated colour fields painted on `screen` with glassy ribbons and a vignette. Glass uses `saturate(1.9) brightness(1.06)` so wallpaper colour survives the pane. |
| Uniform frosted rectangles | No hierarchy inside the window | **Sidebar glass over a calm content pane.** Traffic lights sit on the sidebar; the toolbar is part of the content pane. Sidebars, menus, Dock, Control Center and banners share one recipe with different fills. |
| Phone: grid + pills | Launcher energy | Lock Screen → Home Screen → full-screen app with `UINavigationBar` semantics (`‹ Back`, collapsing large title), inset grouped tables, action sheets, Dynamic Island, home indicator. |

## Icon recipe (`src/icons/IconShell.tsx`)

1. `clipPath` = superellipse path in a 120×120 box (`squirclePath(120, 5)`).
2. Two-stop gradient along `lightAngle` (default 150°).
3. Artwork: filled white shapes with `feDropShadow(0, 1.6, 1.4, 22%)` — the contact shadow is what makes a glyph look printed *on* the tile rather than floating.
4. Radial "foot" darkening at the bottom (12% iOS, 22% mac) for volume.
5. Top-light sheen gradient (28% → 4% → 0).
6. Hairline rim: the squircle stroked at 1.6 units, scaled to 98.7%, white 70% at the top fading to 8% at the bottom.

`AppIcon` maps app ids to palettes and artwork; `GlyphIcon` builds the same shell around any `Symbol` (used for Home Screen shortcuts and the Icon Forge). The Dock passes `variant="mac"` for a stronger foot and sheen.

## Liquid Glass recipe (`src/styles/glass.css`)

```
.glass
  background:        accent tint over --glass-fill (white 40% light · navy 44% dark)
  backdrop-filter:   blur(26px) saturate(1.9) brightness(1.06)
  box-shadow:        inner top highlight + long colour-aware shadow
.glass::after        sheen (top 38%) + caustic radial at --mx/--my
.glass::before       1px ring: padding + mask-composite: exclude, gradient along --rim-angle
```

- `--rim-angle` lets surfaces catch light differently: windows 125°, Dock 160°, Control Center 120°, menus 150°.
- `.glass-caustic` + `useCaustic()` write `--mx/--my` on pointer move so the highlight follows the cursor over the Dock and Control Center (no React state).
- `.glass-thin` (menu panels, pills, widgets), `.glass-thick` (windows, sheets, Spotlight).
- `data-transparency="reduced"` (setting or `prefers-reduced-transparency`) drops the backdrop filter and swaps fills for solids with a hairline border; `data-motion="reduced"` collapses durations and replaces both `linear()` springs with `ease-out`.
- Content panes are near-opaque (`--window-content`), never blurred, and nothing blurs inside a scroll container.

## Shell model

`App.tsx` swaps the shell at `(max-width: 820px)`. Both shells share the store (`src/os/store.tsx`: settings, windows, trash, toasts, overlay), the app registry and the apps themselves.

Apps are shell-agnostic components receiving `{ shell, route, onRoute, openApp }` and rendering through **`AppFrame`** (`src/apps/frame.tsx`):

- `shell="mac"` → `NavigationSplitView`: glass `aside` under the traffic lights (drag handle), a unified toolbar with `App › Document` breadcrumb and trailing actions, a scrolling content body that is also a CSS container (`@container app`).
- `shell="ios"` → `UINavigationController`: absolute nav bar (`‹ Home` on root, `‹ App` when `nested`), large title that collapses into a `.glass-thin` bar after 40px of scroll, and either the root list (`sidebar`) or the pushed detail (`children`).

The phone shell owns one `{ appId, route }`. Opening an app pushes `#/app/route`; `popstate` restores the screen, so the hardware back button behaves like iOS back. The desktop reads the same hash on load and mirrors the focused window back into it, so links round-trip between form factors.

## Lab

| id | Piece | Mechanism |
| --- | --- | --- |
| `glass` | Glass Bench | CSS variables drive a real pane: `blur()`/`saturate()` backdrop, masked rim, and an **edge band** (a second masked ring with `blur(2px) brightness(1.18)`) that reads as glass thickness. Emits copyable CSS. |
| `squircle` | Squircle Studio | Same `squirclePath()` as the icons; dashed `border-radius: 22.37%` overlay; analytic curvature comb from the superellipse derivatives. |
| `icon` | Icon Forge | `GlyphIcon` with live hue/glyph/light-angle; exports the SVG at 1024px. |
| `dock` | Dock Physics | The Dock's Gaussian with σ/peak sliders; icons scale from pointer distance, curve plotted as an SVG polyline. |
| `spring` | Spring Lab | Semi-implicit Euler on a canvas, velocity from the last pointer delta, ζ = c / 2√(km), and a `linear()` baker that samples the step response at 120Hz until it settles. |
| `island` | Dynamic Island | Width/height/radius transition on `--spring`; four content states with a live timer. |
| `ripples` | Ripples | Canvas rings: trough (dark, wide), crest (white, thin), specular arc on the upper-left; ambient drops when idle. |

## Reviewer notes

- `src/desktop/Window.tsx` — drag writes `transform` during the gesture and commits a rect on release; resize writes geometry directly; minimize aims at the Dock icon via `--to-x/--to-y`; the enter animation is dropped after `animationend` (`data-entered`) so it never restarts under a drag.
- `src/desktop/Dock.tsx` — magnification writes `--s` per icon straight to the DOM; width and `transform: scale()` animate together so neighbours slide apart; disabled for touch pointers and when motion is reduced.
- `src/desktop/menus.ts` — menus are data (`buildMenus(state, commands)`), rendered by `MenuBar.tsx` with submenus, checkmarks, shortcuts and arrow-key navigation between titles.
- `src/os/search.ts` — Spotlight index over apps, essays, hackathons, experiments, papers and settings actions; grouped results ordered by best hit.
- `src/components/Wallpaper.tsx` — 420px canvas, `ResizeObserver` for aspect, `screen`/`soft-light`/`overlay`/`multiply` passes, paused when hidden or motion is reduced.
- Trademark hygiene: the menu-bar mark, all app glyphs and the UI symbol set are original drawings. No Apple assets are shipped; the word "Finder" appears only as the default app-menu label.
- Accessibility: roles on menus/dialogs/lists/radiogroups, `aria-pressed`/`aria-checked`/`aria-current`, visible focus rings, ≥ 44pt targets on the phone, reduced motion and reduced transparency (setting + media queries).

## Verified

- `npm install && npm run build` green (tsc + Vite), zero console errors in headless Chrome on every screen exercised below.
- Desktop (1440×900, 1280×800): deep link → window, drag (Δ exact), 8-way resize, `⌥2` open, `⌥W` close, minimize → Dock restore, zoom, Esc close, Control Center → reduce transparency, Trash Empty → Undo banner → 8 items restored, menus + submenus, Spotlight, light/dark, all four wallpapers, all seven experiments.
- Phone (390×844, touch): Lock Screen → unlock → Home → app zoom → push detail (`#/hackathons/tapestry`) → browser back pops → `‹ Home`; deep link skips the lock; Settings, About (collapsing title), Lab experiment, Trash action sheet in dark mode.
