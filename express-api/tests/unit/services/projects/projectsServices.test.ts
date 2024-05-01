import { AppDataSource } from '@/appDataSource';
import { ProjectStatus } from '@/constants/projectStatus';
import { ProjectType } from '@/constants/projectType';
import { ProjectWorkflow } from '@/constants/projectWorkflow';
import projectServices from '@/services/projects/projectsServices';
import { Agency } from '@/typeorm/Entities/Agency';
import { Building } from '@/typeorm/Entities/Building';
import { NotificationQueue } from '@/typeorm/Entities/NotificationQueue';
import { Parcel } from '@/typeorm/Entities/Parcel';
import { Project } from '@/typeorm/Entities/Project';
import { ProjectAgencyResponse } from '@/typeorm/Entities/ProjectAgencyResponse';
import { ProjectNote } from '@/typeorm/Entities/ProjectNote';
import { ProjectProperty } from '@/typeorm/Entities/ProjectProperty';
import { ProjectSnapshot } from '@/typeorm/Entities/ProjectSnapshot';
import { ProjectStatusHistory } from '@/typeorm/Entities/ProjectStatusHistory';
import { ProjectStatusNotification } from '@/typeorm/Entities/ProjectStatusNotification';
import { ProjectTask } from '@/typeorm/Entities/ProjectTask';
import { ErrorWithCode } from '@/utilities/customErrors/ErrorWithCode';
import { faker } from '@faker-js/faker';
import {
  produceBuilding,
  produceParcel,
  produceProject,
  produceProjectNotification,
  produceProjectProperty,
  produceProjectTask,
  productProjectStatusHistory,
} from 'tests/testUtils/factories';
import { DeepPartial } from 'typeorm';

const _getDeleteResponse = (amount: number) => ({
  raw: {},
  affected: amount,
});

// SAVE mocks
const _projectsSave = jest
  .spyOn(AppDataSource.getRepository(Project), 'save')
  .mockImplementation(async (project: DeepPartial<Project> & Project) => project);

const _projectPropertySave = jest
  .spyOn(AppDataSource.getRepository(ProjectProperty), 'save')
  .mockImplementation(async () => produceProjectProperty({}));

const _projectUpdate = jest
  .spyOn(AppDataSource.getRepository(Project), 'save')
  .mockImplementation(async () => produceProject());

const _projectStatusHistoryInsert = jest
  .spyOn(AppDataSource.getRepository(ProjectStatusHistory), 'save')
  .mockImplementation(async () => productProjectStatusHistory());

// EXIST mocks
const _agencyExists = jest
  .spyOn(AppDataSource.getRepository(Agency), 'exists')
  .mockImplementation(async () => true);

const _projectPropertyExists = jest
  .spyOn(AppDataSource.getRepository(ProjectProperty), 'exists')
  .mockImplementation(async () => false);

const _projectExists = jest
  .spyOn(AppDataSource.getRepository(Project), 'exists')
  .mockImplementation(async () => true);

// DELETE mocks
const _projectPropertiesDelete = jest
  .spyOn(AppDataSource.getRepository(ProjectProperty), 'delete')
  .mockImplementation(async () => _getDeleteResponse(1));

const _projectDelete = jest
  .spyOn(AppDataSource.getRepository(Project), 'delete')
  .mockImplementation(async () => _getDeleteResponse(1));

const _projectNoteDelete = jest
  .spyOn(AppDataSource.getRepository(ProjectNote), 'delete')
  .mockImplementation(async () => _getDeleteResponse(1));

const _projectStatusHistoryDelete = jest
  .spyOn(AppDataSource.getRepository(ProjectStatusHistory), 'delete')
  .mockImplementation(async () => _getDeleteResponse(1));

const _projectSnapshotDelete = jest
  .spyOn(AppDataSource.getRepository(ProjectSnapshot), 'delete')
  .mockImplementation(async () => _getDeleteResponse(1));

const _projectTaskDelete = jest
  .spyOn(AppDataSource.getRepository(ProjectTask), 'delete')
  .mockImplementation(async () => _getDeleteResponse(1));

const _projectAgencyResponseDelete = jest
  .spyOn(AppDataSource.getRepository(ProjectAgencyResponse), 'delete')
  .mockImplementation(async () => _getDeleteResponse(1));

const _notificationQueueDelete = jest
  .spyOn(AppDataSource.getRepository(NotificationQueue), 'delete')
  .mockImplementation(async () => _getDeleteResponse(1));

// FIND mocks
const _parcelFindOne = jest
  .spyOn(AppDataSource.getRepository(Parcel), 'findOne')
  .mockImplementation(async () => produceParcel());
const _buildingFindOne = jest
  .spyOn(AppDataSource.getRepository(Building), 'findOne')
  .mockImplementation(async () => produceBuilding());
const _projectFindOne = jest
  .spyOn(AppDataSource.getRepository(Project), 'findOne')
  .mockImplementation(async () => produceProject({}));
const _projectPropertiesFind = jest
  .spyOn(AppDataSource.getRepository(ProjectProperty), 'find')
  .mockImplementation(
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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _notificationFind = jest
  .spyOn(AppDataSource.getRepository(ProjectStatusNotification), 'find')
  .mockImplementation(async () => [produceProjectNotification()]);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _projectTaskFind = jest
  .spyOn(AppDataSource.getRepository(ProjectTask), 'exists')
  .mockImplementation(async () => true);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _projectTaskSave = jest
  .spyOn(AppDataSource.getRepository(ProjectTask), 'save')
  .mockImplementation(async () => produceProjectTask());
// QUERY mocks
const _getNextSequence = jest.spyOn(AppDataSource, 'query').mockImplementation(async () => [
  {
    nextval: faker.number.int(),
  },
]);

const _mockStartTransaction = jest.fn(async () => {});
const _mockRollbackTransaction = jest.fn(async () => {});
const _mockCommitTransaction = jest.fn(async () => {});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _queryRunner = jest.spyOn(AppDataSource, 'createQueryRunner').mockReturnValue({
  ...jest.requireActual('@/appDataSource').createQueryRunner,
  startTransaction: _mockStartTransaction,
  rollbackTransaction: _mockRollbackTransaction,
  commitTransaction: _mockCommitTransaction,
});

describe('UNIT - Project Services', () => {
  describe('addProject', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should add a project and its relevant project property entries', async () => {
      _projectsSave.mockImplementationOnce(
        async (project: DeepPartial<Project> & Project) => project,
      );
      const project = produceProject({ Name: 'Test Project' });
      const result = await projectServices.addProject(project, {
        parcels: [3],
        buildings: [1],
      });
      // Agency is checked for existance
      expect(_agencyExists).toHaveBeenCalledTimes(1);
      // The sequence is called
      expect(_getNextSequence).toHaveBeenCalledTimes(1);
      // Project is saved
      expect(_projectsSave).toHaveBeenCalledTimes(1);
      // One building and one parcel are saved
      expect(_projectPropertySave).toHaveBeenCalledTimes(2);
      // Parcels and buildings are checked to already be in project before adding
      expect(_projectPropertyExists).toHaveBeenCalledTimes(2);
      // Parcels and buildings are checked to exist before adding
      expect(_parcelFindOne).toHaveBeenCalledTimes(1);
      expect(_buildingFindOne).toHaveBeenCalledTimes(1);
      // The created project has the expected values
      expect(result.Name).toEqual('Test Project');
      expect(result.WorkflowId).toEqual(ProjectWorkflow.SUBMIT_DISPOSAL);
      expect(result.ProjectType).toEqual(ProjectType.DISPOSAL);
      expect(result.StatusId).toEqual(ProjectStatus.SUBMITTED);
      expect(result.ProjectNumber).toMatch(/^SPP-\d+$/);
    });

    it('should throw an error if the project is missing a name', async () => {
      const project = produceProject({ Name: undefined });
      expect(
        async () =>
          await projectServices.addProject(project, {
            parcels: [1],
            buildings: [1],
          }),
      ).rejects.toThrow(new ErrorWithCode('Projects must have a name.', 400));
    });

    it('should throw an error if the agency does not exist', async () => {
      _agencyExists.mockImplementationOnce(async () => false);
      const project = produceProject({});
      expect(
        async () =>
          await projectServices.addProject(project, {
            parcels: [1],
            buildings: [1],
          }),
      ).rejects.toThrow(new ErrorWithCode(`Agency with ID ${project.AgencyId} not found.`, 404));
    });

    it('should throw an error if the project save fails', async () => {
      _projectsSave.mockImplementationOnce(async () => {
        throw new Error();
      });
      const project = produceProject({});
      expect(
        async () =>
          await projectServices.addProject(project, {
            parcels: [1],
            buildings: [1],
          }),
      ).rejects.toThrow(new ErrorWithCode('Error creating project.', 500));
    });

    it('should throw an error if the parcel attached to project does not exist', async () => {
      _parcelFindOne.mockImplementationOnce(async () => null);
      const project = produceProject({});
      expect(
        async () =>
          await projectServices.addProject(project, {
            parcels: [1],
            buildings: [1],
          }),
      ).rejects.toThrow(new ErrorWithCode(`Parcel with ID 1 does not exist.`, 404));
    });

    it('should throw an error if the building attached to project does not exist', async () => {
      jest.clearAllMocks();
      _buildingFindOne.mockImplementationOnce(async () => null);
      const project = produceProject({});
      expect(
        async () =>
          await projectServices.addProject(project, {
            parcels: [1],
            buildings: [1],
          }),
      ).rejects.toThrow(new ErrorWithCode(`Building with ID 1 does not exist.`, 404));
    });

    it('should throw an error if the parcel belongs to another project', async () => {
      const existingProject = produceProject({ StatusId: ProjectStatus.IN_ERP });
      const project = produceProject({ Id: existingProject.Id + 1 });
      _projectPropertiesFind.mockImplementationOnce(async () => {
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
          await projectServices.addProject(project, {
            parcels: [1],
          }),
      ).rejects.toThrow(
        new ErrorWithCode(`Parcel with ID 1 already belongs to another active project.`, 400),
      );
    });

    it('should throw an error if the building belongs to another project', async () => {
      const existingProject = produceProject({ StatusId: ProjectStatus.IN_ERP });
      const project = produceProject({ Id: existingProject.Id + 1 });
      _projectPropertiesFind.mockImplementationOnce(async () => {
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
          await projectServices.addProject(project, {
            buildings: [1],
          }),
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
      const result = await projectServices.deleteProjectById(1);
      // Was the project checked for existance?
      expect(_projectExists).toHaveBeenCalledTimes(1);

      // Make sure all the deletions are called
      expect(_projectDelete).toHaveBeenCalledTimes(1);
      expect(_projectNoteDelete).toHaveBeenCalledTimes(1);
      expect(_projectTaskDelete).toHaveBeenCalledTimes(1);
      expect(_projectSnapshotDelete).toHaveBeenCalledTimes(1);
      expect(_notificationQueueDelete).toHaveBeenCalledTimes(1);
      expect(_projectPropertiesDelete).toHaveBeenCalledTimes(1);
      expect(_projectStatusHistoryDelete).toHaveBeenCalledTimes(1);
      expect(_projectAgencyResponseDelete).toHaveBeenCalledTimes(1);

      // Expect one result deleted
      expect(result.affected).toBeGreaterThanOrEqual(1);
    });

    it('should throw an error if the project does not exist', async () => {
      _projectExists.mockImplementationOnce(async () => false);
      expect(projectServices.deleteProjectById(1)).rejects.toThrow(
        new ErrorWithCode('Project does not exist.', 404),
      );
    });

    it('should rollback the transaction and throw and error if database operations fail', async () => {
      _projectDelete.mockImplementationOnce(async () => {
        throw new Error();
      });
      expect(async () => await projectServices.deleteProjectById(2)).rejects.toThrow();
    });
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
      _projectPropertiesFind.mockImplementationOnce(
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
      const result = await projectServices.updateProject(projectUpdate, {
        parcels: [1, 3],
        buildings: [4, 5],
      });
      expect(result.StatusId).toBe(2);
      expect(result.Name).toBe('New Name');
      expect(_projectPropertiesFind).toHaveBeenCalledTimes(3);
      expect(_projectStatusHistoryInsert).toHaveBeenCalledTimes(1);
      expect(_projectUpdate).toHaveBeenCalledTimes(1);
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
          ),
      ).rejects.toThrow(new ErrorWithCode('Project Agency may not be changed.', 403));
    });

    it('should handle error in transaction by rolling back', async () => {
      _projectsSave.mockImplementationOnce(() => {
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
          ),
      ).rejects.toThrow(new ErrorWithCode('Error updating project.', 500));
    });

    describe('getProjects', () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });
      it('should return projects based on filter conditions', async () => {
        const filter = {
          statusId: 1,
          agencyId: 3,
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
              filter.statusId === project.StatusId && filter.agencyId === project.AgencyId,
          );
        });

        // Call the service function
        const projects = await projectServices.getProjects(filter, true); // Pass the mocked projectRepo

        // Assertions
        expect(_projectFind).toHaveBeenCalled();
        // Returned project should be the one based on the agency and status id in the filter
        expect(projects.length).toEqual(1);
      });
    });
  });
});
