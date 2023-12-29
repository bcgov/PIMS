import { Request, Response } from 'express';
import { stubResponse } from '@/utilities/stubResponse';

/**
 * @description Gets a paged list of agencies.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 200 status with a list of agencies.
 */
export const getAgencies = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Agencies - Admin']
   * #swagger.description = 'Gets a paged list of agencies.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */

  // TODO: Replace stub response with controller logic
  return stubResponse(res);
};

/**
 * @description Adds a new agency to the datasource.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 201 status and the data of the agency added.
 */
export const addAgency = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Agencies - Admin']
   * #swagger.description = 'Adds a new agency to the datasource.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */

  // TODO: Replace stub response with controller logic
  return stubResponse(res);
};

/**
 * @description Gets a list of agencies based on a filter.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 200 status with a list of agencies.
 */
export const getAgenciesFiltered = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Agencies - Admin']
   * #swagger.description = 'Returns a paged list of agencies from the datasource based on a supplied filter.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */

  // TODO: Replace stub response with controller logic
  return stubResponse(res);
};

/**
 * @description Gets a single agency that matches an ID.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 200 status and the agency data.
 */
export const getAgencyById = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Agencies - Admin']
   * #swagger.description = 'Returns an agency that matches the supplied ID.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */

  // TODO: Replace stub response with controller logic
  return stubResponse(res);
};

/**
 * @description Updates a single agency that matches an ID.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 200 status and the agency data.
 */
export const updateAgencyById = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Agencies - Admin']
   * #swagger.description = 'Updates an agency that matches the supplied ID.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */

  // TODO: Replace stub response with controller logic
  return stubResponse(res);
};

/**
 * @description Deletes a single agency that matches an ID.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 204 status indicating successful deletion.
 */
export const deleteAgencyById = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Agencies - Admin']
   * #swagger.description = 'Deletes an agency that matches the supplied ID.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */

  // TODO: Replace stub response with controller logic
  return stubResponse(res);
};
