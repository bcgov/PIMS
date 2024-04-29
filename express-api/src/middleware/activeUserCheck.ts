import { AppDataSource } from '@/appDataSource';
import { User } from '@/typeorm/Entities/User';
import { SSOUser } from '@bcgov/citz-imb-sso-express';
import { NextFunction, RequestHandler, Response } from 'express';

const activeUserCheck: unknown = async (
  req: Request & { user: SSOUser },
  res: Response,
  next: NextFunction,
) => {
  const kcUser = req.user;
  if (!kcUser) {
    return res.status(401).send('Unauthorized request.');
  }
  const user = await AppDataSource.getRepository(User).findOne({
    where: {
      Username: kcUser.preferred_username,
    },
  });

  if (!user) {
    return res.status(404).send('Requesting user not found.');
  }

  if (user.Status !== 'Active') {
    return res.status(403).send('Request forbidden. User lacks Active status.');
  }
  next();
};

export default activeUserCheck as RequestHandler;
