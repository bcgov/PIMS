import { AppDataSource } from '@/appDataSource';
import { MapFilter, PropertyUnionFilter } from '@/controllers/properties/propertiesSchema';
import { Building } from '@/typeorm/Entities/Building';
import { Parcel } from '@/typeorm/Entities/Parcel';
import { MapProperties } from '@/typeorm/Entities/views/MapPropertiesView';
import { PropertyUnion } from '@/typeorm/Entities/views/PropertyUnionView';
import {
  constructFindOptionFromQuery,
  constructFindOptionFromQueryPid,
} from '@/utilities/helperFunctions';
import { Brackets, FindOptionsOrder, FindOptionsOrderValue, ILike, In } from 'typeorm';

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
        qb.where(`parcel.pid::text like '%${keyword}%'`)
          .orWhere(`parcel.pin::text like '%${keyword}%'`)
          .orWhere(`agency.name like '%${keyword}%'`)
          .orWhere(`adminArea.name like '%${keyword}%'`)
          .orWhere(`parcel.address1 like '%${keyword}%'`);
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

const sortKeyMapping = (
  sortKey: string,
  sortDirection: FindOptionsOrderValue,
): FindOptionsOrder<PropertyUnion> => {
  return { [sortKey]: sortDirection };
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
  return AppDataSource.getRepository(PropertyUnion).find({
    where: collectFindOptions(filter),
    take: filter.quantity,
    skip: (filter.page ?? 0) * (filter.quantity ?? 0),
    order: sortKeyMapping(filter.sortKey, filter.sortOrder as FindOptionsOrderValue),
  });
};

const propertyServices = {
  propertiesFuzzySearch,
  getPropertiesForMap,
  getPropertiesUnion,
};

export default propertyServices;
