import { Request, Response } from 'express';
import { stubResponse } from '@/utilities/stubResponse';
import parcelServices from '@/services/parcels/parcelServices';
import { ParcelFilter, ParcelFilterSchema } from '@/services/parcels/parcelSchema';
import { KeycloakUser } from '@bcgov/citz-imb-kc-express';
import userServices from '@/services/users/usersServices';
import { Parcel } from '@/typeorm/Entities/Parcel';
import { isAdmin, isAuditor } from '@/utilities/authorizationChecks';

/**
 * @description Function to filter parcels based on agencies
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Parcel[]}      An array of parcels.
 */
const filterParcelsByAgencies = async (req: Request, res: Response) => {
  const filter = ParcelFilterSchema.safeParse(req.query);
  const includeRelations = req.query.includeRelations === 'true';
  const kcUser = req.user as unknown as KeycloakUser;
  if (!filter.success) {
    return res.status(400).send('Could not parse filter.');
  }
  const filterResult = filter.data;
  let parcels;
  if (isAdmin(kcUser) || isAuditor(kcUser)) {
    parcels = await parcelServices.getParcels(filterResult as ParcelFilter, includeRelations);
  } else {
    // get array of user's agencies
    const usersAgencies = await userServices.getAgencies(kcUser.preferred_username);
    filterResult.agencyId = usersAgencies;
    // Get parcels associated with agencies of the requesting user
    parcels = await parcelServices.getParcels(filterResult as ParcelFilter, includeRelations);
  }
  return parcels;
};

/**
 * @description Gets information about a particular parcel by the Id provided in the URL parameter.
 * @param {Request}     req Incoming Request
 * @param {Response}    res Outgoing Response
 * @returns {Response}      A 200 status with a response body containing parcel data.
 */
export const getParcel = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['parcels']
   * #swagger.description = 'Get the parcel from the data source if the user is permitted.'
   * #swagger.security = [{
   * "bearerAuth": []
   * }]
   */
  const parcelId = Number(req.params.parcelId);
  if (isNaN(parcelId)) {
    return res.status(400).send('Parcel ID was invalid.');
  }
  const parcel = await parcelServices.getParcelById(parcelId);
  if (!parcel) {
    return res.status(404).send('Parcel matching this internal ID not found.');
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
  /**
   * #swagger.tags = ['parcels']
   * #swagger.description = 'Updates the parcel from the data source if the user is permitted.'
   * #swagger.security = [{
   * "bearerAuth": []
   * }]
   */
  const parcelId = Number(req.params.parcelId);
  if (isNaN(parcelId) || parcelId !== req.body.Id) {
    return res.status(400).send('Parcel ID was invalid or mismatched with body.');
  }
  const user = await userServices.getUser((req.user as KeycloakUser).preferred_username);
  const updateBody = { ...req.body, UpdatedById: user.Id };
  const parcel = await parcelServices.updateParcel(updateBody);
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
  /**
   * #swagger.tags = ['parcels']
   * #swagger.description = 'Deletes the parcel from the data source if the user is permitted.'
   * #swagger.security = [{
   * "bearerAuth": []
   * }]
   */
  const parcelId = Number(req.params.parcelId);
  if (isNaN(parcelId)) {
    return res.status(400).send('Parcel ID was invalid.');
  }
  const delResult = await parcelServices.deleteParcelById(parcelId);
  return res.status(200).send(delResult);
};

/**
 * @description Gets all parcels satisfying the filter parameters.
 * @param {Request}     req Incoming Request. May contain query strings for filter.
 * @param {Response}    res Outgoing Response
 * @returns {Response}      A 200 status with a response body containing an array of parcel data.
 */
export const getParcels = async (req: Request, res: Response) => {
  const parcels = await filterParcelsByAgencies(req, res);
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
  /**
   * #swagger.tags = ['parcels']
   * #swagger.description = 'Creates a new parcel in the datasource.'
   * #swagger.security = [{
   * "bearerAuth": []
   * }]
   */
  const user = await userServices.getUser((req.user as KeycloakUser).preferred_username);
  const parcel: Parcel = { ...req.body, CreatedById: user.Id };
  parcel.Evaluations = parcel.Evaluations?.map((evaluation) => ({
    ...evaluation,
    CreatedById: user.Id,
  }));
  parcel.Fiscals = parcel.Fiscals?.map((fiscal) => ({ ...fiscal, CreatedById: user.Id }));
  const response = await parcelServices.addParcel(parcel);
  return res.status(201).send(response);
};

/**
 * @description Check whether a PID is available.
 * @param {Request}     req Incoming Request. Query strings should contain parcelId or pid.
 * @param {Response}    res Outgoing Response
 * @returns {Response}      A 200 status with a response body of { available: boolean }.
 */
export const checkPidAvailable = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['parcels']
   * #swagger.description = 'Checks whether a PID is available.'
   * #swagger.security = [{
   * "bearerAuth": []
   * }]
   */
  return stubResponse(res);
};

/**
 * @description Check whether a PID is available.
 * @param {Request}     req Incoming Request. Query strings should contain parcelId or pin.
 * @param {Response}    res Outgoing Response
 * @returns {Response}      A 200 status with a response body of { available: boolean }.
 */
export const checkPinAvailable = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['parcels']
   * #swagger.description = 'Checks whether a PIN is available.'
   * #swagger.security = [{
   * "bearerAuth": []
   * }]
   */
  return stubResponse(res);
};

/**
 * @description Update the specified parcel financials values in the datasource if permitted.
 * @param {Request}     req Incoming Request. Request body should contain entire parcel.
 * @param {Response}    res Outgoing Response
 * @returns {Response}      A 200 status with a response body of the updated parcel.
 */
export const updateParcelFinancial = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['parcels']
   * #swagger.description = 'Updates a parcel's financial values.'
   * #swagger.security = [{
   * "bearerAuth": []
   * }]
   */

  /* Note: It's not clear to me what this endpoint would accomplish that the updateParcel
  endpoint would not. */
  return stubResponse(res);
};
