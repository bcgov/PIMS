/* eslint-disable no-console */
import { Request, Response } from 'express';
import { stubResponse } from '@/utilities/stubResponse';
import propertyServices from '@/services/properties/propertiesServices';
import {
  ImportResultFilterSchema,
  MapFilterSchema,
  PropertyUnionFilterSchema,
} from '@/controllers/properties/propertiesSchema';
import { checkUserAgencyPermission, isAdmin, isAuditor } from '@/utilities/authorizationChecks';
import userServices from '@/services/users/usersServices';
import { Worker } from 'worker_threads';
import path from 'path';
import fs from 'fs';
import { SSOUser } from '@bcgov/citz-imb-sso-express';
import { AppDataSource } from '@/appDataSource';
import { ImportResult } from '@/typeorm/Entities/ImportResult';
import { readFile } from 'xlsx';

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

export const importProperties = async (req: Request, res: Response) => {
  const filePath = req.file.path;
  const fileName = req.file.originalname;
  const ssoUser = req.user;
  const user = await userServices.getUser(ssoUser.preferred_username);
  const roles = ssoUser.client_roles;
  try {
    readFile(filePath, { WTF: true }); //With this read option disabled it will throw if unexpected data is present.
  } catch (e) {
    fs.unlinkSync(filePath);
    return res.status(400).send(e.message);
  }

  const resultRow = await AppDataSource.getRepository(ImportResult).save({
    FileName: fileName,
    CompletionPercentage: 0,
    CreatedById: user.Id,
    CreatedOn: new Date(),
  });
  const worker = new Worker(
    path.resolve(__dirname, '../../services/properties/propertyWorker.ts'),
    {
      workerData: { filePath, resultRowId: resultRow.Id, user, roles },
      execArgv: [
        '--require',
        'ts-node/register',
        '--require',
        'tsconfig-paths/register',
        '--require',
        'dotenv/config',
      ],
    },
  );
  worker.on('message', (msg) => {
    console.log('Worker thread message --', msg);
  });
  worker.on('error', (err) => console.log('Worker errored out with error: ' + err.message));
  worker.on('exit', (code) => {
    console.log(`Worker hit exit code ${code}`);

    fs.unlink(filePath, (err) => {
      if (err) console.error('Failed to cleanup file from file upload.');
    });
  });
  return res.status(200).send(resultRow);
};

export const getImportResults = async (req: Request, res: Response) => {
  const kcUser = req.user as SSOUser;
  const filter = ImportResultFilterSchema.safeParse(req.query);
  if (filter.success == false) {
    return res.status(400).send(filter.error);
  }
  const results = await propertyServices.getImportResults(filter.data, kcUser);
  return res.status(200).send(results);
};

export const getPropertyUnion = async (req: Request, res: Response) => {
  const forExcelExport = req.query.excelExport === 'true';
  const filter = PropertyUnionFilterSchema.safeParse(req.query);
  if (filter.success == false) {
    return res.status(400).send(filter.error);
  }
  // Prevent getting back unrelated agencies for general users
  const kcUser = req.user as unknown as SSOUser;
  const filterResult = filter.data;
  if (!(isAdmin(kcUser) || isAuditor(kcUser))) {
    // get array of user's agencies
    const usersAgencies = await userServices.getAgencies(kcUser.preferred_username);
    filterResult.agencyIds = usersAgencies;
  }

  const properties = forExcelExport
    ? await propertyServices.getPropertiesForExport(filterResult)
    : await propertyServices.getPropertiesUnion(filterResult);

  return res.status(200).send(properties);
};
