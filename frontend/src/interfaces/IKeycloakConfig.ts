/**
 * Configuration file for keycloak.
 * The JSON file for configuring Keycloak will be in this format.
 */
export default interface IKeycloakConfig {
  // The realm name.
  realm: string;
  // Keycloak server URL.
  // Also support `auth-server-url`.
  ['auth-server-url']: string;
  // Whether SSL is required.
  // Also support `ssl-required`.
  ['ssl-required']: string;
  // Also known as clientId
  resource: string;
  // Whether this is a public client type.
  // Also supports `public-client`.
  ['public-client']: boolean;
  // Confidential port number.
  // Also support `confidential-port`.
  ['confidential-port']: number;
}
