import { Request, Response } from 'express';
import parcelServices from '@/services/parcels/parcelServices';
import { ParcelFilter, ParcelFilterSchema } from '@/services/parcels/parcelSchema';
import { SSOUser } from '@bcgov/citz-imb-sso-express';
import userServices from '@/services/users/usersServices';
import { Parcel } from '@/typeorm/Entities/Parcel';
import { Roles } from '@/constants/roles';
import { checkUserAgencyPermission } from '@/utilities/authorizationChecks';
import { AppDataSource } from '@/appDataSource';
import { ProjectProperty } from '@/typeorm/Entities/ProjectProperty';
import { exposedProjectStatuses } from '@/constants/projectStatus';

/**
 * @description Gets information about a particular parcel by the Id provided in the URL parameter.
 * @param {Request}     req Incoming Request
 * @param {Response}    res Outgoing Response
 * @returns {Response}      A 200 status with a response body containing parcel data.
 */
export const getParcel = async (req: Request, res: Response) => {
  const parcelId = Number(req.params.parcelId);
  if (isNaN(parcelId)) {
    return res.status(400).send('Parcel ID was invalid.');
  }

  // admin and auditors are permitted to see any parcel
  const permittedRoles = [Roles.ADMIN, Roles.AUDITOR];
  const kcUser = req.user as unknown as SSOUser;
  const parcel = await parcelServices.getParcelById(parcelId);

  if (!parcel) {
    return res.status(404).send('Parcel matching this internal ID not found.');
  }

  // Get related projects
  const projects = (
    await AppDataSource.getRepository(ProjectProperty).find({
      where: {
        ParcelId: parcel.Id,
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
    !(await checkUserAgencyPermission(kcUser, [parcel.AgencyId], permittedRoles)) &&
    !isVisibleToOtherAgencies
  ) {
    return res.status(403).send('You are not authorized to view this parcel.');
  }
  return res.status(200).send(parcel);
};

/**
 * @description Updates information about a particular parcel by the Id provided in the URL parameter.
 * @param {Request}     req Incoming Request. Should contain complete parcel in request body.
 * @param {Response}    res Outgoing Response
 * @returns {Response}      A 200 status with a response body containing parcel data.
 */
export const updateParcel = async (req: Request, res: Response) => {
  const parcelId = Number(req.params.parcelId);
  if (isNaN(parcelId) || parcelId !== req.body.Id) {
    return res.status(400).send('Parcel ID was invalid or mismatched with body.');
  }
  const user = await userServices.getUser((req.user as SSOUser).preferred_username);
  const updateBody = { ...req.body, UpdatedById: user.Id };
  const parcel = await parcelServices.updateParcel(updateBody, req.user);
  if (!parcel) {
    return res.status(404).send('Parcel matching this internal ID not found.');
  }
  return res.status(200).send(parcel);
};

/**
 * @description Deletes a particular parcel by the Id provided in the URL parameter.
 * @param {Request}     req Incoming Request (Note: The original implementation requires a full parcel request body, but it seems unnecessary)
 * @param {Response}    res Outgoing Response
 * @returns {Response}      A 200 status with a response body containing parcel data.
 */
export const deleteParcel = async (req: Request, res: Response) => {
  const parcelId = Number(req.params.parcelId);
  if (isNaN(parcelId)) {
    return res.status(400).send('Parcel ID was invalid.');
  }
  const delResult = await parcelServices.deleteParcelById(parcelId, req.user.preferred_username);
  return res.status(200).send(delResult);
};

/**
 * @description Gets all parcels satisfying the filter parameters.
 * @param {Request}     req Incoming Request. May contain query strings for filter.
 * @param {Response}    res Outgoing Response
 * @returns {Response}      A 200 status with a response body containing an array of parcel data.
 */
export const getParcels = async (req: Request, res: Response) => {
  const filter = ParcelFilterSchema.safeParse(req.query);
  const includeRelations = req.query.includeRelations === 'true';
  const kcUser = req.user as unknown as SSOUser;
  if (!filter.success) {
    return res.status(400).send('Could not parse filter.');
  }
  const filterResult = filter.data;

  if (
    !(await userServices.hasOneOfRoles(kcUser.preferred_username, [Roles.ADMIN, Roles.AUDITOR]))
  ) {
    // get array of user's agencies
    const usersAgencies = await userServices.getAgencies(kcUser.preferred_username);
    filterResult.agencyId = usersAgencies;
  }
  // Get parcels associated with agencies of the requesting user
  const parcels = await parcelServices.getParcels(filterResult as ParcelFilter, includeRelations);
  return res.status(200).send(parcels);
};

/* Perhaps the above two methods could be consolidated into one? 
  In the original implementation they are separated into a GET and POST endpoint, but obviously
  a POST endpoint could accept both query strings and request body. Whether that's RESTful or not 
  is another discussion though.
*/

/**
 * @description Add a new parcel to the datasource for the current user.
 * @param {Request}     req Incoming Request. Body should contain parcel data.
 * @param {Response}    res Outgoing Response
 * @returns {Response}      A 201 status with a response body containing the created parcel data.
 * Note: the original implementation returns 200, but as a resource is created 201 is better.
 */
export const addParcel = async (req: Request, res: Response) => {
  const user = await userServices.getUser((req.user as SSOUser).preferred_username);
  const parcel: Parcel = { ...req.body, CreatedById: user.Id };
  parcel.Evaluations = parcel.Evaluations?.map((evaluation) => ({
    ...evaluation,
    CreatedById: user.Id,
  }));
  parcel.Fiscals = parcel.Fiscals?.map((fiscal) => ({ ...fiscal, CreatedById: user.Id }));
  const response = await parcelServices.addParcel(parcel);
  return res.status(201).send(response);
};
