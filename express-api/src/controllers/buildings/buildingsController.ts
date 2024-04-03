import { Request, Response } from 'express';
import * as buildingService from '@/services/buildings/buildingServices';
import { BuildingFilterSchema } from '@/services/buildings/buildingSchema';
import userServices from '@/services/users/usersServices';
import { SSOUser } from '@bcgov/citz-imb-sso-express';
import { Building } from '@/typeorm/Entities/Building';

/**
 * @description Gets all buildings satisfying the filter parameters.
 * @param {Request}     req Incoming Request. May contain query strings for filter.
 * @param {Response}    res Outgoing Response
 * @returns {Response}      A 200 status with a response body containing an array of building data.
 */
export const getBuildings = async (req: Request, res: Response) => {
  const includeRelations = req.query.includeRelations === 'true';
  const filter = BuildingFilterSchema.safeParse(req.query);
  if (filter.success) {
    const response = await buildingService.getBuildings(filter.data, includeRelations);
    return res.status(200).send(response);
  } else {
    return res.status(400).send('Could not parse filter.');
  }
};

/**
 * @description Gets information about a particular building by the Id provided in the URL parameter
 * @param {Request}     req Incoming Request
 * @param {Response}    res Outgoing Response
 * @returns {Response}      A 200 status with a response body containing building data.
 */
export const getBuilding = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['building']
   * #swagger.description = 'Get the building from the data source if the user is permitted.'
   * #swagger.security = [{
   * "bearerAuth": []
   * }]
   */
  const buildingId = Number(req.params.buildingId);
  if (isNaN(buildingId)) {
    return res.status(400).send('Building Id is invalid.');
  }
  const building = await buildingService.getBuildingById(buildingId);
  if (!building) {
    return res.status(404).send('Building matching this ID was not found.');
  }
  return res.status(200).send(building);
};

/**
 * @description Updates information about a particular building by the Id provided in the URL parameter.
 * @param {Request}     req Incoming Request. Should contain complete building in request body.
 * @param {Response}    res Outgoing Response
 * @returns {Response}      A 200 status with a response body containing building data.
 */
export const updateBuilding = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['building']
   * #swagger.description = 'Updates the building from the data source if the user is permitted.'
   * #swagger.security = [{
   * "bearerAuth": []
   * }]
   */
  const buildingId = Number(req.params.buildingId);
  if (isNaN(buildingId) || buildingId !== req.body.Id) {
    return res.status(400).send('Building ID was invalid or mismatched with body.');
  }
  const user = await userServices.getUser((req.user as SSOUser).preferred_username);
  const updateBody = { ...req.body, UpdatedById: user.Id };
  const building = await buildingService.updateBuildingById(updateBody);
  return res.status(200).send(building);
};

/**
 * @description Deletes a particular building by the Id provided in the URL parameter.
 * @param {Request}     req Incoming Request (Note: The original implementation requires a full building request body, but it seems unnecessary)
 * @param {Response}    res Outgoing Response
 * @returns {Response}      A 200 status with a response body containing building data.
 */
export const deleteBuilding = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['building']
   * #swagger.description = 'Deletes the building from the data source if the user is permitted.'
   * #swagger.security = [{
   * "bearerAuth": []
   * }]
   */
  const buildingId = Number(req.params.buildingId);
  if (isNaN(buildingId)) {
    return res.status(400).send('Building ID was invalid.');
  }
  const delResult = await buildingService.deleteBuildingById(buildingId);
  return res.status(200).send(delResult);
};

/**
 * @description Add a new building to the datasource for the current user.
 * @param {Request}     req Incoming Request. Body should contain building data.
 * @param {Response}    res Outgoing Response
 * @returns {Response}      A 201 status with a response body containing the created building data.
 * Note: the original implementation returns 200, but as a resource is created 201 is better.
 */
export const addBuilding = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['building']
   * #swagger.description = 'Creates a new building in the datasource.'
   * #swagger.security = [{
   * "bearerAuth": []
   * }]
   */
  const user = await userServices.getUser((req.user as SSOUser).preferred_username);
  const createBody: Building = { ...req.body, CreatedById: user.Id };
  createBody.Evaluations = createBody.Evaluations?.map((evaluation) => ({
    ...evaluation,
    CreatedById: user.Id,
  }));
  createBody.Fiscals = createBody.Fiscals?.map((fiscal) => ({ ...fiscal, CreatedById: user.Id }));
  const response = await buildingService.addBuilding(createBody);
  return res.status(201).send(response);
};
