import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Formik } from 'formik';
import { Form, Input, TextArea } from 'components/common/form';

import { IStepProps } from '../interfaces';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import useStepForm from './useStepForm';
import useStepper from '../hooks/useStepper';
import { initialValues } from 'pages/admin/access/constants/constants';
import StepErrorSummary from './StepErrorSummary';

/**
 * Initial Project creation step - allows entry of high level project information.
 * @param param0 {isReadOnly formikRef} formikRef allow remote formik access, isReadOnly toggle to prevent updates.
 */
const ProjectDraftStep = ({ isReadOnly, formikRef }: IStepProps) => {
  const { onSubmit } = useStepForm();
  const { project } = useStepper();
  const keycloak = useKeycloakWrapper();
  let draftFormValues = initialValues;
  if (project) {
    draftFormValues = { ...project };
  } else {
    //This appears to be a new project, set up some defaults.
    draftFormValues = { ...initialValues, agencyId: keycloak.agencyId! };
  }

  return (
    <Row className="ProjectDraftStep">
      <Col>
        <Formik
          initialValues={draftFormValues}
          validateOnChange={false}
          enableReinitialize={true}
          innerRef={formikRef}
          onSubmit={onSubmit}
        >
          {() => (
            <Form>
              <Row style={{ textAlign: 'left' }}>
                <Col>
                  <Form.Row>
                    <Form.Label column md={2}>
                      Project Number
                    </Form.Label>
                    <Input
                      placeholder="SPP-XXXXXX"
                      disabled={true}
                      outerClassName="col-md-8"
                      field="projectNumber"
                    />
                  </Form.Row>
                  <Form.Row>
                    <Form.Label column md={2}>
                      Name
                    </Form.Label>
                    <Input outerClassName="col-md-8" field="name" />
                  </Form.Row>
                  <Form.Row>
                    <Form.Label column md={2}>
                      Description
                    </Form.Label>
                    <Input outerClassName="col-md-8" field="description" />
                  </Form.Row>
                  {!isReadOnly && (
                    <Form.Row>
                      <Form.Label className="col-md-12" style={{ textAlign: 'left' }}>
                        Notes:
                      </Form.Label>
                      <TextArea outerClassName="col-md-8" field="note" />
                    </Form.Row>
                  )}
                </Col>
              </Row>
              <StepErrorSummary />
            </Form>
          )}
        </Formik>
      </Col>
    </Row>
  );
};

export default ProjectDraftStep;
