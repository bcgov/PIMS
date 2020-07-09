import { ProjectActions } from '../../../constants/actionTypes';
import { handleAxiosResponse } from '../../../utils/utils';
import * as API from 'constants/API';
import { ENVIRONMENT } from 'constants/environment';
import CustomAxios from 'customAxios';
import { toApiProject } from './projectConverter';
import { saveProjectStatus, saveProjectTasks, saveProject, IProject } from '.';
import { saveProjectStatuses } from './slices/projectStatusesSlice';

export const fetchProjectWorkflow = (workflowCode: string = 'SUBMIT-DISPOSAL') => (
  dispatch: Function,
) => {
  const axiosResponse = CustomAxios()
    .get(ENVIRONMENT.apiUrl + API.PROJECT_DISPOSE_WORKFLOW(workflowCode))
    .then(response => dispatch(saveProjectStatus(response.data)));
  return handleAxiosResponse(dispatch, ProjectActions.GET_PROJECT_WORKFLOW, axiosResponse);
};

export const fetchProjectTasks = (statusCode: string | number) => (dispatch: Function) => {
  const axiosResponse = CustomAxios()
    .get(ENVIRONMENT.apiUrl + API.PROJECT_DISPOSE_TASKS(statusCode))
    .then(response => dispatch(saveProjectTasks(response.data)));
  return handleAxiosResponse(dispatch, ProjectActions.GET_PROJECT_TASKS, axiosResponse);
};

export const getProjectTasks = (statusCode: string | number) => (dispatch: Function) => {
  return CustomAxios()
    .get(ENVIRONMENT.apiUrl + API.PROJECT_DISPOSE_TASKS(statusCode))
    .then(response => response.data);
};

export const fetchProjectStatuses = () => (dispatch: Function) => {
  const axiosResponse = CustomAxios()
    .get(ENVIRONMENT.apiUrl + API.PROJECT_STATUSES)
    .then(response => dispatch(saveProjectStatuses(response.data)));
  return handleAxiosResponse(dispatch, ProjectActions.GET_PROJECT_STATUSES, axiosResponse);
};

export const fetchWorkflowTasks = (workflowCode: string) => (dispatch: Function) => {
  const axiosResponse = CustomAxios()
    .get(ENVIRONMENT.apiUrl + API.PROJECT_WORKFLOW_TASKS(workflowCode))
    .then(response => dispatch(saveProjectTasks(response.data)));
  return handleAxiosResponse(dispatch, ProjectActions.GET_PROJECT_TASKS, axiosResponse);
};

export const fetchProject = (projectNumber: string) => (dispatch: Function) => {
  const axiosResponse = CustomAxios()
    .get(ENVIRONMENT.apiUrl + API.PROJECT_DISPOSE_ROOT + projectNumber)
    .then(response => dispatch(saveProject(response.data)));
  return handleAxiosResponse(dispatch, ProjectActions.GET_PROJECT, axiosResponse);
};

export const createProject = (body: IProject) => (dispatch: Function) => {
  const axiosResponse = CustomAxios()
    .post(ENVIRONMENT.apiUrl + API.PROJECT_DISPOSE_ROOT, toApiProject(body))
    .then(response => dispatch(saveProject(response.data)));
  return handleAxiosResponse(dispatch, ProjectActions.ADD_PROJECT, axiosResponse);
};

export const updateProject = (body: IProject) => (dispatch: Function) => {
  const axiosResponse = CustomAxios()
    .put(ENVIRONMENT.apiUrl + API.PROJECT_DISPOSE_ROOT + body.projectNumber, toApiProject(body))
    .then(response => dispatch(saveProject(response.data)));
  return handleAxiosResponse(dispatch, ProjectActions.UPDATE_PROJECT, axiosResponse);
};

export const updateWorkflowStatus = (
  body: IProject,
  statusCode: string,
  workflowCode: string = 'SUBMIT-DISPOSAL',
) => (dispatch: Function) => {
  const axiosResponse = CustomAxios()
    .put(
      ENVIRONMENT.apiUrl + API.PROJECT_UPDATE_WORKFLOW_STATUS(workflowCode, statusCode),
      toApiProject(body),
    )
    .then(response => dispatch(saveProject(response.data)));
  return handleAxiosResponse(dispatch, ProjectActions.UPDATE_WORKFLOW_STATUS, axiosResponse);
};
