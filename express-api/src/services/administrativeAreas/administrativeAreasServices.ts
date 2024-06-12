import { AppDataSource } from '@/appDataSource';
import { AdministrativeArea } from '@/typeorm/Entities/AdministrativeArea';
import { AdministrativeAreaFilter } from './administrativeAreaSchema';
import { DeepPartial } from 'typeorm';
import { ErrorWithCode } from '@/utilities/customErrors/ErrorWithCode';

const getAdministrativeAreas = (filter: AdministrativeAreaFilter) => {
  let order = undefined;
  if (filter.sortRelation) {
    order = { [filter.sortRelation]: { [filter.sortKey]: filter.sortOrder } };
  } else {
    order = { [filter.sortKey]: filter.sortOrder };
  }
  return AppDataSource.getRepository(AdministrativeArea).find({
    relations: {
      RegionalDistrict: true,
    },
    where: {
      Name: filter.name,
      ProvinceId: filter.provinceId,
      RegionalDistrict: { Name: filter.regionalDistrict },
    },
    take: filter.quantity,
    skip: (filter.quantity ?? 0) * (filter.page ?? 0),
    order: order,
  });
};

const addAdministrativeArea = async (adminArea: AdministrativeArea) => {
  const existing = await AppDataSource.getRepository(AdministrativeArea).findOne({
    where: [{ Id: adminArea.Id }, { Name: adminArea.Name }],
  });
  if (existing) {
    throw new ErrorWithCode('Administrative area already exists.');
  }
  return AppDataSource.getRepository(AdministrativeArea).save(adminArea);
};

const getAdministrativeAreaById = (id: number) => {
  return AppDataSource.getRepository(AdministrativeArea).findOne({
    relations: {
      RegionalDistrict: true,
    },
    where: { Id: id },
  });
};

const updateAdministrativeArea = async (adminArea: DeepPartial<AdministrativeArea>) => {
  const exists = await getAdministrativeAreaById(adminArea.Id);
  if (!exists) {
    throw new ErrorWithCode('Administrative area does not exist.', 404);
  }
  await AppDataSource.getRepository(AdministrativeArea).update(adminArea.Id, adminArea);
  return getAdministrativeAreaById(adminArea.Id);
};

const administrativeAreasServices = {
  getAdministrativeAreas,
  addAdministrativeArea,
  getAdministrativeAreaById,
  updateAdministrativeArea,
};

export default administrativeAreasServices;
