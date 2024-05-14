import { AppDataSource } from '@/appDataSource';
import { Building } from '@/typeorm/Entities/Building';
import { Parcel } from '@/typeorm/Entities/Parcel';
import { MapProperties } from '@/typeorm/Entities/views/MapPropertiesView';
import { In, Like } from 'typeorm';

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
}

const getPropertiesForMap = async (filter?: MapPropertiesFilter) => {
  const properties = await AppDataSource.getRepository(MapProperties).find({
    // Select only the properties needed to render map markers
    select: {
      Id: true,
      Location: {
        x: true,
        y: true,
      },
      PropertyTypeId: true,
      ClassificationId: true,
    },
    where: {
      ClassificationId: filter.ClassificationIds ? In(filter.ClassificationIds) : undefined,
      AgencyId: filter.AgencyIds ? In(filter.AgencyIds) : undefined,
      AdministrativeAreaId: filter.AdministrativeAreaIds
        ? In(filter.AdministrativeAreaIds)
        : undefined,
      PID: filter.PID,
      PIN: filter.PIN,
      Address1: filter.Address ? Like(filter.Address) : undefined,
      Name: filter.Name ? Like(filter.Name) : undefined,
      PropertyTypeId: filter.PropertyTypeIds ? In(filter.PropertyTypeIds) : undefined,
    },
  });
  return properties;
};

const propertyServices = {
  propertiesFuzzySearch,
  getPropertiesForMap,
};

export default propertyServices;
