import { NextFunction, Request, RequestHandler, Response } from 'express';
import { decodeJWT, isJWTValid, normalizeUser } from '@bcgov/citz-imb-sso-js-core';
import { ssoClient } from './authConfig';

/**
 * Middleware that validates the access token presented in the Authorization
 * header and attaches the normalized user to `req.user`. Must be followed by
 * `userAuthCheck` for routes that need a PIMS user record.
 */
const protectedRoute = (): RequestHandler => {
  const middleware = async (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).json({ error: 'No authorization header found.' });
    }
    const token = header.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No authorization token found.' });
    }
    try {
      const isTokenValid = await isJWTValid({ jwt: token, ...ssoClient });
      if (!isTokenValid) {
        return res
          .status(401)
          .json({ error: 'Unauthorized: Invalid token, re-log to get a new one.' });
      }
      const userInfo = decodeJWT(token);
      const normalizedUser = normalizeUser(userInfo);
      if (!userInfo || !normalizedUser) {
        return res.status(404).json({ error: 'User not found.' });
      }
      req.token = token;
      req.user = normalizedUser;
      next();
    } catch (error) {
      if (error instanceof Error) {
        return res.status(401).json({ error: error.message });
      }
      return res.status(401).json({ error: 'Unknown authentication error.' });
    }
  };
  return middleware;
};

export default protectedRoute;
