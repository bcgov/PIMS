import './SelectProjectProperties.scss';

import React from 'react';
import { Container } from 'react-bootstrap';
import { projectWorkflowComponents } from '..';
/**
 * Read only version of all step components. TODO: provide ability to update fields on this form.
 * {isReadOnly formikRef} formikRef allow remote formik access, isReadOnly toggle to prevent updates.
 */
const ReviewProjectStep = () => {
  return (
    <Container fluid className="ReviewInfoForm">
      <h3>Review</h3>
      {projectWorkflowComponents
        .slice(0, projectWorkflowComponents.length - 1) //don't include the last component (this component).
        .map(wfc => (
          <wfc.component isReadOnly={true} />
        ))}
    </Container>
  );
};

export default ReviewProjectStep;
