import { z } from 'zod';
import { stubResponse } from '../../utilities/stubResponse';
import { Request, Response } from 'express';
import chesServices from '@/services/ches/chesServices';
import { ChesFilterSchema } from './toolsSchema';
import { KeycloakUser } from '@bcgov/citz-imb-kc-express';
import geocoderService from '@/services/geocoder/geocoderService';

/**
 * @description Gets the status of a CHES message.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with a CHES object.
 */
export const getChesMessageStatusById = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Tools']
   * #swagger.description = 'Make a request to CHES to get the status of the specified 'messageId'.'
   * #swagger.security = [{
      "bearerAuth" : []
      }]
   */
  const messageId = z.string().uuid().safeParse(req.params.messageId);
  if (messageId.success) {
    const status = await chesServices.getStatusByIdAsync(messageId.data);
    return res.status(200).send(status);
  } else {
    return res.status(400).send('Message ID was malformed or missing.');
  }
};

/**
 * @description Gets the status of a CHES message.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with a CHES object.
 */
export const getChesMessageStatuses = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Tools']
   * #swagger.description = 'Make a request to CHES to get the status of many messages by the specified query strings'
   * #swagger.security = [{
      "bearerAuth" : []
      }]
   */
  const filter = ChesFilterSchema.safeParse(req.query);
  if (filter.success) {
    const status = await chesServices.getStatusesAsync(filter.data);
    return res.status(200).send(status);
  } else {
    return res.status(400).send('Could not parse filter.');
  }
};

/**
 * @description Cancel a CHES message by messageId.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with a CHES object.
 */
export const cancelChesMessageById = async (req: Request, res: Response) => {
  /**
     * #swagger.tags = ['Tools']
     * #swagger.description = 'Make a request to CHES to cancel the specified 'messageId''
     * #swagger.security = [{
        "bearerAuth" : []
        }]
     */
  const messageId = z.string().uuid().safeParse(req.params.messageId);
  if (messageId.success) {
    const status = await chesServices.cancelEmailByIdAsync(messageId.data);
    return res.status(200).send(status);
  } else {
    return res.status(400).send('Message ID was missing or malformed.');
  }
};

/**
 * @description Cancel a CHES message.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with a CHES object.
 */
export const cancelChesMessages = async (req: Request, res: Response) => {
  /**
     * #swagger.tags = ['Tools']
     * #swagger.description = 'Make a request to CHES to cancel the specified query string filter'
     * #swagger.security = [{
        "bearerAuth" : []
        }]
     */
  const filter = ChesFilterSchema.safeParse(req.query);
  if (filter.success) {
    const status = await chesServices.cancelEmailsAsync(filter.data);
    return res.status(200).send(status);
  } else {
    return res.status(400).send('Could not parse filter.');
  }
};

// Will likely not make it into final release, excluding from api docs.
export const sendChesMessage = async (req: Request, res: Response) => {
  const email = req.body;
  const kcUser = req.user as KeycloakUser;
  const response = await chesServices.sendEmailAsync(email, kcUser);
  return res.status(201).send(response);
};

/**
 * @description Search Geocoder for an address.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with an address object.
 */
export const searchGeocoderAddresses = async (req: Request, res: Response) => {
  /**
     * #swagger.tags = ['Tools']
     * #swagger.description = 'Make a request to Data BC Geocoder for addresses that match the specified `search`.'
     * #swagger.security = [{
        "bearerAuth" : []
        }]
     */
  const address = String(req.query.address);
  const minScore = isNaN(Number(req.query.minScore)) ? undefined : String(req.query.minScore);
  const maxResults = isNaN(Number(req.query.maxResults)) ? undefined : String(req.query.maxResults);
  const geoReturn = await geocoderService.getSiteAddresses(address, minScore, maxResults);
  return res.status(200).send(geoReturn);
};

/**
 * @description Search Geocoder for the pid of a certain siteId.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with a siteId object.
 */
export const searchGeocoderSiteId = async (req: Request, res: Response) => {
  /**
     * #swagger.tags = ['Tools']
     * #swagger.description = 'Make a request to Data BC Geocoder for PIDs that belong to the specified 'siteId'.'
     * #swagger.security = [{
        "bearerAuth" : []
        }]
     */
  const siteId = String(req.params.siteId);
  const result = await geocoderService.getPids(siteId);
  return res.status(200).send(result);
};

/**
 * @description Bulk upload property data, updates lookup data as a side effect.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with an array of the uploaded objects.
 */
export const bulkImportProperties = async (req: Request, res: Response) => {
  /**
     * #swagger.tags = ['Tools']
     * #swagger.description = 'Add an array of new properties to the datasource. Determines if the property is a parcel or a building and then adds or updates appropriately. This will also add new lookup items to the following; cities, agencies, building construction types, building predominate uses.'
     * #swagger.security = [{
        "bearerAuth" : []
        }]
     */
  return stubResponse(res);
};

/**
 * @description Bulk upload property data, updates lookup data as a side effect.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with an array of the uploaded objects.
 */
export const bulkDeleteProperties = async (req: Request, res: Response) => {
  /**
     * #swagger.tags = ['Tools']
     * #swagger.description = 'Add an array of new properties to the datasource. Determines if the property is a parcel or a building and then adds or updates appropriately. This will also add new lookup items to the following; cities, agencies, building construction types, building predominate uses.'
     * #swagger.security = [{
        "bearerAuth" : []
        }]
     */
  return stubResponse(res);
};

/**
 * @description Bulk upload property financial information only.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with an array of the uploaded objects.
 */
export const bulkUpdatePropertyFinancials = async (req: Request, res: Response) => {
  /**
     * #swagger.tags = ['Tools']
     * #swagger.description = 'Update property financial values in the datasource. If the property does not exist it will not be imported. The financial values provided will overwrite existing data in the datasource.'
     * #swagger.security = [{
        "bearerAuth" : []
        }]
     */
  return stubResponse(res);
};

/**
 * @description Bulk upload projects, updates lookup values as a side effect.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with an array of the uploaded objects.
 */
export const bulkImportProjects = async (req: Request, res: Response) => {
  /**
     * #swagger.tags = ['Tools']
     * #swagger.description = 'Add an array of new properties to the datasource. Determines if the property is a parcel or a building and then adds or updates appropriately. This will also add new lookup items to the following; cities, agencies, building construction types, building predominate uses.'
     * #swagger.security = [{
        "bearerAuth" : []
        }]
     */
  return stubResponse(res);
};
