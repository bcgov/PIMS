export interface IConfiguration {
  isTest: boolean;
  isDevelopment: boolean;
  isProduction: boolean;
  siteMinderLogoutUrl: string | undefined;
  baseUrl: string;
}

export const useConfiguration = (): IConfiguration => {
  const isTest: boolean = import.meta.env.NODE_ENV === 'test';
  const isDevelopment: boolean = import.meta.env.NODE_ENV === 'development';
  const isProduction: boolean = import.meta.env.NODE_ENV === 'production';

  return {
    siteMinderLogoutUrl: import.meta.env.REACT_APP_SITEMINDER_LOGOUT_URL,
    isTest,
    isDevelopment,
    isProduction,
    baseUrl: window.location.href.split(window.location.pathname)[0],
  };
};
