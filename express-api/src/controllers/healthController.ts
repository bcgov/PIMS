import projectServices from '@/services/projects/projectsServices';
import { Request, Response } from 'express';

/**
 * @description Used to check if API is running.
 * @param {Request}     req Incoming request
 * @param {Response}    res Outgoing response
 * @returns {Response}      A 200 status indicating API is healthy and running
 */
export const healthCheck = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Health']
   * #swagger.description = 'Returns a 200 (OK) status if API is reached.'
   */
  const sample_project = await projectServices.getProjectById(9);
const result = await projectServices.updateProject(sample_project, {parcels:[7479], buildings:[]});
  return res.status(200).send(result);
};
