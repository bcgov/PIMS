import { RequestHandler } from 'express';
import { getLoginURL } from '@bcgov/citz-imb-sso-js-core';
import type { SSOEnvironment, SSOIdentityProvider, SSOProtocol } from '@bcgov/citz-imb-sso-js-core';
import logger from '@/utilities/winstonLogger';
import { BACKEND_URL_CONFIG, COOKIE_DOMAIN, ssoClient } from '../authConfig';

const loginCallbackURI = () => `${BACKEND_URL_CONFIG}/auth/login/callback`;

/**
 * GET /auth/login
 * Initiates the Keycloak login flow. Stashes the desired post-login redirect
 * in a cookie (read again by /auth/login/callback) and redirects the browser
 * to the Keycloak authorization endpoint.
 */
export const login: RequestHandler = async (req, res) => {
  try {
    const { idp, post_login_redirect_url } = req.query;
    const redirectURL = getLoginURL({
      idpHint: idp ? (String(idp) as SSOIdentityProvider) : undefined,
      clientID: ssoClient.clientID,
      redirectURI: loginCallbackURI(),
      ssoEnvironment: ssoClient.ssoEnvironment as SSOEnvironment,
      ssoRealm: ssoClient.ssoRealm,
      ssoProtocol: ssoClient.ssoProtocol as SSOProtocol,
    });
    if (post_login_redirect_url) {
      res.cookie('post_login_redirect_url', String(post_login_redirect_url), {
        domain: COOKIE_DOMAIN,
      });
    }
    return res.redirect(redirectURL);
  } catch (error) {
    logger.error('SSO login controller error:', error);
    if (error instanceof Error) {
      return res.status(500).json({ success: false, error: error.message });
    }
    return res.status(500).json({ success: false, error });
  }
};
