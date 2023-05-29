import {
  DisposeWorkflowStatus,
  projectWorkflowComponents,
  ReviewWorkflowStatus,
} from 'features/projects/constants';
import { IProject, IProjectWorkflowComponent } from 'features/projects/interfaces';
import { FormikValues } from 'formik';
import _ from 'lodash';
import React, { useEffect, useRef } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'store';

import { clearProject, SresManual, updateWorkflowStatus, useStepForm } from '../common';
import { GeneratedDisposeStepper, StepActions, useStepper } from '.';

/**
 * Top level component facilitates 'wizard' style multi-step form for disposing of projects.
 * @param param0 default react router props
 */
const ProjectDisposeLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const formikRef = useRef<FormikValues>();
  const { goToNextStep, project, getNextStep, currentStatus, setCurrentStatus, workflowStatuses } =
    useStepper();
  const { onSave, addOrUpdateProject, noFetchingProjectRequests, getProjectRequest } =
    useStepForm();
  const queryParams = new URLSearchParams(location.search);
  const projectNumber = queryParams.get('projectNumber');

  const updateProjectStatus = (
    project: IProject,
    nextStepCode: string,
    workflowStatusCode?: string,
  ): Promise<IProject> => {
    //if we are at the most recent incomplete step, update status and project.
    if (project?.statusId === currentStatus.id) {
      return updateWorkflowStatus(
        project,
        nextStepCode,
        workflowStatusCode,
      )(dispatch)
        .then((project: IProject) => {
          if (goToNextStep(project) === undefined) {
            if (project.statusCode === 'AS-EXE') {
              navigate('/project/exemption/submitted', { replace: true });
            } else {
              navigate('/project/submitted', { replace: true });
            }
          }
          return project;
        })
        .catch((error: any) => {
          const msg: string = error?.response?.data?.error ?? error.toString();
          formikRef.current?.setStatus({ msg });
          return project;
        });
    } else {
      //if we are updating a previous step, just update the project with no status change.
      return addOrUpdateProject(project, formikRef).then((project) => {
        goToNextStep(project);
        return project;
      });
    }
  };

  const onNext = () => {
    formikRef.current?.submitForm().then(() => {
      const values = formikRef?.current?.values;
      const errors = formikRef?.current?.errors;

      // Scroll to required fields
      const firstRequiredInputName = Object.keys(errors)[0];
      const element = document.querySelector(`input[name='${firstRequiredInputName}']`);
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // do not go to the next step if the form has validation errors.
      if (errors === undefined || !Object.keys(errors).length) {
        let nextStepCode = getNextStep(currentStatus)?.code;
        let workflowStatusCode: string | undefined = undefined;
        if (nextStepCode === undefined && !formikRef?.current?.values.exemptionRequested) {
          nextStepCode = ReviewWorkflowStatus.PropertyReview;
          workflowStatusCode = 'ASSESS-DISPOSAL';
        }
        if (nextStepCode === undefined && formikRef?.current?.values.exemptionRequested) {
          nextStepCode = ReviewWorkflowStatus.ExemptionReview;
          workflowStatusCode = 'ASSESS-EXEMPTION';
        }
        let promise: Promise<any> = Promise.resolve(values);
        // If the project has not been created, create it before performing status updates.
        if (values.id === undefined) {
          promise = addOrUpdateProject(values, formikRef);
        }
        return promise.then((project) => {
          return updateProjectStatus(project as IProject, nextStepCode!, workflowStatusCode);
        });
      }
    });
  };

  const getComponentPath = (wfc: IProjectWorkflowComponent) => {
    return `/dispose${_.find(workflowStatuses, { code: wfc.workflowStatus })?.route}`;
  };

  useEffect(() => {
    const statusAtRoute = _.find(workflowStatuses, ({ route }) =>
      location.pathname.includes(route),
    );
    if (setCurrentStatus && noFetchingProjectRequests) setCurrentStatus(statusAtRoute);
  }, [
    location.pathname,
    navigate,
    workflowStatuses,
    setCurrentStatus,
    project.projectNumber,
    noFetchingProjectRequests,
  ]);

  //If the current route isn't set, set based on the query project status.
  useEffect(() => {
    if (location.pathname === '/dispose' && workflowStatuses?.length > 0) {
      dispatch(clearProject());
      navigate(`/dispose${workflowStatuses[0].route}`);
    }
  }, [navigate, workflowStatuses, location.pathname, dispatch, projectNumber]);

  return (
    <>
      {workflowStatuses && workflowStatuses.length ? (
        <Container fluid className="ProjectDisposeLayout">
          <SresManual />
          <h1>Surplus Property Program Project</h1>
          {currentStatus !== undefined ? (
            <GeneratedDisposeStepper
              activeStep={currentStatus?.sortOrder ?? 0}
              basePath="/dispose"
            />
          ) : null}
          {getProjectRequest?.isFetching !== true ? (
            <Container fluid className="step-content">
              {projectWorkflowComponents.map((wfc) =>
                getComponentPath(wfc) === window.location.pathname ? (
                  <div key={wfc.workflowStatus}>
                    <>
                      <wfc.component formikRef={formikRef} />
                      {/* Scroll to the top of the page every time the current step of the form changes */}
                      {document.querySelector('.ProjectDisposeView')?.scrollTo?.(0, 0)}
                    </>
                  </div>
                ) : (
                  ''
                ),
              )}
              <StepActions
                getNextStep={getNextStep}
                onSave={() => onSave(formikRef)}
                onNext={onNext}
                saveDisabled={currentStatus?.code === DisposeWorkflowStatus.Approval}
                isFetching={!noFetchingProjectRequests}
              />
            </Container>
          ) : (
            <Container fluid style={{ textAlign: 'center' }}>
              <Spinner className="loading-spinner" animation="border"></Spinner>
            </Container>
          )}
        </Container>
      ) : null}
    </>
  );
};

export default ProjectDisposeLayout;
