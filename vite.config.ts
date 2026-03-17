import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: { 
    host: 'localhost',
    watch: {
      ignored: ['**/pb_data/**', '**/playwright-report/**']
    }
  },
  optimizeDeps: {
    exclude: ['pocketbase']
  },
  plugins: [react()],
})
