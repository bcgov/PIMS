/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import { defineConfig } from 'vite';
import svgrPlugin from 'vite-plugin-svgr';
import viteTsconfigPaths from 'vite-tsconfig-paths';
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteTsconfigPaths(), svgrPlugin()],
  build: {
    outDir: 'build',
  },
  server: {
    host: true,
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.API_URL || 'http://backend:8080/',
        changeOrigin: true,
        secure: false,
        xfwd: true,
        cookiePathRewrite: '/',
        cookieDomainRewrite: '',
        rewrite: (path) => path,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    coverage: {
      reporter: ['text', 'html'],
      exclude: [
        'node_modules/',
        'src/setupTests.ts',
        'coverage/',
        'public/',
        'build/',
        'src/serviceWorker.**',
      ],
    },
  },
});
