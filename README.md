# Mikail’s Personal Computer — Classic 98

A self-contained Windows 98-inspired personal site, built with React, TypeScript, and Vite. Created with Codex CLI / `gpt-6-astra` for the `win98-classic` iteration.

## Run

Requires Node.js 20.19+ (or 22.12+) and npm.

```sh
npm install
npm run dev
```

```sh
npm run build
npm run preview
```

The production site is in `dist/`. Asset URLs are relative, so it can be served at `/previews/win98-classic/` or another subdirectory. No backend, API keys, remote fonts, account, camera, or microphone required.

## Explore

- Desktop: Welcome and Lab open initially. Click an icon to launch an app. Drag title bars, minimize, maximize, close, or switch using taskbar buttons. Double-click a title bar to maximize. Escape closes the focused window; Alt+Tab cycles apps when the browser lets the page receive the shortcut.
- Start: cascading Programs and Documents menus, Display Properties, Lab search, Help, Run, and a reversible Stand by screen.
- Run recognizes `lab.exe`, `notepad`, `explorer`, `control`, `about`, `home`, app IDs, and experiment names/IDs.
- Phones and tablets at **820px or below**: a textured home grid opens full-screen apps with Back and Close. Returning from an experiment reveals its Lab folder. The desktop taskbar icon returns Home. Reopening an existing app restores its state.
- Lab: 22 interactive experiments grouped by five source prototypes, with search and detail/icon views. Canvas experiments accept pointer input; spring weights also accept arrow keys, and Space scatters the flock.
- Writing, Hackathons, and Papers contain intentionally authored **sample content**, not verified claims about real projects, awards, or publications. GitHub links to the owner specified in the creative brief.

## Implementation

- `src/App.tsx`: shell, window manager, launcher, Explorer, and content apps.
- `src/Experiments.tsx`: canvas simulations and CSS/DOM experiments.
- `src/Icons.tsx`: original pixel-grid SVG illustrations.
- `src/data.ts`: inventory and sample essays.
- `src/styles.css`: classic widget kit, desktop composition, mobile device surface, and motion.

See [PROTOTYPE.md](./PROTOTYPE.md) for visual direction, full inventory, accessibility choices, and limitations.

## Validation and delivery

TypeScript and the Vite production build pass. Server-render checks cover the initial desktop, the six-icon mobile home, all 22 experiment views, and the five-source inventory. Full browser interaction/screenshot validation could not run in the provided sandbox: Chrome and local servers are blocked by socket permissions.

The sandbox cannot resolve GitHub/npm hosts. Dependencies were installed using an existing package cache; an esbuild install-time synchronous subprocess was also blocked, so the initial cached extraction used `--ignore-scripts`. A subsequent cached `npm install` and `npm run build` both passed, including esbuild’s actual production compilation. On a normal networked machine, use the standard commands above.

This branch is the Classic Windows 98 iteration only. Frozen bakeoff branches were not modified.
