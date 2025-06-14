import { AppDataSource } from '@/appDataSource';
import { ProjectStatus } from '@/constants/projectStatus';
import { ProjectType } from '@/constants/projectType';
import { Roles } from '@/constants/roles';
import {
  AgencyResponseType,
  NotificationStatus,
} from '@/services/notifications/notificationServices';
import projectServices from '@/services/projects/projectsServices';
import userServices from '@/services/users/usersServices';
import { Agency } from '@/typeorm/Entities/Agency';
import { Building } from '@/typeorm/Entities/Building';
import { NotificationQueue } from '@/typeorm/Entities/NotificationQueue';
import { Parcel } from '@/typeorm/Entities/Parcel';
import { Project } from '@/typeorm/Entities/Project';
import { ProjectAgencyResponse } from '@/typeorm/Entities/ProjectAgencyResponse';
import { ProjectMonetary } from '@/typeorm/Entities/ProjectMonetary';
import { ProjectNote } from '@/typeorm/Entities/ProjectNote';
import { ProjectProperty } from '@/typeorm/Entities/ProjectProperty';
import { ProjectStatusNotification } from '@/typeorm/Entities/ProjectStatusNotification';
import { ProjectTask } from '@/typeorm/Entities/ProjectTask';
import { ProjectTimestamp } from '@/typeorm/Entities/ProjectTimestamp';
import { ProjectJoin } from '@/typeorm/Entities/views/ProjectJoinView';
import { ErrorWithCode } from '@/utilities/customErrors/ErrorWithCode';
import { faker } from '@faker-js/faker';
import {
  produceAgency,
  produceAgencyResponse,
  produceBuilding,
  produceNote,
  produceNotificationQueue,
  produceParcel,
  producePimsRequestUser,
  produceProject,
  produceProjectJoin,
  produceProjectMonetary,
  produceProjectProperty,
  produceProjectStatusNotification,
  produceProjectTask,
  produceProjectTimestamp,
  produceUser,
} from 'tests/testUtils/factories';
import {
  DeepPartial,
  DeleteResult,
  EntityTarget,
  InsertResult,
  ObjectLiteral,
  UpdateResult,
} from 'typeorm';

const _getDeleteResponse = (amount: number) => ({
  raw: {},
  affected: amount,
});

// EXIST mocks
const _agencyExists = jest
  .spyOn(AppDataSource.getRepository(Agency), 'exists')
  .mockImplementation(async () => true);

const _projectExists = jest
  .spyOn(AppDataSource.getRepository(Project), 'exists')
  .mockImplementation(async () => true);

// FIND mocks
jest
  .spyOn(AppDataSource.getRepository(Parcel), 'findOne')
  .mockImplementation(async () => produceParcel());
jest
  .spyOn(AppDataSource.getRepository(Building), 'findOne')
  .mockImplementation(async () => produceBuilding());
const _projectFindOne = jest
  .spyOn(AppDataSource.getRepository(Project), 'findOne')
  .mockImplementation(async () => produceProject({}));
jest
  .spyOn(AppDataSource.getRepository(Agency), 'find')
  .mockImplementation(async () => [produceAgency()]);
jest.spyOn(AppDataSource.getRepository(ProjectProperty), 'find').mockImplementation(
  async () =>
    [
      {
        ParcelId: 3,
        BuildingId: 4,
        ProjectId: 1,
        Project: produceProject({ StatusId: ProjectStatus.CANCELLED }),
      },
    ] as ProjectProperty[],
);
const _projectFind = jest.spyOn(AppDataSource.getRepository(Project), 'find');
jest
  .spyOn(AppDataSource.getRepository(ProjectNote), 'find')
  .mockImplementation(async () => [produceNote()]);

jest
  .spyOn(AppDataSource.getRepository(ProjectTask), 'find')
  .mockImplementation(async () => [produceProjectTask()]);

jest
  .spyOn(AppDataSource.getRepository(ProjectTimestamp), 'find')
  .mockImplementation(async () => [produceProjectTimestamp()]);

jest
  .spyOn(AppDataSource.getRepository(ProjectMonetary), 'find')
  .mockImplementation(async () => [produceProjectMonetary()]);

jest
  .spyOn(AppDataSource.getRepository(ProjectAgencyResponse), 'find')
  .mockImplementation(async () => [produceAgencyResponse()]);

jest
  .spyOn(AppDataSource.getRepository(NotificationQueue), 'find')
  .mockImplementation(async () => [produceNotificationQueue()]);
// QUERY mocks
const _getNextSequence = jest.spyOn(AppDataSource, 'query').mockImplementation(async () => [
  {
    nextval: faker.number.int(),
  },
]);

jest.spyOn(userServices, 'getUser').mockImplementation(async () => produceUser());
jest.spyOn(userServices, 'getAgencies').mockImplementation(async () => [1]);

const _mockStartTransaction = jest.fn(async () => {});
const _mockRollbackTransaction = jest.fn(async () => {});
const _mockCommitTransaction = jest.fn(async () => {});

const produceSwitch = <Entity extends ObjectLiteral>(entityClass: EntityTarget<Entity>) => {
  if (entityClass === Project) {
    return produceProject();
  } else if (entityClass === ProjectProperty) {
    return produceProjectProperty({ Project: produceProject() });
  } else if (entityClass === ProjectTask) {
    return produceProjectTask();
  } else if (entityClass === ProjectAgencyResponse) {
    return produceAgencyResponse();
  } else if (entityClass === NotificationQueue) {
    return produceNotificationQueue();
  } else if (entityClass === Building) {
    return produceBuilding();
  } else if (entityClass === Parcel) {
    return produceParcel();
  } else {
    return {};
  }
};
const _parcelManagerFindOne = jest.fn().mockImplementation(() => produceParcel());
const _buildingManagerFindOne = jest.fn().mockImplementation(() => produceBuilding());
const _projectPropertiesManagerFind = jest.fn().mockImplementation(
  () =>
    [
      {
        ParcelId: 3,
        BuildingId: 4,
        ProjectId: 1,
        Project: produceProject({ StatusId: ProjectStatus.CANCELLED }),
      },
    ] as ProjectProperty[],
);
const _projectManagerFindOne = jest.fn().mockImplementation(() => produceProject());
const _projectManagerExists = jest.fn().mockImplementation(() => true);
const _agencyManagerExists = jest.fn().mockImplementation(() => true);
const _projectManagerSave = jest.fn().mockImplementation((obj) => obj);
const _projectManagerDelete = jest.fn().mockImplementation(() => _getDeleteResponse(1));
const _projectPropertiesManagerFindOne = jest.fn().mockImplementation(async () => null);

const _notificationQueueManagerExists = jest.fn().mockImplementation(async () => false);
const _projectStatusNotificationManagerFind = jest
  .fn()
  .mockImplementation(async () => [produceProjectStatusNotification()]);

const _mockEntityManager = {
  find: async <Entity extends ObjectLiteral>(entityClass: EntityTarget<Entity>) => {
    if (entityClass === ProjectProperty) {
      return _projectPropertiesManagerFind();
    } else if (entityClass == ProjectStatusNotification) {
      return _projectStatusNotificationManagerFind();
    } else {
      return [produceSwitch(entityClass)];
    }
  },
  save: async <Entity extends ObjectLiteral, T extends DeepPartial<Entity>>(
    entityClass: EntityTarget<Entity>,
    obj: T,
  ) => {
    if (entityClass === Project) {
      return _projectManagerSave(obj);
    } else if (entityClass == ProjectAgencyResponse) {
      return jest.fn().mockImplementation((obj) => obj);
    } else {
      return obj;
    }
  },
  findOne: async <Entity extends ObjectLiteral>(entityClass: EntityTarget<Entity>) => {
    if (entityClass === Parcel) {
      return _parcelManagerFindOne();
    } else if (entityClass === Building) {
      return _buildingManagerFindOne();
    } else if (entityClass === Project) {
      return _projectManagerFindOne();
    } else if (entityClass === ProjectProperty) {
      return _projectPropertiesManagerFindOne();
    } else {
      return produceSwitch(entityClass);
    }
  },
  delete: async <Entity extends ObjectLiteral>(
    entityClass: EntityTarget<Entity>,
  ): Promise<DeleteResult> => {
    if (entityClass === Project) {
      return _projectManagerDelete();
    } else {
      return { raw: {} };
    }
  },
  exists: async <Entity extends ObjectLiteral>(
    entityClass: EntityTarget<Entity>,
  ): Promise<boolean> => {
    if (entityClass === Project) {
      return _projectManagerExists();
    } else if (entityClass === Agency) {
      return _agencyManagerExists();
    } else if (entityClass == NotificationQueue) {
      return _notificationQueueManagerExists();
    } else {
      return false;
    }
  },
  update: async (): Promise<UpdateResult> => {
    return {
      raw: {},
      generatedMaps: [],
    };
  },
  upsert: async (): Promise<InsertResult> => {
    return {
      identifiers: [],
      raw: {},
      generatedMaps: [],
    };
  },
};

jest.spyOn(AppDataSource, 'createQueryRunner').mockReturnValue({
  ...jest.requireActual('@/appDataSource').createQueryRunner,
  startTransaction: _mockStartTransaction,
  rollbackTransaction: _mockRollbackTransaction,
  commitTransaction: _mockCommitTransaction,
  release: jest.fn(async () => {}),
  manager: _mockEntityManager,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const projectJoinQueryBuilder: any = {
  orderBy: () => projectJoinQueryBuilder,
  andWhere: () => projectJoinQueryBuilder,
  where: () => projectJoinQueryBuilder,
  take: () => projectJoinQueryBuilder,
  skip: () => projectJoinQueryBuilder,
  getMany: () => [produceProjectJoin()],
  getManyAndCount: () => [[produceProjectJoin()], 1],
};
jest
  .spyOn(AppDataSource.getRepository(ProjectJoin), 'createQueryBuilder')
  .mockImplementation(() => projectJoinQueryBuilder);

const _generateProjectWatchNotifications = jest.fn(async () => [produceNotificationQueue()]);
const _generateProjectNotifications = jest.fn(async () => [produceNotificationQueue()]);
const _cancelNotificationById = jest.fn(async () => produceNotificationQueue());

jest.mock('@/services/notifications/notificationServices', () => ({
  generateProjectNotifications: async () => _generateProjectNotifications(),
  sendNotification: jest.fn(async () => produceNotificationQueue()),
  generateProjectWatchNotifications: async () => _generateProjectWatchNotifications(),
  NotificationStatus: { Accepted: 0, Pending: 1, Cancelled: 2, Failed: 3, Completed: 4 },
  cancelNotificationById: async () => _cancelNotificationById,
  AgencyResponseType: { Unsubscribe: 0, Subscribe: 1, Watch: 2 },
  insertProjectNotificationQueue: async () => produceNotificationQueue(),
  NotificationAudience: {
    ProjectOwner: 'ProjectOwner',
    OwningAgency: 'OwningAgency',
    Agencies: 'Agencies',
    ParentAgencies: 'ParentAgencies',
    Default: 'Default',
    WatchingAgencies: 'WatchingAgencies',
  },
}));

describe('UNIT - Project Services', () => {
  describe('addProject', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should add a project and its relevant project property entries', async () => {
      const project = produceProject({ Name: 'Test Project' });
      const result = await projectServices.addProject(
        project,
        {
          parcels: [3],
          buildings: [1],
        },
        producePimsRequestUser(),
      );
      // Agency is checked for existance
      expect(_agencyExists).toHaveBeenCalledTimes(1);
      // The sequence is called
      expect(_getNextSequence).toHaveBeenCalledTimes(1);
      // Project is saved
      expect(_projectManagerSave).toHaveBeenCalledTimes(1);
      // One building and one parcel are saved
      //expect(_projectPropertySave).toHaveBeenCalledTimes(2);
      // Parcels and buildings are checked to already be in project before adding
      //expect(_projectPropertyExists).toHaveBeenCalledTimes(2);
      // Parcels and buildings are checked to exist before adding
      expect(_parcelManagerFindOne).toHaveBeenCalledTimes(1);
      expect(_buildingManagerFindOne).toHaveBeenCalledTimes(1);
      // The created project has the expected values
      expect(result.Name).toEqual('Test Project');
      expect(result.ProjectType).toEqual(ProjectType.DISPOSAL);
      expect(result.StatusId).toEqual(ProjectStatus.SUBMITTED);
      expect(result.ProjectNumber).toMatch(/^SPP-\d+$/);
    });

    it('should throw an error if the project is missing a name', async () => {
      const project = produceProject({ Name: undefined });
      expect(
        async () =>
          await projectServices.addProject(
            project,
            {
              parcels: [1],
              buildings: [1],
            },
            producePimsRequestUser(),
          ),
      ).rejects.toThrow(new ErrorWithCode('Projects must have a name.', 400));
    });

    it('should throw an error if the agency does not exist', async () => {
      _agencyExists.mockImplementationOnce(async () => false);
      const project = produceProject({});
      expect(
        async () =>
          await projectServices.addProject(
            project,
            {
              parcels: [1],
              buildings: [1],
            },
            producePimsRequestUser(),
          ),
      ).rejects.toThrow(new ErrorWithCode(`Agency with ID ${project.AgencyId} not found.`, 404));
    });

    it('should throw an error if the project save fails', async () => {
      _projectManagerSave.mockImplementationOnce(async () => {
        throw new Error();
      });
      const project = produceProject({});
      expect(
        async () =>
          await projectServices.addProject(
            project,
            {
              parcels: [1],
              buildings: [1],
            },
            producePimsRequestUser(),
          ),
      ).rejects.toThrow(new ErrorWithCode('Error creating project. Error', 500));
    });

    it('should throw an error if the parcel attached to project does not exist', async () => {
      _parcelManagerFindOne.mockImplementationOnce(async () => null);
      const project = produceProject({});
      expect(
        async () =>
          await projectServices.addProject(
            project,
            {
              parcels: [1],
              buildings: [1],
            },
            producePimsRequestUser(),
          ),
      ).rejects.toThrow(new ErrorWithCode(`Parcel with ID 1 does not exist.`, 404));
    });

    it('should throw an error if the building attached to project does not exist', async () => {
      jest.clearAllMocks();
      _buildingManagerFindOne.mockImplementationOnce(async () => null);
      const project = produceProject({});
      expect(
        async () =>
          await projectServices.addProject(
            project,
            {
              parcels: [1],
              buildings: [1],
            },
            producePimsRequestUser(),
          ),
      ).rejects.toThrow(new ErrorWithCode(`Building with ID 1 does not exist.`, 404));
    });

    it('should throw an error if the parcel belongs to another project', async () => {
      const existingProject = produceProject({ StatusId: ProjectStatus.APPROVED_FOR_ERP });
      const project = produceProject({ Id: existingProject.Id + 1 });
      _projectPropertiesManagerFind.mockImplementationOnce(async () => {
        return [
          produceProjectProperty({
            Id: project.Id,
            ProjectId: existingProject.Id,
            Project: existingProject,
          }),
        ];
      });
      expect(
        async () =>
          await projectServices.addProject(
            project,
            {
              parcels: [1],
            },
            producePimsRequestUser(),
          ),
      ).rejects.toThrow(
        new ErrorWithCode(`Parcel with ID 1 already belongs to another active project.`, 400),
      );
    });

    it('should throw an error if the building belongs to another project', async () => {
      const existingProject = produceProject({ StatusId: ProjectStatus.APPROVED_FOR_ERP });
      const project = produceProject({ Id: existingProject.Id + 1 });
      _projectPropertiesManagerFindOne.mockImplementationOnce(async () => null);
      _projectPropertiesManagerFind.mockImplementationOnce(async () => {
        return [
          produceProjectProperty({
            Id: project.Id,
            ProjectId: existingProject.Id,
            Project: existingProject,
          }),
        ];
      });
      expect(
        async () =>
          await projectServices.addProject(
            project,
            {
              buildings: [1],
            },
            producePimsRequestUser(),
          ),
      ).rejects.toThrow(
        new ErrorWithCode(`Building with ID 1 already belongs to another active project.`, 400),
      );
    });
  });

  describe('getProjectById', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('should return a project if it is found', async () => {
      _projectFindOne.mockImplementationOnce(async () => produceProject());
      const result = await projectServices.getProjectById(1);
      expect(_projectFindOne).toHaveBeenCalledTimes(1);
      expect(result).toBeTruthy();
    });

    it('should return null when a project is not found', async () => {
      _projectFindOne.mockImplementationOnce(async () => null);
      const result = await projectServices.getProjectById(1);
      expect(_projectFindOne).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });
  });

  describe('deleteProject', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('should delete a project and return the DeleteResult object', async () => {
      const result = await projectServices.deleteProjectById(1, producePimsRequestUser());
      // Was the project checked for existance?
      expect(_projectExists).toHaveBeenCalledTimes(1);

      // Make sure all the deletions are called
      // expect(_projectManagerDelete).toHaveBeenCalledTimes(1);
      // expect(_projectNoteDelete).toHaveBeenCalledTimes(1);
      // expect(_projectTaskDelete).toHaveBeenCalledTimes(1);
      // expect(_projectSnapshotDelete).toHaveBeenCalledTimes(1);
      // expect(_notificationQueueDelete).toHaveBeenCalledTimes(1);
      // expect(_projectPropertiesDelete).toHaveBeenCalledTimes(1);
      // expect(_projectStatusHistoryDelete).toHaveBeenCalledTimes(1);
      // expect(_projectAgencyResponseDelete).toHaveBeenCalledTimes(1);

      // Expect one result deleted
      expect(result.generatedMaps).toBeDefined();
    });

    it('should throw an error if the project does not exist', async () => {
      _projectExists.mockImplementationOnce(async () => false);
      expect(projectServices.deleteProjectById(1, producePimsRequestUser())).rejects.toThrow(
        new ErrorWithCode('Project does not exist.', 404),
      );
    });

    // it('should rollback the transaction and throw and error if database operations fail', async () => {
    //   _projectManagerDelete.mockImplementationOnce(async () => {
    //     throw new Error();
    //   });
    //   expect(async () => await projectServices.deleteProjectById(2, '')).rejects.toThrow();
    // });
  });

  describe('updateProject', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    const originalProject = produceProject({ StatusId: ProjectStatus.CANCELLED });

    const projectUpdate = {
      ...originalProject,
      Name: 'New Name',
      StatusId: 2,
      Tasks: [produceProjectTask({ TaskId: 1, IsCompleted: false })],
    };

    it('should update values of a project', async () => {
      _projectFindOne
        .mockImplementationOnce(async () => originalProject)
        .mockImplementationOnce(async () => projectUpdate);
      _projectManagerFindOne.mockImplementationOnce(async () => originalProject);

      _projectPropertiesManagerFind.mockImplementationOnce(
        async () =>
          [
            {
              ParcelId: 3,
              BuildingId: 4,
              ProjectId: originalProject.Id + 1,
              Project: originalProject,
            },
          ] as ProjectProperty[],
      );
      const result = await projectServices.updateProject(
        projectUpdate,
        {
          parcels: [1, 3],
          buildings: [4, 5],
        },
        producePimsRequestUser({ RoleId: Roles.ADMIN }),
      );
      expect(result.StatusId).toBe(2);
      expect(result.Name).toBe('New Name');
      expect(_projectPropertiesManagerFind).toHaveBeenCalledTimes(5);
      expect(_projectManagerSave).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if a name is not included', async () => {
      expect(
        async () =>
          await projectServices.updateProject(
            {
              Name: '',
              StatusId: 2,
            },
            {},
            producePimsRequestUser(),
          ),
      ).rejects.toThrow(new ErrorWithCode('Projects must have a name.', 400));
    });

    it('should throw an error if the project does not exist', async () => {
      _projectFindOne.mockImplementationOnce(async () => null);
      expect(
        async () =>
          await projectServices.updateProject(
            {
              Name: 'New Name',
              StatusId: 2,
            },
            {},
            producePimsRequestUser(),
          ),
      ).rejects.toThrow(new ErrorWithCode('Project does not exist.', 404));
    });

    it('should throw an error if the project number does not match', async () => {
      _projectFindOne.mockImplementationOnce(async () =>
        produceProject({ ProjectNumber: 'a number' }),
      );
      expect(
        async () =>
          await projectServices.updateProject(
            {
              Name: 'New Name',
              StatusId: 2,
              ProjectNumber: 'not a number',
            },
            {},
            producePimsRequestUser(),
          ),
      ).rejects.toThrow(new ErrorWithCode('Project Number may not be changed.', 403));
    });

    it('should throw an error if trying to change the agency', async () => {
      _projectFindOne.mockImplementationOnce(async () => produceProject({ AgencyId: 1 }));
      expect(
        async () =>
          await projectServices.updateProject(
            {
              Name: 'New Name',
              StatusId: 2,
              AgencyId: 5,
            },
            {},
            producePimsRequestUser({ hasOneOfRoles: () => false }),
          ),
      ).rejects.toThrow(new ErrorWithCode('Project Agency may not be changed.', 403));
    });

    it('should handle error in transaction by rolling back', async () => {
      _projectManagerSave.mockImplementationOnce(() => {
        throw Error('bad save');
      });
      expect(
        async () =>
          await projectServices.updateProject(
            {},
            {
              parcels: [1, 3],
              buildings: [4, 5],
            },
            producePimsRequestUser(),
          ),
      ).rejects.toThrow(new ErrorWithCode('Error updating project: bad save', 500));
    });

    it('should send notifications when agency responses changed', async () => {
      _projectManagerFindOne.mockImplementationOnce(async () =>
        produceProject({ StatusId: ProjectStatus.APPROVED_FOR_ERP }),
      );
      const oldProject = produceProject({ StatusId: ProjectStatus.APPROVED_FOR_ERP });
      const projUpd = {
        ...oldProject,
        AgencyResponses: [produceAgencyResponse({ Response: AgencyResponseType.Subscribe })],
      };
      _projectFindOne.mockImplementationOnce(async () => oldProject);
      await projectServices.updateProject(
        projUpd,
        { parcels: [], buildings: [] },
        producePimsRequestUser(),
      );
    });
  });

  describe('handleProjectNotifications', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('should only send a cancellation notification when status becomes Cancelled', async () => {
      const project = produceProject({
        AgencyResponses: [produceAgencyResponse()],
        StatusId: ProjectStatus.CANCELLED,
        CancelledOn: new Date(),
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const queryRunner: any = {
        manager: {
          findOne: async () => project,
          find: () => [produceNotificationQueue({ Status: NotificationStatus.Pending })],
        },
      };
      const result = await projectServices.handleProjectNotifications(
        project.Id,
        ProjectStatus.ON_HOLD,
        producePimsRequestUser(),
        queryRunner,
      );
      expect(_generateProjectWatchNotifications).not.toHaveBeenCalled();
      expect(_generateProjectNotifications).toHaveBeenCalled();
      expect(result).toHaveLength(1);
    });
  });

  describe('handleProjectMonetary', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('should return an updated list of monetary records', async () => {
      const monetary = produceProjectMonetary();
      const project = produceProject({
        Monetaries: [monetary],
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const queryRunner: any = {
        manager: {
          findOne: async () => monetary,
          upsert: async () => [monetary],
        },
      };
      const result = await projectServices.handleProjectMonetary(project, queryRunner);
      expect(result).toHaveLength(1);
    });

    it('should throw an error when the  monetary type ID is not defined', async () => {
      const monetary = produceProjectMonetary({ MonetaryTypeId: null });
      const project = produceProject({
        Monetaries: [monetary],
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const queryRunner: any = {
        manager: {
          findOne: async () => monetary,
          upsert: async () => [monetary],
        },
      };
      await expect(projectServices.handleProjectMonetary(project, queryRunner)).rejects.toThrow();
    });
  });

  describe('handleProjectTimestamps', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('should return an updated list of monetary records', async () => {
      const timestamp = produceProjectTimestamp();
      const project = produceProject({
        Timestamps: [timestamp],
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const queryRunner: any = {
        manager: {
          findOne: async () => timestamp,
          upsert: async () => [timestamp],
        },
      };
      const result = await projectServices.handleProjectTimestamps(project, queryRunner);
      expect(result).toHaveLength(1);
    });

    it('should throw an error when the timestamp type ID is not defined', async () => {
      const timestamp = produceProjectTimestamp({ TimestampTypeId: null });
      const project = produceProject({
        Timestamps: [timestamp],
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const queryRunner: any = {
        manager: {
          findOne: async () => timestamp,
          upsert: async () => [timestamp],
        },
      };
      await expect(projectServices.handleProjectTimestamps(project, queryRunner)).rejects.toThrow();
    });
  });

  describe('handleProjectNotes', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('should return an updated list of note records', async () => {
      const note = produceNote();
      const project = produceProject({
        Notes: [note],
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const queryRunner: any = {
        manager: {
          findOne: async () => note,
          upsert: async () => [note],
        },
      };
      const result = await projectServices.handleProjectNotes(project, queryRunner);
      expect(result).toHaveLength(1);
    });

    it('should throw an error when the note type ID is not defined', async () => {
      const note = produceNote({ NoteTypeId: null });
      const project = produceProject({
        Notes: [note],
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const queryRunner: any = {
        manager: {
          findOne: async () => note,
          upsert: async () => [note],
        },
      };
      await expect(projectServices.handleProjectNotes(project, queryRunner)).rejects.toThrow();
    });
  });

  describe('getProjects', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('should return projects based on filter conditions', async () => {
      const filter = {
        statusId: 1,
        agencyId: [3],
        quantity: 10,
        page: 1,
        market: '$12',
        netBook: '$12',
        agency: 'contains,aaa',
        status: 'contains,aaa',
        projectNumber: 'contains,aaa',
        name: 'contains,Project',
        updatedOn: 'before,' + new Date(),
        updatedBy: 'Jane',
        sortOrder: 'asc',
        sortKey: 'Status',
        quickFilter: 'hi',
      };

      // Call the service function
      const projectsResponse = await projectServices.getProjects(filter); // Pass the mocked projectRepo
      // Returned project should be the one based on the agency and status id in the filter
      expect(projectsResponse.totalCount).toEqual(1);
      expect(projectsResponse.data.length).toEqual(1);
    });
  });

  describe('getProjectsForExport', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('should return projects based on filter conditions', async () => {
      const filter = {
        statusId: 1,
        agencyId: [3],
        quantity: 10,
        page: 0,
      };

      _projectFind.mockImplementationOnce(async () => {
        const mockProjects: Project[] = [
          produceProject({ Id: 1, Name: 'Project 1', StatusId: 1, AgencyId: 3 }),
          produceProject({ Id: 2, Name: 'Project 2', StatusId: 4, AgencyId: 14 }),
        ];
        // Check if the project matches the filter conditions
        return mockProjects.filter(
          (project) =>
            filter.statusId === project.StatusId && filter.agencyId.includes(project.AgencyId),
        );
      });

      // Call the service function
      const projects = await projectServices.getProjectsForExport(filter); // Pass the mocked projectRepo

      // Assertions
      expect(_projectFind).toHaveBeenCalled();
      // Returned project should be the one based on the agency and status id in the filter
      expect(projects.length).toEqual(1);
    });
  });
  describe('queueOutstandingERPNotifications', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('should return a list of sent notifications related to subscribed agencies when project agency != agency', async () => {
      const projectIn = produceProject({ AgencyId: 1 });
      const agencyIn = produceAgency({ Id: 2 });
      const userIn = produceUser();
      const result = await projectServices.queueOutstandingERPNotifications(
        projectIn,
        agencyIn,
        userIn,
      );
      expect(result).toHaveLength(1);
    });

    it('should return a list of sent notifications related to the owning agency when project agency == agency', async () => {
      const projectIn = produceProject({ AgencyId: 1, ApprovedOn: new Date() });
      const agencyIn = produceAgency({ Id: 1 });
      const userIn = produceUser();
      const result = await projectServices.queueOutstandingERPNotifications(
        projectIn,
        agencyIn,
        userIn,
      );
      expect(result).toHaveLength(1);
    });
  });

  describe('updateProjectAgencyResponses', () => {
    jest
      .spyOn(AppDataSource.getRepository(Agency), 'findOne')
      .mockImplementation(async () => produceAgency());
    jest
      .spyOn(AppDataSource.getRepository(ProjectNote), 'find')
      .mockImplementation(async () => [produceNote()]);
    jest
      .spyOn(AppDataSource.getRepository(ProjectAgencyResponse), 'find')
      .mockImplementation(async () => [produceAgencyResponse()]);
    jest
      .spyOn(AppDataSource.getRepository(ProjectAgencyResponse), 'update')
      .mockImplementation(async () => ({
        raw: {},
        generatedMaps: [],
      }));
    // I don't like this return value, because I expect a list returned, but this method would not except that
    jest
      .spyOn(AppDataSource.getRepository(ProjectAgencyResponse), 'save')
      .mockImplementation(async () => produceAgencyResponse());
    it('should return the list of sent notifications from this update', async () => {
      const project = produceProject();
      const responses = [produceAgencyResponse({ Response: AgencyResponseType.Subscribe })];
      const user = producePimsRequestUser();
      const result = await projectServices.updateProjectAgencyResponses(
        project.Id,
        responses,
        user,
      );
      expect(result).toHaveLength(
        responses.filter((r) => r.Response === AgencyResponseType.Subscribe).length,
      );
    });
  });
});
