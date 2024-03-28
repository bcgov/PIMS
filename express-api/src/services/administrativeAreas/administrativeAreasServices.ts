import { AppDataSource } from '@/appDataSource';
import { AdministrativeArea } from '@/typeorm/Entities/AdministrativeArea';
import { AdministrativeAreaFilter } from './administrativeAreaSchema';
import { FindOptionsOrder } from 'typeorm';

const getAdministrativeAreas = (filter: AdministrativeAreaFilter) => {
  return AppDataSource.getRepository(AdministrativeArea).find({
    relations: {
      RegionalDistrict: true,
    },
    where: {
      Name: filter.name,
      ProvinceId: filter.provinceId,
    },
    take: filter.quantity,
    skip: (filter.quantity ?? 0) * (filter.page ?? 0),
    order: filter.sort as FindOptionsOrder<AdministrativeArea>,
  });
};

const administrativeAreasServices = {
  getAdministrativeAreas,
};

export default administrativeAreasServices;
