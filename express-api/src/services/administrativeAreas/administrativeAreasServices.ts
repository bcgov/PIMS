import { AppDataSource } from '@/appDataSource';
import { AdministrativeArea } from '@/typeorm/Entities/AdministrativeArea';
import { AdministrativeAreaFilter } from './administrativeAreaSchema';
import { FindOptionsOrder } from 'typeorm';
import { ErrorWithCode } from '@/utilities/customErrors/ErrorWithCode';

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

const addAdministrativeArea = (adminArea: AdministrativeArea) => {
  const existing = AppDataSource.getRepository(AdministrativeArea).findOne({
    where: [{ Id: adminArea.Id }, { Name: adminArea.Name }],
  });
  if (existing) {
    throw new ErrorWithCode('Administrative area already exists.');
  }
  return AppDataSource.getRepository(AdministrativeArea).save(adminArea);
};

const administrativeAreasServices = {
  getAdministrativeAreas,
  addAdministrativeArea,
};

export default administrativeAreasServices;
