import { saveProjectTasks } from './slices/projectTasksSlice';
import { ProjectActions } from '../../../constants/actionTypes';
import { handleAxiosResponse } from '../../../utils/utils';
import * as API from 'constants/API';
import { ENVIRONMENT } from 'constants/environment';
import CustomAxios from 'customAxios';
import { saveProjectStatus } from './slices/projectWorkflowSlice';
import { IProject } from './interfaces';
import { saveProject } from './slices/projectSlice';
import { toApiProject } from './projectConverter';

export const fetchProjectWorkflow = () => (dispatch: Function) => {
  const axiosResponse = CustomAxios()
    .get(ENVIRONMENT.apiUrl + API.PROJECT_DISPOSE_WORKFLOW)
    .then(response => dispatch(saveProjectStatus(response.data)));
  return handleAxiosResponse(dispatch, ProjectActions.GET_PROJECT_WORKFLOW, axiosResponse);
};

export const fetchProjectTasks = () => (dispatch: Function) => {
  const axiosResponse = CustomAxios()
    .get(ENVIRONMENT.apiUrl + API.PROJECT_DISPOSE_TASKS)
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
  const axiosResponse = CustomAxios().post(
    ENVIRONMENT.apiUrl + API.PROJECT_DISPOSE_ROOT,
    toApiProject(body),
  );
  return handleAxiosResponse(dispatch, ProjectActions.ADD_PROJECT, axiosResponse);
};

export const updateProject = (body: IProject) => (dispatch: Function) => {
  const axiosResponse = CustomAxios().put(
    ENVIRONMENT.apiUrl + API.PROJECT_DISPOSE_ROOT + body.projectNumber,
    toApiProject(body),
  );
  return handleAxiosResponse(dispatch, ProjectActions.UPDATE_PROJECT, axiosResponse);
};
