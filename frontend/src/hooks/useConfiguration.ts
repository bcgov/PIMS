export interface IConfiguration {
  isTest: boolean;
  isDevelopment: boolean;
  isProduction: boolean;
  siteMinderLogoutUrl: string | undefined;
  baseUrl: string;
}

export const useConfiguration = (): IConfiguration => {
  const isTest: boolean = process.env.NODE_ENV === 'test';
  const isDevelopment: boolean = process.env.NODE_ENV === 'development';
  const isProduction: boolean = process.env.NODE_ENV === 'production';

  return {
    siteMinderLogoutUrl: process.env.REACT_APP_SITEMINDER_LOGOUT_URL,
    isTest,
    isDevelopment,
    isProduction,
    baseUrl: window.location.href.split(window.location.pathname)[0],
  };
};
