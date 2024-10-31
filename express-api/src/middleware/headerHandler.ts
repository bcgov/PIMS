import { NextFunction, Response } from 'express';

const headerHandler: unknown = (req: Request, res: Response, next: NextFunction) => {
  //res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');
  next();
};

export default headerHandler;
