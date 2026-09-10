import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Any request the app makes to /api/* is transparently forwarded to the Spring Boot
      // server — the browser only ever sees requests going to localhost:5173, so there's no
      // CORS issue for these calls and the frontend code never needs to know the backend's
      // address. Start the backend first, then `npm run dev`.
      '/api': {
        target: process.env.VITE_API_PROXY_TARGET || 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
