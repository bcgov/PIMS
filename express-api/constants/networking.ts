const { CONTAINERIZED, FRONTEND_URL, BACKEND_URL, API_HTTP_PORT, APP_HTTP_PORT } = process.env;

// Use production urls unless CONTAINERIZED.
let frontendUrl = FRONTEND_URL ?? 'Warning: No FRONTEND_URL set.';
let backendUrl = BACKEND_URL ?? 'Warning: No BACKEND_URL set.';
const apiPort = +API_HTTP_PORT ?? 5000;
const frontendPort = +APP_HTTP_PORT ?? 3000;

if (!CONTAINERIZED) {
  frontendUrl = `http://localhost:${frontendPort}`;
  backendUrl = `http://localhost:${apiPort}`;
}

export default {
  FRONTEND_URL: frontendUrl,
  BACKEND_URL: backendUrl,
  API_PORT: apiPort,
  FRONTEND_PORT: frontendPort,
};
