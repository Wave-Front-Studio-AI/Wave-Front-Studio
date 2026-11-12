import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const LEAD_SERVICE = process.env.LEAD_SERVICE_URL || 'http://127.0.0.1:8787'
const BUILD_DATE = process.env.BUILD_DATE || new Date().toISOString().slice(0, 10)

// The static demo sites in public/demos link between pages with folder URLs (/demos/templates/atlas/about/).
// Production hosts serve index.html for those; the dev server does not, so this does it locally.
const publicDir = fileURLToPath(new URL('./public', import.meta.url))
const demoFolderIndex = {
  name: 'demo-folder-index',
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      const path = (req.url || '').split('?')[0]
      if (path.startsWith('/demos/') && path.endsWith('/') && existsSync(`${publicDir}${path}index.html`)) {
        req.url = `${path}index.html${(req.url || '').slice(path.length)}`
      }
      next()
    })
  },
}

export default defineConfig({
  plugins: [demoFolderIndex, react(), tailwindcss()],
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
  // The day this build treats as today for scheduled pages (src/data/schedule.js).
  define: { __BUILD_DATE__: JSON.stringify(BUILD_DATE) },
  build: { outDir: 'dist', emptyOutDir: true },
})
