import { useEffect, useRef } from 'react';
import { createNoise3D } from '../lib/noise';
import { useSettings } from './settings';
import type { ThemeName } from './types';

const INK: Record<ThemeName, { line: [number, number, number]; min: number; max: number; glow: string }> = {
  dawn: { line: [255, 240, 226], min: 0.07, max: 0.34, glow: 'rgba(255,190,150,' },
  day: { line: [38, 52, 72], min: 0.06, max: 0.22, glow: 'rgba(255,255,255,' },
  dusk: { line: [255, 206, 170], min: 0.05, max: 0.36, glow: 'rgba(255,150,100,' },
  night: { line: [150, 205, 255], min: 0.04, max: 0.26, glow: 'rgba(90,150,255,' },
};

/**
 * A living topographic survey map: layered simplex noise sampled on a coarse
 * grid, iso-lines extracted with marching squares. The pointer raises a hill.
 */
export function Wallpaper() {
  const { theme, reducedMotion, wallpaperRef, settings } = useSettings();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const themeRef = useRef(theme);
  const reducedRef = useRef(reducedMotion);
  const dirtyRef = useRef(true);
  themeRef.current = theme;
  reducedRef.current = reducedMotion;

  useEffect(() => {
    dirtyRef.current = true;
  }, [theme, reducedMotion, settings.wallpaper]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const noise = createNoise3D(1729);
    let w = 0;
    let h = 0;
    let dpr = 1;
    let cell = 12;
    let cols = 0;
    let rows = 0;
    let field = new Float32Array(0);
    let raf = 0;
    let last = 0;
    let t = 40;
    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999, lift: 0, targetLift: 0, pulse: 0 };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      cell = w < 700 ? 10 : 12;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      cols = Math.ceil(w / cell) + 1;
      rows = Math.ceil(h / cell) + 1;
      field = new Float32Array(cols * rows);
      dirtyRef.current = true;
    };
    resize();

    const onMove = (e: PointerEvent) => {
      pointer.tx = e.clientX;
      pointer.ty = e.clientY;
      pointer.targetLift = 1;
      if (pointer.x < -9000) {
        pointer.x = e.clientX;
        pointer.y = e.clientY;
      }
    };
    const onLeave = () => (pointer.targetLift = 0);
    const onDown = (e: PointerEvent) => {
      onMove(e);
      pointer.pulse = 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    window.addEventListener('blur', onLeave);
    window.addEventListener('resize', resize);

    const draw = () => {
      const p = wallpaperRef.current!;
      const ink = INK[themeRef.current];
      const s = 0.0021 * p.scale;
      const lift = p.lift * (pointer.lift + pointer.pulse * 0.6);
      const r2 = (w < 700 ? 120 : 190) ** 2;

      // 1. sample the height field
      for (let j = 0; j < rows; j++) {
        const y = j * cell;
        for (let i = 0; i < cols; i++) {
          const x = i * cell;
          let v = noise(x * s, y * s, t) * 0.68 + noise(x * s * 2.1 + 31, y * s * 2.1, t * 1.4) * 0.26 + noise(x * s * 5, y * s * 5, t * 2) * 0.06;
          v += (y / h - 0.55) * 0.35; // gentle regional slope toward the horizon
          if (lift > 0.001) {
            const dx = x - pointer.x;
            const dy = y - pointer.y;
            v += lift * Math.exp(-(dx * dx + dy * dy) / r2);
          }
          field[j * cols + i] = v;
        }
      }

      // 2. marching squares per elevation level
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const levels = Math.round(p.levels);
      const lo = -0.85;
      const hi = 0.95;
      const [lr, lg, lb] = ink.line;
      for (let L = 0; L < levels; L++) {
        const th = lo + ((hi - lo) * (L + 0.5)) / levels;
        const index = L % 5 === 2;
        const k = L / Math.max(1, levels - 1);
        const a = ink.min + (ink.max - ink.min) * k + (index ? 0.12 : 0);
        ctx.strokeStyle = `rgba(${lr},${lg},${lb},${a.toFixed(3)})`;
        ctx.lineWidth = index ? 1.35 : 0.75;
        ctx.beginPath();
        for (let j = 0; j < rows - 1; j++) {
          const y0 = j * cell;
          const row = j * cols;
          for (let i = 0; i < cols - 1; i++) {
            const tl = field[row + i];
            const tr = field[row + i + 1];
            const br = field[row + cols + i + 1];
            const bl = field[row + cols + i];
            const c = (tl > th ? 8 : 0) | (tr > th ? 4 : 0) | (br > th ? 2 : 0) | (bl > th ? 1 : 0);
            if (c === 0 || c === 15) continue;
            const x0 = i * cell;
            const top = x0 + (cell * (th - tl)) / (tr - tl);
            const bottom = x0 + (cell * (th - bl)) / (br - bl);
            const left = y0 + (cell * (th - tl)) / (bl - tl);
            const right = y0 + (cell * (th - tr)) / (br - tr);
            const x1 = x0 + cell;
            const y1 = y0 + cell;
            switch (c) {
              case 1: case 14: ctx.moveTo(x0, left); ctx.lineTo(bottom, y1); break;
              case 2: case 13: ctx.moveTo(bottom, y1); ctx.lineTo(x1, right); break;
              case 3: case 12: ctx.moveTo(x0, left); ctx.lineTo(x1, right); break;
              case 4: case 11: ctx.moveTo(top, y0); ctx.lineTo(x1, right); break;
              case 6: case 9: ctx.moveTo(top, y0); ctx.lineTo(bottom, y1); break;
              case 7: case 8: ctx.moveTo(x0, left); ctx.lineTo(top, y0); break;
              case 5: ctx.moveTo(top, y0); ctx.lineTo(x1, right); ctx.moveTo(x0, left); ctx.lineTo(bottom, y1); break;
              case 10: ctx.moveTo(x0, left); ctx.lineTo(top, y0); ctx.moveTo(bottom, y1); ctx.lineTo(x1, right); break;
            }
          }
        }
        ctx.stroke();
      }

      // 3. a soft survey marker where the pointer is
      if (pointer.lift > 0.05 && !reducedRef.current) {
        const g = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 160);
        g.addColorStop(0, `${ink.glow}${(0.1 * pointer.lift).toFixed(3)})`);
        g.addColorStop(1, `${ink.glow}0)`);
        ctx.fillStyle = g;
        ctx.fillRect(pointer.x - 160, pointer.y - 160, 320, 320);
      }
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (document.hidden) return;
      const reduced = reducedRef.current;
      if (reduced) {
        if (!dirtyRef.current) return;
        pointer.lift = 0;
        pointer.pulse = 0;
        draw();
        dirtyRef.current = false;
        return;
      }
      if (now - last < 33) return; // ~30fps is plenty for a wallpaper
      const dt = Math.min(64, now - last);
      last = now;
      t += dt * 0.000035 * wallpaperRef.current!.speed;
      pointer.x += (pointer.tx - pointer.x) * 0.12;
      pointer.y += (pointer.ty - pointer.y) * 0.12;
      pointer.lift += (pointer.targetLift - pointer.lift) * 0.05;
      pointer.pulse *= 0.93;
      draw();
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('blur', onLeave);
      window.removeEventListener('resize', resize);
    };
  }, [wallpaperRef]);

  return (
    <div className="wallpaper" aria-hidden>
      {(['dawn', 'day', 'dusk', 'night'] as const).map((name) => (
        <div key={name} className={`wallpaper__sky wallpaper__sky--${name}`} data-active={name === theme} />
      ))}
      {settings.grid && <div className="wallpaper__grid" />}
      <canvas ref={canvasRef} className="wallpaper__canvas" />
      <div className="wallpaper__grain" />
      <div className="wallpaper__legend">
        <span>41°00′N · 28°58′E</span>
        <span className="wallpaper__scale">
          <i />
          <i />
          <i />
          <i />
        </span>
        <span>contour interval 20 m · sheet M-26</span>
      </div>
    </div>
  );
}
