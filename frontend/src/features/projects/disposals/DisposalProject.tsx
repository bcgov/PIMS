import React from 'react';
import { SresManual } from '../common';
import { ProjectStatus, ProjectTabs, GreTransferStep } from '.';

import * as styled from './styled';
import { Form, Formik } from 'formik';
import { defaultProjectForm } from './constants';
import { useProjectDisposal } from 'store';
import { Route, Switch, useLocation } from 'react-router-dom';
import { toForm, toModel } from './utils';
import { Button } from 'components/common/form';
import { Col, Row } from 'components/flex';
import { IProjectModel } from 'hooks/api/projects/disposals';
import { IProjectForm } from './interfaces';
import { useProjectValidation } from './validation';
import { useProjectStore } from 'store/slices/hooks';

export interface IDisposalProjectProps {}

export const DisposalProject: React.FC<IDisposalProjectProps> = props => {
  const api = useProjectDisposal();
  const [state, store] = useProjectStore();
  const location = useLocation();
  const id = parseInt(location.pathname.split('/')[3]);

  const validate = useProjectValidation({ id });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [project, setProject] = React.useState<IProjectModel>();

  const values = state.projectForm ?? defaultProjectForm;

  const fetch = React.useCallback(
    async (id: number) => {
      try {
        const response = await api.get(id);
        if (response?.data) {
          setProject(response.data);
          store.storeProject(toForm(response.data));
        }
      } catch (error) {
        console.error(error); // TODO: Handle error.
      }
    },
    [api, store],
  );

  React.useEffect(() => {
    if (!!id && values.id !== id) {
      fetch(id);
    }
  }, [id, values.id, fetch]);

  const updateProject = async (values: IProjectForm) => {
    setIsSubmitting(true);
    const model = toModel(project, values);
    try {
      const response = await api.update(model);
      if (response) {
        setProject(response.data);
        store.storeProject(toForm(response.data));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = (project: IProjectModel) => {
    setProject(project);
    store.storeProject(toForm(project));
  };

  return (
    <styled.DisposalProject>
      <Formik
        initialValues={values}
        enableReinitialize={true}
        validate={validate}
        onSubmit={updateProject}
        validateOnBlur={true}
        validateOnChange={false}
        initialTouched={{
          appraised: true,
          reportingNote: true,
          onHoldNotificationSentOn: true,
          transferredWithinGreOn: true,
          clearanceNotificationSentOn: true,
          requestForSplReceivedOn: true,
          approvedForSplOn: true,
          marketedOn: true,
          purchaser: true,
          offerAmount: true,
          offerAcceptedOn: true,
          disposedOn: true,
        }}
      >
        <Form className="project">
          <Switch>
            <Route exact path="/projects/disposal/:id/transfer/within/gre">
              {!!project && <GreTransferStep project={project} onUpdate={handleUpdate} />}
            </Route>
            <Route>
              <Row nowrap>
                <Col>
                  <h1>Surplus Property Program Project</h1>
                  <Row align="center">
                    <h2>{project?.projectNumber}</h2>
                    <p>{project?.name}</p>
                  </Row>
                </Col>
                <div className="manual">
                  <SresManual />
                </div>
              </Row>
              <Row>
                <ProjectStatus
                  project={project}
                  onUpdate={handleUpdate}
                  isSubmitting={isSubmitting}
                  setIsSubmitting={setIsSubmitting}
                />
              </Row>
              <ProjectTabs project={project} isLoading={isSubmitting} />
              <Row className="project-footer">
                <Button
                  variant="primary"
                  type="submit"
                  isSubmitting={isSubmitting}
                  showSubmitting={true}
                >
                  Save
                </Button>
              </Row>
            </Route>
          </Switch>
        </Form>
      </Formik>
    </styled.DisposalProject>
  );
};
