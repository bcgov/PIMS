import { AppDataSource } from '@/appDataSource';
import { Agency } from '@/typeorm/Entities/Agency';
import { ErrorWithCode } from '@/utilities/customErrors/ErrorWithCode';
import { AgencyFilter } from './agencySchema';
import {
  constructFindOptionFromQuery,
  constructFindOptionFromQueryBoolean,
  constructFindOptionFromQuerySingleSelect,
} from '@/utilities/helperFunctions';
import { Brackets, FindOptionsWhere } from 'typeorm';
import logger from '@/utilities/winstonLogger';
import { SortOrders } from '@/constants/types';
import { AgencyJoinView } from '@/typeorm/Entities/views/AgencyJoinView';
import { NotificationQueue } from '@/typeorm/Entities/NotificationQueue';
import notificationServices, {
  NotificationStatus,
} from '@/services/notifications/notificationServices';

const agencyRepo = AppDataSource.getRepository(Agency);

/**
 * Collects and constructs find options based on the provided AgencyFilter.
 * @param filter - The filter object containing criteria for finding agencies.
 * @returns An array of constructed find options based on the filter criteria.
 */
const collectFindOptions = (filter: AgencyFilter) => {
  const options = [];
  if (filter.name) options.push(constructFindOptionFromQuery('Name', filter.name));
  if (filter.code) options.push(constructFindOptionFromQuery('Code', filter.code));
  if (filter.isDisabled)
    options.push(constructFindOptionFromQueryBoolean('IsDisabled', filter.isDisabled));
  if (filter.parentName)
    options.push(constructFindOptionFromQuerySingleSelect('ParentName', filter.parentName));
  if (filter.sendEmail)
    options.push(constructFindOptionFromQueryBoolean('SendEmail', filter.sendEmail));
  if (filter.email) options.push(constructFindOptionFromQuery('Email', filter.email));
  if (filter.createdOn) options.push(constructFindOptionFromQuery('CreatedOn', filter.createdOn));
  if (filter.updatedOn) options.push(constructFindOptionFromQuery('UpdatedOn', filter.updatedOn));
  return options;
};

/**
 * Converts entity names to column names.
 * Needed because the sort key in query builder uses the column name, not the entity name.
 */
const sortKeyTranslator: Record<string, string> = {
  Name: 'name',
  Code: 'code',
  IsDisabled: 'is_disabled',
  ParentName: 'parent_name',
  SendEmail: 'send_email',
  Email: 'email',
  CreatedOn: 'created_on',
  UpdatedOn: 'updated_on',
};

/**
 * @description Gets and returns a list of agencies based on filter criteria.
 * @param filter - The filter criteria to apply when retrieving agencies.
 * @returns { Agency[] } A list of agencies in the database
 */
export const getAgencies = async (filter: AgencyFilter = {}) => {
  const options = collectFindOptions(filter);
  const query = AppDataSource.getRepository(AgencyJoinView)
    .createQueryBuilder()
    .where(
      new Brackets((qb) => {
        options.forEach((option) => qb.andWhere(option));
      }),
    );

  // Add quickfilter part
  if (filter.quickFilter) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const quickFilterOptions: FindOptionsWhere<any>[] = [];
    const quickfilterFields = ['Name', 'Code', 'ParentName', 'Email', 'UpdatedOn', 'CreatedOn'];
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
      logger.error('getAgencies Service - Invalid Sort Key');
    }
  }
  const [data, totalCount] = await query.getManyAndCount();
  return { data, totalCount };
};

/**
 * @description Creates a new agency in the database.
 * @param {Agency} agency Information on agency to be created.
 * @returns {Agency} The added agency
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
 * @param {number} agencyId Id of the agency to retrieve.
 * @returns {Agency} The found agency or null.
 */
export const getAgencyById = async (agencyId: number) => {
  const findAgency = await agencyRepo.findOne({
    where: { Id: agencyId },
  });
  return findAgency;
};

/**
 * @description Finds and updates an agency with the given id.
 * @param {Agency} agencyIn An agency object used to update existing agency.
 * @returns {Agency} Status and information on updated agency.
 */
export const updateAgencyById = async (agencyIn: Agency) => {
  const agencyRepo = AppDataSource.getRepository(Agency);
  const findAgency = await agencyRepo.findOne({ where: { Id: agencyIn.Id } });
  if (findAgency == null) {
    throw new ErrorWithCode('Agency not found.', 404);
  }

  // Was a parent agency included?
  if (agencyIn.ParentId != null) {
    const findParentAgency = await agencyRepo.findOne({ where: { Id: agencyIn.ParentId } });
    if (findParentAgency == null) {
      throw new ErrorWithCode(`Requested Parent Agency Id ${agencyIn.ParentId} not found.`, 404);
    }
    // If updated agency is already a parent, it cannot be assigned a parent.
    const isParent = await agencyRepo.find({ where: { ParentId: agencyIn.Id } });
    if (isParent.length) {
      throw new ErrorWithCode('Cannot assign Parent Agency to existing Parent Agency.', 400);
    }
    // If the requested parent has its own parent, it cannot be the parent for the updated agency
    if (findParentAgency.ParentId != null) {
      throw new ErrorWithCode('Cannot assign a child agency as a Parent Agency.', 400);
    }
  }

  const updatedAgency = await agencyRepo.save(agencyIn);

  // If the email fields changed, pending notifications for projects need to be requeued with new emails.
  const emailChanged = agencyIn.Email != null && agencyIn.Email != findAgency.Email;
  const ccChanged = agencyIn.CCEmail != null && agencyIn.CCEmail != findAgency.CCEmail;
  if (emailChanged || ccChanged) {
    // Get all notifications matching the agency they correspond to.
    const affectedNotifications = await AppDataSource.getRepository(NotificationQueue).find({
      where: [{ ToAgencyId: findAgency.Id, Status: NotificationStatus.Pending }],
    });
    if (affectedNotifications.length) {
      // Attempt to resend notifications with new info
      const resendResults = await Promise.allSettled(
        affectedNotifications.map((notification) =>
          notificationServices.resendNotificationWithNewProperties(notification, {
            To: updatedAgency.Email,
            Cc: updatedAgency.CCEmail,
          }),
        ),
      );
      // If any of the attempts to resend fail (promises rejected), log and throw error.
      if (resendResults.some((r) => r.status === 'rejected')) {
        logger.error(resendResults.filter((r) => r.status === 'rejected').map((r) => r.reason));
        throw new ErrorWithCode(
          'Agency updated but not all notifications resent with updated emails.',
          500,
        );
      }
    }
  }
  return updatedAgency;
};

/**
 * @description Finds and removes an agency with the given id.
 * @param {number} agencyId ID of agency to delete.
 * @returns {DeleteResult} The result of the delete action.
 */
export const deleteAgencyById = async (agencyId: number) => {
  const findAgency = await getAgencyById(agencyId);
  if (findAgency == null) {
    throw new ErrorWithCode('Agency not found.', 404);
  }
  const deleted = await agencyRepo.delete(findAgency.Id);
  return deleted;
};
