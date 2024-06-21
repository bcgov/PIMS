import { AppDataSource } from '@/appDataSource';
import { Building } from '@/typeorm/Entities/Building';
import { Parcel } from '@/typeorm/Entities/Parcel';
import { PropertyClassification } from '@/typeorm/Entities/PropertyClassification';
import { MapProperties } from '@/typeorm/Entities/views/MapPropertiesView';
import logger from '@/utilities/winstonLogger';
import { SSOUser } from '@bcgov/citz-imb-sso-express';
import { EntityTarget, FindOptionsWhere, ILike, In, QueryRunner } from 'typeorm';
import xlsx, { WorkSheet } from 'xlsx';
import userServices from '../users/usersServices';
import parcelServices from '../parcels/parcelServices';
import { ParcelFiscal } from '@/typeorm/Entities/ParcelFiscal';
import { ParcelEvaluation } from '@/typeorm/Entities/ParcelEvaluation';

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

const obtainCellValueAtHeader = (
  worksheet: WorkSheet,
  headerLookup: Record<string, number>,
  header: string,
  row: number,
) => {
  const colNum = headerLookup[header];
  if (colNum === undefined) {
    return undefined;
  }
  const cell = worksheet[xlsx.utils.encode_cell({ r: row, c: colNum })];
  return cell ? cell.v : undefined;
};

// const obtainCellValueFromEntity = async <T>(
//   worksheet: WorkSheet,
//   headerLookup: Record<string, number>,
//   header: string,
//   row: number,
//   entity: EntityTarget<T>,
//   entityKey: keyof T,
//   queryRunner: QueryRunner,
// ) => {
//   const cellValue = obtainCellValueAtHeader(worksheet, headerLookup, header, row);
//   if (!cellValue) {
//     return undefined;
//   }
//   const findOption = { [entityKey]: cellValue } as FindOptionsWhere<T>;
//   const entityValue = await queryRunner.manager.getRepository(entity).findOne({
//     where: findOption,
//   });
//   return entityValue;
// };
const importPropertiesAsJSON = async (worksheet: WorkSheet, user: SSOUser) => {
  const dbUser = await userServices.getUser(user.preferred_username);
  const sheetObj: Record<string, any>[] = xlsx.utils.sheet_to_json(worksheet);
  const classifications = await AppDataSource.getRepository(PropertyClassification).find({
    select: { Name: true, Id: true },
  });
  const results = { inserted: 0, updated: 0, failed: 0, ignored: 0 };
  const insertionPromises = [];
  let queuedParcels = [];
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
          where: { PID: Number(row.PID.replace?.(/-/g, '')) },
        });
        existentParcel ? results.updated++ : results.inserted++;
        const fiscals: Array<Partial<ParcelFiscal>> = [];
        const evaluations: Array<Partial<ParcelEvaluation>> = [];
        if (row.NetBook && !existentParcel?.Fiscals.some((a) => a.FiscalYear == row.FiscalYear)) {
          fiscals.push({
            Value: row.NetBook,
            FiscalKeyId: 0,
            FiscalYear: row.FiscalYear,
            CreatedById: dbUser.Id,
            CreatedOn: new Date(),
          });
        }
        if (
          row.Assessed &&
          !existentParcel?.Evaluations.some((a) => a.Year == row.EvaluationYear)
        ) {
          evaluations.push({
            Value: row.Assessed,
            EvaluationKeyId: 0,
            Year: row.FiscalYear, //Change to EvaluationYear later.
            CreatedById: dbUser.Id,
            CreatedOn: new Date(),
          });
        }
        queuedParcels.push({
          Id: existentParcel?.Id,
          PID: row.PID.replace?.(/-/g, ''),
          PIN: row.PIN?.replace?.(/-/g, ''),
          ClassificationId: classificationId,
          Name: row.Name,
          CreatedById: dbUser.Id,
          CreatedOn: new Date(),
          Location: {
            x: row.Longitude,
            y: row.Latitude,
          },
          AdministrativeAreaId: 6,
          IsSensitive: false,
          IsVisibleToOtherAgencies: true,
          PropertyTypeId: 0,
          Fiscals: fiscals,
          Evaluations: evaluations,
        });
      }
      if (rowNum % 100) {
        insertionPromises.push(queryRunner.manager.save(Parcel, queuedParcels));
        queuedParcels = [];
      }
    }
    if (queuedParcels.length) {
      insertionPromises.push(queryRunner.manager.save(Parcel, queuedParcels));
    }
    await Promise.all(insertionPromises);
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

const importProperties = async (worksheet: WorkSheet, user: SSOUser) => {
  let rowNum: number;
  //let colNum: number;
  const dbUser = await userServices.getUser(user.preferred_username);
  const range = xlsx.utils.decode_range(worksheet['!ref']);
  const classifications = await AppDataSource.getRepository(PropertyClassification).find({
    select: { Name: true, Id: true },
  });
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.startTransaction();
  try {
    const headers: Record<string, number> = {};
    for (let headerCol = range.s.c; headerCol <= range.e.c; headerCol++) {
      const headerName = worksheet[xlsx.utils.encode_cell({ r: range.s.r, c: headerCol })];
      headers[headerName.v] = headerCol;
    }
    let queuedParcels = [];
    for (rowNum = range.s.r + 1; rowNum <= range.e.r; rowNum++) {
      const propertyType = obtainCellValueAtHeader(worksheet, headers, 'PropertyType', rowNum);
      if (!propertyType) {
        continue;
      }
      if (propertyType === 'Land') {
        const classificationId = classifications.find(
          (a) => a.Name === obtainCellValueAtHeader(worksheet, headers, 'Classification', rowNum),
        )?.Id;
        const parcel = {
          PID: obtainCellValueAtHeader(worksheet, headers, 'PID', rowNum)?.replace?.(/-/g, ''),
          PIN: obtainCellValueAtHeader(worksheet, headers, 'PIN', rowNum)?.replace?.(/-/g, ''),
          ClassificationId: classificationId,
          Name: obtainCellValueAtHeader(worksheet, headers, 'Name', rowNum),
          CreatedById: dbUser.Id,
          CreatedOn: new Date(),
          Location: {
            x: obtainCellValueAtHeader(worksheet, headers, 'Longitude', rowNum),
            y: obtainCellValueAtHeader(worksheet, headers, 'Latitude', rowNum),
          },
          AdministrativeAreaId: 6,
          IsSensitive: false,
          IsVisibleToOtherAgencies: true,
          PropertyTypeId: 0,
        };
        queuedParcels.push(parcel);
        if (rowNum % 50) {
          await queryRunner.manager.save(Parcel, queuedParcels);
          queuedParcels = [];
        }
      }
    }

    if (queuedParcels.length) {
      await queryRunner.manager.save(Parcel, queuedParcels);
    }
  } catch (e) {
    logger.error(e.message);
    logger.error(e.stack);
  } finally {
    await queryRunner.rollbackTransaction();
    await queryRunner.release();
  }
};

const propertyServices = {
  propertiesFuzzySearch,
  getPropertiesForMap,
  importProperties,
  importPropertiesAsJSON,
};

export default propertyServices;
