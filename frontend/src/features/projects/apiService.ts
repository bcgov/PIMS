import queryString from 'query-string';
import CustomAxios from 'customAxios';
import { IPagedItems } from 'interfaces';
import { ENVIRONMENT } from 'constants/environment';
import { IProjectFilter, IProject } from './list/interfaces';

const { apiUrl: basePath } = ENVIRONMENT;

const API_ENDPOINTS = {
  search: (filter: IProjectFilter) =>
    `${basePath}/projects/search/page?${filter ? queryString.stringify(filter) : ''}`,
  delete: (projectNumber: string) => `${basePath}/projects/disposal/${projectNumber}`,
};

const getProjectList = async (filter: IProjectFilter): Promise<IPagedItems<IProject>> => {
  const url = API_ENDPOINTS.search(filter);
  const response = await CustomAxios().get<IPagedItems<IProject>>(url);
  return response.data;
};

const deleteProject = async (project: IProject) => {
  const url = API_ENDPOINTS.delete(project.projectNumber);
  const response = await CustomAxios().request({
    url,
    method: 'DELETE',
    data: project,
  });
  return response.data;
};

export default {
  getProjectList,
  deleteProject,
};
