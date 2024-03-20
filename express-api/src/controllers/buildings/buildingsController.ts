import { Request, Response } from 'express';
import { stubResponse } from '@/utilities/stubResponse';

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
  return stubResponse(res);
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
  return stubResponse(res);
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
  return stubResponse(res);
};

/**
 * @description Gets all buildings satisfying the filter parameters.
 * @param {Request}     req Incoming Request. May contain query strings for filter.
 * @param {Response}    res Outgoing Response
 * @returns {Response}      A 200 status with a response body containing an array of building data.
 */
export const getBuildings = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['building']
   * #swagger.description = 'Gets all buildings that satisfy the filters.'
   * #swagger.security = [{
   * "bearerAuth": []
   * }]
   */
  return stubResponse(res);
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
  return stubResponse(res);
};

/**
 * @description Update the specified building financials values in the datasource if permitted.
 * @param {Request}     req Incoming Request. Request body should contain entire building.
 * @param {Response}    res Outgoing Response
 * @returns {Response}      A 200 status with a response body of the updated building.
 */
export const updateBuildingFinancial = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['building']
   * #swagger.description = 'Updates a building's financial values.'
   * #swagger.security = [{
   * "bearerAuth": []
   * }]
   */
  return stubResponse(res);
};
