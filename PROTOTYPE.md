# PROTOTYPE — liquid-glass

**Model:** `claude-fable-5-1` (Claude Fable 5.1) running as a Cursor Cloud Agent.
**Stack:** Vite 8 · React 19 · TypeScript 5.9 · zero UI dependencies.
**Branch:** `liquid-glass` → PR to `main` (do not merge; `main` stays the comparison host).

## Direction

Apple's Liquid Glass language applied to a personal OS, committed fully on both form factors:

- **Desktop = macOS Tahoe.** Transparent menu bar with shadowed type; a floating glass Dock pill; windows with continuous 18px corners, a unified 46px glass toolbar, traffic lights that reveal glyphs on hover, and a calmer near-opaque content surface so text never fights the wallpaper. Menus, Control Center, Spotlight and sheets are all cut from the same glass.
- **Phone = iOS 26.** Not a shrunk desktop. Glass widgets and squircle icons over the wallpaper, a floating glass dock, then full-screen apps with iOS large titles that collapse into a floating title pill. Navigation is explicit: **‹ Home** on root screens, **‹ Back** + **×** on nested ones, plus a swipeable home indicator and hash-mirrored browser history.

The material is deliberately restrained: one backdrop-filter per surface, a real specular rim rather than a white border, saturation for vibrancy instead of extra opacity, bloom only where light would actually pool. It should read as "Apple's glass, applied to Mikail's OS", not as a card grid with `backdrop-filter` sprinkled on.

## Mobile model

`App.tsx` swaps the shell at `(max-width: 820px)`. Both shells share:

- the **store** (`src/os/store.tsx`): settings, trash, toasts, spotlight, and (desktop-only) window state;
- the **apps** (`src/apps/*`), which receive `{ shell, route, onRoute, openApp }` and render either inside a window or full-screen. Layout differences are handled with container queries (`@container app`) and a `shell` prop for the few places (large titles, flush two-pane layouts) where behaviour genuinely differs;
- the **Lab experiments**, which are identical on both.

The phone shell owns a single `screen = { appId, route }`. Opening an app pushes `#/app/route` into history so the hardware/browser back button behaves like iOS back; `popstate` updates the screen. The desktop shell reads the same hash on load and on `hashchange`, so links round-trip between form factors.

## Liquid Glass recipe

`src/styles/glass.css` composes each surface from:

1. **Fill** — `--glass-fill` (white 50% light / navy 42% dark; thin and thick variants).
2. **Blur + vibrancy** — `backdrop-filter: blur(30px) saturate(1.65)`.
3. **Specular rim** — a `::before` ring built with `padding: 1px` + `mask-composite: exclude`, filled with a 135° gradient that is bright at the top-left and bottom-right and fades in between. `--rim-angle` lets surfaces catch light from slightly different angles (Dock 160°, windows 125°).
4. **Lens band** — `::after` with inset shadows and a top radial highlight so the pane looks thick, not printed.
5. **Shadow** — long, low-opacity, colour-aware.

Tokens in `src/styles/tokens.css` switch with `data-appearance`, `data-transparency` (solid surfaces), `data-motion` and `data-tint` on `<html>`; `prefers-reduced-motion` and `prefers-color-scheme` are honoured automatically.

## Lab (8 experiments)

| id | Piece | What you play with |
| --- | --- | --- |
| `spring` | Spring toy | Throw a glass orb; semi-implicit Euler spring with stiffness/damping sliders, ζ readout and a live trace. |
| `glass` | Glass workbench | Drag a pane over a busy backdrop; blur, saturation, fill, rim, radius and an SVG `feDisplacementMap` edge-refraction layer. Copy the CSS. |
| `lens` | Liquid lens | A magnifying droplet over a paragraph using a clipped, scaled duplicate with a slight chromatic split; click to pin. |
| `type` | Type studio | Variable weight/tracking/size headline; letters bump under the cursor with the Dock's Gaussian; glass fill via `background-clip: text`. |
| `curves` | Motion curves | Drag cubic-bezier handles or bake a real spring into a `linear()` easing; play a glass puck; copy the CSS. |
| `ripples` | Ripples | Tap to disturb a glass surface; crest/trough rings with a specular arc, ambient drops when idle. |
| `concentric` | Concentric corners | Nested panes with `r − padding` radii vs a naive same-radius mode, with corner-circle guides. |
| `dock` | Dock curve | The magnification Gaussian with σ and peak exposed, plotted live under a row of pills. |

## Reviewer notes

- `src/desktop/Window.tsx` — drag writes `transform` during the gesture and commits a rect on release; resize writes geometry directly; minimize aims at the Dock icon via CSS variables; exit animations are owned by the shell so Esc, menus and traffic lights share one path.
- `src/desktop/Dock.tsx` — magnification writes `--s` per icon straight to the DOM (no React re-render per pointer move); width and height animate together so neighbours slide apart.
- `src/desktop/wallpapers.ts` — four generative palettes painted at 360px wide; blobs on `screen` compositing plus glass-edge ribbons and a vignette.
- `src/os/menus.ts` — the menu bar is data (`buildMenus(state, commands)`), rendered by `MenuBar.tsx`.
- `src/os/search.ts` — Spotlight index over apps, essays, hackathons, experiments, papers and settings actions; results stay grouped, groups ordered by best hit.
- Accessibility: roles on menus/dialogs/lists, `aria-pressed`/`aria-checked` on controls, visible focus rings, ≥ 44pt hit areas on the phone, reduced motion + reduced transparency toggles.

## Verified

- `npm install && npm run build` green (tsc + Vite), zero console errors in headless Chrome.
- Desktop smoke (1440×900 and 1024×700): open via Dock / desktop icon / `⌥4` / Spotlight / deep link, drag, resize, minimize, zoom, tile, Esc close, menus, Control Center, appearance switch, reduced transparency, Trash empty + Undo toast, all eight experiments.
- Phone smoke (390×844, touch): home → app → nested route → back → close, large-title collapse, hash history back, Lab experiment, Settings.
