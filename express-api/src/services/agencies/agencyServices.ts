import { AppDataSource } from '@/appDataSource';
import { Agency } from '@/typeorm/Entities/Agency';
import { ErrorWithCode } from '@/utilities/customErrors/ErrorWithCode';
import { AgencyFilter } from './agencySchema';
import { constructFindOptionFromQuery } from '@/utilities/helperFunctions';
import { FindOptionsOrderValue, FindOptionsOrder } from 'typeorm';

const agencyRepo = AppDataSource.getRepository(Agency);

const collectFindOptions = (filter: AgencyFilter) => {
  const options = [];
  if (filter.name) options.push(constructFindOptionFromQuery('Name', filter.name));
  if (filter.parent) options.push({ Parent: constructFindOptionFromQuery('Name', filter.parent) });
  if (filter.isDisabled)
    options.push(constructFindOptionFromQuery('IsDisabled', filter.isDisabled));
  if (filter.code) options.push(constructFindOptionFromQuery('Code', filter.code));
  if (filter.email) options.push(constructFindOptionFromQuery('Email', filter.email));
  if (filter.createdOn) options.push(constructFindOptionFromQuery('CreatedOn', filter.createdOn));
  if (filter.updatedOn) options.push(constructFindOptionFromQuery('UpdatedOn', filter.updatedOn));
  return options;
};

const sortKeyMapping = (
  sortKey: string,
  sortDirection: FindOptionsOrderValue,
): FindOptionsOrder<Agency> => {
  switch (sortKey) {
    case 'Parent':
      return { Parent: { Name: sortDirection } };
    default:
      return { [sortKey]: sortDirection };
  }
};

/**
 * @description Gets and returns a list of all agencies.
 * @returns { Agency[] } A list of all agencies in the database
 */
export const getAgencies = async (filter: AgencyFilter, includeRelations: boolean = false) => {
  const allAgencies = await agencyRepo.find({
    where: collectFindOptions(filter),
    relations: {
      Parent: includeRelations,
    },
    take: filter.quantity,
    skip: (filter.quantity ?? 0) * (filter.page ?? 0),
    order: sortKeyMapping(filter.sortKey, filter.sortOrder as FindOptionsOrderValue),
  });
  return allAgencies;
};

/**
 * @description Creates a new agency in the database.
 * @param Request information on agency to be created.
 * @returns Status and information on the added agency
 * @throws ErrorWithCode if agency already exists
 */
export const addAgency = async (agency: Agency) => {
  const existingAgencies = await agencyRepo.find({
    where: [{ Name: agency.Name }, { Code: agency.Code }], // OR check
  });
  if (existingAgencies.length > 0) {
    throw new ErrorWithCode('Agency with that name or code already exists', 409);
  }
  const newAgency = AppDataSource.getRepository(Agency).save(agency);
  return newAgency;
};

/**
 * @description Finds and returns an agency with a given id.
 * @param Request id.
 * @returns found agency.
 */
export const getAgencyById = async (agencyId: number) => {
  const findAgency = await agencyRepo.findOne({
    where: { Id: agencyId },
    relations: {
      Parent: true,
    },
  });
  return findAgency;
};

/**
 * @description Finds and updates an agency with the given id.
 * @param The id provided in the request.
 * @returns Status and information on updated agency.
 */
export const updateAgencyById = async (agencyIn: Agency) => {
  const agencies = await getAgencies({});
  const findAgency = agencies.find((agency) => agency.Id === agencyIn.Id);
  if (findAgency == null) {
    throw new ErrorWithCode('Agency not found.', 404);
  }

  // Was a parent agency included?
  if (agencyIn.ParentId != null) {
    const findParentAgency = agencies.find((agency) => agency.Id === agencyIn.ParentId);
    if (findParentAgency == null) {
      throw new ErrorWithCode(`Requested Parent Agency Id ${agencyIn.ParentId} not found.`, 404);
    }
    // If updated agency is already a parent, it cannot be assigned a parent.
    const isParent = agencies.some((agency) => agency.ParentId === agencyIn.Id);
    if (isParent) {
      throw new ErrorWithCode('Cannot assign Parent Agency to existing Parent Agency.', 400);
    }
    // If the requested parent has its own parent, it cannot be the parent for the updated agency
    if (findParentAgency.ParentId != null) {
      throw new ErrorWithCode('Cannot assign a child agency as a Parent Agency.', 400);
    }
  }
  const updatedAgency = await agencyRepo.save(agencyIn);
  return updatedAgency;
};

/**
 * @description Finds and removes an agency with the given id.
 * @param the id provided in the request.
 * @returns Status with conformation on the removal.
 */
export const deleteAgencyById = async (agencyId: number) => {
  const findAgency = await getAgencyById(agencyId);
  if (findAgency == null) {
    throw new ErrorWithCode('Agency not found.', 404);
  }
  const deleted = await agencyRepo.delete(findAgency.Id);
  return deleted;
};
