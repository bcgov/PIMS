import { useFormikContext } from 'formik';
import useDeepCompareEffect from 'hooks/useDeepCompareEffect';
import _ from 'lodash';
import * as React from 'react';
import { useCallback } from 'react';

interface IDebouncedValidationProps {
  formikProps: any;
}

/** This function allows formik to use debounced form validation when a change occurs.
 * Formik does not support this currently with the top level validate prop.
 * Another possible solution would be to enable field level validation on all fields, but this was implemented due to time constraints.
 * */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DebouncedValidation = (props: IDebouncedValidationProps) => {
  const { validateForm, values } = useFormikContext();
  const validation = useCallback(
    (abort: boolean) => {
      return _.debounce(
        (abort: boolean) => {
          if (!abort) {
            validateForm();
          }
        },
        400,
        { trailing: true },
      )(abort);
    },
    [validateForm],
  );

  useDeepCompareEffect(() => {
    validation(false);
    return () => {
      validation(true);
    };
  }, [values, validation]);

  return <></>;
};

export default DebouncedValidation;
