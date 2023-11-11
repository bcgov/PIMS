const { ENVIRONMENT, FRONTEND_URL, BACKEND_URL, API_PORT, FRONTEND_PORT } = process.env;

// Use production urls unless ENVIRONMENT === "local".
let frontendUrl = FRONTEND_URL ?? '';
let backendUrl = BACKEND_URL ?? '';
const apiPort = API_PORT ?? 3004;
const frontendPort = FRONTEND_PORT ?? 3003;

if (ENVIRONMENT && ENVIRONMENT === 'local') {
  frontendUrl = `http://localhost:${FRONTEND_PORT}`;
  backendUrl = `http://localhost:${API_PORT}`;
}

export default {
  FRONTEND_URL: frontendUrl,
  BACKEND_URL: backendUrl,
  API_PORT: apiPort,
  FRONTEND_PORT: frontendPort,
};
