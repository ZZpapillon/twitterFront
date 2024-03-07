import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy WebSocket connections for Socket.IO
      '/socket.io': {
        target: 'http://localhost:3000', // Your backend server URL
        ws: true, // Enable WebSocket proxying
        changeOrigin: true, // May be required if you're dealing with CORS issues
      },
    },
  },
})