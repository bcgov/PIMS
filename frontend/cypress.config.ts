import { defineConfig } from 'cypress';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

export default defineConfig({
  e2e: {
    projectId: 'k7dkv4',
    baseUrl: `http://localhost:${process.env.APP_HTTP_PORT || 3000}`,
    viewportHeight: 850,
    viewportWidth: 1400,
    chromeWebSecurity: false,
    experimentalSessionAndOrigin: true,
    failOnStatusCode: true,
    env: {
      auth_base_url: `https://dev.loginproxy.gov.bc.ca/auth`,
      auth_realm: 'standard',
      auth_client_id: 'pims-local-test-4292',
      keycloak_user: 'testUser',
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
