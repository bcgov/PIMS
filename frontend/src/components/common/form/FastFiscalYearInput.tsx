import React, { memo, useEffect } from 'react';
import MaskedInput from 'react-text-mask';
import { FormikProps, getIn, ErrorMessage } from 'formik';
import { formikFieldMemo, formatDateFiscal } from 'utils';
import classNames from 'classnames';
import Form from 'react-bootstrap/Form';

type RequiredAttributes = {
  /** The field name */
  field: string;
  /** formik state used for context and memo calculations */
  formikProps: FormikProps<any>;
};

type OptionalAttributes = {
  /** Specifies that the HTML element should be disabled */
  disabled?: boolean;
  /** The value to display, overrides formik values */
  value?: number | '';
  /** Adds a custom class to the input element of the <Input> component */
  className?: string;
  /** Class name of the input wrapper */
  outerClassName?: string;
  /** formik state used for context and memo calculations */
  formikProps: FormikProps<any>;
};
/**
 * Formik-wrapped fiscal year input providing a simple mask over fiscal year fields
 * without changing the formik prop value to string.
 * @param param0
 */
const FiscalYearInput = ({
  field,
  className,
  outerClassName,
  value,
  disabled,
  formikProps: {
    handleBlur,
    handleChange,
    values,
    setFieldValue,
    errors,
    touched,
    registerField,
    unregisterField,
  },
}: RequiredAttributes & OptionalAttributes) => {
  value = value ? value : getIn(values, field);
  const error = getIn(errors, field);
  const touch = getIn(touched, field);
  if (!value) {
    value = '';
  }
  useEffect(() => {
    registerField(field, {});
    return () => {
      unregisterField(field);
    };
  }, [field, registerField, unregisterField]);
  const isInvalid = error && touch ? 'is-invalid ' : '';
  const isValid = !error && touch && value && !disabled ? 'is-valid ' : '';
  return (
    <Form.Group className={outerClassName}>
      <MaskedInput
        value={value >= 0 ? formatDateFiscal(value.toString()) : value}
        mask={[/\d/, /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
        name={field}
        onChange={(e: any) => {
          const cleanValue = e.target.value.replace(/[^0-9/]/g, '');
          setFieldValue(field, cleanValue);
        }}
        onBlur={(e: any) => {
          const years = e.target.value.replace(/[^0-9/]/g, '').split('/');
          const upperYear = years.length === 2 ? years[1] : years[0];
          setFieldValue(field, upperYear ? parseInt(upperYear) : '');
        }}
        className={classNames('form-control', className, isInvalid, isValid)}
        disabled={disabled}
        placeholder="YYYY/YYYY"
      />
      <ErrorMessage component="div" className="invalid-feedback" name={field}></ErrorMessage>
    </Form.Group>
  );
};
export const FastFiscalYearInput = memo(
  FiscalYearInput,
  (prevProps: any, currentProps: any) =>
    prevProps.value === currentProps.value && formikFieldMemo(prevProps, currentProps),
);
