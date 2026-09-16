# Classic Windows 98 — prototype notes

**Tool:** Codex CLI · **Model:** `gpt-6-astra` · **Branch:** `win98-classic`

## Direction

Mikail’s Personal Computer: a teal desktop with crisp `#C0C0C0` raised and sunken surfaces, dark navy gradient active captions, gray inactive captions, chunky window controls, and a gray Start button with an original four-color pixel flag. The content uses a quiet cream reading surface, with a teal illustrated Welcome panel, readable hierarchy, inset fields, group boxes, and status bars.

No Luna skin, green Start pill, Bliss wallpaper, downloaded Windows icons, or external visual assets. All icons are hand-authored SVG on a 32-unit pixel grid. Tahoma / MS Sans Serif / Arial form the system stack; Courier New supplies a terminal-like fallback. There are no font downloads.

## Desktop

Welcome and Explorer-style Lab are arranged as layered, functional windows. App instances retain state while minimized. Pointer capture handles dragging; positions are constrained so captions remain reachable. Maximize fills the work area above the taskbar. Taskbar buttons indicate focus and restore minimized apps. Escape closes the current app or Start menu; Alt+Tab provides an in-page focus cycle where the OS/browser does not intercept it.

The original Welcome illustration is an oversized, slightly tilted pixel CRT. The subtle teal dither, desktop lettering, small personal note, and muted embossed wordmark give the surrounding desktop a sense of place.

## Mobile: a physical little computer

At `max-width: 820px`, the window manager becomes a phone-style activity stack. Initial state is Home, not a tiny desktop window. Apps fill the area above the persistent taskbar. Back/Close returns to the previous activity, including Lab after an experiment. Show Desktop returns to the launcher; reopening restores an app.

The Home surface has a molded gray case, embossed device header and status LED, deeply inset teal patterned desk, separate raised icon wells with stepped drop bevels, and a beveled note window. The 3×2 launcher and short welcome note make the resting state substantial at phone widths. The page scrolls when needed on short devices.

Primary touch controls are at least 44px. Active apps remove the underlying Home buttons from keyboard interaction. Newly focused windows receive keyboard focus. Focus indicators, semantic buttons, named controls, explicit canvas labels, keyboard spring input, and live system reduced-motion preferences are included. CSS transitions and animations stop under `prefers-reduced-motion`; dynamic experiments start paused. Explicit Play permits canvas/LFO progression. Hidden canvas apps skip drawing work.

## Unified Lab inventory

Each entry opens its own app, with local state and relevant controls. Source labels identify the requested inventory provenance, not imported code; everything was implemented independently here using the brief inventory.

| # | Source | Experiment | Interaction |
|---|---|---|---|
| 1 | grok-4.6 | Spring mass | Drag/release or arrow-key weight; stiffness and damping |
| 2 | grok-4.6 | Optical size | Type size and optical spacing specimen slider |
| 3 | grok-4.6 | Glass depth | Acrylic blur and perspective depth slider |
| 4 | fable-5.1 | Spring toy | Throw and release a damped weight |
| 5 | fable-5.1 | Metaballs | Animated inverse-square fields; pointer adds a blob |
| 6 | fable-5.1 | Text scramble | Hover, focus, or tap to decode |
| 7 | fable-5.1 | Ordered dither | Bayer-matrix gradient with threshold adjustment |
| 8 | fable-5.1 | Boids | Separation, alignment, cohesion; pointer/Space scatter |
| 9 | opus-5 | Contour Field | Animated isolines using marching-squares edge intersections |
| 10 | opus-5 | Spring Tuner | Adjustable stiffness/damping with draggable puck |
| 11 | opus-5 | Gooey Cursor | SVG Gaussian blur + color-matrix merging blobs |
| 12 | opus-5 | FLIP Shuffle | Stable items animate between translated list slots |
| 13 | opus-5 | Bayer Camera | Animated synthetic feed through ordered dithering |
| 14 | opus-5 | Breathing Type | CSS/LFO size, weight, and width breathing |
| 15 | gpt-6-astra | Orbital daydream | Orbit radius, tempo, and palette |
| 16 | gpt-6-astra | Satisfying click | Tactile press travel, counter, and reset |
| 17 | claude-design | Orbits without JS | CSS offset-path satellite motion; tempo/palette controls |
| 18 | claude-design | Audio-ish bars | Staggered keyframe bars; intensity, tempo, palette |
| 19 | claude-design | Conic loader | Conic-gradient ring; scale, tempo, palette |
| 20 | claude-design | Breathing grid | Staggered scaling cells; size, tempo, palette |
| 21 | claude-design | Typewriter | Editable sentence, tempo, finite completion, reset |
| 22 | claude-design | Linear() spring | CSS `linear()` easing, release toggle, reset |

## Deliberate simplifications

- Front-end prototype only. Display preferences and window state last for the current page session, without permanent storage.
- Bayer Camera uses an animated mathematical feed. Breathing Type uses a local oscillator. Neither requests device access.
- Optical size adjusts a system-font specimen’s size and spacing; it does not load a variable optical-size font. Breathing weight fidelity depends on locally installed system fonts.
- The shuffle uses stable elements and transform-based slot transitions (FLIP-style motion), rather than layout measurement, because all slots have a known equal height.
- The three spring entries share a small physical engine; each remains a separate inventory item/app.
- Placeholder project notes and essays are explicitly identified as samples. Trash operates only on sample entries. Stand by is reversible.
- CSS `offset-path`, `linear()`, SVG filters, and backdrop filtering target modern browsers.

## Validation

`npm run build` passes: strict TypeScript and a Vite production bundle. Render smoke checks pass for desktop/mobile initial states and every experiment. Chrome launch and Vite HTTP serving were attempted but blocked by sandbox socket permissions, so visual inspection and end-to-end interaction checks remain unverified in this environment.

## Publication

Built assets use relative URLs. The main preview update adds `/previews/win98-classic/` and a comparison-board entry without modifying any existing preview. Built for branch `win98-classic` with Pages preview at `/previews/win98-classic/`.
