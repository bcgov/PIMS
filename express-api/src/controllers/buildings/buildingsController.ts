import { Request, Response } from 'express';
import * as buildingService from '@/services/buildings/buildingServices';
import { BuildingFilter, BuildingFilterSchema } from '@/services/buildings/buildingSchema';
import userServices from '@/services/users/usersServices';
import { Building } from '@/typeorm/Entities/Building';
import { checkUserAgencyPermission } from '@/utilities/authorizationChecks';
import { Roles } from '@/constants/roles';
import { AppDataSource } from '@/appDataSource';
import { exposedProjectStatuses } from '@/constants/projectStatus';
import { ProjectProperty } from '@/typeorm/Entities/ProjectProperty';

/**
 * @description Gets all buildings satisfying the filter parameters.
 * @param {Request}     req Incoming Request. May contain query strings for filter.
 * @param {Response}    res Outgoing Response
 * @returns {Response}      A 200 status with a response body containing an array of building data.
 */
export const getBuildings = async (req: Request, res: Response) => {
  const filter = BuildingFilterSchema.safeParse(req.query);
  const includeRelations = req.query.includeRelations === 'true';
  const user = req.pimsUser;
  if (!filter.success) {
    return res.status(400).send('Could not parse filter.');
  }
  const filterResult = filter.data;
  if (!user.hasOneOfRoles([Roles.ADMIN, Roles.AUDITOR])) {
    // get array of user's agencies
    const usersAgencies = await userServices.getAgencies(user.Username);
    filterResult.agencyId = usersAgencies;
  }
  // Get parcels associated with agencies of the requesting user
  const buildings = await buildingService.getBuildings(
    filterResult as BuildingFilter,
    includeRelations,
  );
  return res.status(200).send(buildings);
};

/**
 * @description Gets information about a particular building by the Id provided in the URL parameter
 * @param {Request}     req Incoming Request
 * @param {Response}    res Outgoing Response
 * @returns {Response}      A 200 status with a response body containing building data.
 */
export const getBuilding = async (req: Request, res: Response) => {
  const buildingId = Number(req.params.buildingId);
  if (isNaN(buildingId)) {
    return res.status(400).send('Building Id is invalid.');
  }

  // admin and auditors are permitted to see any building
  const permittedRoles = [Roles.ADMIN, Roles.AUDITOR];
  const user = req.pimsUser;
  const building = await buildingService.getBuildingById(buildingId);

  if (!building) {
    return res.status(404).send('Building matching this ID was not found.');
  }

  // Get related projects
  const projects = (
    await AppDataSource.getRepository(ProjectProperty).find({
      where: {
        BuildingId: building.Id,
      },
      relations: {
        Project: true,
      },
    })
  ).map((pp) => pp.Project);
  // Are any related projects in ERP? If so, they should be visible to outside agencies.
  const isVisibleToOtherAgencies = projects.some((project) =>
    exposedProjectStatuses.includes(project.StatusId),
  );

  if (
    !(await checkUserAgencyPermission(user, [building.AgencyId], permittedRoles)) &&
    !isVisibleToOtherAgencies
  ) {
    return res.status(403).send('You are not authorized to view this building.');
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
  const buildingId = Number(req.params.buildingId);
  if (isNaN(buildingId) || buildingId !== req.body.Id) {
    return res.status(400).send('Building ID was invalid or mismatched with body.');
  }
  const user = req.pimsUser;
  const updateBody = { ...req.body, UpdatedById: user.Id };
  const building = await buildingService.updateBuildingById(updateBody, req.pimsUser);
  return res.status(200).send(building);
};

/**
 * @description Deletes a particular building by the Id provided in the URL parameter.
 * @param {Request}     req Incoming Request (Note: The original implementation requires a full building request body, but it seems unnecessary)
 * @param {Response}    res Outgoing Response
 * @returns {Response}      A 200 status with a response body containing building data.
 */
export const deleteBuilding = async (req: Request, res: Response) => {
  const buildingId = Number(req.params.buildingId);
  if (isNaN(buildingId)) {
    return res.status(400).send('Building ID was invalid.');
  }
  const delResult = await buildingService.deleteBuildingById(buildingId, req.pimsUser);
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
  const user = req.pimsUser;
  const createBody: Building = { ...req.body, CreatedById: user.Id };
  createBody.Evaluations = createBody.Evaluations?.map((evaluation) => ({
    ...evaluation,
    CreatedById: user.Id,
  }));
  createBody.Fiscals = createBody.Fiscals?.map((fiscal) => ({ ...fiscal, CreatedById: user.Id }));
  const response = await buildingService.addBuilding(createBody);
  return res.status(201).send(response);
};
