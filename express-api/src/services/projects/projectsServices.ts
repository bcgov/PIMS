import { AppDataSource } from '@/appDataSource';
import { Agency } from '@/typeorm/Entities/Agency';
import { Building } from '@/typeorm/Entities/Building';
import { Parcel } from '@/typeorm/Entities/Parcel';
import { Project } from '@/typeorm/Entities/Project';
import { ProjectProperty } from '@/typeorm/Entities/ProjectProperty';
import { ErrorWithCode } from '@/utilities/customErrors/ErrorWithCode';
import { DeepPartial, FindOptionsOrder, In } from 'typeorm';
import { ProjectFilter } from '@/services/projects/projectSchema';

const projectRepo = AppDataSource.getRepository(Project);
const projectPropertiesRepo = AppDataSource.getRepository(ProjectProperty);
const parcelRepo = AppDataSource.getRepository(Parcel);
const buildingRepo = AppDataSource.getRepository(Building);
export interface ProjectPropertyIds {
  parcels?: number[];
  buildings?: number[];
}

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

const getProjects = async (filter: ProjectFilter, includeRelations: boolean = false) => {
  const projects = await projectRepo.find({
    relations: {
      ProjectProperties: includeRelations,
      Agency: includeRelations,
      Status: includeRelations,
    },
    select: {
      Agency: {
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
    order: filter.sort as FindOptionsOrder<Project>,
  });
  return projects;
};

const projectServices = {
  addProject,
  getProjects,
};

export default projectServices;
