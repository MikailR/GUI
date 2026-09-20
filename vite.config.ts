import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base so the built app works from any subpath (e.g. GitHub Pages /previews/liquid-glass/).
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    target: 'es2022',
    cssCodeSplit: true,
  },
})
