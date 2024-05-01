import { Request, Response } from 'express';
import { stubResponse } from '@/utilities/stubResponse';
import * as ltsaService from '@/services/ltsa/ltsaservice';

export const getToken = async (req: Request, res: Response) => {
  const token = await ltsaService.getTokenAsync();
  return res.status(200).send(token);
};
/**
 * @description Used to retrieve property information from LTSA.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 200 status with LTSA order information.
 */
export const getLTSA = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['LTSA']
   * #swagger.description = 'Returns property information from LTSA.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */

  // TODO: Replace stub response with controller logic
  return stubResponse(res);
};
