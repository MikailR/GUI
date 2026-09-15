# PROTOTYPE

**Model:** claude-opus-5

**Visual direction:** `mikail.os` — a dusk/dawn/day themed desktop with layered CSS sky wallpapers (ember horizon, violet dusk), glass window chrome, Spotlight search, toast notifications, and a macOS-language dock/menu bar. Mobile uses a dedicated sheet/springboard shell (`MobileShell`) rather than a shrunk desktop.

**How to run:**

```bash
npm install
npm run dev
npm run build
```

**Notable bits:** window manager in `src/os/store.tsx`; Spotlight; Terminal/Lab/Hackathons/Writing/Papers/Trash/Settings apps; generative-feeling wallpaper system in `src/os/Wallpaper.tsx` + `src/styles/os.css`.
