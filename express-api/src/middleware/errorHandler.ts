import { ErrorWithCode } from '@/utilities/customErrors/ErrorWithCode';
import logger from '@/utilities/winstonLogger';
import { NextFunction, Request, Response } from 'express';

/**
 * Handles errors and sends appropriate response.
 * Use this as the last middleware in express.ts
 *
 * @param err - The error message or Error object.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The Express next function.
 */
const errorHandler = (
  err: string | Error | ErrorWithCode,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Is this one of the valid input options?
  if (!(typeof err === 'string' || err instanceof Error)) {
    const message = `Unknown server error.`;
    logger.error(message);
    return res.status(500).send(message);
  }
  // Determine what message and status should be
  const message = err instanceof Error ? err.message : err;
  const code = err instanceof ErrorWithCode ? err.code : 500;
  // Report through logger
  if (code === 500) {
    logger.error(message);
    logger.error((err as Error).stack);
  } else {
    logger.warn(message);
  }
  // Return status and message
  res.status(code).send(`Error: ${message}`);
  next();
};

export default errorHandler;
