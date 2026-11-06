import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (
            id.includes('/three/') ||
            id.includes('@react-three') ||
            id.includes('postprocessing')
          ) {
            return 'three'
          }
          if (id.includes('framer-motion')) return 'motion'
          if (id.includes('gsap')) return 'gsap'
          return
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
      '/artifacts': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
})
