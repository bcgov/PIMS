import { ENVIRONMENT } from 'constants/environment';
import CustomAxios from 'customAxios';
import { IApiProject, IProperty } from 'features/projects/interfaces';
import { IPagedItems } from 'interfaces';

import { toFlatProject } from './common/projectConverter';
import { IProject, IProjectFilter } from './list/interfaces';

const { apiUrl: basePath } = ENVIRONMENT;

const API_ENDPOINTS = {
  search: (filter: IProjectFilter) => {
    const queryParams = new URLSearchParams();
    for (const [key, value] of Object.entries(filter ?? {})) {
      queryParams.set(key, String(value));
    }
    return `${basePath}/projects/search/page?${queryParams.toString()}`;
  },
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

const ApiService = {
  getProjectList,
  deleteProject,
  loadProperties,
};

export default ApiService;
