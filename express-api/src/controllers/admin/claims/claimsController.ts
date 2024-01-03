import { Request, Response } from 'express';
import { stubResponse } from '@/utilities/stubResponse';

/**
 * @description Gets a paged list of claims.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 200 status with a list of claims.
 */
export const getClaims = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Claims - Admin']
   * #swagger.description = 'Gets a paged list of claims.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */

  // TODO: Replace stub response with controller logic
  return stubResponse(res);
};

/**
 * @description Adds a new claim to the datasource.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 201 status and the data of the claim added.
 */
export const addClaim = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Claims - Admin']
   * #swagger.description = 'Adds a new claim to the datasource.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */

  // TODO: Replace stub response with controller logic
  return stubResponse(res);
};

/**
 * @description Gets a single claim that matches an ID.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 200 status and the claim data.
 */
export const getClaimById = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Claims - Admin']
   * #swagger.description = 'Returns a claim that matches the supplied ID.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */

  // TODO: Replace stub response with controller logic
  return stubResponse(res);
};

/**
 * @description Updates a single claim that matches an ID.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 200 status and the claim data.
 */
export const updateClaimById = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Claims - Admin']
   * #swagger.description = 'Updates a claim that matches the supplied ID.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */

  // TODO: Replace stub response with controller logic
  return stubResponse(res);
};

/**
 * @description Deletes a single claim that matches an ID.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 204 status indicating successful deletion.
 */
export const deleteClaimById = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Claims - Admin']
   * #swagger.description = 'Deletes a claim that matches the supplied ID.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */

  // TODO: Replace stub response with controller logic
  return stubResponse(res);
};
