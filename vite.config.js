import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // REPLICATING SGG CONGÉS ARCHITECTURE:
    // We use Vite as a high-performance proxy to Apache.
    // Apache (XAMPP) handles the multi-threaded PHP execution.
    // This removes the 30s single-thread bottleneck of 'artisan serve'.
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        timeout: 60000,
        proxyTimeout: 60000,
      },
      '/storage': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        timeout: 60000,
        proxyTimeout: 60000,
      },
      '/cv-download': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cv-download/, '/ABDELILAH_AMALAS_CV.pdf'),
        timeout: 60000,
        proxyTimeout: 60000,
      },
    },
  },
})
