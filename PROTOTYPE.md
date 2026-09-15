# PROTOTYPE

**Model:** claude-fable-5-1

**Visual direction:** A macOS-flavoured desktop with its own identity: a live-painted aurora wallpaper under frosted-glass chrome, warm amber accents on a dusk palette (with a dawn counterpart), hand-drawn squircle app icons, and a dock whose magnification follows a Gaussian falloff. On phones the same window manager renders as an iOS-style springboard with swipe-to-dismiss sheets.

**How to run:**

```bash
npm install
npm run dev        # dev server
npm run build      # verifies tsc + vite build
npm run preview    # serve dist/
```

**Notable bits for reviewers**

- `src/os/store.tsx` — single reducer drives windows (open/close/focus/move/resize/minimize/zoom with phases for animation), theme, toasts, spotlight, trash.
- `src/components/Window.tsx` — pointer-capture drag/resize that writes transforms during the gesture and commits to the store on release; genie-minimize aims at the dock icon.
- `src/components/Dock.tsx` — continuous magnification (`1 + 0.6·e^(−d²/2σ²)`), running dots, launch bounce.
- `src/components/Wallpaper.tsx` — three generative wallpapers on a low-res canvas upscaled for free blur, with film grain; pauses when hidden or with reduced motion.
- `src/apps/Lab.tsx` — five live experiments (spring toy, metaballs, text scramble, Bayer dither, boids) with loops that pause off-screen.
- `src/apps/Terminal.tsx` — fake zsh with history, tab-completion, `neofetch`, and `open <app>`.
- `src/components/MobileShell.tsx` — sheets, home bar, status bar, dock with running indicators.
