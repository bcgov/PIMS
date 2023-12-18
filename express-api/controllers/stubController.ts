import { Request, Response } from 'express';

// TODO: Remove this controller, along with its test when all routes are fully implemented.

/**
 * @description Used as a placeholder for routes where the controller is incomplete.
 * @param {Request}     req Incoming request
 * @param {Response}    res Outgoing response
 * @returns {Response}      A 501 status indicating this route is incomplete.
 */
export const stubController = async (req: Request, res: Response) =>
  res.status(501).send('Not yet implemented');
