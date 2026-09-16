# Prototype: Windows 98 × XP

## Direction

A personal computer as a personal website. XP blue gradient title bars and a glowing green Start button sit over Windows 98 gray bevels, inset address bars, compact menus, and a status tray. The initial desktop opens the Lab, emphasizing readable folders, consistent previews, and a clear source hierarchy. Tahoma and Trebuchet system fonts preserve the period without sacrificing legibility.

The wallpaper is an original SVG composition of layered green hills, a blue sky, blurred clouds, and subtle procedural grain. It does not contain or trace the copyrighted Bliss photograph. All icons and preview artwork are built locally with SVG/CSS. No other benchmark folders are used.

Desktop behavior: draggable title bars, focus stacking, minimize/restore, maximize/restore, close, taskbar app buttons, Start launcher, Show desktop, clock, Escape, and a browser-delivered Alt+Tab cycle. An open experiment is a separate window; closing it returns to the underlying Lab. Launching an existing app focuses its existing window.

## Mobile model

At 820px and below, the desktop becomes a phone home screen with a three-column icon grid. Activities occupy the full available screen above compact bottom chrome. Only the focused activity is visible. A labeled Back button and a Close button have 44px targets; app controls and folder selection are sized for touch. The Lab’s left sidebar becomes a source selector, and cards use two columns. Start becomes a bottom sheet with an app launcher and Show desktop.

There are no draggable miniature windows on phones. Activities retain their state when covered by another activity, and Back reveals the previous one. Start’s Show desktop minimizes all activities, which can be restored through the launcher.

## Lab inventory

| # | Source | Experiment | Implementation / interaction |
|---|---|---|---|
| 1 | grok-4.6 | Spring mass | Canvas spring, drag/release mass, stiffness and damping |
| 2 | grok-4.6 | Optical size | Live type specimen size/weight/spacing slider |
| 3 | grok-4.6 | Glass depth | Translucent acrylic pane, blur and perspective slider |
| 4 | fable-5.1 | Spring toy | Drag and throw a mass; retained release velocity and damping |
| 5 | fable-5.1 | Metaballs | Canvas inverse-square field with moving blobs; press to attract one |
| 6 | fable-5.1 | Text scramble | Hover, keyboard focus, or tap to decode randomized letters |
| 7 | fable-5.1 | Ordered dither | 4×4 Bayer matrix gradient; live intensity control |
| 8 | fable-5.1 | Boids | Separation, alignment, cohesion; tap/press to scatter |
| 9 | opus-5 | Contour Field | Animated layered contour field with amplitude control |
| 10 | opus-5 | Spring Tuner | Canvas puck with independent stiffness/damping controls |
| 11 | opus-5 | Gooey Cursor | SVG Gaussian blur plus feColorMatrix; trailing liquid pointer |
| 12 | opus-5 | FLIP Shuffle | Measures pre/post item rectangles and animates the position delta |
| 13 | opus-5 | Bayer Camera | Animated synthetic luminance feed with Bayer thresholding |
| 14 | opus-5 | Breathing Type | CSS weight, spacing, and scale pulse; LFO fallback, no mic |
| 15 | gpt-6-astra | Orbital daydream | CSS ring orbits; adjustable tempo and warm/cool palette |
| 16 | gpt-6-astra | Satisfying click | Beveled tactile button, press travel, live counter and reset |
| 17 | claude-design | Orbits without JS | Satellites using CSS offset-path / offset-distance keyframes |
| 18 | claude-design | Audio-ish bars | Staggered keyframe bars with tempo control; no audio required |
| 19 | claude-design | Conic loader | Masked conic gradient with adjustable CSS rotation |
| 20 | claude-design | Breathing grid | Staggered grid scale/opacity wave with tempo control |
| 21 | claude-design | Typewriter | Finite typewriter sequence that stops at the end; replay |
| 22 | claude-design | Linear() spring | Toggle a puck between endpoints using CSS linear() spring easing |

All 22 entries remain distinct and are tagged by source. Related spring entries share the clean local physics engine. The Explorer supports search, source folders, grid/list view, a result count, empty results, and random discovery.

## Other apps

- About: personal introduction, fictional system specifications, and a Lab shortcut.
- Hackathons: three sample process notebooks with readable detail views.
- Writing: three sample essays with collection/detail navigation.
- Papers: three sample technical notes connected to the Lab.
- Trash: three playful discarded filenames, restore and empty interactions.

## Accessibility and limitations

Semantic buttons, labeled search/controls, keyboard focus styles, pointer capture for dragging, and 44px mobile controls. `prefers-reduced-motion` disables CSS animation/transition, skips FLIP motion, and freezes ambient canvas simulation time. Explicit manual interactions remain available. Animation frames, timers, and event listeners are cleaned up when experiments close.

This is an in-memory prototype: window arrangements, clicks, and trash state do not persist across reloads. Optical size is approximated through system-font size, weight, and spacing rather than a bundled variable-font optical axis. Breathing Type also uses system-font weight steps. Contours use an analytic layered field rather than sampled terrain. No webcam/microphone permission, backend, external asset, or account is required.

## Delivery

Expected commands: `npm install` and `npm run build`. Intended branch is `win98-xp` only; the provided read-only `.git` placeholder prevents branch creation in this environment. Existing branches and other model directories are untouched.

## Validation results

- `npm install && npm run build` succeeded with TypeScript and Vite production output.
- Dependencies were resolved from the provided npm cache because external registry DNS is unavailable. A project-local cache setting also avoids the read-only global cache.
- Browser validation was attempted but could not run: the sandbox denied the Vite listening socket (EPERM) and terminated the Chromium control pipe. Desktop/mobile screenshots and browser interaction checks are therefore unverified in this environment.
