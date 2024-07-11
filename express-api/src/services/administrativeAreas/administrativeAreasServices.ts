import { AppDataSource } from '@/appDataSource';
import { AdministrativeArea } from '@/typeorm/Entities/AdministrativeArea';
import { AdministrativeAreaFilter } from './administrativeAreaSchema';
import { Brackets, DeepPartial, FindOptionsWhere } from 'typeorm';
import { ErrorWithCode } from '@/utilities/customErrors/ErrorWithCode';
import {
  constructFindOptionFromQuery,
  constructFindOptionFromQueryBoolean,
} from '@/utilities/helperFunctions';
import { AdministrativeAreaJoinView } from '@/typeorm/Entities/views/AdministrativeAreaJoinView';
import { SortOrders } from '@/constants/types';
import logger from '@/utilities/winstonLogger';

const sortKeyTranslator: Record<string, string> = {
  Name: 'name',
  IsDisabled: 'is_disabled',
  RegionalDistrictName: 'regional_district_name',
  CreatedOn: 'created_on',
  UpdatedOn: 'updated_on',
};

const collectFindOptions = (filter: AdministrativeAreaFilter) => {
  const options = [];
  if (filter.name) options.push(constructFindOptionFromQuery('Name', filter.name));
  if (filter.regionalDistrictName)
    options.push(constructFindOptionFromQuery('RegionalDistrictName', filter.regionalDistrictName));
  if (filter.isDisabled)
    options.push(constructFindOptionFromQueryBoolean('IsDisabled', filter.isDisabled));
  if (filter.createdOn) options.push(constructFindOptionFromQuery('CreatedOn', filter.createdOn));
  if (filter.updatedOn) options.push(constructFindOptionFromQuery('UpdatedOn', filter.updatedOn));
  return options;
};

const getAdministrativeAreas = async (filter: AdministrativeAreaFilter) => {
  const options = collectFindOptions(filter);
  const query = AppDataSource.getRepository(AdministrativeAreaJoinView)
    .createQueryBuilder()
    .where(
      new Brackets((qb) => {
        options.forEach((option) => qb.orWhere(option));
      }),
    );

  // Add quickfilter part
  if (filter.quickFilter) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const quickFilterOptions: FindOptionsWhere<any>[] = [];
    const quickfilterFields = ['Name', 'RegionalDistrictName', 'CreatedOn'];
    quickfilterFields.forEach((field) =>
      quickFilterOptions.push(constructFindOptionFromQuery(field, filter.quickFilter)),
    );
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
        'NULLS LAST',
      );
    } else {
      logger.error('getAdministrativeAreas Service - Invalid Sort Key');
    }
  }
  return await query.getMany();
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
