import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base so the built app works from any subpath (GitHub Pages previews, extracted dist/).
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    target: 'es2022',
    cssTarget: 'safari16',
    sourcemap: false,
  },
})
