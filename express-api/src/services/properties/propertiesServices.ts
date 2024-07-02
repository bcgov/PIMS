/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppDataSource } from '@/appDataSource';
import { Building } from '@/typeorm/Entities/Building';
import { Parcel } from '@/typeorm/Entities/Parcel';
import { PropertyClassification } from '@/typeorm/Entities/PropertyClassification';
import { MapProperties } from '@/typeorm/Entities/views/MapPropertiesView';
import logger from '@/utilities/winstonLogger';
import { ILike, In, QueryRunner } from 'typeorm';
import xlsx, { WorkSheet } from 'xlsx';
import { ParcelFiscal } from '@/typeorm/Entities/ParcelFiscal';
import { ParcelEvaluation } from '@/typeorm/Entities/ParcelEvaluation';
import { BuildingEvaluation } from '@/typeorm/Entities/BuildingEvaluation';
import { BuildingFiscal } from '@/typeorm/Entities/BuildingFiscal';
import { BuildingConstructionType } from '@/typeorm/Entities/BuildingConstructionType';
import { BuildingPredominateUse } from '@/typeorm/Entities/BuildingPredominateUse';
import { UUID } from 'crypto';
import { Agency } from '@/typeorm/Entities/Agency';
import { AdministrativeArea } from '@/typeorm/Entities/AdministrativeArea';
import { ImportResult } from '@/typeorm/Entities/ImportResult';

const propertiesFuzzySearch = async (keyword: string, limit?: number) => {
  const parcels = await AppDataSource.getRepository(Parcel)
    .createQueryBuilder('parcel')
    .leftJoinAndSelect('parcel.Agency', 'agency')
    .leftJoinAndSelect('parcel.AdministrativeArea', 'adminArea')
    .leftJoinAndSelect('parcel.Evaluations', 'evaluations')
    .leftJoinAndSelect('parcel.Fiscals', 'fiscals')
    .where(`parcel.pid::text like '%${keyword}%'`)
    .orWhere(`parcel.pin::text like '%${keyword}%'`)
    .orWhere(`agency.name like '%${keyword}%'`)
    .orWhere(`adminArea.name like '%${keyword}%'`)
    .orWhere(`parcel.address1 like '%${keyword}%'`)
    .take(limit)
    .getMany();
  const buildings = await AppDataSource.getRepository(Building)
    .createQueryBuilder('building')
    .leftJoinAndSelect('building.Agency', 'agency')
    .leftJoinAndSelect('building.AdministrativeArea', 'adminArea')
    .leftJoinAndSelect('building.Evaluations', 'evaluations')
    .leftJoinAndSelect('building.Fiscals', 'fiscals')
    .where(`building.pid::text like '%${keyword}%'`)
    .orWhere(`building.pin::text like '%${keyword}%'`)
    .orWhere(`agency.name like '%${keyword}%'`)
    .orWhere(`adminArea.name like '%${keyword}%'`)
    .orWhere(`building.address1 like '%${keyword}%'`)
    .take(limit)
    .getMany();
  return {
    Parcels: parcels,
    Buildings: buildings,
  };
};

export interface MapPropertiesFilter {
  PID?: number;
  PIN?: number;
  Address?: string;
  AgencyIds?: number[];
  AdministrativeAreaIds?: number[];
  ClassificationIds?: number[];
  PropertyTypeIds?: number[];
  Name?: string;
  RegionalDistrictIds?: number[];
}

/**
 * Retrieves properties based on the provided filter criteria to render map markers.
 * @param filter - An optional object containing filter criteria for properties.
 * @returns A promise that resolves to an array of properties matching the filter criteria.
 */
const getPropertiesForMap = async (filter?: MapPropertiesFilter) => {
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

const BATCH_SIZE = 100;
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
const getOrCreateAgency = (row: Record<string, any>, agencies: Agency[]) => {
  const agencyCode = row.AgencyCode;
  const agency = agencies.find((a) => a.Code == agencyCode);
  return agency;
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
  if (row.City) return adminAreas.find((a) => compareWithoutCase(a.Name, row.City))?.Id;
  else if (row.AdministrativeArea)
    return adminAreas.find((a) => compareWithoutCase(a.Name, row.AdministrativeArea))?.Id;
  else {
    throw new Error(
      `Could not determine administrative area for ${row.City ?? row.AdministrativeArea ?? 'Undefined'}. Please provide a valid name in column AdministrativeArea or City.`,
    );
  }
};
const getBuildingPredominateUseOrThrow = (
  row: Record<string, any>,
  predominateUses: BuildingPredominateUse[],
) => {
  if (row.PredominateUse) {
    return predominateUses.find((a) => compareWithoutCase(row.PredominateUse, a.Name))?.Id;
  } else {
    throw new Error(
      `Could not determine predominate use for ${row.PredominateUse ?? 'Undefined'}. Please provide a valid predominate use in column PredominateUse`,
    );
  }
};
const getBuildingConstructionTypeOrThrow = (
  row: Record<string, any>,
  constructionTypes: BuildingConstructionType[],
) => {
  if (row.ConstructionType) {
    return constructionTypes.find((a) => compareWithoutCase(row.ConstructionType, a.Name))?.Id;
  } else {
    throw new Error(
      `Could not determine construction type for ${row.ConstructionType ?? 'Undefined'}. Please provide a valid construction type in column ConstructionType.`,
    );
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
  userId: UUID,
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
  if (row.NetBook && !currRowFiscals.some((a) => a.FiscalYear == row.FiscalYear)) {
    currRowFiscals.push({
      Value: row.NetBook,
      FiscalKeyId: 0,
      FiscalYear: row.FiscalYear,
      CreatedById: userId,
      CreatedOn: new Date(),
    });
  }
  if (row.Assessed && !currRowEvaluations.some((a) => a.Year == row.EvaluationYear)) {
    currRowEvaluations.push({
      Value: row.Assessed,
      EvaluationKeyId: 0,
      Year: row.AssessedYear,
      CreatedById: userId,
      CreatedOn: new Date(),
    });
  }

  const classificationId: number = getClassificationOrThrow(row, lookups.classifications);

  const adminAreaId: number = getAdministrativeAreaOrThrow(row, lookups.adminAreas);

  return {
    Id: existentParcel?.Id,
    AgencyId: getOrCreateAgency(row, lookups.agencies).Id,
    PID: numberOrNull(row.PID),
    PIN: numberOrNull(row.PIN),
    ClassificationId: classificationId,
    Name: row.Name,
    CreatedById: existentParcel ? undefined : userId,
    UpdatedById: existentParcel ? userId : undefined,
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
  userId: UUID,
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

  if (row.NetBook && !currRowFiscals.some((a) => a.FiscalYear == row.FiscalYear)) {
    currRowFiscals.push({
      Value: row.NetBook,
      FiscalKeyId: 0,
      FiscalYear: row.FiscalYear,
      CreatedById: userId,
      CreatedOn: new Date(),
    });
  }
  if (row.Assessed && !currRowEvaluations.some((a) => a.Year == row.EvaluationYear)) {
    currRowEvaluations.push({
      Value: row.Assessed,
      EvaluationKeyId: 0,
      Year: row.AssessedYear,
      CreatedById: userId,
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
    ClassificationId: classificationId,
    BuildingConstructionTypeId: constructionTypeId,
    BuildingPredominateUseId: predominateUseId,
    Name: generateBuildingName(row.Name, row.Description, row.LocalId),
    CreatedById: existentBuilding ? undefined : userId,
    UpdatedById: existentBuilding ? userId : undefined,
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
};

type BulkUploadRowResult = {
  action: 'inserted' | 'updated' | 'ignored' | 'error';
  reason?: string;
};

const importPropertiesAsJSON = async (worksheet: WorkSheet, userId: UUID, resultId: number) => {
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
  const lookups: Lookups = {
    classifications,
    constructionTypes,
    predominateUses,
    agencies,
    adminAreas,
  };
  const results: Array<BulkUploadRowResult> = [];
  let queuedParcels = [];
  let queuedBuildings = [];
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.startTransaction();
  try {
    for (let rowNum = 0; rowNum < sheetObj.length; rowNum++) {
      const row = sheetObj[rowNum];
      if (row.PropertyType === undefined) {
        results.push({ action: 'ignored', reason: 'Must specify PropertyType for this row.' });
        continue;
      }
      if (row.PropertyType === 'Land') {
        const existentParcel = await queryRunner.manager.findOne(Parcel, {
          where: { PID: numberOrNull(row.PID) },
        });
        try {
          const parcelToUpsert = await makeParcelUpsertObject(
            row,
            userId,
            lookups,
            queryRunner,
            existentParcel,
          );
          queuedParcels.push(parcelToUpsert);
          results.push({ action: existentParcel ? 'updated' : 'inserted' });
        } catch (e) {
          results.push({ action: 'error', reason: e.message });
        }
      } else if (row.PropertyType === 'Building') {
        const generatedName = generateBuildingName(row.Name, row.Description, row.LocalId);
        const existentBuilding = await queryRunner.manager.findOne(Building, {
          where: { PID: numberOrNull(row.PID), Name: generatedName },
        });
        try {
          const buildingForUpsert = await makeBuildingUpsertObject(
            row,
            userId,
            lookups,
            queryRunner,
            existentBuilding,
          );
          queuedBuildings.push(buildingForUpsert);
          results.push({ action: existentBuilding ? 'updated' : 'inserted' });
        } catch (e) {
          results.push({ action: 'error', reason: e.message });
        }
      }
      // Little benefit to batching these when mass updating, but appreciable benefits when batching inserts.
      if (queuedParcels.length >= BATCH_SIZE) {
        await queryRunner.manager.save(Parcel, queuedParcels);
        queuedParcels = [];
      }
      if (queuedBuildings.length >= BATCH_SIZE) {
        await queryRunner.manager.save(Building, queuedBuildings);
        queuedBuildings = [];
      }
      if (rowNum % 100) {
        queryRunner.manager.save(ImportResult, {
          Id: resultId,
          CompletionPercentage: rowNum / sheetObj.length,
        });
      }
    }
    //Make sure to flush any remaining entries from the queue before exit.
    if (queuedParcels.length) {
      await queryRunner.manager.save(Parcel, queuedParcels);
    }
    if (queuedBuildings.length) {
      await queryRunner.manager.save(Building, queuedBuildings);
    }
  } catch (e) {
    logger.warn(e.message);
    logger.warn(e.stack);
  } finally {
    await queryRunner.rollbackTransaction();
    await queryRunner.release();
  }

  return results;
};

const propertyServices = {
  propertiesFuzzySearch,
  getPropertiesForMap,
  importPropertiesAsJSON,
};

export default propertyServices;
