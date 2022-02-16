import { useFormikContext } from 'formik';
import React from 'react';

/**
 * Show an error if the formik component threw an error during save.
 */
const StepErrorSummary = () => {
  const formikProps = useFormikContext();
  return (
    <div style={{ textAlign: 'right' }}>
      {formikProps.status && formikProps.status.msg && (
        <p style={{ color: 'red' }}>{formikProps.status.msg}</p>
      )}
    </div>
  );
};

export default StepErrorSummary;
