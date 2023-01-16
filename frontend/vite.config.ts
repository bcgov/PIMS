import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgrPlugin from 'vite-plugin-svgr';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import dotenv from 'dotenv';
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteTsconfigPaths(), svgrPlugin()],
  build: {
    outDir: 'build',
  },
  server: {
    host: 'frontend',
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.API_URL || 'http://backend:8080/',
        changeOrigin: true,
        secure: false,
        xfwd: true,
        cookiePathRewrite: '/',
        cookieDomainRewrite: '',
        rewrite: path => path,
      },
    },
  },
});
