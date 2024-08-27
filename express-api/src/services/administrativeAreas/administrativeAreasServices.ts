import { AppDataSource } from '@/appDataSource';
import { AdministrativeArea } from '@/typeorm/Entities/AdministrativeArea';
import { AdministrativeAreaFilter } from './administrativeAreaSchema';
import { Brackets, DeepPartial, FindOptionsWhere } from 'typeorm';
import { ErrorWithCode } from '@/utilities/customErrors/ErrorWithCode';
import {
  constructFindOptionFromQuery,
  constructFindOptionFromQueryBoolean,
  constructFindOptionFromQuerySingleSelect,
} from '@/utilities/helperFunctions';
import { AdministrativeAreaJoinView } from '@/typeorm/Entities/views/AdministrativeAreaJoinView';
import { SortOrders } from '@/constants/types';
import logger from '@/utilities/winstonLogger';

/**
 * Converts entity names to column names.
 * Needed because the sort key in query builder uses the column name, not the entity name.
 */
const sortKeyTranslator: Record<string, string> = {
  Name: 'name',
  IsDisabled: 'is_disabled',
  RegionalDistrictName: 'regional_district_name',
  CreatedOn: 'created_on',
  UpdatedOn: 'updated_on',
};

/**
 * Collects and constructs find options based on the provided AdministrativeAreaFilter.
 * @param filter - The filter containing criteria for finding administrative areas.
 * @returns An array of constructed find options based on the filter criteria.
 */
const collectFindOptions = (filter: AdministrativeAreaFilter) => {
  const options = [];
  if (filter.name) options.push(constructFindOptionFromQuery('Name', filter.name));
  if (filter.regionalDistrictName)
    options.push(
      constructFindOptionFromQuerySingleSelect('RegionalDistrictName', filter.regionalDistrictName),
    );
  if (filter.isDisabled)
    options.push(constructFindOptionFromQueryBoolean('IsDisabled', filter.isDisabled));
  if (filter.createdOn) options.push(constructFindOptionFromQuery('CreatedOn', filter.createdOn));
  if (filter.updatedOn) options.push(constructFindOptionFromQuery('UpdatedOn', filter.updatedOn));
  return options;
};

/**
 * Retrieves administrative areas based on the provided filter criteria.
 * @param {AdministrativeAreaFilter} filter - The filter criteria to apply.
 * @returns {Promise<{ data: AdministrativeAreaJoinView[], totalCount: number }>} An object containing the retrieved data and the total count.
 */
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
  const [data, totalCount] = await query.getManyAndCount();
  return { data, totalCount };
};

/**
 * Adds a new administrative area to the database if it does not already exist.
 * @param {AdministrativeArea} adminArea - The administrative area object to be added.
 * @returns {Promise<AdministrativeArea>} The newly added administrative area.
 * @throws {ErrorWithCode} If the administrative area already exists in the database.
 */
const addAdministrativeArea = async (adminArea: AdministrativeArea) => {
  const existing = await AppDataSource.getRepository(AdministrativeArea).findOne({
    where: [{ Id: adminArea.Id }, { Name: adminArea.Name }],
  });
  if (existing) {
    throw new ErrorWithCode('Administrative area already exists.');
  }
  return AppDataSource.getRepository(AdministrativeArea).save(adminArea);
};

/**
 * Retrieves an administrative area by its unique identifier.
 * @param {number} id - The unique identifier of the administrative area to retrieve.
 * @returns {Promise<AdministrativeArea | undefined>} A promise that resolves to the administrative area if found, otherwise null.
 */
const getAdministrativeAreaById = (id: number) => {
  return AppDataSource.getRepository(AdministrativeArea).findOne({
    where: { Id: id },
  });
};

/**
 * Updates an administrative area in the database.
 * @param {DeepPartial<AdministrativeArea>} adminArea - The partial data of the administrative area to be updated.
 * @returns {Promise<AdministrativeArea>} The updated administrative area.
 * @throws {ErrorWithCode} When the administrative area does not exist, throws an error with code 404.
 */
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
