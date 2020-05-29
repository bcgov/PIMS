import React, { Fragment } from 'react';
import { projectWorkflowComponents } from '..';

/**
 * Form component of ReviewProjectForm.
 * @param param0 isReadOnly disable editing
 */
const ReviewProjectForm = () => {
  return (
    <Fragment>
      <h3>Review</h3>
      {projectWorkflowComponents
        .slice(0, projectWorkflowComponents.length - 1) //don't include the last component (this component).
        .map(wfc => (
          <wfc.component isReadOnly={true} />
        ))}
    </Fragment>
  );
};

export default ReviewProjectForm;
