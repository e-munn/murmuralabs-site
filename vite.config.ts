import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split Three.js into its own chunk so the main bundle stays small.
          // Three.js is only used by lazy-loaded components (HexNetwork, CityScene).
          if (id.includes('node_modules/three/')) return 'three'
          if (id.includes('node_modules/@react-three/')) return 'three-ecosystem'
        },
      },
    },
  },
})
