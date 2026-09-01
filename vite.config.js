import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const LEAD_SERVICE = process.env.LEAD_SERVICE_URL || 'http://127.0.0.1:8787'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Lets shared components use the conventional "@/..." import path.
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: {
    // Production builds may run while the preview server is open. Ignoring
    // their output avoids Windows file-lock errors in Vite's watcher.
    watch: { ignored: ['**/dist/**', '**/dist-ssr/**'] },
    proxy: {
      '/api': { target: LEAD_SERVICE, changeOrigin: true },
    },
  },
  build: { outDir: 'dist', emptyOutDir: true },
})
