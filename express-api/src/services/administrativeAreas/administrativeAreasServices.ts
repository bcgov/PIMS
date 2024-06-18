import { AppDataSource } from '@/appDataSource';
import { AdministrativeArea } from '@/typeorm/Entities/AdministrativeArea';
import { AdministrativeAreaFilter } from './administrativeAreaSchema';
import { DeepPartial, FindOptionsOrder, FindOptionsOrderValue } from 'typeorm';
import { ErrorWithCode } from '@/utilities/customErrors/ErrorWithCode';
import { constructFindOptionFromQuery } from '@/utilities/helperFunctions';

const sortKeyMapping = (
  sortKey: string,
  sortDirection: FindOptionsOrderValue,
): FindOptionsOrder<AdministrativeArea> => {
  switch (sortKey) {
    case 'RegionalDistrict':
      return { RegionalDistrict: { Name: sortDirection } };
    default:
      return { [sortKey]: sortDirection };
  }
};

const collectFindOptions = (filter: AdministrativeAreaFilter) => {
  const options = [];
  if (filter.name) options.push(constructFindOptionFromQuery('Name', filter.name));
  if (filter.regionalDistrict)
    options.push({
      RegionalDistrict: constructFindOptionFromQuery('Name', filter.regionalDistrict),
    });
  if (filter.isDisabled)
    options.push(constructFindOptionFromQuery('IsDisabled', filter.isDisabled));
  return options;
};

const getAdministrativeAreas = (filter: AdministrativeAreaFilter) => {
  return AppDataSource.getRepository(AdministrativeArea).find({
    relations: {
      RegionalDistrict: true,
    },
    where: collectFindOptions(filter),
    take: filter.quantity,
    skip: (filter.quantity ?? 0) * (filter.page ?? 0),
    order: sortKeyMapping(filter.sortKey, filter.sortOrder as FindOptionsOrderValue),
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
