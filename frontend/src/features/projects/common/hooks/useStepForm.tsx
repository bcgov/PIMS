import { AxiosError } from 'axios';
import { ProjectActions } from 'constants/actionTypes';
import Claims from 'constants/claims';
import { Roles } from 'constants/roles';
import { IProject } from 'features/projects/interfaces';
import { FormikValues } from 'formik';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import _ from 'lodash';
import { MutableRefObject } from 'react';
import { useAppDispatch, useAppSelector } from 'store';
import { useNetworkStore } from 'store/slices/hooks';

import { createProject, updateProject, updateWorkflowStatus } from '..';

/** hook providing utilities for project dispose step forms. */
const useStepForm = () => {
  const network = useNetworkStore();
  const dispatch = useAppDispatch();
  const keycloak = useKeycloakWrapper();
  const getProjectRequest = useAppSelector(
    (store) => (store.network.requests as any)[ProjectActions.GET_PROJECT],
  );
  const addProjectRequest = useAppSelector(
    (store) => (store.network.requests as any)[ProjectActions.ADD_PROJECT],
  );
  const updateProjectRequest = useAppSelector(
    (store) => (store.network.requests as any)[ProjectActions.UPDATE_PROJECT],
  );
  const updateWorflowStatusRequest = useAppSelector(
    (store) => (store.network.requests as any)[ProjectActions.UPDATE_WORKFLOW_STATUS],
  );
  const noFetchingProjectRequests =
    getProjectRequest?.isFetching !== true &&
    addProjectRequest?.isFetching !== true &&
    updateProjectRequest?.isFetching !== true &&
    updateWorflowStatusRequest?.isFetching !== true;

  //TODO: There is a known issue in formik preventing submitForm()
  // from returning promises. For the time being the higher level
  // functions will need to handle all chained promises.
  const onSubmit = (values: any) => Promise.resolve(values);

  const onSubmitReview = async (
    values: IProject,
    formikRef: MutableRefObject<FormikValues | undefined>,
    statusCode?: string,
    workflow?: string,
  ): Promise<IProject> => {
    const apiValues = _.cloneDeep(values);
    if (values.exemptionRequested && statusCode !== undefined) {
      return await updateWorkflowStatus(
        apiValues,
        statusCode,
        workflow ?? apiValues.workflowCode,
      )(dispatch);
    }

    if (statusCode !== undefined) {
      return await updateWorkflowStatus(
        apiValues,
        statusCode,
        workflow ?? apiValues.workflowCode,
      )(dispatch).catch((error: any) => {
        const msg: string = error?.response?.data?.error ?? error.toString();
        formikRef?.current?.setStatus({ msg });
        return apiValues;
      });
    }

    return await updateProject(apiValues)(dispatch).catch((error: any) => {
      const msg: string = error?.response?.data?.error ?? error.toString();
      formikRef?.current?.setStatus({ msg });
      return apiValues;
    });
  };

  const canUserOverride = () => {
    return keycloak.hasRole(Roles.SRES_FINANCIAL_MANAGER); // TODO: This is a temporary way to allow for editing the historical projects and should be replaced with a better implementation.
  };

  const canUserEditForm = (projectAgencyId: number) => {
    return (
      (keycloak.hasAgency(projectAgencyId) && keycloak.hasClaim(Claims.PROJECT_EDIT)) ||
      keycloak.hasClaim(Claims.ADMIN_PROJECTS)
    );
  };

  const canUserSubmitForm = () => {
    return keycloak.hasClaim(Claims.DISPOSE_REQUEST);
  };

  const canUserApproveForm = () => {
    return keycloak.hasClaim(Claims.ADMIN_PROJECTS);
  };

  const addOrUpdateProject = (
    project: IProject,
    formikRef: MutableRefObject<FormikValues | undefined>,
  ) => {
    let promise: Promise<IProject>;
    if (project.projectNumber === undefined || project.projectNumber === '') {
      promise = createProject(project)(dispatch);
    } else {
      promise = updateProject(project)(dispatch);
    }
    return promise
      .catch((error: AxiosError<any>) => {
        const msg: string = error?.response?.data?.error ?? error.toString();
        formikRef?.current?.setStatus({ msg });
        throw Error(`Axios request failed: ${msg}`);
      })
      .finally(() => {
        network.clearRequest(ProjectActions.UPDATE_PROJECT);
        network.clearRequest(ProjectActions.ADD_PROJECT);
      });
  };

  const onSave = (formikRef: MutableRefObject<FormikValues | undefined>) => {
    return formikRef.current?.submitForm().then(() => {
      const values = formikRef?.current?.values;
      const errors = formikRef?.current?.errors;

      // do not go to the next step if the form has validation errors.
      if (errors === undefined || Object.keys(errors).length === 0) {
        return addOrUpdateProject(values, formikRef);
      }
    });
  };
  return {
    onSubmit,
    canUserOverride,
    canUserEditForm,
    canUserSubmitForm,
    canUserApproveForm,
    onSubmitReview,
    addOrUpdateProject,
    onSave,
    noFetchingProjectRequests,
    getProjectRequest,
  };
};

export default useStepForm;
