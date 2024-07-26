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
 */
const activeUserCheck: unknown = async (
  req: Request & { user: SSOUser },
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

  // Checking user status
  if (user.Status !== 'Active') {
    return res.status(403).send('Request forbidden. User lacks Active status.');
  }

  // Check that user has a role
  if (
    req.user?.hasRoles([Roles.ADMIN, Roles.AUDITOR, Roles.GENERAL_USER], { requireAllRoles: false })
  ) {
    return res.status(403).send('Request forbidden. User has no assigned role.');
  }
  next();
};

export default activeUserCheck as RequestHandler;
