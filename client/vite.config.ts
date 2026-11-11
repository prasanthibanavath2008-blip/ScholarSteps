import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const isProd = command === 'build';
  // Use VITE_BASE_PATH if provided, else in production build default to GitHub Pages repository path
  const base = process.env.VITE_BASE_PATH || (isProd ? '/ScholarSteps/' : '/');

  return {
    base,
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@shared': path.resolve(__dirname, '../shared'),
        '@fixtures': path.resolve(__dirname, '../fixtures'),
      },
    },
    server: {
      port: 5173,
      host: true, // Listen on all network addresses (localhost, 127.0.0.1, 0.0.0.0)
      proxy: {
        '/api': {
          target: 'http://localhost:4000',
          changeOrigin: true,
        },
      },
    },
  };
});
