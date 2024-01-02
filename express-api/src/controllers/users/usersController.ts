import { stubResponse } from '../../utilities/stubResponse';
import { Request, Response } from 'express';

/**
 * @description Redirects user to the keycloak user info endpoint.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with an object containing keycloak info.
 */
export const getUserInfo = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Users']
   * #swagger.description = 'Redirect user to keycloak user info.'
   * #swagger.security = [{
      "bearerAuth" : []
      }]
   */
  return stubResponse(res);
};

/**
 * @description Get the most recent access request for this user.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with the most recent access request.
 */
export const getUserAccessRequestLatest = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Users']
   * #swagger.description = 'Get user's most recent access request.'
   * #swagger.security = [{
      "bearerAuth" : []
      }]
   */
  return stubResponse(res);
};

/**
 * @description Submits a user access request.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 201 status with the created access request.
 */
export const submitUserAccessRequest = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Users']
   * #swagger.description = 'Submit a user access request.'
   * #swagger.security = [{
      "bearerAuth" : []
      }]
   */
  return stubResponse(res);
};

/**
 * @description Gets a user access request by ID.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with the user access request matching the Id.
 */
export const getUserAccessRequestById = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Users']
   * #swagger.description = 'Get a user access request by ID.'
   * #swagger.security = [{
      "bearerAuth" : []
      }]
   */
  return stubResponse(res);
};

/**
 * @description Updates a user access request.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with the updated request.
 */
export const updateUserAccessRequest = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Users']
   * #swagger.description = 'Update a user access request.'
   * #swagger.security = [{
      "bearerAuth" : []
      }]
   */
  return stubResponse(res);
};

/**
 * @description Gets user agency information.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with an array of integers.
 *
 *  Note that the original docs imply it gives the full user response, but looking at the implementation
 *  I think it only gives the numeric agency Ids.
 */
export const getUserAgencies = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Users']
   * #swagger.description = 'Get user agency information.'
   * #swagger.security = [{
      "bearerAuth" : []
      }]
   */
  return stubResponse(res);
};

/**
 * @description Exports user as CSV or Excel file.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with the CSV or Excel file in the response body.
 */
export const getUserReport = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Users']
   * #swagger.description = 'Exports users as CSV or Excel file. Include 'Accept' header to request the appropriate expor - ["text/csv", "application/application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]'
   * #swagger.security = [{
      "bearerAuth" : []
      }]
   */
  return stubResponse(res);
};

/**
 * @description Filters user report based on criteria provided in the request body.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with
 */
export const filterUserReport = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Users']
   * #swagger.description = 'Exports users as CSV or Excel file. Include 'Accept' header to request the appropriate expor - ["text/csv", "application/application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]'
   * #swagger.security = [{
      "bearerAuth" : []
      }]
   */
  return stubResponse(res);
};
