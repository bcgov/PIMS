import { Request, Response } from 'express';
import * as agencyService from '@/services/admin/agencyServices';
import { AgencyFilterSchema } from '@/services/admin/agencySchema';
import { z } from 'zod';

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
  const filter = AgencyFilterSchema.safeParse(req.query);
  if (filter.success) {
    const agencies = await agencyService.getAgencies(filter.data);
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
  try {
    const agency = await agencyService.postAgency(req.body);
    return res.status(201).send(agency);
  } catch (e) {
    return res.status(400).send(e.message);
  }
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

  try {
    const agency = await agencyService.getAgencyById(parseInt(req.params.id));

    if (agency == null) {
      return res.status(404).send('Agency not found');
    }
    return res.status(200).send(agency);
  } catch (e) {
    return res.status(400).send(e.message);
  }
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
  const id = z.string().parse(req.params.id);
  if (id != req.body.Id) {
    return res.status(400).send('The param ID does not match the request body.');
  }
  try {
    const agency = await agencyService.updateAgencyById(req.body);
    return res.status(200).send(agency);
  } catch (e) {
    return res.status(400).send(e.message);
  }
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
  const id = z.string().parse(req.params.id);
  try {
    const agency = await agencyService.deleteAgencyById(parseInt(id));
    return res.status(200).send(agency);
  } catch (e) {
    return res.status(400).send(e.message);
  }
};
