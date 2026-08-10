import { AUTH_URLS } from '@bcgov/citz-imb-sso-js-core';

const {
  FRONTEND_URL = '',
  BACKEND_URL = '',
  SSO_CLIENT_ID = '',
  SSO_CLIENT_SECRET = '',
  SSO_ENVIRONMENT = 'dev',
} = process.env;

export type SSOEnvironment = 'dev' | 'test' | 'prod';

export const ssoClient = {
  clientID: SSO_CLIENT_ID,
  clientSecret: SSO_CLIENT_SECRET,
  ssoEnvironment: SSO_ENVIRONMENT as SSOEnvironment,
  ssoRealm: 'standard',
  ssoProtocol: 'openid-connect' as const,
};

export const FRONTEND_URL_CONFIG = FRONTEND_URL;
export const BACKEND_URL_CONFIG = BACKEND_URL;

export const COOKIE_DOMAIN = FRONTEND_URL.includes('localhost') ? 'localhost' : '.gov.bc.ca';

export const refreshCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'none' as const,
  domain: COOKIE_DOMAIN,
};

export const AUTH_SERVER_URL =
  process.env.SSO_AUTH_SERVER_URL?.trim() ??
  `${AUTH_URLS[ssoClient.ssoEnvironment]}/realms/${ssoClient.ssoRealm}/protocol/${ssoClient.ssoProtocol}`;
