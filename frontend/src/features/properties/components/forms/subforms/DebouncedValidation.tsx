import * as React from 'react';
import { useCallback } from 'react';
import { useFormikContext } from 'formik';
import _ from 'lodash';
import useDeepCompareEffect from 'hooks/useDeepCompareEffect';

interface IDebouncedValidationProps {
  formikProps: any;
}

/** This function allows formik to use debounced form validation when a change occurs.
 * Formik does not support this currently with the top level validate prop.
 * Another possible solution would be to enable field level validation on all fields, but this was implemented due to time constraints.
 * */
const DebouncedValidation = (props: IDebouncedValidationProps) => {
  const { validateForm } = useFormikContext();
  const validation = useCallback(
    _.debounce((abort: boolean) => {
      if (!abort) {
        validateForm();
      }
    }, 400),
    [],
  );

  useDeepCompareEffect(() => {
    validation(false);
    return () => {
      validation(true);
    };
  }, [props.formikProps.values, validation]);

  return <></>;
};

export default DebouncedValidation;
