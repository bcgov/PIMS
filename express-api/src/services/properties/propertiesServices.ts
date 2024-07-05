import { AppDataSource } from '@/appDataSource';
import { SortOrders } from '@/constants/types';
import { MapFilter, PropertyUnionFilter } from '@/controllers/properties/propertiesSchema';
import { Building } from '@/typeorm/Entities/Building';
import { Parcel } from '@/typeorm/Entities/Parcel';
import { MapProperties } from '@/typeorm/Entities/views/MapPropertiesView';
import { PropertyUnion } from '@/typeorm/Entities/views/PropertyUnionView';
import {
  constructFindOptionFromQuery,
  constructFindOptionFromQueryPid,
} from '@/utilities/helperFunctions';
import logger from '@/utilities/winstonLogger';
<<<<<<< HEAD
import {
  Brackets,
  FindOptionsOrder,
  FindOptionsOrderValue,
  FindOptionsWhere,
  ILike,
  In,
} from 'typeorm';
=======
import { Brackets, FindOptionsOrder, FindOptionsOrderValue, ILike, In } from 'typeorm';
>>>>>>> main

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

export const sortKeyMapping = (
  sortKey: string,
  sortDirection: FindOptionsOrderValue,
): FindOptionsOrder<PropertyUnion> => {
  return { [sortKey]: sortDirection };
};

<<<<<<< HEAD
// No joins, so database column names are used for sort
=======
type SortOrders = 'ASC' | 'DESC';

>>>>>>> main
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
    // TODO: Make this more concise
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const quickFilterOptions: FindOptionsWhere<any>[] = [];
    quickFilterOptions.push(constructFindOptionFromQuery('Agency', filter.quickFilter));
    quickFilterOptions.push(constructFindOptionFromQuery('PID', filter.quickFilter)); // Cannot use PID constructor, always true with strings
    quickFilterOptions.push(constructFindOptionFromQuery('PIN', filter.quickFilter));
    quickFilterOptions.push(constructFindOptionFromQuery('Address', filter.quickFilter));
    quickFilterOptions.push(constructFindOptionFromQuery('UpdatedOn', filter.quickFilter));
    quickFilterOptions.push(constructFindOptionFromQuery('Classification', filter.quickFilter));
    quickFilterOptions.push(constructFindOptionFromQuery('LandArea', filter.quickFilter));
    quickFilterOptions.push(constructFindOptionFromQuery('AdministrativeArea', filter.quickFilter));
    quickFilterOptions.push(constructFindOptionFromQuery('PropertyType', filter.quickFilter));
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
  getPropertiesUnion,
};

export default propertyServices;
