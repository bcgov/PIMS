import { AppDataSource } from '@/appDataSource';
import { Roles } from '@/constants/roles';
import { User } from '@/typeorm/Entities/User';
import { SSOUser } from '@bcgov/citz-imb-sso-express';
import { NextFunction, RequestHandler, Response } from 'express';

export interface UserCheckOptions {
  requiredRoles?: Roles[];
  onlyAuthenticated?: boolean;
}

/**
 * Middleware that checks for a user with Active status.
 * If the user lacks that status, isn't found,
 * or is missing a token, a rejected response is sent.
 * Successful checks result in the request passed on.
 * Also checks that user has a role parsed from their token.
 */
const userAuthCheck = (options?: UserCheckOptions): RequestHandler => {
  const check = async (
    req: Request & { user?: SSOUser; pimsUser?: PimsRequestUser },
    res: Response,
    next: NextFunction,
  ) => {
    // Checking Keycloak user
    const kcUser = req.user;
    if (!kcUser) {
      return res.status(401).send('Requestor not authenticated by Keycloak.');
    }
    // Checking user existence
    const user = await AppDataSource.getRepository(User).findOne({
      where: {
        Username: kcUser.preferred_username,
      },
    });
    if (!user) {
      return res.status(404).send('Requesting user not found.');
    }
    const hasOneOfRoles = (roles: Roles[]): boolean => {
      // No roles, then no permission.
      if (!roles || !roles.length) {
        return false;
      }
      return roles.includes(user.RoleId as Roles);
    };

    // Check that user has a role, any role
    if (!user.RoleId) {
      return res.status(403).send('Request forbidden. User has no assigned role.');
    }

    // Were specific roles required for access?
    if (options?.requiredRoles && !hasOneOfRoles(options.requiredRoles)) {
      return res.status(403).send('Request forbidden. User lacks required roles.');
    }

    // Checking user status
    if (user.Status !== 'Active') {
      return res.status(403).send('Request forbidden. User lacks Active status.');
    }

    // Add this user info to the request so we don't have to query the database again.
    req.pimsUser = { ...user, hasOneOfRoles };

    next();
  };
  return check as unknown as RequestHandler;
};

export type PimsRequestUser = User & {
  hasOneOfRoles: (roles: Roles[]) => boolean;
};

// Ensure pimsUsers is a part of the Request object by default.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      pimsUser?: PimsRequestUser;
    }
  }
}

export default userAuthCheck;
