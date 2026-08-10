import { RequestHandler } from 'express';
import logger from '@/utilities/winstonLogger';
import { FRONTEND_URL_CONFIG, refreshCookieOptions } from '../authConfig';

/**
 * GET /auth/logout/callback
 * Keycloak redirects here after a successful logout. Clears the refresh token
 * cookie and redirects the user to the frontend.
 */
export const logoutCallback: RequestHandler = async (_req, res) => {
  try {
    return res
      .cookie('refresh_token', '', { ...refreshCookieOptions, maxAge: 0 })
      .redirect(FRONTEND_URL_CONFIG ?? '');
  } catch (error) {
    logger.error('SSO logoutCallback controller error:', error);
    if (error instanceof Error) {
      return res.status(500).json({ success: false, error: error.message });
    }
    return res.status(500).json({ success: false, error });
  }
};
