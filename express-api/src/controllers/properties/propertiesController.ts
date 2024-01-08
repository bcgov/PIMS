import { Request, Response } from 'express';
import { stubResponse } from '@/utilities/stubResponse';

/**
 * @description Used to retrieve all properties.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 200 status with a list of properties.
 */
export const getProperties = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Properties']
   * #swagger.description = 'Returns a list of all properties.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */

  // TODO: Replace stub response with controller logic
  return stubResponse(res);
};

/**
 * @description Used to retrieve all properties that match the incoming filter.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 200 status with a list of properties.
 */
export const getPropertiesFilter = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Properties']
   * #swagger.description = 'Returns a list of properties that match the incoming filter.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */

  // TODO: Replace stub response with controller logic
  return stubResponse(res);
};

/**
 * @description Used to a paged list of all properties.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 200 status with a paged list of properties.
 */
export const getPropertiesPaged = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Properties']
   * #swagger.description = 'Returns a paged list of all properties.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */

  // TODO: Replace stub response with controller logic
  return stubResponse(res);
};

/**
 * @description Used to a paged list of properties that match the incoming filter.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 200 status with a paged list of properties.
 */
export const getPropertiesPagedFilter = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Properties']
   * #swagger.description = 'Returns a paged list of properties that match the incoming filter.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */

  // TODO: Replace stub response with controller logic
  return stubResponse(res);
};

/**
 * @description Used to retrieve all property geolocation information.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 200 status with a list of property geolocation information.
 */
export const getPropertiesForMap = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Properties']
   * #swagger.description = 'Returns a list of all property geolocation information.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */

  // TODO: Replace stub response with controller logic
  return stubResponse(res);
};

/**
 * @description Used to retrieve all property geolocation information that matches the incoming filter.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 200 status with a list of property geolocation information.
 */
export const getPropertiesForMapFilter = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Properties']
   * #swagger.description = 'Returns a list of all property geolocation information that matches the incoming filter.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */

  // TODO: Replace stub response with controller logic
  return stubResponse(res);
};
