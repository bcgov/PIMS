import { NextFunction, Request, Response } from 'express';

/**
 * Wraps an asynchronous function with error handling middleware.
 *
 * @param {Function} fn - The asynchronous function to be wrapped.
 * @returns {Function} - The wrapped function with error handling middleware.
 */
const catchErrors =
  (fn: (req: Request, res: Response) => Promise<Response<unknown, Record<string, unknown>>>) =>
  (req: Request, res: Response, next: NextFunction) => {
    fn(req, res).catch(next);
  };

export default catchErrors;
