import React, { FunctionComponent, memo, useEffect } from 'react';
import { ErrorMessage, getIn, FormikProps } from 'formik';
import DatePicker, { ReactDatePickerProps } from 'react-datepicker';
import moment from 'moment';
import { FormGroup, FormControlProps } from 'react-bootstrap';
import { formikFieldMemo } from 'utils';
import classNames from 'classnames';

type RequiredAttributes = {
  /** The field name */
  field: string;
  /** formik state used for context and memo calculations */
  formikProps: FormikProps<any>;
};

type OptionalAttributes = {
  /** Specifies that the HTML element should be disabled */
  disabled?: boolean;
  /** Class name of the input wrapper */
  outerClassName?: string;
};

export type FastDatePickerProps = FormControlProps &
  RequiredAttributes &
  OptionalAttributes &
  Partial<ReactDatePickerProps>;

/**
 * Formik connected react-datepicker. Uses memo and cleanup inspired by
 * https://jaredpalmer.com/formik/docs/api/fastfield
 */
const FormikDatePicker: FunctionComponent<FastDatePickerProps> = ({
  field,
  disabled,
  outerClassName,
  formikProps: {
    values,
    errors,
    touched,
    setFieldValue,
    registerField,
    unregisterField,
    handleBlur,
  },
  ...rest
}) => {
  const error = getIn(errors, field);
  const touch = getIn(touched, field);
  let value = getIn(values, field);
  if (value === '') {
    value = null;
  }
  if (typeof value === 'string') {
    value = moment(value, 'YYYY-MM-DD').toDate();
  }
  useEffect(() => {
    registerField(field, {});
    return () => {
      unregisterField(field);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const isInvalid = error && touch ? 'is-invalid ' : '';
  const isValid = !error && touch && value && disabled ? 'is-valid ' : '';
  return (
    <FormGroup className={outerClassName ?? ''}>
      <span className={isInvalid}></span>
      <DatePicker
        autoComplete="off"
        name={field}
        placeholderText="--/--/----"
        className={classNames('form-control', 'date-picker', isInvalid, isValid)}
        dateFormat="MM/dd/yyyy"
        selected={(value && new Date(value)) || null}
        onBlur={handleBlur}
        disabled={disabled}
        {...rest}
        onChange={(val: any) => {
          setFieldValue(field, val ? moment(val).format('YYYY-MM-DD') : '');
        }}
      />
      <ErrorMessage component="div" className="invalid-feedback" name={field}></ErrorMessage>
    </FormGroup>
  );
};

export const FastDatePicker = memo(FormikDatePicker, formikFieldMemo);
