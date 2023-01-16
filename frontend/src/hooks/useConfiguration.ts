export interface IConfiguration {
  isTest: boolean;
  isDevelopment: boolean;
  isProduction: boolean;
  keycloakAuthUrl: string;
  keycloakId: string;
  siteMinderLogoutUrl: string | undefined;
  baseUrl: string;
  keycloakRedirectURI: string;
  validRefreshEndpoints: string[];
}

export const useConfiguration = (): IConfiguration => {
  //TODO: Change codebase to have NODE_ENV represent the current environment
  const isTest: boolean = window.location.href.includes('pims-test');
  const isDevelopment: boolean = window.location.href.includes('pims-dev');
  const isProduction: boolean = window.location.href.includes('pims.gov.bc.ca');
  const isLocal: boolean = window.location.href.includes('localhost');

  const getKeycloakAuthURL = (): string => {
    if (isProduction) {
      return 'https://loginproxy.gov.bc.ca/auth';
    }

    if (isTest) {
      return 'https://test.loginproxy.gov.bc.ca/auth';
    }

    return 'https://dev.loginproxy.gov.bc.ca/auth';
  };

  const getKeycloakId = (): string => {
    return isLocal ? 'pims-local-test-4292' : 'pims-frontend-4391';
  };

  const validRefreshEndpoints: string[] = [
    '/admin/users',
    '/admin/access/requests',
    '/admin/administrativeAreas',
    '/properties/list',
    '/dispose/projects/draft',
    '/projects/list',
    '/projects/spl',
    '/projects/approval/requests',
    '/login',
  ];

  const keycloakRedirectURI: string = validRefreshEndpoints.includes(window.location.pathname)
    ? window.location.origin + window.location.pathname
    : window.location.origin;

  return {
    siteMinderLogoutUrl: import.meta.env.REACT_APP_SITEMINDER_LOGOUT_URL,
    isTest,
    isDevelopment,
    isProduction,
    keycloakAuthUrl: getKeycloakAuthURL(),
    keycloakId: getKeycloakId(),
    baseUrl: window.location.href.split(window.location.pathname)[0],
    keycloakRedirectURI,
    validRefreshEndpoints,
  };
};
