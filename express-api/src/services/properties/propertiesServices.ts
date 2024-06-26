/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppDataSource } from '@/appDataSource';
import { Building } from '@/typeorm/Entities/Building';
import { Parcel } from '@/typeorm/Entities/Parcel';
import { PropertyClassification } from '@/typeorm/Entities/PropertyClassification';
import { MapProperties } from '@/typeorm/Entities/views/MapPropertiesView';
import logger from '@/utilities/winstonLogger';
import { ILike, In } from 'typeorm';
import xlsx, { WorkSheet } from 'xlsx';
import { ParcelFiscal } from '@/typeorm/Entities/ParcelFiscal';
import { ParcelEvaluation } from '@/typeorm/Entities/ParcelEvaluation';
import { BuildingEvaluation } from '@/typeorm/Entities/BuildingEvaluation';
import { BuildingFiscal } from '@/typeorm/Entities/BuildingFiscal';
import { BuildingConstructionType } from '@/typeorm/Entities/BuildingConstructionType';
import { BuildingPredominateUse } from '@/typeorm/Entities/BuildingPredominateUse';
import { UUID } from 'crypto';

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
const importPropertiesAsJSON = async (worksheet: WorkSheet, userId: UUID) => {
  const sheetObj: Record<string, any>[] = xlsx.utils.sheet_to_json(worksheet);
  const classifications = await AppDataSource.getRepository(PropertyClassification).find({
    select: { Name: true, Id: true },
  });
  const constructionTypes = await AppDataSource.getRepository(BuildingConstructionType).find({
    select: { Name: true, Id: true },
  });
  const buildingPredominate = await AppDataSource.getRepository(BuildingPredominateUse).find({
    select: { Name: true, Id: true },
  });
  const results = { inserted: 0, updated: 0, failed: 0, ignored: 0 };
  let queuedParcels = [];
  let queuedBuildings = [];
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.startTransaction();
  try {
    for (let rowNum = 0; rowNum < sheetObj.length; rowNum++) {
      const row = sheetObj[rowNum];
      if (row.PropertyType === undefined) {
        results.ignored++;
      }

      if (row.PropertyType === 'Land') {
        const classificationId = classifications.find((a) => a.Name === row.Classification)?.Id;
        const existentParcel = await queryRunner.manager.findOne(Parcel, {
          where: { PID: numberOrNull(row.PID) },
        });
        if (existentParcel) {
          const evaluations = await queryRunner.manager.find(ParcelEvaluation, {
            where: { ParcelId: existentParcel.Id },
          });
          const fiscals = await queryRunner.manager.find(ParcelFiscal, {
            where: { ParcelId: existentParcel.Id },
          });
          existentParcel.Evaluations = evaluations;
          existentParcel.Fiscals = fiscals;
        }

        existentParcel ? results.updated++ : results.inserted++;
        const currRowEvaluations: Array<Partial<ParcelEvaluation>> = [];
        const currRowFiscals: Array<Partial<ParcelFiscal>> = [];
        if (row.NetBook && !existentParcel?.Fiscals.some((a) => a.FiscalYear == row.FiscalYear)) {
          currRowFiscals.push({
            Value: row.NetBook,
            FiscalKeyId: 0,
            FiscalYear: row.FiscalYear ?? 2024,
            CreatedById: userId,
            CreatedOn: new Date(),
          });
        }
        if (
          row.Assessed &&
          !existentParcel?.Evaluations.some((a) => a.Year == row.EvaluationYear)
        ) {
          currRowEvaluations.push({
            Value: row.Assessed,
            EvaluationKeyId: 0,
            Year: row.AssessedYear ?? 2024, //Change to EvaluationYear later.
            CreatedById: userId,
            CreatedOn: new Date(),
          });
        }
        queuedParcels.push({
          Id: existentParcel?.Id,
          PID: numberOrNull(row.PID),
          PIN: numberOrNull(row.PIN),
          ClassificationId: classificationId,
          Name: row.Name,
          CreatedById: userId,
          CreatedOn: new Date(),
          Location: {
            x: row.Longitude,
            y: row.Latitude,
          },
          AdministrativeAreaId: 6,
          IsSensitive: false,
          IsVisibleToOtherAgencies: true,
          PropertyTypeId: 0,
          Evaluations: currRowEvaluations,
          Fiscals: currRowFiscals,
        });
      } else if (row.PropertyType === 'Building') {
        const generatedName = generateBuildingName(row.Name, row.Description, row.LocalId);
        const classificationId = classifications.find((a) => a.Name === row.Classification)?.Id;
        const existentBuilding = await queryRunner.manager.findOne(Building, {
          where: { PID: numberOrNull(row.PID), Name: generatedName },
        });
        if (existentBuilding) {
          const evaluations = await queryRunner.manager.find(BuildingEvaluation, {
            where: { BuildingId: existentBuilding.Id },
          });
          const fiscals = await queryRunner.manager.find(BuildingFiscal, {
            where: { BuildingId: existentBuilding.Id },
          });
          existentBuilding.Evaluations = evaluations;
          existentBuilding.Fiscals = fiscals;
        }
        existentBuilding ? results.updated++ : results.inserted++;
        const currRowEvaluations: Array<Partial<BuildingEvaluation>> = [];
        const currRowFiscals: Array<Partial<BuildingFiscal>> = [];
        if (row.NetBook && !existentBuilding?.Fiscals.some((a) => a.FiscalYear == row.FiscalYear)) {
          currRowFiscals.push({
            Value: row.NetBook,
            FiscalKeyId: 0,
            FiscalYear: row.FiscalYear,
            CreatedById: userId,
            CreatedOn: new Date(),
          });
        }
        if (
          row.Assessed &&
          !existentBuilding?.Evaluations.some((a) => a.Year == row.EvaluationYear)
        ) {
          currRowEvaluations.push({
            Value: row.Assessed,
            EvaluationKeyId: 0,
            Year: row.AssessedYear, //Change to EvaluationYear later.
            CreatedById: userId,
            CreatedOn: new Date(),
          });
        }
        queuedBuildings.push({
          Id: existentBuilding?.Id,
          PID: numberOrNull(row.PID),
          PIN: numberOrNull(row.PIN),
          ClassificationId: classificationId,
          Name: row.Name,
          CreatedById: userId,
          CreatedOn: new Date(),
          Location: {
            x: row.Longitude,
            y: row.Latitude,
          },
          AdministrativeAreaId: 6,
          IsSensitive: false,
          IsVisibleToOtherAgencies: true,
          PropertyTypeId: 0,
          BuildingPredominateUseId: buildingPredominate[0].Id,
          BuildingConstructionTypeId: constructionTypes[0].Id,
          RentableArea: 0,
          BuildingTenancy: '123',
          BuildingFloorCount: 0,
          TotalArea: 0,
          Evaluations: currRowEvaluations,
          Fiscals: currRowFiscals,
        });
      }
      if (queuedParcels.length >= BATCH_SIZE) {
        await queryRunner.manager.save(Parcel, queuedParcels);
        queuedParcels = [];
      }
      if (queuedBuildings.length >= BATCH_SIZE) {
        await queryRunner.manager.save(Building, queuedBuildings);
        queuedBuildings = [];
      }
    }
    if (queuedParcels.length) {
      await queryRunner.manager.save(Parcel, queuedParcels);
    }
    if (queuedBuildings.length) {
      await queryRunner.manager.save(Building, queuedBuildings);
    }
  } catch (e) {
    logger.warn(e.message);
    logger.warn(e.stack);
    results.failed++;
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
