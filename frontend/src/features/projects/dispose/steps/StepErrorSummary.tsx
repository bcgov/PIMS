import React from 'react';
import { useFormikContext } from 'formik';

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
