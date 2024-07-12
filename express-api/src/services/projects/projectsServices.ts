import { AppDataSource } from '@/appDataSource';
import { ProjectStatus } from '@/constants/projectStatus';
import { ProjectType } from '@/constants/projectType';
import { ProjectWorkflow } from '@/constants/projectWorkflow';
import { Agency } from '@/typeorm/Entities/Agency';
import { Building } from '@/typeorm/Entities/Building';
import { Parcel } from '@/typeorm/Entities/Parcel';
import { Project } from '@/typeorm/Entities/Project';
import { ProjectAgencyResponse } from '@/typeorm/Entities/ProjectAgencyResponse';
import { ProjectNote } from '@/typeorm/Entities/ProjectNote';
import { ProjectProperty } from '@/typeorm/Entities/ProjectProperty';
import { ProjectSnapshot } from '@/typeorm/Entities/ProjectSnapshot';
import { ProjectStatusHistory } from '@/typeorm/Entities/ProjectStatusHistory';
import { ProjectTask } from '@/typeorm/Entities/ProjectTask';
import { ErrorWithCode } from '@/utilities/customErrors/ErrorWithCode';
import logger from '@/utilities/winstonLogger';
import {
  Brackets,
  DeepPartial,
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsOrderValue,
  FindOptionsWhere,
  In,
  InsertResult,
  QueryRunner,
} from 'typeorm';
import { ProjectFilter } from '@/services/projects/projectSchema';
import { PropertyType } from '@/constants/propertyType';
import { ProjectRisk } from '@/constants/projectRisk';
import notificationServices from '../notifications/notificationServices';
import { SSOUser } from '@bcgov/citz-imb-sso-express';
import userServices from '../users/usersServices';
import { constructFindOptionFromQuery } from '@/utilities/helperFunctions';
import { ProjectTimestamp } from '@/typeorm/Entities/ProjectTimestamp';
import { ProjectMonetary } from '@/typeorm/Entities/ProjectMonetary';
import { NotificationQueue } from '@/typeorm/Entities/NotificationQueue';
import { SortOrders } from '@/constants/types';
import { ProjectJoin } from '@/typeorm/Entities/views/ProjectJoinView';

const projectRepo = AppDataSource.getRepository(Project);

export interface ProjectPropertyIds {
  parcels?: number[];
  buildings?: number[];
}

/**
 * Retrieves a project by its ID.
 *
 * @param id - The ID of the project to retrieve.
 * @returns A Promise that resolves to the project object or null if not found.
 */
const getProjectById = async (id: number) => {
  const project = await projectRepo.findOne({
    where: {
      Id: id,
    },
    relations: {
      StatusHistory: true,
      Notifications: true,
    },
    select: {
      Workflow: {
        Name: true,
        Code: true,
        Description: true,
      },
    },
  });
  if (!project) {
    return null;
  }
  const projectProperties = await AppDataSource.getRepository(ProjectProperty).find({
    relations: {
      Parcel: {
        Agency: true,
        Evaluations: true,
        Fiscals: true,
      },
      Building: {
        Agency: true,
        Evaluations: true,
        Fiscals: true,
      },
    },
    where: {
      ProjectId: id,
    },
  });
  const agencyResponses = await AppDataSource.getRepository(ProjectAgencyResponse).find({
    where: {
      ProjectId: id,
    },
  });
  const projectTasks = await AppDataSource.getRepository(ProjectTask).find({
    where: {
      ProjectId: id,
    },
  });
  const projectNotes = await AppDataSource.getRepository(ProjectNote).find({
    where: {
      ProjectId: id,
    },
  });
  const projectMonetary = await AppDataSource.getRepository(ProjectMonetary).find({
    where: {
      ProjectId: id,
    },
  });
  const projectTimestamps = await AppDataSource.getRepository(ProjectTimestamp).find({
    where: {
      ProjectId: id,
    },
  });
  return {
    ...project,
    ProjectProperties: projectProperties,
    AgencyResponses: agencyResponses,
    Tasks: projectTasks,
    Notes: projectNotes,
    Monetaries: projectMonetary,
    Timestamps: projectTimestamps,
  };
};

/**
 * Adds a new project to the database.
 *
 * @param project - The project object to be added.
 * @param propertyIds - The IDs of the properties (parcels and buildings) to be associated with the project.
 * @returns The newly created project.
 * @throws ErrorWithCode - If the project name is missing, agency is not found, or there is an error creating the project.
 */
const addProject = async (
  project: DeepPartial<Project>,
  propertyIds: ProjectPropertyIds,
  ssoUser: SSOUser,
) => {
  // Does the project have a name?
  if (!project.Name) throw new ErrorWithCode('Projects must have a name.', 400);

  // Check if agency exists
  if (!(await AppDataSource.getRepository(Agency).exists({ where: { Id: project.AgencyId } }))) {
    throw new ErrorWithCode(`Agency with ID ${project.AgencyId} not found.`, 404);
  }

  // Workflow ID during submission will always be the submit disposal
  project.WorkflowId = ProjectWorkflow.SUBMIT_DISPOSAL;

  // Only project type at the moment is 1 (Disposal)
  project.ProjectType = ProjectType.DISPOSAL;

  // What type of submission is this? Regular (7) or Exemption (8)?
  project.StatusId = project?.Tasks?.find((task) => task.TaskId === 16) //Task labelled Exemption requested
    ? ProjectStatus.SUBMITTED_EXEMPTION
    : ProjectStatus.SUBMITTED;

  // Set default RiskId
  project.RiskId = project.RiskId ?? ProjectRisk.GREEN;

  // Get a project number from the sequence
  const [{ nextval }] = await AppDataSource.query("SELECT NEXTVAL('project_num_seq')");

  // TODO: If drafts become possible, this can't always be SPP.
  project.ProjectNumber = `SPP-${nextval}`;
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.startTransaction();
  try {
    const newProject = await queryRunner.manager.save(Project, project);
    // Add parcel/building relations
    const { parcels, buildings } = propertyIds;
    if (parcels) await addProjectParcelRelations(newProject, parcels, queryRunner);
    if (buildings) await addProjectBuildingRelations(newProject, buildings, queryRunner);
    await handleProjectTasks(newProject, queryRunner);
    await handleProjectMonetary(newProject, queryRunner);
    await handleProjectNotes(newProject, queryRunner);
    await handleProjectTimestamps(newProject, queryRunner);
    await handleProjectNotifications(newProject, ssoUser, queryRunner);
    await queryRunner.commitTransaction();
    return newProject;
  } catch (e) {
    await queryRunner.rollbackTransaction();
    logger.warn(e.message);
    if (e instanceof ErrorWithCode) throw e;
    throw new ErrorWithCode('Error creating project.', 500);
  } finally {
    await queryRunner.release();
  }
};

/**
 * Adds parcel relations to a project.
 *
 * @param project - The project to add parcel relations to.
 * @param parcelIds - An array of parcel IDs to add as relations.
 * @throws {ErrorWithCode} - If the parcel with the given ID does not exist or already belongs to another project.
 * @returns {Promise<void>} - A promise that resolves when the parcel relations have been added.
 */
const addProjectParcelRelations = async (
  project: DeepPartial<Project>,
  parcelIds: number[],
  queryRunner: QueryRunner,
) => {
  await Promise.all(
    parcelIds?.map(async (parcelId) => {
      const relationExists = await queryRunner.manager.findOne(ProjectProperty, {
        where: {
          ProjectId: project.Id,
          ParcelId: parcelId,
        },
      });
      if (!relationExists) {
        const existingParcel = await queryRunner.manager.findOne(Parcel, {
          where: { Id: parcelId },
        });
        if (!existingParcel) {
          throw new ErrorWithCode(`Parcel with ID ${parcelId} does not exist.`, 404);
        }
        // Check that property doesn't belong to another active project
        // Could be in Cancelled (23) or Denied (16) projects
        const allowedStatusIds = [ProjectStatus.CANCELLED, ProjectStatus.DENIED];
        const existingProjectProperties = await queryRunner.manager.find(ProjectProperty, {
          where: {
            ParcelId: parcelId,
          },
          relations: {
            Project: true,
          },
        });
        if (
          existingProjectProperties.some(
            (relation) =>
              relation.ProjectId !== project.Id &&
              !allowedStatusIds.includes(relation.Project.StatusId),
          )
        ) {
          throw new ErrorWithCode(
            `Parcel with ID ${parcelId} already belongs to another active project.`,
            400,
          );
        }
        // Is this a land (0) or subdivision (2)
        const propertyType = existingParcel.ParentParcelId
          ? PropertyType.SUBDIVISION
          : PropertyType.LAND;
        const entry: Partial<ProjectProperty> = {
          CreatedById: project.CreatedById,
          ProjectId: project.Id,
          PropertyTypeId: propertyType,
          ParcelId: parcelId,
        };
        // Only try to add if this realtion doesn't exist yet
        await queryRunner.manager.save(ProjectProperty, entry);
      }
    }),
  );
};

/**
 * Adds building relations to a project.
 *
 * @param {Project} project - The project to add building relations to.
 * @param {number[]} buildingIds - An array of building IDs to add as relations.
 * @returns {Promise<void>} - A promise that resolves when the building relations have been added.
 * @throws {ErrorWithCode} - If a building with the given ID does not exist or if the building already belongs to another project.
 */
const addProjectBuildingRelations = async (
  project: DeepPartial<Project>,
  buildingIds: number[],
  queryRunner: QueryRunner,
) => {
  await Promise.all(
    buildingIds?.map(async (buildingId) => {
      const relationExists = await queryRunner.manager.findOne(ProjectProperty, {
        where: {
          ProjectId: project.Id,
          BuildingId: buildingId,
        },
      });
      if (!relationExists) {
        const existingBuilding = await queryRunner.manager.findOne(Building, {
          where: { Id: buildingId },
        });
        if (!existingBuilding) {
          throw new ErrorWithCode(`Building with ID ${buildingId} does not exist.`, 404);
        }
        // Check that property doesn't belong to another active project
        // Could be in Cancelled (23) or Denied (16) projects
        const allowedStatusIds = [ProjectStatus.CANCELLED, ProjectStatus.DENIED];
        const existingProjectProperties = await queryRunner.manager.find(ProjectProperty, {
          where: {
            BuildingId: buildingId,
          },
          relations: {
            Project: true,
          },
        });
        if (
          existingProjectProperties.some(
            (relation) =>
              relation.ProjectId !== project.Id &&
              !allowedStatusIds.includes(relation.Project.StatusId),
          )
        ) {
          throw new ErrorWithCode(
            `Building with ID ${buildingId} already belongs to another active project.`,
            400,
          );
        }
        // Property type building (1)
        const entry: Partial<ProjectProperty> = {
          CreatedById: project.CreatedById,
          ProjectId: project.Id,
          PropertyTypeId: PropertyType.BUILDING,
          BuildingId: buildingId,
        };
        // Only try to add if this relation doesn't exist yet

        await queryRunner.manager.save(ProjectProperty, entry);
      }
    }),
  );
};

/**
 * Removes the relations between a project and the specified parcel IDs.
 *
 * @param {Project} project - The project from which to remove the parcel relations.
 * @param {number[]} parcelIds - An array of parcel IDs to remove the relations for.
 * @returns {Promise<void>} - A promise that resolves when the relations have been removed.
 */
const removeProjectParcelRelations = async (
  project: Project,
  parcelIds: number[],
  queryRunner: QueryRunner,
) => {
  return Promise.all(
    parcelIds?.map((parcelId) => {
      return queryRunner.manager.update(
        ProjectProperty,
        {
          ProjectId: project.Id,
          ParcelId: parcelId,
        },
        { DeletedById: project.UpdatedById, DeletedOn: new Date() },
      );
    }),
  );
};

/**
 * Removes the relationship between a project and the specified buildings.
 *
 * @param {Project} project - The project from which to remove the building relationships.
 * @param {number[]} buildingIds - An array of building IDs to be removed from the project.
 * @returns {Promise<void>} - A promise that resolves when the building relationships have been removed.
 */
const removeProjectBuildingRelations = async (
  project: Project,
  buildingIds: number[],
  queryRunner: QueryRunner,
) => {
  return Promise.all(
    buildingIds?.map(async (buildingId) => {
      return queryRunner.manager.update(
        ProjectProperty,
        {
          ProjectId: project.Id,
          BuildingId: buildingId,
        },
        { DeletedById: project.UpdatedById, DeletedOn: new Date() },
      );
    }),
  );
};

const handleProjectNotifications = async (
  oldProject: DeepPartial<Project>,
  user: SSOUser,
  queryRunner: QueryRunner,
) => {
  const projectWithRelations = await queryRunner.manager.findOne(Project, {
    relations: {
      Agency: true,
      ProjectProperties: {
        Building: {
          Evaluations: true,
          Fiscals: true,
        },
        Parcel: {
          Evaluations: true,
          Fiscals: true,
        },
      },
      AgencyResponses: true,
      Notes: true,
    },
    where: {
      Id: oldProject.Id,
    },
  });
  const notifs = await notificationServices.generateProjectNotifications(
    projectWithRelations,
    oldProject.StatusId,
    queryRunner,
  );
  return Promise.all(
    notifs.map((notif) => notificationServices.sendNotification(notif, user, queryRunner)),
  );
};

const handleProjectTasks = async (project: DeepPartial<Project>, queryRunner: QueryRunner) => {
  if (project?.Tasks?.length) {
    for (const task of project.Tasks) {
      const existingTask = await queryRunner.manager.findOne(ProjectTask, {
        where: { ProjectId: project.Id, TaskId: task.TaskId },
      });
      const taskEntity: DeepPartial<ProjectTask> = {
        ...task,
        ProjectId: project.Id,
        CreatedById: existingTask ? existingTask.CreatedById : project.CreatedById,
        UpdatedById: existingTask ? project.UpdatedById : undefined,
        IsCompleted: task.IsCompleted,
        CompletedOn: !existingTask?.CompletedOn && task.IsCompleted ? new Date() : undefined,
        //This CompletedOn logic basically means that you will only ever set the CompletedOn date once, even if you transition between IsCompleted true/false
        //multiple times. Doing that wouldn't really be the intended flow anyways so this seemed like the safest bet.
      };
      await queryRunner.manager.save(ProjectTask, taskEntity);
    }
  }
};

const handleProjectAgencyResponses = async (
  newProject: DeepPartial<Project>,
  queryRunner: QueryRunner,
) => {
  if (newProject.AgencyResponses) {
    const existingResponses = await queryRunner.manager.find(ProjectAgencyResponse, {
      where: {
        ProjectId: newProject.Id,
      },
    });
    const removeResponses = existingResponses.filter(
      (r) => !newProject.AgencyResponses.find((a) => a.AgencyId === r.AgencyId),
    );
    await queryRunner.manager.update(
      ProjectAgencyResponse,
      {
        AgencyId: In(removeResponses.map((a) => a.AgencyId)),
        ProjectId: newProject.Id,
      },
      { DeletedById: newProject.CreatedById, DeletedOn: new Date() },
    );
    await queryRunner.manager.save(
      ProjectAgencyResponse,
      newProject.AgencyResponses.map((resp) => ({
        ...resp,
        ProjectId: newProject.Id,
        CreatedById: newProject.CreatedById,
        DeletedById: null,
        DeletedOn: null,
      })),
    );
  }
};

const handleProjectNotes = async (newProject: DeepPartial<Project>, queryRunner: QueryRunner) => {
  if (newProject?.Notes?.length) {
    const saveNotes = newProject.Notes.map(async (note): Promise<InsertResult | void> => {
      if (note.NoteTypeId == null) {
        throw new ErrorWithCode('Provided note was missing a required field.', 400);
      }
      const exists = await queryRunner.manager.findOne(ProjectNote, {
        where: { ProjectId: newProject.Id, NoteTypeId: note.NoteTypeId },
      });
      return queryRunner.manager.upsert(
        ProjectNote,
        {
          ProjectId: newProject.Id,
          Note: note.Note,
          NoteTypeId: note.NoteTypeId,
          CreatedById: exists ? exists.CreatedById : newProject.CreatedById,
          UpdatedById: exists ? newProject.UpdatedById : undefined,
        },
        ['ProjectId', 'NoteTypeId'],
      );
    });
    return Promise.all(saveNotes);
  }
};

const handleProjectTimestamps = async (
  newProject: DeepPartial<Project>,
  queryRunner: QueryRunner,
) => {
  if (newProject?.Timestamps?.length) {
    const saveTimestamps = newProject.Timestamps.map(
      async (timestamp): Promise<InsertResult | void> => {
        if (timestamp.TimestampTypeId == null) {
          throw new ErrorWithCode('Provided timestamp was missing a required field.', 400);
        }
        const exists = await queryRunner.manager.findOne(ProjectTimestamp, {
          where: { ProjectId: newProject.Id, TimestampTypeId: timestamp.TimestampTypeId },
        });
        return queryRunner.manager.upsert(
          ProjectTimestamp,
          {
            ProjectId: newProject.Id,
            Date: timestamp.Date,
            TimestampTypeId: timestamp.TimestampTypeId,
            CreatedById: exists ? exists.CreatedById : newProject.CreatedById,
            UpdatedById: exists ? newProject.UpdatedById : undefined,
          },
          ['ProjectId', 'TimestampTypeId'],
        );
      },
    );
    return Promise.all(saveTimestamps);
  }
};

const handleProjectMonetary = async (
  newProject: DeepPartial<Project>,
  queryRunner: QueryRunner,
) => {
  if (newProject?.Monetaries?.length) {
    const saveTimestamps = newProject.Monetaries.map(
      async (monetary): Promise<InsertResult | void> => {
        if (monetary.MonetaryTypeId == null) {
          throw new ErrorWithCode('Provided monetary was missing a required field.', 400);
        }
        const exists = await queryRunner.manager.findOne(ProjectMonetary, {
          where: { ProjectId: newProject.Id, MonetaryTypeId: monetary.MonetaryTypeId },
        });
        return queryRunner.manager.upsert(
          ProjectMonetary,
          {
            ProjectId: newProject.Id,
            Value: monetary.Value,
            MonetaryTypeId: monetary.MonetaryTypeId,
            CreatedById: exists ? exists.CreatedById : newProject.CreatedById,
            UpdatedById: exists ? newProject.UpdatedById : undefined,
          },
          ['ProjectId', 'MonetaryTypeId'],
        );
      },
    );
    return Promise.all(saveTimestamps);
  }
};

/**
 * Updates a project with the given changes and property IDs.
 *
 * @param project - The project object containing the changes to be made.
 * @param propertyIds - The IDs of the properties to be associated with the project.
 * @returns The result of the project update.
 * @throws {ErrorWithCode} If the project name is empty or null, if the project does not exist, if the project number or agency cannot be changed, or if there is an error updating the project.
 */
const updateProject = async (
  project: DeepPartial<Project>,
  propertyIds: ProjectPropertyIds,
  user: SSOUser,
) => {
  // Project must still have a name
  // undefined is allowed because it is not always updated
  if (project.Name === null || project.Name === '') {
    throw new ErrorWithCode('Projects must have a name.', 400);
  }
  const originalProject = await projectRepo.findOne({
    where: { Id: project.Id },
  });
  if (!originalProject) {
    throw new ErrorWithCode('Project does not exist.', 404);
  }
  // Not allowed to change Project Number
  if (project.ProjectNumber && originalProject.ProjectNumber !== project.ProjectNumber) {
    throw new ErrorWithCode('Project Number may not be changed.', 403);
  } // Not allowed to change the agency
  if (project.AgencyId && originalProject.AgencyId !== project.AgencyId) {
    throw new ErrorWithCode('Project Agency may not be changed.', 403);
  }

  /* TODO: Need something that checks for valid changes between status, workflow, etc.
   * Can address this when business logic is determined.
   */
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.startTransaction();
  try {
    // Metadata field is not preserved if a metadata property is set. It is overwritten.
    // Construct the proper metadata before continuing.
    const newMetadata = { ...originalProject.Metadata, ...project.Metadata };

    await handleProjectTasks({ ...project, CreatedById: project.UpdatedById }, queryRunner);
    await handleProjectAgencyResponses(
      { ...project, CreatedById: project.UpdatedById },
      queryRunner,
    );
    await handleProjectNotes({ ...project, CreatedById: project.UpdatedById }, queryRunner);
    await handleProjectMonetary({ ...project, CreatedById: project.UpdatedById }, queryRunner);
    await handleProjectTimestamps({ ...project, CreatedById: project.UpdatedById }, queryRunner);

    // Update Project
    await queryRunner.manager.save(Project, {
      ...project,
      Metadata: newMetadata,
      Tasks: undefined,
      AgencyResponses: undefined,
      Notes: undefined,
      Timestamps: undefined,
      Monetaries: undefined,
    });
    //Seems this save will also try to save Tasks array if present, but if missing the ProjectId it will do weird stuff.
    //So we could consolidate handleProjectTasks to here if we wanted, but then it might be annoying trying to get the more specific behavior in that function.
    //Same deal with AgencyResponses

    // Update related Project Properties
    const existingProjectProperties = await queryRunner.manager.find(ProjectProperty, {
      where: { ProjectId: originalProject.Id },
    });
    const existingParcelIds = existingProjectProperties
      .map((record) => record.ParcelId)
      .filter((id) => id);
    const existingBuildingIds = existingProjectProperties
      .map((record) => record.BuildingId)
      .filter((id) => id);
    // Adding new Project Properties
    const { parcels: parcelsToAdd, buildings: buildingsToAdd } = propertyIds;
    if (parcelsToAdd) await addProjectParcelRelations(originalProject, parcelsToAdd, queryRunner);
    if (buildingsToAdd)
      await addProjectBuildingRelations(originalProject, buildingsToAdd, queryRunner);

    // Removing the old project properties
    const parcelsToRemove = existingParcelIds.filter(
      (id) => !parcelsToAdd.includes(id) && existingParcelIds.includes(id),
    );
    const buildingsToRemove = existingBuildingIds.filter(
      (id) => !buildingsToAdd.includes(id) && existingBuildingIds.includes(id),
    );

    if (parcelsToRemove)
      await removeProjectParcelRelations(originalProject, parcelsToRemove, queryRunner);
    if (buildingsToRemove)
      await removeProjectBuildingRelations(originalProject, buildingsToRemove, queryRunner);

    // If status was changed, write result to Project Status History table.
    if (project.StatusId !== undefined && originalProject.StatusId !== project.StatusId) {
      await queryRunner.manager.save(ProjectStatusHistory, {
        CreatedById: project.UpdatedById,
        ProjectId: project.Id,
        WorkflowId: originalProject.WorkflowId,
        StatusId: originalProject.StatusId,
      });
    }

    queryRunner.commitTransaction();

    if (project.StatusId !== undefined && originalProject.StatusId !== project.StatusId) {
      await handleProjectNotifications(originalProject, user, queryRunner); //Do this after committing transaction so that we don't send emails to CHES unless the rest of the project metadata actually saved.
    }
    // Get project to return
    const returnProject = await projectRepo.findOne({ where: { Id: originalProject.Id } });
    return returnProject;
  } catch (e) {
    await queryRunner.rollbackTransaction();
    logger.warn(e.message);
    if (e instanceof ErrorWithCode) throw e;
    throw new ErrorWithCode(`Error updating project: ${e.message}`, 500);
  } finally {
    await queryRunner.release();
  }
};

/**
 * Deletes a project by its ID.
 *
 * @param {number} id - The ID of the project to delete.
 * @returns {Promise<DeleteResult>} - A promise that resolves to the delete result.
 * @throws {ErrorWithCode} - If the project does not exist, or if there is an error deleting the project.
 */
const deleteProjectById = async (id: number, username: string) => {
  if (!(await projectRepo.exists({ where: { Id: id } }))) {
    throw new ErrorWithCode('Project does not exist.', 404);
  }
  const user = await userServices.getUser(username);
  const queryRunner = await AppDataSource.createQueryRunner();
  await queryRunner.startTransaction();
  try {
    // Remove Project Properties relations
    await queryRunner.manager.update(
      ProjectProperty,
      { ProjectId: id },
      { DeletedById: user.Id, DeletedOn: new Date() },
    );
    // Remove Project Status History
    await queryRunner.manager.update(
      ProjectStatusHistory,
      { ProjectId: id },
      { DeletedById: user.Id, DeletedOn: new Date() },
    );
    // Remove Project Notes
    await queryRunner.manager.update(
      ProjectNote,
      { ProjectId: id },
      { DeletedById: user.Id, DeletedOn: new Date() },
    );
    // Remove Project Snapshots
    await queryRunner.manager.update(
      ProjectSnapshot,
      { ProjectId: id },
      { DeletedById: user.Id, DeletedOn: new Date() },
    );
    // Remove Project Tasks
    await queryRunner.manager.update(
      ProjectTask,
      { ProjectId: id },
      { DeletedById: user.Id, DeletedOn: new Date() },
    );
    // Remove Project Timestamps
    await queryRunner.manager.update(
      ProjectTimestamp,
      { ProjectId: id },
      { DeletedById: user.Id, DeletedOn: new Date() },
    );
    // Remove Project Monetary
    await queryRunner.manager.update(
      ProjectMonetary,
      { ProjectId: id },
      { DeletedById: user.Id, DeletedOn: new Date() },
    );
    // Remove Project Agency Responses
    await queryRunner.manager.update(
      ProjectAgencyResponse,
      { ProjectId: id },
      { DeletedById: user.Id, DeletedOn: new Date() },
    );
    // Remove Notifications from Project
    /* FIXME: This should eventually be done with the notifications service.
     * Otherwise, any notifications sent to CHES won't be cancelled. -Dylan
     * This is true ^ I think it's best to comment out this delete call for now. -Graham
     */
    // await queryRunner.manager.delete(NotificationQueue, { ProjectId: id });
    // Delete the project
    const deleteResult = await queryRunner.manager.update(
      Project,
      { Id: id },
      { DeletedById: user.Id, DeletedOn: new Date() },
    );
    await queryRunner.commitTransaction();
    return deleteResult;
  } catch (e) {
    await queryRunner.rollbackTransaction();
    logger.warn(e.message);
    if (e instanceof ErrorWithCode) throw e;
    throw new ErrorWithCode('Error deleting project.', 500);
  } finally {
    await queryRunner.release();
  }
};

const sortKeyMapping = (
  sortKey: string,
  sortDirection: FindOptionsOrderValue,
): FindOptionsOrder<Project> => {
  switch (sortKey) {
    case 'Status':
      return { Status: { Name: sortDirection } };
    case 'Agency':
      return { Agency: { Name: sortDirection } };
    case 'UpdatedBy':
      return { UpdatedBy: { LastName: sortDirection } };
    default:
      return { [sortKey]: sortDirection };
  }
};

const collectFindOptions = (filter: ProjectFilter) => {
  const options = [];
  // TODO: Add market value and updated by searches
  if (filter.name) options.push(constructFindOptionFromQuery('Name', filter.name));
  if (filter.agency) options.push(constructFindOptionFromQuery('Agency', filter.agency));
  if (filter.status) options.push(constructFindOptionFromQuery('Status', filter.status));
  if (filter.projectNumber) {
    options.push(constructFindOptionFromQuery('ProjectNumber', filter.projectNumber));
  }
  if (filter.updatedOn) options.push(constructFindOptionFromQuery('UpdatedOn', filter.updatedOn));
  return options;
};

const sortKeyTranslator: Record<string, string> = {
  ProjectNumber: 'project_number',
  Name: 'name',
  Status: 'status_name',
  Agency: 'agency_name',
  NetBook: 'net_book',
  Market: 'market',
  UpdatedOn: 'updated_on',
  UpdatedBy: 'user_full_name',
};

const getProjects = async (filter: ProjectFilter) => {
  const options = collectFindOptions(filter);
  const query = AppDataSource.getRepository(ProjectJoin)
    .createQueryBuilder()
    .where(
      new Brackets((qb) => {
        options.forEach((option) => qb.orWhere(option));
      }),
    );

  // Restricts based on user's agencies
  if (filter.agencyId?.length) {
    query.andWhere('agency_id IN(:...list)', {
      list: filter.agencyId,
    });
  }

  // Add quickfilter part
  if (filter.quickFilter) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const quickFilterOptions: FindOptionsWhere<any>[] = [];
    const quickfilterFields = [
      'ProjectNumber',
      'Name',
      'Status',
      'Agency',
      'NetBook',
      'Market',
      'UpdatedOn',
      'UpdatedBy',
    ];
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
      logger.error('getProjects Service - Invalid Sort Key');
    }
  }
  const [data, totalCount] = await query.getManyAndCount();
  return { data, totalCount };
};

const getProjectsForExport = async (filter: ProjectFilter, includeRelations: boolean = false) => {
  const queryOptions: FindManyOptions<Project> = {
    relations: {
      Agency: {
        Parent: includeRelations,
      },
      TierLevel: includeRelations,
      Risk: includeRelations,
      Status: includeRelations,
      Workflow: includeRelations,
      CreatedBy: includeRelations,
      UpdatedBy: includeRelations,
      // Don't include these joins below. It can be very large.
      Tasks: false,
      Notes: false,
      Timestamps: false,
      Monetaries: false,
      Notifications: false,
    },
    select: {
      Agency: {
        Name: true,
        Parent: {
          Name: true,
        },
      },
      TierLevel: {
        Name: true,
      },
      Risk: {
        Name: true,
      },
      Status: {
        Name: true,
      },
      CreatedBy: {
        Id: true,
        FirstName: true,
        LastName: true,
      },
      UpdatedBy: {
        Id: true,
        FirstName: true,
        LastName: true,
      },
      Workflow: {
        Name: true,
      },
    },
    where: {
      StatusId: filter.statusId,
      AgencyId: filter.agencyId
        ? In(typeof filter.agencyId === 'number' ? [filter.agencyId] : filter.agencyId)
        : undefined,
      ProjectNumber: filter.projectNumber,
    },
    take: filter.quantity,
    skip: (filter.page ?? 0) * (filter.quantity ?? 0),
    order: sortKeyMapping(filter.sortKey, filter.sortOrder as FindOptionsOrderValue),
  };
  const projects = await projectRepo.find(queryOptions);

  /**
   * Separated these queries intentionally.
   * Joining them with the projects call is much slower.
   */
  const tasks = await AppDataSource.getRepository(ProjectTask).find();
  const notes = await AppDataSource.getRepository(ProjectNote).find();
  const monetaries = await AppDataSource.getRepository(ProjectMonetary).find();
  const timestamps = await AppDataSource.getRepository(ProjectTimestamp).find();
  const notifications = await AppDataSource.getRepository(NotificationQueue).find();

  return projects.map((project) => ({
    ...project,
    Tasks: tasks.filter((task) => task.ProjectId === project.Id),
    Notes: notes.filter((note) => note.ProjectId === project.Id),
    Monetaries: monetaries.filter((mon) => mon.ProjectId === project.Id),
    Timestamps: timestamps.filter((time) => time.ProjectId === project.Id),
    Notifications: notifications.filter((notification) => notification.ProjectId === project.Id),
  }));
};

const projectServices = {
  addProject,
  getProjectById,
  deleteProjectById,
  updateProject,
  getProjects,
  getProjectsForExport,
};

export default projectServices;
