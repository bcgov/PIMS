import { Request, Response } from 'express';
import { SSOUser } from '@bcgov/citz-imb-sso-express';
import {
  AdministrativeAreaFilterSchema,
  AdministrativeAreaPublicResponseSchema,
} from '@/services/administrativeAreas/administrativeAreaSchema';
import administrativeAreasServices from '@/services/administrativeAreas/administrativeAreasServices';
import { Roles } from '@/constants/roles';
import userServices from '@/services/users/usersServices';

/**
 * @description Gets a list of administrative areas.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 200 status with a list of administrative areas.
 */
export const getAdministrativeAreas = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Administrative Areas - Admin']
   * #swagger.description = 'Returns a paged list of administrative areas from the datasource.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */
  const ssoUser = req.user;
  const filter = AdministrativeAreaFilterSchema.safeParse(req.query);
  if (filter.success) {
    const adminAreas = await administrativeAreasServices.getAdministrativeAreas(filter.data);
    if (!ssoUser.hasRoles([Roles.ADMIN])) {
      const trimmed = AdministrativeAreaPublicResponseSchema.array().parse(adminAreas.data);
      return res.status(200).send({
        ...adminAreas,
        data: trimmed,
      });
    }
    return res.status(200).send(adminAreas);
  } else {
    return res.status(400).send('Could not parse filter.');
  }
};

/**
 * @description Adds a new administrative area.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 201 status and response with the added administrative area.
 */
export const addAdministrativeArea = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Administrative Areas - Admin']
   * #swagger.description = 'Add a new administrative area to the datasource.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */
  const user = await userServices.getUser((req.user as SSOUser).preferred_username);
  const addBody = { ...req.body, CreatedById: user.Id };
  const response = await administrativeAreasServices.addAdministrativeArea(addBody);
  return res.status(201).send(response);
};

/**
 * @description Gets a single administrative area that matches an ID.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 200 status and the administrative area data.
 */
export const getAdministrativeAreaById = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Administrative Areas - Admin']
   * #swagger.description = 'Returns an administrative area that matches the supplied ID.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */

  const id = Number(req.params.id);
  const adminArea = await administrativeAreasServices.getAdministrativeAreaById(id);
  return res.status(200).send(adminArea);
};

/**
 * @description Updates a single administrative area that matches an ID.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 200 status and the administrative area data.
 */
export const updateAdministrativeAreaById = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Administrative Areas - Admin']
   * #swagger.description = 'Updates an administrative area that matches the supplied ID.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */

  const id = req.params.id;
  if (id != req.body.Id) {
    return res.status(400).send('Id mismatched or invalid.');
  }
  const update = await administrativeAreasServices.updateAdministrativeArea(req.body);
  return res.status(200).send(update);
};
