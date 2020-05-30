import { createProject, updateProject, fetchProject } from '../projectsActionCreator';
import { ProjectActions } from 'constants/actionTypes';
import { useDispatch } from 'react-redux';
import { IProject } from '..';
import { clear } from 'actions/genericActions';
import _ from 'lodash';
import useStepper from '../hooks/useStepper';

/** hook providing utilities for project dispose step forms. */
const useStepForm = () => {
  const dispatch = useDispatch();
  const { getLastCompletedStatusId } = useStepper();

  const onSubmit = (values: IProject, actions: any) => {
    const apiValues = _.cloneDeep(values);
    let response: any;
    apiValues.statusId = getLastCompletedStatusId();
    if (!apiValues.projectNumber) {
      response = dispatch(createProject(apiValues));
    } else {
      response = dispatch(updateProject(apiValues));
    }
    response
      .then(() => {
        dispatch(fetchProject(apiValues.projectNumber));
      })
      .catch((error: any) => {
        actions.setStatus({ msg: error.toString() });
      })
      .finally(() => {
        dispatch(clear(ProjectActions.ADD_PROJECT));
        dispatch(clear(ProjectActions.UPDATE_PROJECT));
        actions.setSubmitting(false);
      });
    return response;
  };
  return { onSubmit };
};

export default useStepForm;
