import { Request, Response } from 'express';
import { stubResponse } from '@/utilities/stubResponse';

/**
 * @description Gets a list of access requests.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 200 status with a list of access requests.
 */
export const getAccessRequests = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Access Requests - Admin']
   * #swagger.description = 'Gets a list of access requests.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */

  // TODO: Replace stub response with controller logic
  return stubResponse(res);
};

/**
 * @description Deletes a single access request.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 204 status indicating successful deletion.
 */
export const deleteAccessRequest = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Access Requests - Admin']
   * #swagger.description = 'Deletes an access request.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */

  // TODO: Replace stub response with controller logic
  return stubResponse(res);
};
