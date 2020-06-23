import { updateProject, updateWorkflowStatus, createProject } from '../projectsActionCreator';
import { ProjectActions } from 'constants/actionTypes';
import { useDispatch } from 'react-redux';
import { clear } from 'actions/genericActions';
import _ from 'lodash';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import Claims from 'constants/claims';
import { IProject } from '..';
import { MutableRefObject } from 'react';
import { FormikValues } from 'formik';
import { AxiosError } from 'axios';

/** hook providing utilities for project dispose step forms. */
const useStepForm = () => {
  const dispatch = useDispatch();
  const keycloak = useKeycloakWrapper();

  //TODO: There is a known issue in formik preventing submitForm()
  // from returning promises. For the time being the higher level
  // functions will need to handle all chained promises.
  const onSubmit = (values: any, actions: any) => Promise.resolve(values);

  const onSubmitReview = (values: any, actions: any, statusCode?: string) => {
    const apiValues = _.cloneDeep(values);
    return ((statusCode !== undefined
      ? dispatch(updateWorkflowStatus(apiValues, statusCode, 'ACCESS-DISPOSAL'))
      : Promise.resolve(apiValues)) as any)
      .then((values: IProject) => {
        return dispatch(
          updateProject({
            ...apiValues,
            statusCode: values.statusCode,
            rowVersion: values.rowVersion,
          }),
        );
      })
      .catch((error: any) => {
        const msg: string = error?.response?.data?.error ?? error.toString();
        actions.setStatus({ msg });
      })
      .finally(() => {
        dispatch(clear(ProjectActions.UPDATE_PROJECT));
      });
  };

  const canUserEditForm = (projectAgencyId: number) => {
    return (
      (keycloak.hasAgency(projectAgencyId) && keycloak.hasClaim(Claims.PROJECT_EDIT)) ||
      keycloak.hasClaim(Claims.ADMIN_PROJECTS)
    );
  };

  const canUserApproveForm = () => {
    return keycloak.hasClaim(Claims.ADMIN_PROJECTS);
  };

  const addOrUpdateProject = (
    project: IProject,
    formikRef: MutableRefObject<FormikValues | undefined>,
  ) => {
    let promise: Promise<any>;
    if (project.projectNumber === undefined) {
      promise = dispatch(createProject(project)) as any;
    } else {
      promise = dispatch(updateProject(project)) as any;
    }
    return promise
      .catch((error: AxiosError) => {
        const msg: string = error?.response?.data?.error ?? error.toString();
        formikRef?.current?.setStatus({ msg });
        throw Error('axios request failed');
      })
      .finally(() => {
        dispatch(clear(ProjectActions.UPDATE_PROJECT));
        dispatch(clear(ProjectActions.ADD_PROJECT));
        formikRef?.current?.setSubmitting(false);
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
    canUserEditForm,
    canUserApproveForm,
    onSubmitReview,
    addOrUpdateProject,
    onSave,
  };
};

export default useStepForm;
