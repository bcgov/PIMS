import { Response } from 'express';

export const stubResponse = (res: Response) => {
  return res.status(501).send('Not yet implemented');
};
