# Mikail’s Personal Computer

A self-contained Windows 98 × XP portfolio prototype built with Vite, React, and TypeScript. Original SVG wallpaper, a desktop window manager, six apps, and 22 working experiments. No files or assets are imported from the other model prototypes.

## Run

```sh
npm install
npm run dev
```

Production build and preview:

```sh
npm run build
npm run preview
```

Desktop: click an icon or Start item to launch an app. Drag title bars, minimize, maximize, and close windows. Double-click a title bar to maximize. Taskbar buttons restore or minimize apps. Escape closes the focused app; Alt+Tab cycles windows when the browser/OS delivers the shortcut.

Mobile (820px and below): the home icon grid launches full-screen activities. Back or Close returns to the previous activity. Start offers all apps and Show desktop. No miniature desktop windows.

Lab: browse all five source groups, filter by folder, search, toggle grid/list, or pick a random experiment. A single click/tap opens an experiment (also naturally supports double-clicking without duplicate windows). Each experiment includes live controls.

All portfolio articles and hackathon notes are explicitly labeled sample editorial content. No invented achievements or external integrations. The Bayer Camera uses a synthetic feed, and Breathing Type uses an oscillator; neither requests hardware access.

See [PROTOTYPE.md](./PROTOTYPE.md) for the complete inventory and design notes.

## Branch

Intended branch: `win98-xp`. The supplied environment contains a read-only placeholder `.git` directory and is not a usable Git repository. No existing branches were changed, and no push was attempted.
