import { defineConfig } from 'cypress';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

export default defineConfig({
  e2e: {
    projectId: 'k7dkv4',
    baseUrl: `http://localhost:${process.env.APP_HTTP_PORT || 3000}`,
    viewportHeight: 850,
    viewportWidth: 1400,
    env: {
      auth_base_url: `http://localhost:${process.env.KEYLCOAK_PORT || 8080}/auth`,
      auth_realm: 'pims',
      auth_client_id: 'pims-app',
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
