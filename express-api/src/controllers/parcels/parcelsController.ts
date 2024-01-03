import { Request, Response } from 'express';
import { stubResponse } from '@/utilities/stubResponse';

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
  return stubResponse(res);
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
  return stubResponse(res);
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
  return stubResponse(res);
};

/**
 * @description Gets all parcels satisfying the filter parameters.
 * @param {Request}     req Incoming Request. May contain query strings for filter.
 * @param {Response}    res Outgoing Response
 * @returns {Response}      A 200 status with a response body containing an array of parcel data.
 */
export const filterParcelsQueryString = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['parcels']
   * #swagger.description = 'Gets all parcels that satisfy the filters.'
   * #swagger.security = [{
   * "bearerAuth": []
   * }]
   */
  return stubResponse(res);
};

/**
 * @description Gets all parcels satisfying the filter parameters.
 * @param {Request}     req Incoming Request. Body should contain filter parameters.
 * @param {Response}    res Outgoing Response
 * @returns {Response}      A 200 status with a response body containing an array of parcel data.
 */
export const filterParcelsRequestBody = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['parcels']
   * #swagger.description = 'Creates a new parcel in the datasource.'
   * #swagger.security = [{
   * "bearerAuth": []
   * }]
   */
  return stubResponse(res);
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
  return stubResponse(res);
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
