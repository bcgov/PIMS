import queryString from 'query-string';
import CustomAxios from 'customAxios';
import { IPagedItems } from 'interfaces';
import { ENVIRONMENT } from 'constants/environment';
import { IProjectFilter, IProject } from './list/interfaces';
import { toFlatProject } from './common/projectConverter';
import { IProperty, IApiProject } from './common';

const { apiUrl: basePath } = ENVIRONMENT;

const API_ENDPOINTS = {
  search: (filter: IProjectFilter) =>
    `${basePath}/projects/search/page?${filter ? queryString.stringify(filter) : ''}`,
  delete: (projectNumber: string) => `${basePath}/projects/disposal/${projectNumber}`,
  properties: (projectNumber: string) => `${basePath}/projects/disposal/${projectNumber}`,
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

const loadProperties = async (projectNumber: string): Promise<{ [key: string]: IProperty[] }> => {
  const url = API_ENDPOINTS.properties(projectNumber);
  const response = await CustomAxios().get<IApiProject>(url);
  const project = toFlatProject(response.data);

  return { [projectNumber]: project?.properties || [] };
};

export default {
  getProjectList,
  deleteProject,
  loadProperties,
};
