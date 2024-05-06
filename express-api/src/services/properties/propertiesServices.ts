import { AppDataSource } from '@/appDataSource';
import { Building } from '@/typeorm/Entities/Building';
import { Parcel } from '@/typeorm/Entities/Parcel';
import { MapProperties } from '@/typeorm/Entities/views/MapPropertiesView';

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

const getPropertiesForMap = async () => {
  // TODO: Use where to add search parameters
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
  });
  return properties;
};

const propertyServices = {
  propertiesFuzzySearch,
  getPropertiesForMap,
};

export default propertyServices;
