/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppDataSource } from '@/appDataSource';
import { SortOrders } from '@/constants/types';
import {
  ImportResultFilter,
  MapFilter,
  PropertyUnionFilter,
} from '@/controllers/properties/propertiesSchema';
import { Building } from '@/typeorm/Entities/Building';
import { Parcel } from '@/typeorm/Entities/Parcel';
import { PropertyClassification } from '@/typeorm/Entities/PropertyClassification';
import { MapProperties } from '@/typeorm/Entities/views/MapPropertiesView';
import logger from '@/utilities/winstonLogger';
import xlsx, { WorkSheet } from 'xlsx';
import { ParcelFiscal } from '@/typeorm/Entities/ParcelFiscal';
import { ParcelEvaluation } from '@/typeorm/Entities/ParcelEvaluation';
import { BuildingEvaluation } from '@/typeorm/Entities/BuildingEvaluation';
import { BuildingFiscal } from '@/typeorm/Entities/BuildingFiscal';
import { BuildingConstructionType } from '@/typeorm/Entities/BuildingConstructionType';
import { BuildingPredominateUse } from '@/typeorm/Entities/BuildingPredominateUse';
import { Agency } from '@/typeorm/Entities/Agency';
import { AdministrativeArea } from '@/typeorm/Entities/AdministrativeArea';
import { ImportResult } from '@/typeorm/Entities/ImportResult';
import { User } from '@/typeorm/Entities/User';
import { Roles } from '@/constants/roles';
import { PropertyUnion } from '@/typeorm/Entities/views/PropertyUnionView';
import {
  constructFindOptionFromQuery,
  constructFindOptionFromQueryPid,
  constructFindOptionFromQuerySingleSelect,
} from '@/utilities/helperFunctions';
import userServices from '../users/usersServices';
import { Brackets, FindOptionsWhere, ILike, In, QueryRunner } from 'typeorm';
import { SSOUser } from '@bcgov/citz-imb-sso-express';
import { PropertyType } from '@/constants/propertyType';
import { ProjectStatus } from '@/constants/projectStatus';
import { ProjectProperty } from '@/typeorm/Entities/ProjectProperty';
import { ProjectStatus as ProjectStatusEntity } from '@/typeorm/Entities/ProjectStatus';
import { parentPort } from 'worker_threads';
import { ErrorWithCode } from '@/utilities/customErrors/ErrorWithCode';

/**
 * Perform a fuzzy search for properties based on the provided keyword.
 * @param keyword - The keyword to search for within property details.
 * @param limit - (Optional) The maximum number of results to return.
 * @param agencyIds - (Optional) An array of agency IDs to filter the search results.
 * @returns An object containing the found parcels and buildings that match the search criteria.
 */
const propertiesFuzzySearch = async (keyword: string, limit?: number, agencyIds?: number[]) => {
  const allStatusIds = (await AppDataSource.getRepository(ProjectStatusEntity).find()).map(
    (i) => i.Id,
  );
  const allowedStatusIds = [
    ProjectStatus.CANCELLED,
    ProjectStatus.DENIED,
    ProjectStatus.TRANSFERRED_WITHIN_GRE,
  ];
  const disallowedStatusIds = allStatusIds.filter((s) => !allowedStatusIds.includes(s));

  // Find all properties that are attached to projects in states other than Cancelled, Transferred within GRE, or Denied
  // Get project properties that are in projects currently in the disallowed statuses
  const excludedIds = await AppDataSource.getRepository(ProjectProperty).find({
    relations: {
      Project: true,
    },
    where: {
      Project: {
        StatusId: In(disallowedStatusIds),
      },
    },
  });

  const excludedParcelIds = excludedIds.map((row) => row.ParcelId).filter((id) => id != null);

  const excludedBuildingIds = excludedIds.map((row) => row.BuildingId).filter((id) => id != null);

  const parcelsQuery = await AppDataSource.getRepository(Parcel)
    .createQueryBuilder('parcel')
    .leftJoinAndSelect('parcel.Agency', 'agency')
    .leftJoinAndSelect('parcel.AdministrativeArea', 'adminArea')
    .leftJoinAndSelect('parcel.Evaluations', 'evaluations')
    .leftJoinAndSelect('parcel.Fiscals', 'fiscals')
    .leftJoinAndSelect('parcel.Classification', 'classification')
    // Match the search criteria
    .where(
      new Brackets((qb) => {
        qb.where(`LPAD(parcel.pid::text, 9, '0') ILIKE '%${keyword.replaceAll('-', '')}%'`)
          .orWhere(`parcel.pin::text ILIKE '%${keyword}%'`)
          .orWhere(`agency.name ILIKE '%${keyword}%'`)
          .orWhere(`adminArea.name ILIKE '%${keyword}%'`)
          .orWhere(`parcel.address1 ILIKE '%${keyword}%'`)
          .orWhere(`parcel.name ILIKE '%${keyword}%'`);
      }),
    )
    // Only include surplus properties
    .andWhere(`classification.Name in ('Surplus Encumbered', 'Surplus Active')`)
    // Exclude if already is a project property in a project that's in a disallowed status
    .andWhere(`parcel.id NOT IN(:...excludedParcelIds)`, { excludedParcelIds });

  // Add the optional agencyIds filter if provided
  if (agencyIds && agencyIds.length > 0) {
    parcelsQuery.andWhere(`parcel.agency_id IN (:...agencyIds)`, { agencyIds });
  }
  if (limit) {
    parcelsQuery.take(limit);
  }
  const parcels = await parcelsQuery.getMany();

  const buildingsQuery = await AppDataSource.getRepository(Building)
    .createQueryBuilder('building')
    .leftJoinAndSelect('building.Agency', 'agency')
    .leftJoinAndSelect('building.AdministrativeArea', 'adminArea')
    .leftJoinAndSelect('building.Evaluations', 'evaluations')
    .leftJoinAndSelect('building.Fiscals', 'fiscals')
    .leftJoinAndSelect('building.Classification', 'classification')
    // Match the search criteria
    .where(
      new Brackets((qb) => {
        qb.where(`LPAD(building.pid::text, 9, '0') ILIKE '%${keyword.replaceAll('-', '')}%'`)
          .orWhere(`building.pin::text ILIKE '%${keyword}%'`)
          .orWhere(`agency.name ILIKE '%${keyword}%'`)
          .orWhere(`adminArea.name ILIKE '%${keyword}%'`)
          .orWhere(`building.address1 ILIKE '%${keyword}%'`)
          .orWhere(`building.name ILIKE '%${keyword}%'`);
      }),
    )
    // Only include surplus properties
    .andWhere(`classification.Name in ('Surplus Encumbered', 'Surplus Active')`)
    // Exclude if already is a project property in a project that's in a disallowed status
    .andWhere(`building.id NOT IN(:...excludedBuildingIds)`, { excludedBuildingIds });

  if (agencyIds && agencyIds.length > 0) {
    buildingsQuery.andWhere(`building.agency_id IN (:...agencyIds)`, { agencyIds });
  }
  if (limit) {
    buildingsQuery.take(limit);
  }
  const buildings = await buildingsQuery.getMany();
  return {
    Parcels: parcels,
    Buildings: buildings,
  };
};
/**
 * Finds associated projects based on the provided building ID or parcel ID.
 *
 * This function queries the `ProjectProperty` repository to find projects linked
 * to either a building or a parcel. It returns an empty array if neither ID is provided.
 *
 * @param buildingId - Optional ID of the building to find associated projects for.
 * @param parcelId - Optional ID of the parcel to find associated projects for.
 * @returns A promise that resolves to an array of `ProjectProperty` objects.
 *          If neither `buildingId` nor `parcelId` is provided, an empty array is returned.
 */
const findLinkedProjectsForProperty = async (buildingId?: number, parcelId?: number) => {
  const whereCondition = buildingId
    ? { BuildingId: buildingId }
    : parcelId
      ? { ParcelId: parcelId }
      : {}; // Return an empty condition if neither ID is provided

  const query = AppDataSource.getRepository(ProjectProperty)
    .createQueryBuilder('pp')
    .leftJoinAndSelect('pp.Project', 'p')
    .leftJoinAndSelect('p.Status', 'ps')
    .where(whereCondition)
    .select(['p.*', 'ps.Name AS status_name']);

  const associatedProjects = buildingId || parcelId ? await query.getRawMany() : []; // Return an empty array if no ID is provided

  return associatedProjects.map((result) => ({
    ProjectNumber: result.project_number,
    Id: result.id,
    StatusName: result.status_name,
    Description: result.description,
  }));
};

/**
 * Retrieves properties based on the provided filter criteria to render map markers.
 * @param filter - An optional object containing filter criteria for properties.
 * @returns A promise that resolves to an array of properties matching the filter criteria.
 */
const getPropertiesForMap = async (filter?: MapFilter) => {
  const properties = await AppDataSource.getRepository(MapProperties).find({
    // Select only the properties needed to render map markers and sidebar
    select: {
      Id: true,
      Location: {
        x: true,
        y: true,
      },
      PropertyTypeId: true,
      ClassificationId: true,
      Name: true,
      PID: true,
      PIN: true,
      AdministrativeAreaId: true,
      AgencyId: true,
      Address1: true,
    },
    where: {
      ClassificationId: filter.ClassificationIds ? In(filter.ClassificationIds) : undefined,
      AgencyId: filter.AgencyIds ? In(filter.AgencyIds) : undefined,
      AdministrativeAreaId: filter.AdministrativeAreaIds
        ? In(filter.AdministrativeAreaIds)
        : undefined,
      PID: filter.PID,
      PIN: filter.PIN,
      Address1: filter.Address ? ILike(`%${filter.Address}%`) : undefined,
      Name: filter.Name ? ILike(`%${filter.Name}%`) : undefined,
      PropertyTypeId: filter.PropertyTypeIds ? In(filter.PropertyTypeIds) : undefined,
      RegionalDistrictId: filter.RegionalDistrictIds ? In(filter.RegionalDistrictIds) : undefined,
    },
  });
  return properties;
};

const numberOrNull = (value: any) => {
  if (value == '' || value == null) return null;
  return typeof value === 'number' ? value : Number(value.replace?.(/-/g, ''));
};

/**
 * Retrieves the agency based on the provided row data and checks if the user has permission to add properties for that agency.
 * @param row - The row data containing the agency code.
 * @param lookups - Object containing various lookup data including agencies and user agencies.
 * @param roles - Array of roles assigned to the user.
 * @returns The agency if the user has permission, otherwise throws an error.
 * @throws Error if the agency code is not supported or if the user does not have permission to add properties for the agency.
 */
export const getAgencyOrThrowIfMismatched = (
  row: Record<string, any>,
  lookups: Lookups,
  roles: string[],
) => {
  const agencyCode = row.AgencyCode;
  const agency = lookups.agencies.find((a) => a.Code == agencyCode);
  if (!agency) {
    throw new Error(`The agency with code ${agencyCode ?? 'Undefined'} is not supported.`);
  }
  if (roles.includes(Roles.ADMIN) || lookups.userAgencies.includes(agency.Id)) {
    return agency;
  } else {
    throw new Error(`You do not have permission to add properties for agency ${agency.Name}`);
  }
};

/**
 * Get the classification ID for a given row based on the provided classifications.
 * Throws an error if the classification is not found or unsupported.
 * @param {Record<string, any>} row - The row containing the classification information.
 * @param {PropertyClassification[]} classifications - The list of property classifications to search from.
 * @returns {number} The classification ID.
 */
export const getClassificationOrThrow = (
  row: Record<string, any>,
  classifications: PropertyClassification[],
) => {
  let classificationId: number;
  if (row.Classification) {
    classificationId = classifications.find((a) =>
      compareWithoutCase(row.Classification, a.Name),
    )?.Id;
  } else {
    throw new Error(`Unable to classify this parcel.`);
  }
  if (classificationId == null)
    throw new Error(`Classification "${row.Classification}" is not supported.`);
  return classificationId;
};

/**
 * Get the administrative area ID based on the provided row data and the list of administrative areas.
 * @param row - The row data containing the AdministrativeArea field.
 * @param adminAreas - The array of AdministrativeArea objects to search for a match.
 * @returns The ID of the administrative area if found, otherwise throws an error.
 */
export const getAdministrativeAreaOrThrow = (
  row: Record<string, any>,
  adminAreas: AdministrativeArea[],
) => {
  let adminArea: number;
  if (row.AdministrativeArea) {
    adminArea = adminAreas.find((a) => compareWithoutCase(a.Name, row.AdministrativeArea))?.Id;
  }

  if (adminArea == undefined) {
    throw new Error(
      `Could not determine administrative area for ${row.AdministrativeArea ?? 'Undefined'}. Please provide a valid name in column AdministrativeArea.`,
    );
  } else {
    return adminArea;
  }
};

/**
 * Get the ID of the building predominate use based on the provided row data and predominate uses list.
 * @param row - The row data containing the predominate use information.
 * @param predominateUses - The list of available building predominate uses.
 * @returns The ID of the predominate use if found, otherwise throws an error.
 */
export const getBuildingPredominateUseOrThrow = (
  row: Record<string, any>,
  predominateUses: BuildingPredominateUse[],
) => {
  let predominateUse: number;
  if (row.PredominateUse) {
    predominateUse = predominateUses.find((a) =>
      compareWithoutCase(row.PredominateUse, a.Name),
    )?.Id;
  }
  if (predominateUse == undefined) {
    throw new Error(
      `Could not determine predominate use for ${row.PredominateUse ?? 'Undefined'}. Please provide a valid predominate use in column PredominateUse`,
    );
  } else {
    return predominateUse;
  }
};

/**
 * Get the ID of the building construction type based on the provided row data and list of construction types.
 * @param row - The row data containing the construction type information.
 * @param constructionTypes - The list of available building construction types.
 * @returns The ID of the matched building construction type.
 * @throws Error if the construction type cannot be determined from the provided data.
 */
export const getBuildingConstructionTypeOrThrow = (
  row: Record<string, any>,
  constructionTypes: BuildingConstructionType[],
) => {
  let constructionType: number;
  if (row.ConstructionType) {
    constructionType = constructionTypes.find((a) =>
      compareWithoutCase(row.ConstructionType, a.Name),
    )?.Id;
  }
  if (constructionType == undefined) {
    throw new Error(
      `Could not determine construction type for ${row.ConstructionType ?? 'Undefined'}. Please provide a valid construction type in column ConstructionType.`,
    );
  } else {
    return constructionType;
  }
};

const compareWithoutCase = (str1: string, str2: string) => {
  if (str1.localeCompare(str2, 'en', { sensitivity: 'base' }) == 0) return true;
  else return false;
};

export const setNewBool = (newValue: boolean, previousValue: boolean, defaultValue: boolean) => {
  let returnValue = defaultValue;
  if (newValue == true || newValue == false) {
    returnValue = newValue;
  } else if (previousValue == true || previousValue == false) {
    returnValue = previousValue;
  }
  return returnValue;
};

/**
 * Creates an object for upserting a parcel entity with the provided data.
 * @param row - The row data containing the parcel information.
 * @param user - The user performing the upsert operation.
 * @param roles - The roles of the user.
 * @param lookups - The lookup data containing classifications and administrative areas.
 * @param queryRunner - The query runner for database operations.
 * @param existentParcel - The existing parcel entity to update, if any.
 * @returns An object with the necessary data for upserting a parcel entity.
 */
const makeParcelUpsertObject = async (
  row: Record<string, any>,
  user: User,
  roles: string[],
  lookups: Lookups,
  queryRunner: QueryRunner,
  existentParcel: Parcel = null,
) => {
  const currRowEvaluations: Array<Partial<ParcelEvaluation>> = [];
  const currRowFiscals: Array<Partial<ParcelFiscal>> = [];
  if (existentParcel) {
    const evaluations = await queryRunner.manager.find(ParcelEvaluation, {
      where: { ParcelId: existentParcel.Id },
    });
    const fiscals = await queryRunner.manager.find(ParcelFiscal, {
      where: { ParcelId: existentParcel.Id },
    });
    currRowEvaluations.push(...evaluations);
    currRowFiscals.push(...fiscals);
  }
  if (row.Netbook && !currRowFiscals.some((a) => a.FiscalYear == row.FiscalYear)) {
    currRowFiscals.push({
      Value: row.Netbook,
      FiscalKeyId: 0,
      FiscalYear: row.FiscalYear,
      CreatedById: user.Id,
      CreatedOn: new Date(),
    });
  }
  if (row.Assessed && !currRowEvaluations.some((a) => a.Year == row.EvaluationYear)) {
    currRowEvaluations.push({
      Value: row.Assessed,
      EvaluationKeyId: 0,
      Year: row.AssessedYear,
      CreatedById: user.Id,
      CreatedOn: new Date(),
    });
  }
  const classificationId: number = getClassificationOrThrow(row, lookups.classifications);
  const adminAreaId: number = getAdministrativeAreaOrThrow(row, lookups.adminAreas);
  const pin = numberOrNull(row.PIN) ?? existentParcel?.PIN;
  const description = row.Description ?? (existentParcel ? existentParcel.Description : '');
  const isSensitive = setNewBool(row.IsSensitive, existentParcel?.IsSensitive, false);
  const isVisibleToOtherAgencies = setNewBool(
    row.IsVisibleToOtherAgencies,
    existentParcel?.IsVisibleToOtherAgencies,
    false,
  );
  return {
    Id: existentParcel?.Id,
    AgencyId: getAgencyOrThrowIfMismatched(row, lookups, roles).Id,
    PID: numberOrNull(row.PID),
    PIN: pin,
    ClassificationId: classificationId,
    CreatedById: existentParcel ? existentParcel.CreatedById : user.Id,
    UpdatedById: existentParcel ? user.Id : undefined,
    UpdatedOn: existentParcel ? new Date() : undefined,
    CreatedOn: existentParcel ? existentParcel.CreatedOn : new Date(),
    Location: {
      x: row.Longitude,
      y: row.Latitude,
    },
    Address1: row.Address ?? existentParcel?.Address1 ?? null,
    AdministrativeAreaId: adminAreaId,
    IsSensitive: isSensitive,
    IsVisibleToOtherAgencies: isVisibleToOtherAgencies,
    PropertyTypeId: 0,
    Description: description,
    LandArea: numberOrNull(row.LandArea) ?? existentParcel ? existentParcel.LandArea : null,
    Evaluations: currRowEvaluations,
    Fiscals: currRowFiscals,
  };
};

/**
 * Creates an object for upserting a building entity with the provided data.
 * @param row - The row data containing the building information.
 * @param user - The user performing the upsert operation.
 * @param roles - The roles of the user.
 * @param lookups - The lookup data containing classifications and administrative areas.
 * @param queryRunner - The query runner for database operations.
 * @param existentBuilding - The existing building entity to update, if any.
 * @returns An object with the necessary data for upserting a parcel building.
 */
const makeBuildingUpsertObject = async (
  row: Record<string, any>,
  user: User,
  roles: string[],
  lookups: Lookups,
  queryRunner: QueryRunner,
  existentBuilding: Building = null,
) => {
  const currRowEvaluations: Array<Partial<BuildingEvaluation>> = [];
  const currRowFiscals: Array<Partial<BuildingFiscal>> = [];
  if (existentBuilding) {
    const evaluations = await queryRunner.manager.find(BuildingEvaluation, {
      where: { BuildingId: existentBuilding.Id },
    });
    const fiscals = await queryRunner.manager.find(BuildingFiscal, {
      where: { BuildingId: existentBuilding.Id },
    });
    currRowEvaluations.push(...evaluations);
    currRowFiscals.push(...fiscals);
  }

  if (row.Netbook && !currRowFiscals.some((a) => a.FiscalYear == row.FiscalYear)) {
    currRowFiscals.push({
      Value: row.Netbook,
      FiscalKeyId: 0,
      FiscalYear: row.FiscalYear,
      CreatedById: user.Id,
      CreatedOn: new Date(),
    });
  }
  if (row.Assessed && !currRowEvaluations.some((a) => a.Year == row.EvaluationYear)) {
    currRowEvaluations.push({
      Value: row.Assessed,
      EvaluationKeyId: 0,
      Year: row.AssessedYear,
      CreatedById: user.Id,
      CreatedOn: new Date(),
    });
  }

  const classificationId = getClassificationOrThrow(row, lookups.classifications);
  const constructionTypeId = getBuildingConstructionTypeOrThrow(row, lookups.constructionTypes);
  const predominateUseId = getBuildingPredominateUseOrThrow(row, lookups.predominateUses);
  const adminAreaId = getAdministrativeAreaOrThrow(row, lookups.adminAreas);

  const description = row.Description ?? (existentBuilding ? existentBuilding.Description : '');
  const rentableArea = row.NetUsableArea ?? (existentBuilding ? existentBuilding.RentableArea : 0);
  const isSensitive = setNewBool(row.IsSensitive, existentBuilding?.IsSensitive, false);
  const isVisibleToOtherAgencies = setNewBool(
    row.IsVisibleToOtherAgencies,
    existentBuilding?.IsVisibleToOtherAgencies,
    false,
  );
  const buildingFloorCount =
    row.BuildingFloorCount ?? (existentBuilding ? existentBuilding.BuildingFloorCount : 0);
  const tenancy = row.BuildingTenancy ?? (existentBuilding ? existentBuilding.BuildingTenancy : '');
  const totalArea = row.TotalArea ?? (existentBuilding ? existentBuilding.TotalArea : 0);

  return {
    Id: existentBuilding?.Id,
    PID: numberOrNull(row.PID),
    PIN: numberOrNull(row.PIN) ?? existentBuilding?.PIN ?? null,
    AgencyId: getAgencyOrThrowIfMismatched(row, lookups, roles).Id,
    ClassificationId: classificationId,
    BuildingConstructionTypeId: constructionTypeId,
    BuildingPredominateUseId: predominateUseId,
    CreatedById: existentBuilding ? existentBuilding.CreatedById : user.Id,
    UpdatedById: existentBuilding ? user.Id : undefined,
    UpdatedOn: existentBuilding ? new Date() : undefined,
    CreatedOn: existentBuilding ? existentBuilding.CreatedOn : new Date(),
    Location: {
      x: row.Longitude,
      y: row.Latitude,
    },
    AdministrativeAreaId: adminAreaId,
    IsSensitive: isSensitive,
    Description: description,
    Address1: row.Address ?? existentBuilding?.Address1 ?? null,
    IsVisibleToOtherAgencies: isVisibleToOtherAgencies,
    PropertyTypeId: 1,
    RentableArea: rentableArea,
    BuildingTenancy: tenancy,
    BuildingFloorCount: buildingFloorCount,
    TotalArea: totalArea,
    Evaluations: currRowEvaluations,
    Fiscals: currRowFiscals,
  };
};

export type Lookups = {
  classifications: PropertyClassification[];
  constructionTypes: BuildingConstructionType[];
  predominateUses: BuildingPredominateUse[];
  agencies: Agency[];
  adminAreas: AdministrativeArea[];
  userAgencies: number[];
};

export type BulkUploadRowResult = {
  rowNumber: number;
  action: 'inserted' | 'updated' | 'ignored' | 'error';
  reason?: string;
};

export const checkForHeaders = (sheetObj: Record<string, any>[], columnArray: any) => {
  const requiredHeaders = [
    'PropertyType',
    'PID',
    'Classification',
    'AgencyCode',
    'AdministrativeArea',
    'Latitude',
    'Longitude',
  ];
  for (let rowNum = 0; rowNum < sheetObj.length; rowNum++) {
    const row = sheetObj[rowNum];
    if (row.PropertyType == 'Building') {
      requiredHeaders.push('Name', 'PredominateUse', 'ConstructionType');
      break;
    }
  }
  for (let rowNum = 0; rowNum < requiredHeaders.length; rowNum++) {
    if (!columnArray.includes(requiredHeaders[rowNum])) {
      throw new ErrorWithCode(`Missing required header: ${requiredHeaders[rowNum]}`, 400);
    }
  }
};

export interface ImportRow {
  // Required
  PropertyType: 'Land' | 'Building';
  PID: number;
  Classification: string;
  AgencyCode: string;
  AdministrativeArea: string;
  Latitude: number;
  Longitude: number;
  // Required for Buildings
  ConstructionType?: string;
  PredominateUse?: string;
  Name?: string;
  // Optional
  Description?: string;
  Address?: string;
  PIN?: number;
  Assessed?: number;
  Netbook?: number;
  FiscalYear?: number;
  AssessedYear?: number;
  IsSensitive?: boolean;
  IsVisibleToOtherAgencies?: boolean; // TODO: Removed in other PR.
  LandArea?: number;
  BuildingTenancy?: number;
  NetUsableArea?: number;
  BuildingFloorCount?: number;
  TotalArea?: number;
  // Not displayed in UI
  LocalId?: string;
}

/**
 * Imports properties data from a worksheet as JSON format, processes each row to upsert parcels or buildings,
 * and returns an array of BulkUploadRowResult indicating the actions taken for each row.
 * @param worksheet The worksheet containing the properties data.
 * @param user The user performing the import.
 * @param roles The roles of the user.
 * @param resultId The ID of the import result.
 * @returns An array of BulkUploadRowResult indicating the actions taken for each row.
 */
const importPropertiesAsJSON = async (
  worksheet: WorkSheet,
  user: User,
  roles: string[],
  resultId: number,
) => {
  const columnsArray = xlsx.utils.sheet_to_json(worksheet, { header: 1 })[0];
  const sheetObj: ImportRow[] = xlsx.utils.sheet_to_json(worksheet);

  checkForHeaders(sheetObj, columnsArray);

  const classifications = await AppDataSource.getRepository(PropertyClassification).find({
    select: { Name: true, Id: true },
  });
  const constructionTypes = await AppDataSource.getRepository(BuildingConstructionType).find({
    select: { Name: true, Id: true },
  });
  const predominateUses = await AppDataSource.getRepository(BuildingPredominateUse).find({
    select: { Name: true, Id: true },
  });
  const agencies = await AppDataSource.getRepository(Agency).find({
    select: { Name: true, Id: true, Code: true },
  });
  const adminAreas = await AppDataSource.getRepository(AdministrativeArea).find({
    select: { Name: true, Id: true },
  });
  const userAgencies = await userServices.getAgencies(user.Username);
  const lookups: Lookups = {
    classifications,
    constructionTypes,
    predominateUses,
    agencies,
    adminAreas,
    userAgencies,
  };
  const results: Array<BulkUploadRowResult> = [];
  const queryRunner = AppDataSource.createQueryRunner();
  try {
    for (let rowNum = 0; rowNum < sheetObj.length; rowNum++) {
      const row = sheetObj[rowNum];
      if (row.PropertyType === 'Land') {
        const existentParcel = await queryRunner.manager.findOne(Parcel, {
          where: { PID: numberOrNull(row.PID) },
        });
        try {
          const parcelToUpsert = await makeParcelUpsertObject(
            row,
            user,
            roles,
            lookups,
            queryRunner,
            existentParcel,
          );
          await queryRunner.manager.save(Parcel, parcelToUpsert);
          results.push({ action: existentParcel ? 'updated' : 'inserted', rowNumber: rowNum });
        } catch (e) {
          results.push({ action: 'error', reason: e.message, rowNumber: rowNum });
        }
      } else if (row.PropertyType === 'Building') {
        const foundBuildings = await queryRunner.manager.findAndCount(Building, {
          where: { PID: numberOrNull(row.PID), Name: row.Name },
        });
        const count = foundBuildings[1];
        if (count > 1) {
          results.push({
            action: 'error',
            reason: 'Multiple buildings match PID, Name combo.',
            rowNumber: rowNum,
          });
        } else {
          const existentBuilding = foundBuildings[0][0];
          try {
            const buildingForUpsert = await makeBuildingUpsertObject(
              row,
              user,
              roles,
              lookups,
              queryRunner,
              existentBuilding,
            );
            //queuedBuildings.push(buildingForUpsert);
            await queryRunner.manager.save(Building, buildingForUpsert);
            results.push({ action: existentBuilding ? 'updated' : 'inserted', rowNumber: rowNum });
          } catch (e) {
            results.push({ action: 'error', reason: e.message, rowNumber: rowNum });
          }
        }
      } else {
        results.push({
          action: 'ignored',
          reason: 'Must specify PropertyType of Building or Land for this row.',
          rowNumber: rowNum,
        });
      }
      if (rowNum % 100 == 0) {
        await queryRunner.manager.save(ImportResult, {
          Id: resultId,
          CompletionPercentage: rowNum / sheetObj.length,
        });
      }
    }
  } catch (e) {
    logger.warn(e.message);
    logger.warn(e.stack);
  } finally {
    await queryRunner.release();
  }

  return results;
};

/**
 * Retrieves import results based on the provided filter and user.
 * @param filter - The filter to apply to the import results.
 * @param ssoUser - The SSO user requesting the import results.
 * @returns A promise that resolves to the import results matching the filter criteria.
 */
const getImportResults = async (filter: ImportResultFilter, ssoUser: SSOUser) => {
  const user = await userServices.getUser(ssoUser.preferred_username);
  return AppDataSource.getRepository(ImportResult).find({
    where: {
      CreatedById: user.Id,
    },
    order: { [filter.sortKey]: filter.sortOrder },
    skip: (filter.page ?? 0) * (filter.quantity ?? 0),
    take: filter.quantity,
  });
};

/**
 * Converts entity names to column names.
 * Needed because the sort key in query builder uses the column name, not the entity name.
 */
const sortKeyTranslator: Record<string, string> = {
  Agency: 'agency_name',
  PID: 'pid',
  PIN: 'pin',
  Address: 'address1',
  UpdatedOn: 'updated_on',
  Classification: 'property_classification_name',
  LandArea: 'land_area',
  AdministrativeArea: 'administrative_area_name',
  PropertyType: 'property_type',
};

/**
 * Collects and constructs find options based on the provided PropertyUnionFilter.
 * @param filter - The filter containing criteria for constructing find options.
 * @returns An array of constructed find options based on the provided filter.
 */
const collectFindOptions = (filter: PropertyUnionFilter) => {
  const options = [];
  if (filter.agency)
    options.push(constructFindOptionFromQuerySingleSelect('Agency', filter.agency));
  if (filter.pid) options.push(constructFindOptionFromQueryPid('PID', filter.pid));
  if (filter.pin) options.push(constructFindOptionFromQueryPid('PIN', filter.pin));
  if (filter.address) options.push(constructFindOptionFromQuery('Address', filter.address));
  if (filter.updatedOn) options.push(constructFindOptionFromQuery('UpdatedOn', filter.updatedOn));
  if (filter.classification)
    options.push(constructFindOptionFromQuerySingleSelect('Classification', filter.classification));
  if (filter.landArea) options.push(constructFindOptionFromQuery('LandArea', filter.landArea));
  if (filter.administrativeArea)
    options.push(
      constructFindOptionFromQuerySingleSelect('AdministrativeArea', filter.administrativeArea),
    );
  if (filter.propertyType)
    options.push(constructFindOptionFromQuerySingleSelect('PropertyType', filter.propertyType));
  return options;
};

/**
 * Retrieves properties based on the provided filter criteria, including agency restrictions and quick filters.
 * @param filter - The filter criteria to apply when retrieving properties.
 * @returns An object containing the retrieved data and the total count of properties.
 */
const getPropertiesUnion = async (filter: PropertyUnionFilter) => {
  const options = collectFindOptions(filter);
  const query = AppDataSource.getRepository(PropertyUnion)
    .createQueryBuilder()
    .where(
      new Brackets((qb) => {
        options.forEach((option) => qb.orWhere(option));
      }),
    );

  // Restricts based on user's agencies
  if (filter.agencyIds?.length) {
    query.andWhere('agency_id IN(:...list)', {
      list: filter.agencyIds,
    });
  }

  // Add quickfilter part
  if (filter.quickFilter) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const quickFilterOptions: FindOptionsWhere<any>[] = [];
    const quickfilterFields = [
      'Agency',
      'PID',
      'PIN',
      'Address',
      'UpdatedOn',
      'Classification',
      'LandArea',
      'AdministrativeArea',
      'PropertyType',
    ];
    quickfilterFields.forEach((field) => {
      if (field === 'PID') {
        return quickFilterOptions.push(constructFindOptionFromQueryPid(field, filter.quickFilter));
      } else {
        return quickFilterOptions.push(constructFindOptionFromQuery(field, filter.quickFilter));
      }
    });
    query.andWhere(
      new Brackets((qb) => {
        quickFilterOptions.forEach((option) => qb.orWhere(option));
      }),
    );
  }

  if (filter.quantity) query.take(filter.quantity);
  if (filter.page && filter.quantity) query.skip((filter.page ?? 0) * (filter.quantity ?? 0));
  if (filter.sortKey && filter.sortOrder) {
    if (sortKeyTranslator[filter.sortKey]) {
      query.orderBy(
        sortKeyTranslator[filter.sortKey],
        filter.sortOrder.toUpperCase() as SortOrders,
        'NULLS LAST',
      );
    } else {
      logger.error('PropertyUnion Service - Invalid Sort Key');
    }
  }
  const [data, totalCount] = await query.getManyAndCount();
  return { data, totalCount };
};

/**
 * Retrieves properties for export based on the provided filter.
 * Filters the properties by type (LAND, BUILDING, SUBDIVISION) and fetches additional details for each property.
 * Returns an array of Parcel and Building entities.
 * @param filter - The filter criteria to apply when retrieving properties.
 * @returns An array of Parcel and Building entities for export.
 */
const getPropertiesForExport = async (filter: PropertyUnionFilter) => {
  const result = await getPropertiesUnion(filter);
  const filteredProperties = result.data;
  const parcelIds = filteredProperties
    .filter(
      (p) =>
        p.PropertyTypeId === PropertyType.LAND || p.PropertyTypeId === PropertyType.SUBDIVISION,
    )
    .map((p) => p.Id);
  const buildingIds = filteredProperties
    .filter((p) => p.PropertyTypeId === PropertyType.BUILDING)
    .map((b) => b.Id);

  /**
   * For some reason, getting the data in multiple calls and filtering here is faster than letting TypeORM do it.
   *
   * Getting evals, fiscals, and filtering separately: 850-1050ms
   * Getting as as part of joins, WHERE clause with TypeORM: 1587-1672ms
   */

  const ongoingFinds = [];
  ongoingFinds.push(AppDataSource.getRepository(Parcel).find());
  ongoingFinds.push(AppDataSource.getRepository(Building).find());
  // Order these to guarantee the find operation later gets the most recent one.
  ongoingFinds.push(
    AppDataSource.getRepository(ParcelEvaluation).find({ order: { Year: 'DESC' } }),
  );
  ongoingFinds.push(
    AppDataSource.getRepository(ParcelFiscal).find({ order: { FiscalYear: 'DESC' } }),
  );
  ongoingFinds.push(
    AppDataSource.getRepository(BuildingEvaluation).find({ order: { Year: 'DESC' } }),
  );
  ongoingFinds.push(
    AppDataSource.getRepository(BuildingFiscal).find({ order: { FiscalYear: 'DESC' } }),
  );

  // Wait for all database requests to resolve, then build the parcels and buildings lists
  // Use IDs from filtered properties above to filter lists
  const resolvedFinds = await Promise.all(ongoingFinds);
  const parcelEvaluations = resolvedFinds.at(2) as ParcelEvaluation[];
  const parcelFiscals = resolvedFinds.at(3) as ParcelFiscal[];
  const buildingEvaluations = resolvedFinds.at(4) as BuildingEvaluation[];
  const buildingFiscals = resolvedFinds.at(5) as BuildingFiscal[];
  const parcels: Parcel[] = (resolvedFinds.at(0) as Parcel[])
    .filter((p: Parcel) => parcelIds.includes(p.Id))
    .map((p: Parcel) => {
      const evaluation = parcelEvaluations.find((pe) => pe.ParcelId === p.Id);
      const fiscal = parcelFiscals.find((pf) => pf.ParcelId === p.Id);
      return {
        ...p,
        Evaluations: evaluation ? [evaluation] : undefined,
        Fiscals: fiscal ? [fiscal] : undefined,
      };
    });
  const buildings: Building[] = (resolvedFinds.at(1) as Building[])
    .filter((b: Building) => buildingIds.includes(b.Id))
    .map((b: Building) => {
      const evaluation = buildingEvaluations.find((be) => be.BuildingId === b.Id);
      const fiscal = buildingFiscals.find((bf) => bf.BuildingId === b.Id);
      return {
        ...b,
        Evaluations: evaluation ? [evaluation] : undefined,
        Fiscals: fiscal ? [fiscal] : undefined,
      };
    });

  return [...parcels, ...buildings];
};

/**
 * Asynchronously processes a file for property import, initializing a new database connection for the worker thread.
 * Reads the file content, imports properties as JSON, and saves the results to the database.
 * Handles exceptions and ensures database connection cleanup after processing.
 * @param filePath The path to the file to be processed.
 * @param resultRowId The ID of the result row in the database.
 * @param user The user initiating the import.
 * @param roles The roles assigned to the user.
 * @returns A list of bulk upload row results after processing the file.
 */
const processFile = async (filePath: string, resultRowId: number, user: User, roles: string[]) => {
  await AppDataSource.initialize(); //Since this function is going to be called from a new process, requires a new database connection.
  let results: BulkUploadRowResult[] = [];
  try {
    parentPort.postMessage('Database connection for worker thread has been initialized');
    const file = xlsx.readFile(filePath); //It's better to do the read here rather than the parent process because any arguments passed to this function are copied rather than referenced.
    const sheetName = file.SheetNames[0];
    const worksheet = file.Sheets[sheetName];

    results = await propertyServices.importPropertiesAsJSON(worksheet, user, roles, resultRowId);
    await AppDataSource.getRepository(ImportResult).save({
      Id: resultRowId,
      CompletionPercentage: 1.0,
      Results: results,
      UpdatedById: user.Id,
      UpdatedOn: new Date(),
    });
    return results; // Note that this return still works with finally as long as return is not called from finally block.
  } catch (e) {
    parentPort.postMessage('Aborting file upload: ' + e.message);
    parentPort.postMessage('Aborting stack: ' + e.stack);
    await AppDataSource.getRepository(ImportResult).save({
      Id: resultRowId,
      CompletionPercentage: -1.0,
      Results: results,
      UpdatedById: user.Id,
      UpdatedOn: new Date(),
      Message: e.message,
    });
  } finally {
    await AppDataSource.destroy(); //Not sure whether this is necessary but seems like the safe thing to do.
  }
};

const propertyServices = {
  propertiesFuzzySearch,
  getPropertiesForMap,
  importPropertiesAsJSON,
  getPropertiesUnion,
  getImportResults,
  getPropertiesForExport,
  processFile,
  findLinkedProjectsForProperty,
  makeBuildingUpsertObject,
  makeParcelUpsertObject,
};

export default propertyServices;
