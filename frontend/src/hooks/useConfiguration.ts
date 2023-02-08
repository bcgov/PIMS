export interface IConfiguration {
  isTest: boolean;
  isDevelopment: boolean;
  isProduction: boolean;
  keycloakAuthUrl: string;
  keycloakId: string;
  siteMinderLogoutUrl: string | undefined;
  baseUrl: string;
}

export const useConfiguration = (): IConfiguration => {
  const isTest: boolean = process.env.NODE_ENV === 'test';
  const isDevelopment: boolean = process.env.NODE_ENV === 'development';
  const isProduction: boolean = process.env.NODE_ENV === 'production';
  //TODO: Update codebase to allow NODE_ENV to be 'local'
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

  return {
    siteMinderLogoutUrl: process.env.REACT_APP_SITEMINDER_LOGOUT_URL,
    isTest,
    isDevelopment,
    isProduction,
    keycloakAuthUrl: getKeycloakAuthURL(),
    keycloakId: getKeycloakId(),
    baseUrl: window.location.href.split(window.location.pathname)[0],
  };
};
