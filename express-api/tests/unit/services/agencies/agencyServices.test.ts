import { AppDataSource } from '@/appDataSource';
import { Agency } from '@/typeorm/Entities/Agency';
import {
  produceAgency,
  produceNotificationQueue,
  producePimsRequestUser,
  produceProject,
} from 'tests/testUtils/factories';
import * as agencyServices from '@/services/agencies/agencyServices';
import { DeepPartial } from 'typeorm';
import { ErrorWithCode } from '@/utilities/customErrors/ErrorWithCode';
import { AgencyJoinView } from '@/typeorm/Entities/views/AgencyJoinView';
import { NotificationQueue } from '@/typeorm/Entities/NotificationQueue';
import notificationServices from '@/services/notifications/notificationServices';
import projectServices from '@/services/projects/projectsServices';
import { ProjectAgencyResponse } from '@/typeorm/Entities/ProjectAgencyResponse';
import { Project } from '@/typeorm/Entities/Project';

const _agencyFind = jest
  .spyOn(AppDataSource.getRepository(Agency), 'find')
  .mockImplementation(async () => [produceAgency()]);
const _agencySave = jest
  .spyOn(AppDataSource.getRepository(Agency), 'save')
  .mockImplementation(async (agency: DeepPartial<Agency> & Agency) => agency);
const _agencyFindOne = jest
  .spyOn(AppDataSource.getRepository(Agency), 'findOne')
  .mockImplementation(async () => produceAgency());
const _agencyDelete = jest
  .spyOn(AppDataSource.getRepository(Agency), 'delete')
  .mockImplementation(async () => ({ generatedMaps: [], raw: {} }));

const _getManyAndCountAgencies = jest.fn().mockImplementation(async () => [[produceAgency()], 1]);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _agenciesJoinView: any = {
  select: () => _agenciesJoinView,
  leftJoinAndSelect: () => _agenciesJoinView,
  where: () => _agenciesJoinView,
  orWhere: () => _agenciesJoinView,
  andWhere: () => _agenciesJoinView,
  take: () => _agenciesJoinView,
  skip: () => _agenciesJoinView,
  orderBy: () => _agenciesJoinView,
  getMany: () => [produceAgency()],
  getManyAndCount: _getManyAndCountAgencies,
};

jest
  .spyOn(AppDataSource.getRepository(AgencyJoinView), 'createQueryBuilder')
  .mockImplementation(() => _agenciesJoinView);

// Notification mocks
jest
  .spyOn(AppDataSource.getRepository(NotificationQueue), 'find')
  .mockImplementation(async () => [produceNotificationQueue()]);
const _resendNotificationsMock = jest
  .spyOn(notificationServices, 'resendNotificationWithNewProperties')
  .mockImplementation(async () => produceNotificationQueue());

// Project-related mocks
const _queueOutstanding = jest
  .spyOn(projectServices, 'queueOutstandingERPNotifications')
  .mockImplementation(async () => [produceNotificationQueue()]);
jest
  .spyOn(AppDataSource.getRepository(ProjectAgencyResponse), 'update')
  .mockImplementation(async () => ({ generatedMaps: [], raw: {} }));
jest
  .spyOn(AppDataSource.getRepository(Project), 'find')
  .mockImplementation(async () => [produceProject()]);

describe('UNIT - agency services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('getAgencies', () => {
    it('should get a list of agencies', async () => {
      const agencies = await agencyServices.getAgencies({
        name: 'contains,aaa',
        parentName: 'equals,aaa',
        isDisabled: 'equals,true',
        sortKey: 'ParentName',
        sortOrder: 'asc',
        page: 1,
        quantity: 1,
      });
      expect(Array.isArray(agencies.data)).toBe(true);
      expect(agencies.totalCount).toBe(1);
    });

    it('should get a list of agencies and trigger invalid sort key', async () => {
      const agencies = await agencyServices.getAgencies({
        name: 'startsWith,aaa',
        code: 'endsWith,code',
        email: 'contains,email',
        sendEmail: 'true',
        createdOn: `is,${new Date()}`,
        updatedOn: `after,${new Date()}`,
        sortKey: 'wow',
        sortOrder: 'asc',
        quickFilter: 'hi',
      });
      expect(Array.isArray(agencies.data)).toBe(true);
      expect(agencies.totalCount).toBe(1);
    });
  });
  describe('getAgencyById', () => {
    it('should get one agency with the specified id', async () => {
      const getagency = produceAgency();
      _agencyFindOne.mockResolvedValueOnce(getagency);
      const agency = await agencyServices.getAgencyById(getagency.Id);
      expect(agency.Id).toBe(getagency.Id);
      expect(_agencyFindOne).toHaveBeenCalledTimes(1);
    });
  });
  describe('addAgency', () => {
    it('should add an agency and return it', async () => {
      _agencyFind.mockImplementationOnce(async () => []);
      const addagency = produceAgency();
      const agency = await agencyServices.addAgency(addagency);
      expect(agency.Id).toBe(addagency.Id);
      expect(_agencySave).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if the new agency name or code is already taken', async () => {
      _agencyFind.mockImplementationOnce(async () => [produceAgency()]);
      const addagency = produceAgency();
      await expect(agencyServices.addAgency(addagency)).rejects.toThrow();
    });
  });
  describe('updateAgencyById', () => {
    const user = producePimsRequestUser();
    it('should update an agency and return it', async () => {
      const upagency = produceAgency();
      await agencyServices.updateAgencyById(upagency, user);
      expect(_agencySave).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if the agency is not found', async () => {
      const upagency = produceAgency({ ParentId: 1 });
      _agencyFindOne.mockImplementationOnce(async () => null);
      await expect(agencyServices.updateAgencyById(upagency, user)).rejects.toThrow(
        new ErrorWithCode(`Agency not found.`, 404),
      );
    });

    it('should throw an error if the parent Id is not found', async () => {
      const agencyId = 1;
      const upagency = produceAgency({ Id: agencyId, ParentId: agencyId + 1 });
      _agencyFindOne
        .mockImplementationOnce(async () => upagency)
        .mockImplementationOnce(async () => null);
      await expect(agencyServices.updateAgencyById(upagency, user)).rejects.toThrow(
        new ErrorWithCode(`Requested Parent Agency Id ${upagency.ParentId} not found.`, 404),
      );
    });

    it('should throw an error if the updated agency is already a parent agency', async () => {
      const agencyId = 1;
      const childAgency = produceAgency({ Id: agencyId + 2, ParentId: agencyId });
      const parentAgency = produceAgency({ Id: agencyId - 1 });
      const upagency = produceAgency({ Id: agencyId, ParentId: parentAgency.Id });
      _agencyFind.mockImplementationOnce(async () => [childAgency]);
      await expect(agencyServices.updateAgencyById(upagency, user)).rejects.toThrow(
        new ErrorWithCode('Cannot assign Parent Agency to existing Parent Agency.', 400),
      );
    });

    it('should throw an error if the parent agency id belongs to a child agency', async () => {
      const agencyId = 1;
      const parentAgency = produceAgency({ Id: agencyId - 1, ParentId: agencyId + 1 });
      const upagency = produceAgency({ Id: agencyId, ParentId: parentAgency.Id });
      _agencyFind.mockImplementationOnce(async () => []);
      _agencyFindOne
        .mockImplementationOnce(async () => upagency)
        .mockImplementationOnce(async () => produceAgency({ ParentId: 8 }));
      await expect(agencyServices.updateAgencyById(upagency, user)).rejects.toThrow(
        new ErrorWithCode('Cannot assign a child agency as a Parent Agency.', 400),
      );
    });

    it('should throw an error if any of the resend notifications fail', async () => {
      const upagency = produceAgency();
      _resendNotificationsMock.mockImplementationOnce(async () => {
        throw new Error();
      });
      await expect(agencyServices.updateAgencyById(upagency, user)).rejects.toThrow(
        new ErrorWithCode(
          'Agency updated but not all notifications resent with updated emails.',
          500,
        ),
      );
    });

    it('should attempt to cancel pending emails if the send email flag is false', async () => {
      const upagency = produceAgency({ SendEmail: false, Email: 'test', CCEmail: 'cc' });
      _agencyFindOne.mockImplementationOnce(async () => ({
        ...upagency,
        SendEmail: true,
        Email: 'test',
        CCEmail: 'cc',
      }));
      await agencyServices.updateAgencyById(upagency, user);
      expect(_resendNotificationsMock).toHaveBeenCalled();
    });

    it('should attempt to queue outstanding notifications if the send email flag is true', async () => {
      const upagency = produceAgency({ SendEmail: true, Email: 'test', CCEmail: 'cc' });
      _agencyFindOne.mockImplementationOnce(async () => ({
        ...upagency,
        SendEmail: false,
        Email: 'test',
        CCEmail: 'cc',
      }));
      await agencyServices.updateAgencyById(upagency, user);
      expect(_queueOutstanding).toHaveBeenCalled();
    });
  });

  describe('deleteAgencyById', () => {
    it('should delete an agency and return it', async () => {
      const delagency = produceAgency();
      await agencyServices.deleteAgencyById(delagency.Id);
      expect(_agencyDelete).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if the agency is not found', async () => {
      _agencyFindOne.mockImplementationOnce(async () => null);
      const delagency = produceAgency();
      await expect(agencyServices.deleteAgencyById(delagency.Id)).rejects.toThrow(
        new ErrorWithCode(`Agency not found.`, 404),
      );
    });
  });
});
