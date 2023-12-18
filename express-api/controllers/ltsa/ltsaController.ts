import { Request, Response } from 'express';
import { stubResponse } from '../../utilities/stubResponse';

/**
 * @description Used to retrieve property information from LTSA.
 * @param {Request}     req Incoming request
 * @param {Response}    res Outgoing response
 * @returns {Response}      A 200 status with LTSA order information.
 */
export const getLTSA = async (req: Request, res: Response) => {
  // TODO: Replace stub response with controller logic
  return stubResponse(res);
};
