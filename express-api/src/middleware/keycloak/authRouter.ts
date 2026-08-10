import { Router } from 'express';
import { login, loginCallback, logout, logoutCallback, token } from './controllers';

/**
 * Routes required by the @bcgov/citz-imb-sso-react frontend package.
 */
const authRouter = Router();

authRouter.get('/login', login);
authRouter.get('/login/callback', loginCallback);
authRouter.get('/logout', logout);
authRouter.get('/logout/callback', logoutCallback);
authRouter.post('/token', token);

export default authRouter;
