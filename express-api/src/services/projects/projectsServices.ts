import { AppDataSource } from '@/appDataSource';
import { Agency } from '@/typeorm/Entities/Agency';
import { Project } from '@/typeorm/Entities/Project';
import { ErrorWithCode } from '@/utilities/customErrors/ErrorWithCode';

const projectRepo = AppDataSource.getRepository(Project);

const addProject = async (project: Project) => {
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
  project.StatusId = project.Metadata.exemptionRequested ? 8 : 7;
  // Get a project number from the sequence
  const [{ nextval }] = await AppDataSource.query("SELECT NEXTVAL('project_num_seq')");
  // TODO: If drafts become possible, this can't always be SPP.
  project.ProjectNumber = `SPP-${nextval}`;
  const result = await projectRepo.save(project);
  return result;
};

const projectServices = {
  addProject,
};

export default projectServices;
