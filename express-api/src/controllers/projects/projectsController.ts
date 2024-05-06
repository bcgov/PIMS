import { ProjectFilterSchema, ProjectFilter } from '@/services/projects/projectSchema';
import { stubResponse } from '../../utilities/stubResponse';
import { Request, Response } from 'express';
import { SSOUser } from '@bcgov/citz-imb-sso-express';
import projectServices, { ProjectPropertyIds } from '@/services/projects/projectsServices';
import userServices from '@/services/users/usersServices';
import { isAdmin, isAuditor, checkUserAgencyPermission } from '@/utilities/authorizationChecks';
import { DeepPartial } from 'typeorm';
import { Project } from '@/typeorm/Entities/Project';

/**
 * @description Get disposal project by either the numeric id or projectNumber.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with the requested project.
 */
export const getDisposalProject = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Projects']
   * #swagger.description = 'Get disposal project by either the numeric id or projectNumber.'
   * #swagger.security = [{
   *   "bearerAuth" : []
   * }]
   */
  const user = req.user as SSOUser;
  const projectId = Number(req.params.projectId);
  if (isNaN(projectId)) {
    return res.status(400).send('Project ID was invalid.');
  }
  const project = await projectServices.getProjectById(projectId);
  if (!project) {
    return res.status(404).send('Project matching this internal ID not found.');
  }

  if (!(await checkUserAgencyPermission(user, [project.AgencyId]))) {
    return res.status(403).send('You are not authorized to view this project.');
  }

  const buildings = project.ProjectProperties.filter((a) => a.Building != null).map(
    (a) => a.Building,
  );
  const parcels = project.ProjectProperties.filter((p) => p.Parcel != null).map((p) => p.Parcel);
  return res.status(200).send({ ...project, Buildings: buildings, Parcels: parcels });
};

/**
 * @description Update disposal project by either the numeric id.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with the updated project.
 */
export const updateDisposalProject = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Projects']
   * #swagger.description = 'Update the project for the specified id.'
   * #swagger.security = [{
   *   "bearerAuth" : []
   * }]
   */
  const projectId = Number(req.params.projectId);
  if (isNaN(projectId)) {
    return res.status(400).send('Invalid Project ID');
  }

  if (!req.body.project || !req.body.propertyIds) {
    return res
      .status(400)
      .send('Request must include the following: {project:..., propertyIds:...}');
  }

  if (projectId != req.body.project.Id) {
    return res.status(400).send('The param ID does not match the request body.');
  }
  // need to coordinate how we want tasks to be translated
  const user = await userServices.getUser(req.user.preferred_username);
  const updateBody = { ...req.body.project, UpdatedById: user.Id };
  const project = await projectServices.updateProject(updateBody, req.body.propertyIds);
  return res.status(200).send(project);
};

/**
 * @description Delete disposal project by either the numeric id or projectNumber.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with the deleted project.
 */
export const deleteDisposalProject = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Projects']
   * #swagger.description = 'Delete the project for the specified id.'
   * #swagger.security = [{
   *   "bearerAuth" : []
   * }]
   */
  const projectId = Number(req.params.projectId);
  if (isNaN(projectId)) {
    return res.status(400).send('Invalid Project ID');
  }

  const delProject = projectServices.deleteProjectById(projectId);
  return res.status(200).send(delProject);
};

/**
 * @description Add disposal project.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with the new project.
 */
export const addDisposalProject = async (req: Request, res: Response) => {
  // Extract project data from request body
  // Extract projectData and propertyIds from the request body
  const {
    project,
    projectPropertyIds,
  }: { project: DeepPartial<Project>; projectPropertyIds: ProjectPropertyIds } = req.body;
  const user = await userServices.getUser((req.user as SSOUser).preferred_username);
  const addBody = { ...project, CreatedById: user.Id, AgencyId: user.AgencyId };

  // Call the addProject service function with the project data
  const newProject = await projectServices.addProject(addBody, projectPropertyIds);

  // Return the new project in the response
  return res.status(201).json(newProject);
};

/**
 * @description Request a status change for the project with the specified id..
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with the requested project.
 */
export const requestProjectStatusChange = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Projects']
   * #swagger.description = 'Request a status change for the project with the specified id.'
   * #swagger.security = [{
   *   "bearerAuth" : []
   * }]
   */
  return stubResponse(res);
};

/**
 * @description Get a report for the specified project.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with the requested report.
 */
export const getProjectReport = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Projects']
   * #swagger.description = 'Get the report for the project with the specified id.'
   * #swagger.security = [{
   *   "bearerAuth" : []
   * }]
   */
  return stubResponse(res);
};

/**
 * @description Update the report for the specified project.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with the updated report.
 */
export const updateProjectReport = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Projects']
   * #swagger.description = 'Update the report for the project with the specified id.'
   * #swagger.security = [{
   *   "bearerAuth" : []
   * }]
   */
  return stubResponse(res);
};

/**
 * @description Delete the report for the specified project.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with the deleted report.
 */
export const deleteProjectReport = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Projects']
   * #swagger.description = 'Delete the report for the project with the specified id.'
   * #swagger.security = [{
   *   "bearerAuth" : []
   * }]
   */
  return stubResponse(res);
};

/**
 * @description Get every project report.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with the an array of reports.
 */
export const getAllProjectReports = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Projects']
   * #swagger.description = 'Get all project reports.'
   * #swagger.security = [{
   *   "bearerAuth" : []
   * }]
   */
  return stubResponse(res);
};

/**
 * @description Add a new project report.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with the new report.
 */
export const addProjectReport = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Projects']
   * #swagger.description = 'Add a new project report.'
   * #swagger.security = [{
   *   "bearerAuth" : []
   * }]
   */
  return stubResponse(res);
};

/**
 * @description Get all of the project snapshots for the specified report id.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with the an array of report snapshots.
 */
export const getProjectReportSnapshots = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Projects']
   * #swagger.description = 'Get snapshots for the report of the project with the specified id.'
   * #swagger.security = [{
   *   "bearerAuth" : []
   * }]
   */
  return stubResponse(res);
};

/**
 * @description Get a refreshed list of snapshots for the specified report id.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with the an array of report snapshots.
 */
export const refreshProjectSnapshots = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Projects']
   * #swagger.description = 'Get a refreshed list of project snapshots based on the current data in the database.'
   * #swagger.security = [{
   *   "bearerAuth" : []
   * }]
   */
  return stubResponse(res);
};

/**
 * @description Get all of the project snapshots for the specified report id.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with the an array of report snapshots.
 */
export const generateProjectReportSnapshots = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Projects']
   * #swagger.description = 'Get all of the project snapshots for the specified report id. If snapshots to not exist for the for the 'To' date in the passed report they will be generated. By passing a 'From' date different than the report saved in the DB, the variances will be calculated against the passed 'From' date.'
   * #swagger.security = [{
   *   "bearerAuth" : []
   * }]
   */
  return stubResponse(res);
};

/**
 * @description Get all of the projects matching the query strings.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with the an array of projects.
 */
export const searchProjects = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Projects']
   * #swagger.description = 'Search projects based on specified criteria.'
   * #swagger.security = [{
   *   "bearerAuth" : []
   * }]
   */
  return stubResponse(res);
};

/**
 * @description Get all of the projects matching the request body.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with the an array of projects.
 */
export const filterProjects = async (req: Request, res: Response) => {
  const filter = ProjectFilterSchema.safeParse(req.query);
  const includeRelations = req.query.includeRelations === 'true';
  const forExcelExport = req.query.excelExport === 'true';
  const kcUser = req.user as unknown as SSOUser;
  if (!filter.success) {
    return res.status(400).send('Could not parse filter.');
  }
  const filterResult = filter.data;
  if (!(isAdmin(kcUser) || isAuditor(kcUser))) {
    // get array of user's agencies
    const usersAgencies = await userServices.getAgencies(kcUser.preferred_username);
    filterResult.agencyId = usersAgencies;
  }
  // Get projects associated with agencies of the requesting user
  const projects = forExcelExport
    ? await projectServices.getProjectsForExport(filterResult as ProjectFilter, includeRelations)
    : await projectServices.getProjects(filterResult as ProjectFilter, includeRelations);
  return res.status(200).send(projects);
};

/**
 * @description Get an array of all possible project statuses.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with the an array of statuses.
 */
export const getAllProjectStatus = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Projects']
   * #swagger.description = 'Get all project statuses.'
   * #swagger.security = [{
   *   "bearerAuth" : []
   * }]
   */
  return stubResponse(res);
};

/**
 * @description Get an array of all tasks associated with a specific status.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with the an array of tasks.
 */
export const getProjectStatusTasks = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Projects']
   * #swagger.description = 'Get tasks associated with the status id.'
   * #swagger.security = [{
   *   "bearerAuth" : []
   * }]
   */
  return stubResponse(res);
};

/**
 * @description Get an array of all statuses associated with a specific workflow.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with the an array of tasks.
 */
export const getProjectWorkflowStatuses = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Projects']
   * #swagger.description = 'Get statuses associated with the workflow.'
   * #swagger.security = [{
   *   "bearerAuth" : []
   * }]
   */
  return stubResponse(res);
};

/**
 * @description Get an array of all tasks associated with a specific workflow.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with the an array of tasks.
 */
export const getProjectWorkflowTasks = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Projects']
   * #swagger.description = 'Get tasks associated with the workflow.'
   * #swagger.security = [{
   *   "bearerAuth" : []
   * }]
   */
  return stubResponse(res);
};
