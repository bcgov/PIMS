export interface IConfiguration {
  isTest: boolean;
  isDevelopment: boolean;
  isProduction: boolean;
  keycloakAuthUrl: string;
  keycloakLogoutUrl: string;
  keycloakId: string;
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
  const baseUrl = window.location.href.split(window.location.pathname)[0];

  const getKeycloakAuthURL = (): string => {
    if (isProduction) return 'https://loginproxy.gov.bc.ca/auth';
    if (isTest) return 'https://test.loginproxy.gov.bc.ca/auth';
    return 'https://dev.loginproxy.gov.bc.ca/auth';
  };

  const getKeycloakId = (): string => {
    return isLocal ? 'pims-local-test-4292' : 'pims-frontend-4391';
  };

  const getKeycloakLogoutURL = () => {
    const siteMinderLogoutUrl = isProduction
      ? 'https://logon7.gov.bc.ca/clp-cgi/logoff.cgi?retnow=1&returl='
      : isTest
        ? 'https://logontest7.gov.bc.ca/clp-cgi/logoff.cgi?retnow=1&returl='
        : 'https://logondev7.gov.bc.ca/clp-cgi/logoff.cgi?retnow=1&returl=';
    const keycloakLogoutURL = `${getKeycloakAuthURL()}/realms/standard/protocol/openid-connect/logout`;

    return `${siteMinderLogoutUrl}${keycloakLogoutURL}`;
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
    isTest,
    isDevelopment,
    isProduction,
    keycloakAuthUrl: getKeycloakAuthURL(),
    keycloakLogoutUrl: getKeycloakLogoutURL(),
    keycloakId: getKeycloakId(),
    baseUrl,
    keycloakRedirectURI,
    validRefreshEndpoints,
  };
};
