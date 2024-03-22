import { Request, Response } from 'express';
import * as agencyService from '@/services/agencies/agencyServices';
import { AgencyFilterSchema, AgencyPublicResponseSchema } from '@/services/agencies/agencySchema';
import { z } from 'zod';
import { KeycloakUser } from '@bcgov/citz-imb-kc-express';
import { Roles } from '@/constants/roles';

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
  const kcUser = req.user as KeycloakUser;
  const filter = AgencyFilterSchema.safeParse(req.query);
  if (filter.success) {
    const agencies = await agencyService.getAgencies(filter.data);
    if (!kcUser.client_roles || !kcUser.client_roles.includes(Roles.ADMIN)) {
      const trimmed = AgencyPublicResponseSchema.array().parse(agencies);
      return res.status(200).send(trimmed);
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
  /**
   * #swagger.tags = ['Agencies - Admin']
   * #swagger.description = 'Adds a new agency to the datasource.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */
  const agency = await agencyService.postAgency(req.body);
  return res.status(201).send(agency);
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
  /**
   * #swagger.tags = ['Agencies - Admin']
   * #swagger.description = 'Updates an agency that matches the supplied ID.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */
  const idParse = z.string().safeParse(req.params.id);
  if (!idParse.success) {
    return res.status(400).send(idParse);
  }
  if (idParse.data != req.body.Id) {
    return res.status(400).send('The param ID does not match the request body.');
  }
  const agency = await agencyService.updateAgencyById(req.body);
  return res.status(200).send(agency);
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
  const idParse = z.string().safeParse(req.params.id);
  if (!idParse.success) {
    return res.status(400).send(idParse);
  }
  const agency = await agencyService.deleteAgencyById(parseInt(idParse.data));
  return res.status(200).send(agency);
};
