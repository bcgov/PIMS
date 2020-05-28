import './SelectProjectProperties.scss';

import React from 'react';
import { Container } from 'react-bootstrap';
import { mapLookupCode } from 'utils';
import { Formik } from 'formik';
import { Form, TextArea, FastSelect } from 'components/common/form';
import { IStepProps } from '../interfaces';
import { PropertyListViewUpdate } from '../PropertyListViewUpdate';
import useCodeLookups from 'hooks/useLookupCodes';
import useStepForm from './useStepForm';
import useStepper from '../hooks/useStepper';
import StepErrorSummary from './StepErrorSummary';

/**
 * Update property information already associated to this project on a property list view.
 * @param param0 {isReadOnly formikRef} formikRef allow remote formik access, isReadOnly toggle to prevent updates.
 */
const UpdateInfoStep = ({ isReadOnly, formikRef }: IStepProps) => {
  const codeLookups = useCodeLookups();
  const { onSubmit } = useStepForm();
  const { project } = useStepper();
  const tierCodes = codeLookups.getByType('TierLevel').map(mapLookupCode);
  if (!project) {
    // Step does not allow creation of new properties
    throw Error('Unexpected error updating project. Please reload your project.');
  }

  return (
    <Container fluid className="UpdateInfoStep">
      <Formik initialValues={project} innerRef={formikRef} onSubmit={onSubmit}>
        {formikProps => (
          <Form>
            <h3>Properties in the Project</h3>
            <Form.Row>
              <Form.Label column md={2}>
                Tier
              </Form.Label>
              <FastSelect
                formikProps={formikProps}
                outerClassName="col-md-2"
                placeholder="Must Select One"
                field="tierLevelId"
                type="number"
                options={tierCodes}
              />
            </Form.Row>
            <PropertyListViewUpdate
              field="properties"
              disabled={isReadOnly}
            ></PropertyListViewUpdate>
            {!isReadOnly && (
              <Form.Row>
                <Form.Label className="col-md-12" style={{ textAlign: 'left' }}>
                  Notes:
                </Form.Label>
                <TextArea outerClassName="col-md-8" field="note" />
              </Form.Row>
            )}
            <StepErrorSummary />
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default UpdateInfoStep;
