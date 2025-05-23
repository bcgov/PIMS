import { Request, Response } from 'express';
import * as agencyService from '@/services/agencies/agencyServices';
import { AgencyFilterSchema, AgencyPublicResponseSchema } from '@/services/agencies/agencySchema';
import { z } from 'zod';
import { Roles } from '@/constants/roles';
import { Agency } from '@/typeorm/Entities/Agency';

/**
 * @description Gets a paged list of agencies.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 200 status with a list of agencies.
 */
export const getAgencies = async (req: Request, res: Response) => {
  const user = req.pimsUser;
  const filter = AgencyFilterSchema.safeParse(req.query);
  if (filter.success) {
    const agencies = await agencyService.getAgencies(filter.data);
    if (!user.hasOneOfRoles([Roles.ADMIN])) {
      const trimmed = AgencyPublicResponseSchema.array().parse(agencies);
      return res.status(200).send({
        ...agencies,
        data: trimmed,
      });
    }
    return res.status(200).send(agencies);
  } else {
    return res.status(400).send('Could not parse filter.');
  }
};

/**
 * @description Adds a new agency to the datasource.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 201 status and the data of the agency added.
 */
export const addAgency = async (req: Request, res: Response) => {
  const user = req.pimsUser;
  const agency = await agencyService.addAgency({ ...req.body, CreatedById: user.Id });

  return res.status(201).send(agency);
};

/**
 * @description Gets a single agency that matches an ID.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 200 status and the agency data.
 */
export const getAgencyById = async (req: Request, res: Response) => {
  const agency = await agencyService.getAgencyById(parseInt(req.params.id));
  if (!agency) {
    return res.status(404).send('Agency does not exist.');
  }
  return res.status(200).send(agency);
};

/**
 * @description Updates a single agency that matches an ID.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 200 status and the agency data.
 */
export const updateAgencyById = async (req: Request, res: Response) => {
  const idParse = z.string().safeParse(req.params.id);
  if (!idParse.success) {
    return res.status(400).send(idParse);
  }
  const updateInfo: Partial<Agency> = req.body;
  if (idParse.data != updateInfo.Id.toString()) {
    return res.status(400).send('The param ID does not match the request body.');
  }
  // Make sure you can't assign an agency as its own parent
  if (updateInfo.ParentId != null && updateInfo.ParentId === updateInfo.Id) {
    return res.status(403).send('An agency cannot be its own parent.');
  }
  const user = req.pimsUser;
  const agency = await agencyService.updateAgencyById({ ...req.body, UpdatedById: user.Id }, user);
  return res.status(200).send(agency);
};

/**
 * @description Deletes a single agency that matches an ID.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 204 status indicating successful deletion.
 */
export const deleteAgencyById = async (req: Request, res: Response) => {
  const idParse = z.string().safeParse(req.params.id);
  if (!idParse.success) {
    return res.status(400).send(idParse);
  }
  await agencyService.deleteAgencyById(parseInt(idParse.data));
  return res.status(204).send();
};
