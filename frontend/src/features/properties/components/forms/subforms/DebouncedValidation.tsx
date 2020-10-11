import * as React from 'react';
import { useCallback } from 'react';
import { useFormikContext } from 'formik';
import _ from 'lodash';

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
    _.debounce(() => {
      validateForm();
    }, 400),
    [],
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => validation(), [JSON.stringify(props.formikProps.values), validation]);

  return <></>;
};

export default DebouncedValidation;
