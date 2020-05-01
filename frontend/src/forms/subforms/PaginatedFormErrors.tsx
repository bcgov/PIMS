import React, { useEffect, useState } from 'react';
import { useFormikContext } from 'formik';

interface PaginatedFormErrorsProps {
  errors: number[];
  nameSpace: string;
}

/**
 * Component that displays a csv list of errors for paginated forms if submit fails.
 * @param errors a list of pages that are in errors.
 */
const PaginatedFormErrors: React.FC<PaginatedFormErrorsProps> = ({
  errors,
  nameSpace,
}: PaginatedFormErrorsProps) => {
  const formik = useFormikContext();
  const [submitAttempted, setSubmitAttempted] = useState(false);

  //Only display this component if the user has attempted to submit the form.
  useEffect(() => {
    if (formik.isSubmitting) {
      setSubmitAttempted(true);
    }
  }, [formik.isSubmitting]);

  return !!errors?.length && submitAttempted ? (
    <p style={{ color: 'red' }}>{`The following ${nameSpace} have errors: ${errors.join(', ')}`}</p>
  ) : null;
};

export default PaginatedFormErrors;
