import { ProjectActions } from '../../../constants/actionTypes';
import { handleAxiosResponse } from '../../../utils/utils';
import * as API from 'constants/API';
import { ENVIRONMENT } from 'constants/environment';
import CustomAxios from 'customAxios';
import { saveProjectStatus } from './ProjectWorkflowSlice';

export const fetchProjectWorkflow = () => (dispatch: Function) => {
  const axiosResponse = CustomAxios()
    .get(ENVIRONMENT.apiUrl + API.PROJECT_DISPOSE_WORKFLOW())
    .then(response => dispatch(saveProjectStatus(response.data)));
  return handleAxiosResponse(dispatch, ProjectActions.GET_PROJECT_WORKFLOW, axiosResponse);
};
