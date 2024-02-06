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
    return res.status(201).send(user);
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
  const uuid = z.string().uuid().safeParse(id);
  if (uuid.success) {
    const user = await userServices.getUserById(uuid.data);
    if (user) {
      return res.status(200).send(user);
    } else {
      return res.status(404);
    }
  } else {
    return res.status(400).send('Could not parse UUID.');
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
  // TODO: This schema check should not throw an uncaught error when failing. Handle properly.
  const id = z.string().uuid().parse(req.params.id);
  if (id != req.body.Id) {
    return res.status(400).send('The param ID does not match the request body.');
  }
  try {
    const user = await userServices.updateUser(req.body);
    return res.status(200).send(user);
  } catch (e) {
    return res.status(e?.code ?? 400).send(e?.message);
  }
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

  // TODO: This schema check should not throw an uncaught error when failing. Handle properly.
  const id = z.string().uuid().parse(req.params.id);
  if (id != req.body.Id) {
    return res.status(400).send('The param ID does not match the request body.');
  }
  try {
    const user = await userServices.deleteUser(req.body);
    return res.status(200).send(user);
  } catch (e) {
    return res.status(e?.code ?? 400).send(e?.message);
  }
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
export const getAllRoles = async (req: Request, res: Response) => {
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
  const roles = await userServices.getKeycloakUserRoles(username);
  return res.status(200).send(roles);
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
  const roles = await userServices.getKeycloakUserRoles(username);
  return res.status(200).send(roles);
};

export const updateUserRolesByName = async (req: Request, res: Response) => {
  const username = req.params.username;
  const roles = z.string().array().safeParse(req.body);
  if (!roles.success) {
    return res.status(400).send('Request body was wrong format.');
  }
  if (!username) {
    return res.status(400).send('Username was empty.');
  }
  const updatedRoles = await userServices.updateKeycloakUserRoles(username, roles.data);
  return res.status(200).send(updatedRoles);
};

// Leaving these two below here for now but I think that we can just consolidate them into the above function instead.

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
