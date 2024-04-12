import { AppDataSource } from '@/appDataSource';
import { Agency } from '@/typeorm/Entities/Agency';
import { Building } from '@/typeorm/Entities/Building';
import { NotificationQueue } from '@/typeorm/Entities/NotificationQueue';
import { Parcel } from '@/typeorm/Entities/Parcel';
import { Project } from '@/typeorm/Entities/Project';
import { ProjectNote } from '@/typeorm/Entities/ProjectNote';
import { ProjectProperty } from '@/typeorm/Entities/ProjectProperty';
import { ProjectSnapshot } from '@/typeorm/Entities/ProjectSnapshot';
import { ErrorWithCode } from '@/utilities/customErrors/ErrorWithCode';
import { DeepPartial } from 'typeorm';

const projectRepo = AppDataSource.getRepository(Project);
const projectPropertiesRepo = AppDataSource.getRepository(ProjectProperty);
const parcelRepo = AppDataSource.getRepository(Parcel);
const buildingRepo = AppDataSource.getRepository(Building);
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
      Agency: true,
      Workflow: true,
      TierLevel: true,
      Status: true,
      Risk: true,
      ProjectProperties: true,
    },
    select: {
      Workflow: {
        Name: true,
        Code: true,
        Description: true,
      },
      Agency: {
        Name: true,
        Code: true,
      },
      TierLevel: {
        Name: true,
        Description: true,
      },
      Status: {
        Name: true,
        GroupName: true,
        Description: true,
        IsTerminal: true,
        IsMilestone: true,
      },
      Risk: {
        Name: true,
        Code: true,
        Description: true,
      },
    },
  });
  return project;
};

/**
 * Adds a new project to the database.
 *
 * @param project - The project object to be added.
 * @param propertyIds - The IDs of the properties (parcels and buildings) to be associated with the project.
 * @returns The newly created project.
 * @throws ErrorWithCode - If the project name is missing, agency is not found, or there is an error creating the project.
 */
const addProject = async (project: DeepPartial<Project>, propertyIds: ProjectPropertyIds) => {
  // Does the project have a name?
  if (!project.Name) throw new ErrorWithCode('Projects must have a name.', 400);

  // Check if agency exists
  if (!(await AppDataSource.getRepository(Agency).exists({ where: { Id: project.AgencyId } }))) {
    throw new ErrorWithCode(`Agency with ID ${project.AgencyId} not found.`, 404);
  }

  // Workflow ID during submission will always be the submit entry
  project.WorkflowId = 1; // 1 == Submit Disposal

  // Only project type at the moment is 1 (Disposal)
  project.ProjectType = 1;

  // What type of submission is this? Regular (7) or Exemption (8)?
  project.StatusId = project.Metadata?.exemptionRequested ? 8 : 7;

  // Get a project number from the sequence
  const [{ nextval }] = await AppDataSource.query("SELECT NEXTVAL('project_num_seq')");

  // TODO: If drafts become possible, this can't always be SPP.
  project.ProjectNumber = `SPP-${nextval}`;
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.startTransaction();
  try {
    const newProject = await projectRepo.save(project);
    // After project is saved, add parcel/building relations
    const { parcels, buildings } = propertyIds;
    if (propertyIds.parcels) await addProjectParcelRelations(newProject, parcels);
    if (propertyIds.buildings) await addProjectBuildingRelations(newProject, buildings);
    await queryRunner.commitTransaction();
    return newProject;
  } catch (e) {
    await queryRunner.rollbackTransaction();
    if (e instanceof ErrorWithCode) throw e;
    throw new ErrorWithCode('Error creating project.', 500);
  }
};

const addProjectParcelRelations = async (project: Project, parcelIds: number[]) => {
  await Promise.all(
    parcelIds?.map(async (parcelId) => {
      const existingParcel = await parcelRepo.findOne({ where: { Id: parcelId } });
      if (!existingParcel) {
        throw new ErrorWithCode(`Parcel with ID ${parcelId} does not exist.`, 404);
      }
      if (
        await projectPropertiesRepo.exists({
          where: {
            ProjectId: project.Id,
            PropertyTypeId: 1,
            ParcelId: parcelId,
          },
        })
      ) {
        throw new ErrorWithCode(
          `Parcel with ID ${parcelId} already belongs to another project.`,
          400,
        );
      }
      // Is this a land (0) or subdivision (2)
      const propertyType = existingParcel.ParentParcelId ? 2 : 0;
      const entry: Partial<ProjectProperty> = {
        CreatedById: project.CreatedById,
        ProjectId: project.Id,
        PropertyTypeId: propertyType,
        ParcelId: parcelId,
      };
      await projectPropertiesRepo.save(entry);
    }),
  );
};

const addProjectBuildingRelations = async (project: Project, buildingIds: number[]) => {
  await Promise.all(
    buildingIds?.map(async (buildingId) => {
      const existingBuilding = await buildingRepo.findOne({ where: { Id: buildingId } });
      if (!existingBuilding) {
        throw new ErrorWithCode(`Building with ID ${buildingId} does not exist.`, 404);
      }
      if (
        await projectPropertiesRepo.exists({
          where: {
            ProjectId: project.Id,
            PropertyTypeId: 1,
            BuildingId: buildingId,
          },
        })
      ) {
        throw new ErrorWithCode(
          `Building with ID ${buildingId} already belongs to another project.`,
          400,
        );
      }
      // Property type building (1)
      const entry: Partial<ProjectProperty> = {
        CreatedById: project.CreatedById,
        ProjectId: project.Id,
        PropertyTypeId: 1,
        BuildingId: buildingId,
      };
      await projectPropertiesRepo.save(entry);
    }),
  );
};

const deleteProjectById = async (id: number) => {
  if (!(await projectRepo.exists({ where: { Id: id } }))) {
    throw new ErrorWithCode('Project does not exist.', 404);
  }
  const queryRunner = await AppDataSource.createQueryRunner();
  queryRunner.startTransaction();
  try {
    // Remove Project Properties relations
    await projectPropertiesRepo.delete({ ProjectId: id });
    // Remove Project Notes
    await AppDataSource.getRepository(ProjectNote).delete({ ProjectId: id });
    // Remove Project Snapshots
    await AppDataSource.getRepository(ProjectSnapshot).delete({ ProjectId: id });
    // Remove Notifications from Project
    /* FIXME: This should eventually be done with the notifications service.
     * Otherwise, any notifications sent to CHES won't be cancelled.
     */
    await AppDataSource.getRepository(NotificationQueue).delete({ ProjectId: id });
    // Delete the project
    const deleteResult = await projectRepo.delete({ Id: id });
    queryRunner.commitTransaction();
    return deleteResult;
  } catch (e) {
    await queryRunner.rollbackTransaction();
    if (e instanceof ErrorWithCode) throw e;
    throw new ErrorWithCode('Error deleting project.', 500);
  }
};

const projectServices = {
  addProject,
  getProjectById,
  deleteProjectById,
};

export default projectServices;
