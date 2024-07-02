import { Request, Response } from 'express';
import { stubResponse } from '@/utilities/stubResponse';
import propertyServices from '@/services/properties/propertiesServices';
import {
  MapFilterSchema,
  PropertyUnionFilterSchema,
} from '@/controllers/properties/propertiesSchema';
import { checkUserAgencyPermission, isAdmin, isAuditor } from '@/utilities/authorizationChecks';
import userServices from '@/services/users/usersServices';

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

  return stubResponse(res);
};

/**
 * @description Search for a single keyword across multiple different fields in both parcels and buildings.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 200 status with a list of properties.
 */
export const getPropertiesFuzzySearch = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Properties']
   * #swagger.description = 'Returns a list of fuzzy searched properties.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */
  const keyword = String(req.query.keyword);
  const take = req.query.take ? Number(req.query.take) : undefined;
  const kcUser = req.user;
  let userAgencies;
  if (!isAdmin(kcUser)) {
    userAgencies = await userServices.getAgencies(kcUser.preferred_username);
  }
  const result = await propertyServices.propertiesFuzzySearch(keyword, take, userAgencies);
  return res.status(200).send(result);
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
  // parse for filter
  const filter = MapFilterSchema.safeParse(req.query);
  if (filter.success == false) {
    return res.status(400).send(filter.error);
  }

  // Converts comma-separated lists to arrays, see schema
  // Must remove empty arrays for TypeORM to work
  const filterResult = {
    ...filter.data,
    AgencyIds: filter.data.AgencyIds.length ? filter.data.AgencyIds : undefined,
    ClassificationIds: filter.data.ClassificationIds.length
      ? filter.data.ClassificationIds
      : undefined,
    AdministrativeAreaIds: filter.data.AdministrativeAreaIds.length
      ? filter.data.AdministrativeAreaIds
      : undefined,
    PropertyTypeIds: filter.data.PropertyTypeIds.length ? filter.data.PropertyTypeIds : undefined,
    RegionalDistrictIds: filter.data.RegionalDistrictIds.length
      ? filter.data.RegionalDistrictIds
      : undefined,
  };

  // Controlling for agency search visibility
  const kcUser = req.user;
  // Admins and auditors see all, otherwise...
  if (!(isAdmin(kcUser) || isAuditor(kcUser))) {
    const requestedAgencies = filterResult.AgencyIds;
    const userHasAgencies = await checkUserAgencyPermission(kcUser, requestedAgencies);
    // If not agencies were requested or if the user doesn't have those requested agencies
    if (!requestedAgencies || !userHasAgencies) {
      // Then only show that user's agencies instead.
      const usersAgencies = await userServices.getAgencies(kcUser.preferred_username);
      filterResult.AgencyIds = usersAgencies;
    }
  }

  const properties = await propertyServices.getPropertiesForMap(filterResult);
  // Convert to GeoJSON format
  const mapFeatures = properties.map((property) => ({
    type: 'Feature',
    properties: { ...property },
    geometry: {
      type: 'Point',
      // Coordinates are backward compared to most places. Needed for Superclusterer.
      // Superclusterer expects the exact opposite lat,lng compared to Leaflet
      coordinates: [property.Location.x, property.Location.y],
    },
  }));
  return res.status(200).send(mapFeatures);
};

export const getPropertyUnion = async (req: Request, res: Response) => {
  const filter = PropertyUnionFilterSchema.safeParse(req.query);
  if (filter.success == false) {
    return res.status(400).send(filter.error);
  }
  const properties = await propertyServices.getPropertiesUnion(filter.data);
  return res.status(200).send(properties);
};
