import { RequestHandler } from 'express';
import { decodeJWT, getTokens, normalizeUser } from '@bcgov/citz-imb-sso-js-core';
import type { SSOEnvironment, SSOProtocol } from '@bcgov/citz-imb-sso-js-core';
import logger from '@/utilities/winstonLogger';
import { SSO_OPTIONS } from '@/middleware/keycloak/keycloakOptions';
import {
  BACKEND_URL_CONFIG,
  FRONTEND_URL_CONFIG,
  refreshCookieOptions,
  ssoClient,
} from '../authConfig';

const loginCallbackURI = () => `${BACKEND_URL_CONFIG}/auth/login/callback`;

/**
 * GET /auth/login/callback
 * Exchanges the authorization code for tokens, stores the refresh token in an
 * httpOnly cookie and bounces the browser back to the frontend, carrying the
 * refresh_expires_in and the original post-login redirect target.
 */
export const loginCallback: RequestHandler = async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).send('Missing authorization code.');
    }
    const { access_token, refresh_token, refresh_expires_in } = await getTokens({
      code: String(code),
      clientID: ssoClient.clientID,
      clientSecret: ssoClient.clientSecret,
      redirectURI: loginCallbackURI(),
      ssoEnvironment: ssoClient.ssoEnvironment as SSOEnvironment,
      ssoRealm: ssoClient.ssoRealm,
      ssoProtocol: ssoClient.ssoProtocol as SSOProtocol,
    });
    const { post_login_redirect_url } = req.cookies;
    const redirectURL = `${FRONTEND_URL_CONFIG}?refresh_expires_in=${refresh_expires_in}&post_login_redirect_url=${post_login_redirect_url}`;
    res.cookie('refresh_token', refresh_token, refreshCookieOptions).redirect(redirectURL);
    const normalizedUser = normalizeUser(decodeJWT(access_token));
    if (normalizedUser) {
      await SSO_OPTIONS.afterUserLogin(normalizedUser);
    }
  } catch (error) {
    logger.error('SSO loginCallback controller error:', error);
    if (error instanceof Error) {
      return res.status(500).json({ success: false, error: error.message });
    }
    return res.status(500).json({ success: false, error });
  }
};
