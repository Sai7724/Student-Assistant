import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The browser only ever talks to Vite (port 5173).
// Anything starting with /api is forwarded to our Express server (port 8787),
// which is the only place the API key will live.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: { '/api': 'http://localhost:8787' },
  },
})
