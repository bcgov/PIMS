import { ProjectActions } from 'constants/actionTypes';
import * as API from 'constants/API';
import { ENVIRONMENT } from 'constants/environment';
import CustomAxios from 'customAxios';
import { IProject } from 'features/projects/interfaces';
import { AnyAction, Dispatch } from 'redux';
import { handleAxiosResponse } from 'utils';

import { saveProject, saveProjectStatus, saveProjectTasks } from '.';
import { toApiProject } from './projectConverter';
import { saveProjectStatuses } from './slices/projectStatusesSlice';

export const fetchProjectWorkflow =
  (workflowCode: string = 'SUBMIT-DISPOSAL') =>
  async (dispatch: Dispatch<AnyAction>) => {
    const axiosResponse = CustomAxios()
      .get(ENVIRONMENT.apiUrl + API.PROJECT_DISPOSE_WORKFLOW(workflowCode))
      .then((response) => dispatch(saveProjectStatus(response.data)));
    return await handleAxiosResponse(ProjectActions.GET_PROJECT_WORKFLOW, axiosResponse)(dispatch);
  };

export const fetchProjectTasks =
  (statusCode: string | number) => async (dispatch: Dispatch<AnyAction>) => {
    const axiosResponse = CustomAxios()
      .get(ENVIRONMENT.apiUrl + API.PROJECT_DISPOSE_TASKS(statusCode))
      .then((response) => dispatch(saveProjectTasks(response.data)));
    return await handleAxiosResponse(ProjectActions.GET_PROJECT_TASKS, axiosResponse)(dispatch);
  };

export const getProjectTasks =
  (statusCode: string | number) => async (dispatch: Dispatch<AnyAction>) => {
    const axiosResponse = CustomAxios()
      .get(ENVIRONMENT.apiUrl + API.PROJECT_DISPOSE_TASKS(statusCode))
      .then((response) => response.data);
    return await handleAxiosResponse(ProjectActions.GET_PROJECT_TASKS, axiosResponse)(dispatch);
  };

export const fetchProjectStatuses = () => async (dispatch: Dispatch<AnyAction>) => {
  const axiosResponse = CustomAxios()
    .get(ENVIRONMENT.apiUrl + API.PROJECT_STATUSES)
    .then((response) => dispatch(saveProjectStatuses(response.data)));
  return await handleAxiosResponse(ProjectActions.GET_PROJECT_STATUSES, axiosResponse)(dispatch);
};

export const fetchWorkflowTasks =
  (workflowCode: string) => async (dispatch: Dispatch<AnyAction>) => {
    const axiosResponse = CustomAxios()
      .get(ENVIRONMENT.apiUrl + API.PROJECT_WORKFLOW_TASKS(workflowCode))
      .then((response) => dispatch(saveProjectTasks(response.data)));
    return await handleAxiosResponse(ProjectActions.GET_PROJECT_TASKS, axiosResponse)(dispatch);
  };

export const fetchProject = (projectNumber: string) => async (dispatch: Dispatch<AnyAction>) => {
  const axiosResponse = CustomAxios()
    .get(ENVIRONMENT.apiUrl + API.PROJECT_DISPOSE_ROOT + projectNumber)
    .then((response) => dispatch(saveProject(response.data)));

  return (await handleAxiosResponse(
    ProjectActions.GET_PROJECT,
    axiosResponse,
  )(dispatch)) as Promise<IProject>;
};

export const createProject = (body: IProject) => async (dispatch: Dispatch<AnyAction>) => {
  const axiosResponse = CustomAxios()
    .post(ENVIRONMENT.apiUrl + API.PROJECT_DISPOSE_ROOT, toApiProject(body))
    .then((response) => dispatch(saveProject(response.data)));

  return (await handleAxiosResponse(
    ProjectActions.ADD_PROJECT,
    axiosResponse,
  )(dispatch)) as Promise<IProject>;
};

export const updateProject = (body: IProject) => async (dispatch: Dispatch<AnyAction>) => {
  const axiosResponse = CustomAxios()
    .put(ENVIRONMENT.apiUrl + API.PROJECT_DISPOSE_ROOT + body.projectNumber, toApiProject(body))
    .then((response) => dispatch(saveProject(response.data)));

  return (await handleAxiosResponse(
    ProjectActions.UPDATE_PROJECT,
    axiosResponse,
  )(dispatch)) as Promise<IProject>;
};

export const updateWorkflowStatus =
  (body: IProject, statusCode: string, workflowCode: string = 'SUBMIT-DISPOSAL') =>
  async (dispatch: Dispatch<AnyAction>) => {
    const axiosResponse = CustomAxios()
      .put(
        ENVIRONMENT.apiUrl + API.PROJECT_UPDATE_WORKFLOW_STATUS(workflowCode, statusCode),
        toApiProject(body),
      )
      .then((response) => dispatch(saveProject(response.data)));

    return (await handleAxiosResponse(
      ProjectActions.UPDATE_WORKFLOW_STATUS,
      axiosResponse,
    )(dispatch)) as Promise<IProject>;
  };
