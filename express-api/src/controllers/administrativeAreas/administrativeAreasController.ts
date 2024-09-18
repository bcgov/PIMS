import { Request, Response } from 'express';
import {
  AdministrativeAreaFilterSchema,
  AdministrativeAreaPublicResponseSchema,
} from '@/services/administrativeAreas/administrativeAreaSchema';
import administrativeAreasServices from '@/services/administrativeAreas/administrativeAreasServices';
import { Roles } from '@/constants/roles';

/**
 * @description Gets a list of administrative areas.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 200 status with a list of administrative areas.
 */
export const getAdministrativeAreas = async (req: Request, res: Response) => {
  const user = req.pimsUser;
  const filter = AdministrativeAreaFilterSchema.safeParse(req.query);
  if (filter.success) {
    const adminAreas = await administrativeAreasServices.getAdministrativeAreas(filter.data);
    if (!user.hasOneOfRoles([Roles.ADMIN])) {
      const trimmed = AdministrativeAreaPublicResponseSchema.array().parse(adminAreas);
      return res.status(200).send({
        ...adminAreas,
        data: trimmed,
      });
    }
    return res.status(200).send(adminAreas);
  } else {
    return res.status(400).send(filter.error);
  }
};

/**
 * @description Adds a new administrative area.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 201 status and response with the added administrative area.
 */
export const addAdministrativeArea = async (req: Request, res: Response) => {
  const user = req.pimsUser;
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
  const id = req.params.id;
  if (id != req.body.Id) {
    return res.status(400).send('Id mismatched or invalid.');
  }
  const update = await administrativeAreasServices.updateAdministrativeArea(req.body);
  return res.status(200).send(update);
};
