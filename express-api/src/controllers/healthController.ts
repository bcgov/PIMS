import { Request, Response } from 'express';

/**
 * @description Used to check if API is running.
 * @param {Request}     req Incoming request
 * @param {Response}    res Outgoing response
 * @returns {Response}      A 200 status indicating API is healthy and running
 */
export const healthCheck = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Health']
   * #swagger.description = 'Returns a 200 (OK) status if API is reached.'
   */
  return res.status(200).send('/health endpoint reached. API running.');
};
