import { Request, Response } from 'express';
import propertyServices, { PropertyIdsByType } from '@/services/properties/propertiesServices';
import {
  ImportResultFilterSchema,
  MapFilter,
  MapFilterSchema,
  PropertyUnionFilterSchema,
} from '@/controllers/properties/propertiesSchema';
import { checkUserAgencyPermission } from '@/utilities/authorizationChecks';
import userServices from '@/services/users/usersServices';
import { Worker } from 'worker_threads';
import path from 'path';
import fs from 'fs';
import { AppDataSource } from '@/appDataSource';
import { ImportResult } from '@/typeorm/Entities/ImportResult';
import { readFile } from 'xlsx';
import logger from '@/utilities/winstonLogger';
import { Roles } from '@/constants/roles';
import { PropertyType } from '@/constants/propertyType';
import { ErrorWithCode } from '@/utilities/customErrors/ErrorWithCode';

/**
 * @description Search for a single keyword across multiple different fields in both parcels and buildings.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 200 status with a list of properties.
 */
export const getPropertiesFuzzySearch = async (req: Request, res: Response) => {
  const keyword = String(req.query.keyword);
  const take = req.query.take ? Number(req.query.take) : undefined;
  const user = req.pimsUser;
  let userAgencies;
  const isAdmin = user.hasOneOfRoles([Roles.ADMIN]);
  if (!isAdmin) {
    userAgencies = await userServices.getAgencies(user.Username);
  }
  const result = await propertyServices.propertiesFuzzySearch(keyword, take, userAgencies);
  return res.status(200).send(result);
};

/**
 * @description Search for a single keyword across multiple different fields in both parcels and buildings.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 200 status with a list of properties.
 */
export const getLinkedProjects = async (req: Request, res: Response) => {
  const buildingId = req.query.buildingId
    ? parseInt(req.query.buildingId as string, 10)
    : undefined;
  const parcelId = req.query.parcelId ? parseInt(req.query.parcelId as string, 10) : undefined;

  const linkedProjects = await propertyServices.findLinkedProjectsForProperty(buildingId, parcelId);

  return res.status(200).send(linkedProjects);
};

/**
 * A helper function for the map-based property controllers.
 * Handles the filtering and permission checks.
 * @param req
 * @returns A list of properties.
 */
const prepareMapProperties = async (req: Request) => {
  // parse for filter
  const filter = MapFilterSchema.safeParse(req.query);
  if (filter.success == false) {
    throw new ErrorWithCode(JSON.stringify(filter.error), 400);
  }

  // Converts comma-separated lists to arrays, see schema
  // Must remove empty arrays for TypeORM to work
  const filterResult: MapFilter = {
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
    // UserAgencies included to separate requested filter on agencies vs user's restriction on agencies
    UserAgencies: undefined,
  };

  // Controlling for agency search visibility
  const permittedRoles = [Roles.ADMIN, Roles.AUDITOR];
  // Admins and auditors see all, otherwise...
  const user = req.pimsUser;
  if (!user.hasOneOfRoles(permittedRoles)) {
    const requestedAgencies = filterResult.AgencyIds;
    const userHasAgencies = await checkUserAgencyPermission(
      user,
      requestedAgencies,
      permittedRoles,
    );
    // If no agencies were requested or if the user doesn't have those requested agencies
    if (!requestedAgencies || !userHasAgencies) {
      // Then only show that user's agencies instead.
      const usersAgencies = await userServices.getAgencies(user.Username);
      filterResult.UserAgencies = usersAgencies;
    }
  }

  const properties = await propertyServices.getPropertiesForMap(filterResult);
  return properties;
};

/**
 * @description Used to retrieve all property geolocation information.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 200 status with a list of property geolocation information.
 */
export const getPropertiesForMap = async (req: Request, res: Response) => {
  const properties = await prepareMapProperties(req);
  // Standard operation is to return the properties in GeoJSON format
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

/**
 * @description Used to export properties based on map filter
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 200 status with a list of property information.
 */
export const getPropertiesForMapExport = async (req: Request, res: Response) => {
  const properties = await prepareMapProperties(req);
  // If it was requested as an Excel export, get the properties in export form
  const filteredIds: PropertyIdsByType = {
    parcelIds: properties
      .filter(
        (p) =>
          p.PropertyTypeId === PropertyType.LAND || p.PropertyTypeId === PropertyType.SUBDIVISION,
      )
      .map((p) => p.Id),
    buildingIds: properties
      .filter((p) => p.PropertyTypeId === PropertyType.BUILDING)
      .map((p) => p.Id),
  };
  const exportData = await propertyServices.getPropertiesForExport({}, filteredIds);
  return res.status(200).send(exportData);
};

/**
 * Receives request to upload file containing property information.
 * Starts a Node worker to handle property import and updates the ImportResult table.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        HTTP response indicating successful (200) or failed submission.
 */
export const importProperties = async (req: Request, res: Response) => {
  const filePath = req.file.path;
  const fileName = req.file.originalname;
  const user = req.pimsUser;
  delete user.hasOneOfRoles; // Because Node worker cannot pass functions.
  try {
    readFile(filePath, { WTF: true }); //With this read option disabled it will throw if unexpected data is present.
  } catch (e) {
    const rootPath = path.resolve(__dirname + '/../../../uploads');
    const realPath = fs.realpathSync(path.resolve(filePath));
    if (realPath.startsWith(rootPath)) {
      fs.unlinkSync(realPath);
    }
    return res.status(400).send(e.message);
  }

  const resultRow = await AppDataSource.getRepository(ImportResult).save({
    FileName: fileName,
    CompletionPercentage: 0,
    CreatedById: user.Id,
    CreatedOn: new Date(),
  });
  const workerPath = `../../services/properties/propertyWorker.${process.env.NODE_ENV === 'production' ? 'js' : 'ts'}`;
  const worker = new Worker(path.resolve(__dirname, workerPath), {
    workerData: { filePath, resultRowId: resultRow.Id, user, roles: [user.RoleId] },
    execArgv: [
      '--require',
      'ts-node/register',
      '--require',
      'tsconfig-paths/register',
      '--require',
      'dotenv/config',
    ],
  });
  worker.on('message', (msg) => {
    logger.info('Worker thread message --', msg);
  });
  worker.on('error', (err) => {
    logger.error(`Worker errored out: ${err.message}`);
    AppDataSource.getRepository(ImportResult).update(
      { Id: resultRow.Id },
      { CompletionPercentage: -1 },
    );
  });
  worker.on('exit', (code) => {
    logger.info(`Worker hit exit code ${code}`);

    fs.unlink(filePath, (err) => {
      if (err) logger.error('Failed to cleanup file from file upload.');
    });
  });
  return res.status(200).send(resultRow);
};

/**
 * Retrieves the results of a user's bulk import.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns                   Response with ImportFilterResult.
 */
export const getImportResults = async (req: Request, res: Response) => {
  const user = req.pimsUser;
  const filter = ImportResultFilterSchema.safeParse(req.query);
  if (filter.success == false) {
    return res.status(400).send(filter.error);
  }
  const results = await propertyServices.getImportResults(filter.data, user);
  return res.status(200).send(results);
};

/**
 * Retrieves a combination of parcels and buildings.
 * Useful for lists or queries that require searching both.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns                   Response with a list of properties.
 */
export const getPropertyUnion = async (req: Request, res: Response) => {
  const forExcelExport = req.query.excelExport === 'true';
  const filter = PropertyUnionFilterSchema.safeParse(req.query);
  if (filter.success == false) {
    return res.status(400).send(filter.error);
  }
  // Prevent getting back unrelated agencies for general users
  const user = req.pimsUser;
  const filterResult = filter.data;
  if (!user.hasOneOfRoles([Roles.ADMIN, Roles.AUDITOR])) {
    // get array of user's agencies
    const usersAgencies = await userServices.getAgencies(user.Username);
    filterResult.agencyIds = usersAgencies;
  }

  const properties = forExcelExport
    ? await propertyServices.getPropertiesForExport(filterResult)
    : await propertyServices.getPropertiesUnion(filterResult);

  return res.status(200).send(properties);
};
