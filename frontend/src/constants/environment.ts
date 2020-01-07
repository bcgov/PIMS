// environment config variables for test/dev/prod

export const DEFAULT_ENVIRONMENT = {
  apiUrl: 'http://localhost:5000',
  environment: 'development',
  googleApiKey: 'AIzaSyAyesbQMyKVVbBgKVi2g6VX7mop2z96jBo', // temp public key
  mapboxApiKey: 'YOUR_MAPBOX_API_KEY_GOES_HERE',
};

export const ENVIRONMENT = {
  apiUrl: '(API_URL)',
  environment: '(ENV)',
  googleApiKey: '(API_KEY)',
  mapboxApiKey: '(API_KEY)',
};

// TODO: Expand these once we get keycloak in place...

export const KEYCLOAK = {
  realm: '(REALM)',
  url: '(URL)',
  idpHint: 'idir',
  'ssl-required': 'external',
  resource: '(RESOURCE)',
  'public-client': true,
  'confidential-port': 0,
  clientId: '(CLIENT_ID)',
};

export const USER_ROLES = {
  role_view: 'core_view_all',
  role_edit: 'core_edit',
  role_admin: 'core_admin',
};
