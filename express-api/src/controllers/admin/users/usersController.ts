import { Request, Response } from 'express';
import { stubResponse } from '@/utilities/stubResponse';

/**
 * @description Gets a paged list of users.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 200 status with a list of users.
 */
export const getUsers = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Users - Admin']
   * #swagger.description = 'Gets a paged list of users.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */

  // TODO: Replace stub response with controller logic
  return stubResponse(res);
};

/**
 * @description Adds a new user to the datasource.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 201 status and the data of the user added.
 */
export const addUser = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Users - Admin']
   * #swagger.description = 'Adds a new user to the datasource.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */

  // TODO: Replace stub response with controller logic
  return stubResponse(res);
};

/**
 * @description Gets a single user that matches an ID.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 200 status and the user data.
 */
export const getUserById = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Users - Admin']
   * #swagger.description = 'Returns an user that matches the supplied ID.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */

  // TODO: Replace stub response with controller logic
  return stubResponse(res);
};

/**
 * @description Updates a single user that matches an ID.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 200 status and the user data.
 */
export const updateUserById = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Users - Admin']
   * #swagger.description = 'Updates an user that matches the supplied ID.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */

  // TODO: Replace stub response with controller logic
  return stubResponse(res);
};

/**
 * @description Deletes a single user that matches an ID.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 204 status indicating successful deletion.
 */
export const deleteUserById = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Users - Admin']
   * #swagger.description = 'Deletes an user that matches the supplied ID.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */

  // TODO: Replace stub response with controller logic
  return stubResponse(res);
};

/**
 * @description Gets a paged list of users based on filter.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 200 status with a list of users.
 */
export const getUsersByFilter = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Users - Admin']
   * #swagger.description = 'Gets a paged list of users based on supplied filter.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */

  // TODO: Replace stub response with controller logic
  return stubResponse(res);
};

/**
 * @description Gets a paged list of users within the user's agency.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 200 status with a list of users.
 */
export const getUsersSameAgency = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Users - Admin']
   * #swagger.description = 'Gets a paged list of users within the user's agency.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */

  // TODO: Replace stub response with controller logic
  return stubResponse(res);
};

/**
 * @description Gets all roles of a user based on their name.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 200 status with a list of the user's roles.
 */
export const getUserRolesByName = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Users - Admin']
   * #swagger.description = 'Gets a list of roles assigned to a user.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */

  // TODO: Replace stub response with controller logic
  return stubResponse(res);
};

/**
 * @description Adds a role to a user based on their name.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 200 status with the user's updated information.
 */
export const addUserRoleByName = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Users - Admin']
   * #swagger.description = 'Adds a role to a user based on their name.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */

  // TODO: Replace stub response with controller logic
  return stubResponse(res);
};

/**
 * @description Deletes a role from a user based on their name.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 200 status with the user's updated information.
 */
export const deleteUserRoleByName = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Users - Admin']
   * #swagger.description = 'Deletes a role from a user based on their name.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */

  // TODO: Replace stub response with controller logic
  return stubResponse(res);
};
