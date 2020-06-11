import {
  createProject,
  updateProject,
  fetchProject,
  updateWorkflowStatus,
} from '../projectsActionCreator';
import { ProjectActions } from 'constants/actionTypes';
import { useDispatch } from 'react-redux';
import { clear } from 'actions/genericActions';
import _ from 'lodash';
import useStepper from './useStepper';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import Claims from 'constants/claims';

/** hook providing utilities for project dispose step forms. */
const useStepForm = () => {
  const dispatch = useDispatch();
  const keycloak = useKeycloakWrapper();
  const { getLastCompletedStatus, getNextStep } = useStepper();

  const onSubmit = (values: any, actions: any) => {
    const apiValues = _.cloneDeep(values);
    let response: any;
    const nextStep = getNextStep(getLastCompletedStatus());
    if (nextStep !== undefined) {
      apiValues.statusId = nextStep.id;
    }
    if (nextStep?.isMilestone === true) {
      response = dispatch(updateWorkflowStatus(apiValues, nextStep.id));
    } else if (!apiValues.projectNumber) {
      response = dispatch(createProject(apiValues));
    } else {
      response = dispatch(updateProject(apiValues));
    }
    response
      .then((values: any) => {
        return dispatch(fetchProject(values.projectNumber));
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

  const onSubmitReview = (values: any, actions: any) => {
    const apiValues = _.cloneDeep(values);
    let response: any = dispatch(
      updateWorkflowStatus(apiValues, values.statusCode, 'ACCESS-DISPOSAL'),
    );
    response
      .then((values: any) => {
        return dispatch(fetchProject(values.projectNumber));
      })
      .catch((error: any) => {
        actions.setStatus({ msg: error.toString() });
      })
      .finally(() => {
        dispatch(clear(ProjectActions.UPDATE_PROJECT));
        actions.setSubmitting(false);
      });
    return response;
  };

  const canUserEditForm = (projectAgencyId: number) =>
    (keycloak.hasAgency(projectAgencyId) && keycloak.hasClaim(Claims.PROJECT_EDIT)) ||
    keycloak.hasClaim(Claims.ADMIN_PROJECTS);
  return { onSubmit, canUserEditForm, onSubmitReview };
};

export default useStepForm;
