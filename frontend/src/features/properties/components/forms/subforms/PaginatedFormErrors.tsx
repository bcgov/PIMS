import { useFormikContext } from 'formik';
import React, { useEffect, useState } from 'react';

interface PaginatedFormErrorsProps {
  errors: number[];
  pagingRef?: any;
}

/**
 * Component that displays a csv list of errors for paginated forms if submit fails.
 * @param errors a list of pages that are in error.
 */
const PaginatedFormErrors: React.FC<PaginatedFormErrorsProps> = ({
  errors,
  pagingRef,
}: PaginatedFormErrorsProps) => {
  const formik = useFormikContext();
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [forceNavigation, setForceNavigation] = useState(true);

  //This will ensure the dom has finished updating before manually updating the dom.
  setTimeout(() => {
    if (pagingRef?.current && submitAttempted) {
      pagingRef.current.querySelectorAll(`li[class*="error"]`).forEach((node: any) => {
        node.className = node.className.replace('error', '');
      });
      errors.forEach((error) => {
        const pageInError = pagingRef.current.querySelector(`li [aria-label*="Page ${error}"]`);
        if (pageInError?.parentNode && !pageInError.parentNode.className.includes('error')) {
          pageInError.parentNode.className += ' error';
        }
      });
      if (errors.length === 1 && forceNavigation) {
        const pageInError = pagingRef.current.querySelector(`li [aria-label*="Page ${errors[0]}"]`);
        pageInError.click();
      }
      setForceNavigation(false);
    }
  }, 100);

  //Only display this component if the user has attempted to submit the form.
  useEffect(() => {
    if (formik.isSubmitting) {
      setSubmitAttempted(true);
    }
  }, [formik.isSubmitting]);

  return <></>;
};

export default PaginatedFormErrors;
