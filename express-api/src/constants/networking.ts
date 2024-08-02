const { CONTAINERIZED, FRONTEND_URL, BACKEND_URL, API_HTTP_PORT, APP_HTTP_PORT } = process.env;

let frontendUrl = FRONTEND_URL ?? '';
let backendUrl = BACKEND_URL ?? '';
const apiPort = +(API_HTTP_PORT ?? 5000);
const frontendPort = +(APP_HTTP_PORT ?? 3000);

// Use URLs from ENV when CONTAINERIZED.
if (!CONTAINERIZED) {
  frontendUrl = `http://localhost:${frontendPort}`;
  backendUrl = `http://localhost:${apiPort}`;
} else {
  switch (undefined || '') {
    case FRONTEND_URL:
      throw new Error('Warning: No FRONTEND_URL set.');
    case BACKEND_URL:
      throw new Error('Warning: No BACKEND_URL set.');
    default:
      break;
  }
}

export default {
  FRONTEND_URL: frontendUrl,
  BACKEND_URL: backendUrl,
  API_PORT: apiPort,
  FRONTEND_PORT: frontendPort,
};
