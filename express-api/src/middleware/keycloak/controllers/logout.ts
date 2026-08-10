import { RequestHandler } from 'express';
import { decodeJWT, getLogoutURL, normalizeUser } from '@bcgov/citz-imb-sso-js-core';
import type { SSOEnvironment, SSOProtocol } from '@bcgov/citz-imb-sso-js-core';
import logger from '@/utilities/winstonLogger';
import { SSO_OPTIONS } from '@/middleware/keycloak/keycloakOptions';
import {
  BACKEND_URL_CONFIG,
  FRONTEND_URL_CONFIG,
  refreshCookieOptions,
  ssoClient,
} from '../authConfig';

/**
 * GET /auth/logout
 * Redirects the browser through Keycloak (and SiteMinder) logout, clearing the
 * refresh_token cookie either here or on the logout callback.
 */
export const logout: RequestHandler = async (req, res) => {
  try {
    const { id_token } = req.query;
    if (!id_token || id_token === 'undefined') {
      return res
        .cookie('refresh_token', '', { ...refreshCookieOptions, maxAge: 0 })
        .redirect(FRONTEND_URL_CONFIG ?? '');
    }
    const redirectURL = getLogoutURL({
      idToken: String(id_token),
      postLogoutRedirectURI: `${BACKEND_URL_CONFIG}/auth/logout/callback`,
      ssoEnvironment: ssoClient.ssoEnvironment as SSOEnvironment,
      ssoRealm: ssoClient.ssoRealm,
      ssoProtocol: ssoClient.ssoProtocol as SSOProtocol,
    });
    res.redirect(redirectURL);
    try {
      const normalizedUser = normalizeUser(decodeJWT(String(id_token)));
      if (normalizedUser) {
        SSO_OPTIONS.afterUserLogout(normalizedUser);
      }
    } catch {
      // Malformed id_token; the logout redirect still proceeds.
    }
  } catch (error) {
    logger.error('SSO logout controller error:', error);
    if (error instanceof Error) {
      return res.status(500).json({ success: false, error: error.message });
    }
    return res.status(500).json({ success: false, error });
  }
};
