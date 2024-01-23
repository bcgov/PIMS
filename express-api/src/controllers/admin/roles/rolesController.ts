import { Request, Response } from 'express';
import rolesServices from '@/services/admin/rolesServices';
import { RolesFilter, RolesFilterSchema } from '@/controllers/admin/roles/rolesSchema';

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
  const filter = RolesFilterSchema.safeParse(req.query);
  if (filter.success) {
    const roles = rolesServices.getRoles(filter.data as RolesFilter);
    return res.status(200).send(roles);
  } else {
    return res.status(400).send('Could not parse filter.');
  }
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

  const role = rolesServices.addRole(req.body);
  return res.status(200).send(role);
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

  const id = req.params.id;
  const filter = RolesFilterSchema.safeParse({ id: id });
  if (filter.success) {
    const roles = await rolesServices.getRoles(filter.data as RolesFilter);
    if (roles.length == 1) {
      return res.status(200).send(roles);
    } else {
      return res.status(500);
    }
  } else {
    return res.status(400).send('Could not parse filter.');
  }
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

  const id = req.params.id;
  if (id != req.body.Id) {
    return res.status(400).send('Request param id did not match request body id.');
  } else {
    const role = rolesServices.updateRole(req.body);
    return role;
  }
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

  const id = req.params.id;
  if (id != req.body.Id) {
    return res.status(400).send('Request param id did not match request body id.');
  } else {
    const role = rolesServices.removeRole(req.body);
    return role;
  }
};
