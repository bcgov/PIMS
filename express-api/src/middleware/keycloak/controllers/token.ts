import { RequestHandler } from 'express';
import { getNewTokens } from '@bcgov/citz-imb-sso-js-core';
import type { SSOEnvironment, SSOProtocol } from '@bcgov/citz-imb-sso-js-core';
import logger from '@/utilities/winstonLogger';
import { refreshCookieOptions, ssoClient } from '../authConfig';

/**
 * POST /auth/token
 * Refreshes tokens using the refresh_token cookie via js-core's `getNewTokens`,
 * mirroring the citz-grs-dats implementation. getNewTokens first validates the
 * refresh token locally (expiry check only - no introspection), then exchanges
 * it at Keycloak's token endpoint. The response shape matches what the
 * @bcgov/citz-imb-sso-react frontend package expects.
 */
export const token: RequestHandler = async (req, res) => {
  const { refresh_token } = req.cookies;
  if (!refresh_token || refresh_token === '') {
    return res.status(401).send('Cookies must include refresh_token.');
  }
  try {
    const tokens = await getNewTokens({
      refreshToken: refresh_token,
      clientID: ssoClient.clientID,
      clientSecret: ssoClient.clientSecret,
      ssoEnvironment: ssoClient.ssoEnvironment as SSOEnvironment,
      ssoRealm: ssoClient.ssoRealm,
      ssoProtocol: ssoClient.ssoProtocol as SSOProtocol,
    });
    if (!tokens) {
      return res.status(401).json({ success: false, message: 'Invalid token.' });
    }
    // Keep the refresh cookie in sync in case the SSO server rotates it.
    res.cookie('refresh_token', tokens.refresh_token, refreshCookieOptions);
    return res.json({
      access_token: tokens.access_token,
      id_token: tokens.id_token,
      expires_in: tokens.expires_in,
    });
  } catch (error) {
    logger.error('SSO token controller error:', error);
    if (error instanceof Error) {
      return res.status(500).json({ success: false, error: error.message });
    }
    return res.status(500).json({ success: false, error });
  }
};
