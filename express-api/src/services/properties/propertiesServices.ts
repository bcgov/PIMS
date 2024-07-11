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
} from '@/utilities/helperFunctions';
import userServices from '../users/usersServices';
import {
  Brackets,
  FindOptionsOrder,
  FindOptionsOrderValue,
  FindOptionsWhere,
  ILike,
  In,
  QueryRunner,
} from 'typeorm';
import { SSOUser } from '@bcgov/citz-imb-sso-express';

const propertiesFuzzySearch = async (keyword: string, limit?: number, agencyIds?: number[]) => {
  const parcelsQuery = await AppDataSource.getRepository(Parcel)
    .createQueryBuilder('parcel')
    .leftJoinAndSelect('parcel.Agency', 'agency')
    .leftJoinAndSelect('parcel.AdministrativeArea', 'adminArea')
    .leftJoinAndSelect('parcel.Evaluations', 'evaluations')
    .leftJoinAndSelect('parcel.Fiscals', 'fiscals')
    .leftJoinAndSelect('parcel.Classification', 'classification')
    .where(
      new Brackets((qb) => {
        qb.where(`LPAD(parcel.pid::text, 9, '0') ILIKE '%${keyword.replaceAll('-', '')}%'`)
          .orWhere(`parcel.pin::text ILIKE '%${keyword}%'`)
          .orWhere(`agency.name ILIKE '%${keyword}%'`)
          .orWhere(`adminArea.name ILIKE '%${keyword}%'`)
          .orWhere(`parcel.address1 ILIKE '%${keyword}%'`);
      }),
    )
    .andWhere(`classification.Name in ('Surplus Encumbered', 'Surplus Active')`);

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
    .where(
      new Brackets((qb) => {
        qb.where(`building.pid::text like :keyword`, { keyword: `%${keyword}%` })
          .orWhere(`building.pin::text like :keyword`, { keyword: `%${keyword}%` })
          .orWhere(`agency.name like :keyword`, { keyword: `%${keyword}%` })
          .orWhere(`adminArea.name like :keyword`, { keyword: `%${keyword}%` })
          .orWhere(`building.address1 like :keyword`, { keyword: `%${keyword}%` });
      }),
    )
    .andWhere(`classification.Name in ('Surplus Encumbered', 'Surplus Active')`);

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

//const BATCH_SIZE = 100;
const generateBuildingName = (name: string, desc: string = null, localId: string = null) => {
  return (
    (localId == null ? '' : localId) +
    (name != null ? name : desc?.substring(0, 150 < desc.length ? 150 : desc.length).trim())
  );
};
const numberOrNull = (value: any) => {
  if (value == '' || value == null) return null;
  return typeof value === 'number' ? value : Number(value.replace?.(/-/g, ''));
};
const getAgencyOrThrowIfMismatched = (
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
const getClassificationOrThrow = (
  row: Record<string, any>,
  classifications: PropertyClassification[],
) => {
  let classificationId: number = null;
  if (compareWithoutCase(String(row.Status), 'Active')) {
    classificationId = classifications.find((a) =>
      compareWithoutCase(row.Classification, a.Name),
    )?.Id;
    if (classificationId == null)
      throw new Error(`Classification "${row.Classification}" is not supported.`);
  } else {
    classificationId = classifications.find((a) => a.Name === 'Disposed')?.Id;
    if (classificationId == null) throw new Error(`Unable to classify this parcel.`);
  }
  return classificationId;
};
const getAdministrativeAreaOrThrow = (
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
const getBuildingPredominateUseOrThrow = (
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
const getBuildingConstructionTypeOrThrow = (
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
// const isEvaluationInDataSourceMoreRecent = (
//   row: Record<string, any>,
//   evaluations: ParcelEvaluation[] | BuildingEvaluation[],
// ) => {
//   return evaluations.some((a) => a.Year > row.AssessedYear);
// };
// const isFiscalInDataSourceMoreRecent = (
//   row: Record<string, any>,
//   fiscals: ParcelFiscal[] | BuildingFiscal[],
// ) => {
//   return fiscals.some((a) => a.FiscalYear > row.FiscalYear);
// };
const compareWithoutCase = (str1: string, str2: string) => {
  if (str1.localeCompare(str2, 'en', { sensitivity: 'base' }) == 0) return true;
  else return false;
};
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

  return {
    Id: existentParcel?.Id,
    AgencyId: getAgencyOrThrowIfMismatched(row, lookups, roles).Id,
    PID: numberOrNull(row.PID),
    PIN: numberOrNull(row.PIN),
    ClassificationId: classificationId,
    Name: row.Name,
    CreatedById: existentParcel ? undefined : user.Id,
    UpdatedById: existentParcel ? user.Id : undefined,
    UpdatedOn: existentParcel ? new Date() : undefined,
    CreatedOn: existentParcel ? undefined : new Date(),
    Location: {
      x: row.Longitude,
      y: row.Latitude,
    },
    Address1: row.Address,
    AdministrativeAreaId: adminAreaId,
    IsSensitive: false,
    IsVisibleToOtherAgencies: true,
    PropertyTypeId: 0,
    Description: row.Description,
    LandLegalDescription: row.LandLegalDescription,
    Evaluations: currRowEvaluations,
    Fiscals: currRowFiscals,
  };
};

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

  return {
    Id: existentBuilding?.Id,
    PID: numberOrNull(row.PID),
    PIN: numberOrNull(row.PIN),
    AgencyId: getAgencyOrThrowIfMismatched(row, lookups, roles).Id,
    ClassificationId: classificationId,
    BuildingConstructionTypeId: constructionTypeId,
    BuildingPredominateUseId: predominateUseId,
    Name: generateBuildingName(row.Name, row.Description, row.LocalId),
    CreatedById: existentBuilding ? undefined : user.Id,
    UpdatedById: existentBuilding ? user.Id : undefined,
    UpdatedOn: existentBuilding ? new Date() : undefined,
    CreatedOn: existentBuilding ? undefined : new Date(),
    Location: {
      x: row.Longitude,
      y: row.Latitude,
    },
    AdministrativeAreaId: adminAreaId,
    IsSensitive: false,
    IsVisibleToOtherAgencies: true,
    PropertyTypeId: 0,
    RentableArea: 0,
    BuildingTenancy: '123',
    BuildingFloorCount: 0,
    TotalArea: 0,
    Evaluations: currRowEvaluations,
    Fiscals: currRowFiscals,
  };
};

type Lookups = {
  classifications: PropertyClassification[];
  constructionTypes: BuildingConstructionType[];
  predominateUses: BuildingPredominateUse[];
  agencies: Agency[];
  adminAreas: AdministrativeArea[];
  userAgencies: number[];
};

type BulkUploadRowResult = {
  rowNumber: number;
  action: 'inserted' | 'updated' | 'ignored' | 'error';
  reason?: string;
};

const importPropertiesAsJSON = async (
  worksheet: WorkSheet,
  user: User,
  roles: string[],
  resultId: number,
) => {
  const sheetObj: Record<string, any>[] = xlsx.utils.sheet_to_json(worksheet);
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
  // let queuedParcels = [];
  // let queuedBuildings = [];
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.startTransaction();
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
          //queuedParcels.push(parcelToUpsert);
          await queryRunner.manager.save(Parcel, parcelToUpsert);
          results.push({ action: existentParcel ? 'updated' : 'inserted', rowNumber: rowNum });
        } catch (e) {
          results.push({ action: 'error', reason: e.message, rowNumber: rowNum });
        }
      } else if (row.PropertyType === 'Building') {
        const generatedName = generateBuildingName(row.Name, row.Description, row.LocalId);
        const existentBuilding = await queryRunner.manager.findOne(Building, {
          where: { PID: numberOrNull(row.PID), Name: generatedName },
        });
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
    await queryRunner.rollbackTransaction(); //NOTE: This rollback provided for testing convenience. Will be removed for final merge.
    await queryRunner.release();
  }

  return results;
};

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

export const sortKeyMapping = (
  sortKey: string,
  sortDirection: FindOptionsOrderValue,
): FindOptionsOrder<PropertyUnion> => {
  return { [sortKey]: sortDirection };
};

// No joins, so database column names are used for sort
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

const collectFindOptions = (filter: PropertyUnionFilter) => {
  const options = [];
  if (filter.agency) options.push(constructFindOptionFromQuery('Agency', filter.agency));
  if (filter.pid) options.push(constructFindOptionFromQueryPid('PID', filter.pid));
  if (filter.pin) options.push(constructFindOptionFromQueryPid('PIN', filter.pin));
  if (filter.address) options.push(constructFindOptionFromQuery('Address', filter.address));
  if (filter.updatedOn) options.push(constructFindOptionFromQuery('UpdatedOn', filter.updatedOn));
  if (filter.classification)
    options.push(constructFindOptionFromQuery('Classification', filter.classification));
  if (filter.landArea) options.push(constructFindOptionFromQuery('LandArea', filter.landArea));
  if (filter.administrativeArea)
    options.push(constructFindOptionFromQuery('AdministrativeArea', filter.administrativeArea));
  if (filter.propertyType)
    options.push(constructFindOptionFromQuery('PropertyType', filter.propertyType));
  return options;
};

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
    quickfilterFields.forEach((field) =>
      quickFilterOptions.push(constructFindOptionFromQuery(field, filter.quickFilter)),
    );
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
  return await query.getMany();
};

const propertyServices = {
  propertiesFuzzySearch,
  getPropertiesForMap,
  importPropertiesAsJSON,
  getPropertiesUnion,
  getImportResults,
};

export default propertyServices;
