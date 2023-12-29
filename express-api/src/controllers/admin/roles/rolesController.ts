import { Request, Response } from 'express';
import { stubResponse } from '@/utilities/stubResponse';

/**
 * @description Gets a paged list of roles.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 200 status with a list of roles.
 */
export const getRoles = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Roles - Admin']
   * #swagger.description = 'Gets a paged list of roles.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */

  // TODO: Replace stub response with controller logic
  return stubResponse(res);
};

/**
 * @description Adds a new role to the datasource.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 201 status and the data of the role added.
 */
export const addRole = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Roles - Admin']
   * #swagger.description = 'Adds a new role to the datasource.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */

  // TODO: Replace stub response with controller logic
  return stubResponse(res);
};

/**
 * @description Gets a single role that matches an ID.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 200 status and the role data.
 */
export const getRoleById = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Roles - Admin']
   * #swagger.description = 'Returns an role that matches the supplied ID.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */

  // TODO: Replace stub response with controller logic
  return stubResponse(res);
};

/**
 * @description Updates a single role that matches an ID.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 200 status and the role data.
 */
export const updateRoleById = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Roles - Admin']
   * #swagger.description = 'Updates an role that matches the supplied ID.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */

  // TODO: Replace stub response with controller logic
  return stubResponse(res);
};

/**
 * @description Deletes a single role that matches an ID.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 204 status indicating successful deletion.
 */
export const deleteRoleById = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Roles - Admin']
   * #swagger.description = 'Deletes an role that matches the supplied ID.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */

  // TODO: Replace stub response with controller logic
  return stubResponse(res);
};

/**
 * @description Gets a single role that matches a name.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 200 status and the role data.
 */
export const getRoleByName = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Roles - Admin']
   * #swagger.description = 'Gets a role that matches the supplied name.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */

  // TODO: Replace stub response with controller logic
  return stubResponse(res);
};
