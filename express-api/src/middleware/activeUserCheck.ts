import { AppDataSource } from '@/appDataSource';
import { Roles } from '@/constants/roles';
import { User } from '@/typeorm/Entities/User';
import { SSOUser } from '@bcgov/citz-imb-sso-express';
import { NextFunction, RequestHandler, Response } from 'express';

/**
 * Middleware that checks for a user with Active status.
 * If the user lacks that status, isn't found,
 * or is missing a token, a rejected response is sent.
 * Successful checks result in the request passed on.
 * Also checks that user has a role parsed from their token.
 */
const activeUserCheck: unknown = async (
  req: Request & { user: SSOUser; pimsUser: PimsRequestUser },
  res: Response,
  next: NextFunction,
) => {
  // Checking Keycloak user
  const kcUser = req.user;
  if (!kcUser) {
    return res.status(401).send('Unauthorized request.');
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
    if (!roles.length) {
      return false;
    }
    return roles.includes(user.RoleId as Roles);
  };

  // Add this user info to the request so we don't have to query the database again.
  req.pimsUser = { ...user, hasOneOfRoles };

  // Checking user status
  if (user.Status !== 'Active') {
    return res.status(403).send('Request forbidden. User lacks Active status.');
  }

  // Check that user has a role
  if (!user.RoleId) {
    return res.status(403).send('Request forbidden. User has no assigned role.');
  }
  next();
};

export type PimsRequestUser = User & {
  hasOneOfRoles: (roles: Roles[]) => boolean;
};

// The token and user properties are not a part of the Request object by default.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      pimsUser?: PimsRequestUser;
    }
  }
}

export default activeUserCheck as RequestHandler;
