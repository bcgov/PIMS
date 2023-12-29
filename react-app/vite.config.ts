import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), '') };
  const frontendPort: number = +(process.env.APP_HTTP_PORT ?? 3000);
  const target = process.env.CONTAINERIZED
    ? `http://${process.env.API_SERVICE_NAME ?? 'backend'}:${process.env.API_PROXY_PORT ?? 8080}/`
    : `http://localhost:${process.env.API_HTTP_PORT ?? 5000}/`;

  return defineConfig({
    plugins: [react()],
    build: {
      outDir: 'dist',
    },
    server: {
      host: true,
      port: frontendPort,
      proxy: {
        '/api': {
          target: target,
          changeOrigin: true,
        },
      },
    },
  });
};
