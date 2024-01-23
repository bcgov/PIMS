import { Request, Response } from 'express';
import { stubResponse } from '@/utilities/stubResponse';
import userServices from '@/services/admin/usersServices';
import { UserFilteringSchema, UserFiltering } from '@/controllers/admin/users/usersSchema';
import { z } from 'zod';

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

  const filter = UserFilteringSchema.safeParse(req.query);
  if (filter.success) {
    const users = await userServices.getUsers(filter.data as UserFiltering);
    return res.status(200).send(users);
  } else {
    return res.status(400).send('Failed to parse filter query.');
  }
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
  try {
    const user = await userServices.addUser(req.body);
    return res.status(200).send(user);
  } catch (e) {
    return res.status(400).send(e.message);
  }
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
  const id = req.params.id;
  const filter = UserFilteringSchema.safeParse({ id: id });
  if (filter.success) {
    const user = await userServices.getUsers(filter.data as UserFiltering);
    if (user.length == 1) {
      return res.status(200).send(user[0]);
    } else {
      return res.status(500);
    }
  } else {
    return res.status(400).send('Unable to parse filter.');
  }
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
  const id = z.string().uuid().parse(req.params.id);
  if (id != req.body.id) {
    return res.status(400).send('The param ID does not match the request body.');
  }
  const user = await userServices.updateUser(req.body);
  return res.status(200).send(user);
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

  const id = z.string().uuid().parse(req.params.id);
  if (id != req.body.id) {
    return res.status(400).send('The param ID does not match the request body.');
  }
  const user = await userServices.deleteUser(req.body);
  return res.status(200).send(user);
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
  const username = req.params.username;
  if (!username) {
    return res.status(400).send('Username was empty.');
  }
  const roles = await userServices.getUserRoles(username);
  return res.status(200).send(roles);
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
