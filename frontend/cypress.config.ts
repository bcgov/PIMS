import { defineConfig } from 'cypress';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

export default defineConfig({
  pageLoadTimeout: 100000,
  videoUploadOnPasses: false,
  e2e: {
    projectId: 'k7dkv4',
    baseUrl: `http://localhost:${process.env.APP_HTTP_PORT || 3000}`,
    viewportHeight: 850,
    viewportWidth: 1400,
    chromeWebSecurity: false,
    experimentalSessionAndOrigin: true,
    defaultCommandTimeout: 15000,
    env: {
      auth_base_url: `https://dev.loginproxy.gov.bc.ca/auth`,
      auth_realm: 'standard',
      auth_client_id: 'pims-local-test-4292',
      keycloak_user: process.env.CYPRESS_KEYCLOAK_USER,
      keycloak_password: process.env.CYPRESS_KEYCLOAK_PASSWORD,
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
