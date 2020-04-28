import React, { memo, useEffect } from 'react';
import { Form, FormControlProps } from 'react-bootstrap';
import { getIn, FormikProps } from 'formik';
import { DisplayError } from './DisplayError';
import { formikFieldMemo } from 'utils';
import classNames from 'classnames';

type RequiredAttributes = {
  /** The field name */
  field: string;
  /** formik state used for context and memo calculations */
  formikProps: FormikProps<any>;
};

type OptionalAttributes = {
  /** The form component label */
  label?: string;
  /** The underlying HTML element to use when rendering the FormControl */
  as?: React.ElementType;
  /** Short hint that describes the expected value of an <input> element */
  placeholder?: string;
  /** Adds a custom class to the input element of the <Input> component */
  className?: string;
  /** Whether the field is required. Shows an asterisk after the label. */
  required?: boolean;
  /** Specifies that the HTML element should be disabled */
  disabled?: boolean;
  /** Use React-Bootstrap's custom form elements to replace the browser defaults */
  custom?: boolean;
  /** Class name of the input wrapper */
  outerClassName?: string;
};

// only "field" is required for <Input>, the rest are optional
export type FastInputProps = FormControlProps & OptionalAttributes & RequiredAttributes;

/**
 * Formik-connected <Input> form control. Uses memo and cleanup inspired by
 * https://jaredpalmer.com/formik/docs/api/fastfield
 */
export const FastInput: React.FC<FastInputProps> = memo(
  ({
    field,
    label,
    as: is, // `as` is reserved in typescript
    placeholder,
    className,
    outerClassName,
    required,
    disabled,
    custom,
    formikProps: {
      values,
      errors,
      touched,
      handleChange,
      handleBlur,
      registerField,
      unregisterField,
    },
    ...rest
  }) => {
    const error = getIn(errors, field);
    const touch = getIn(touched, field);
    const value = getIn(values, field);
    const asElement: any = is || 'input';
    useEffect(() => {
      registerField(field, { validate: undefined });
      return () => {
        unregisterField(field);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <Form.Group
        controlId={`input-${field}`}
        className={classNames(!!required ? 'required' : '', outerClassName)}
      >
        {!!label && <Form.Label>{label}</Form.Label>}
        {!!required && <span className="required">*</span>}
        <Form.Control
          as={asElement}
          name={field}
          className={className}
          required={required}
          disabled={disabled}
          custom={custom}
          isInvalid={!!touch && !!error}
          isValid={!!touch && !error && value && !disabled}
          value={value}
          placeholder={placeholder}
          onBlur={handleBlur}
          onChange={handleChange}
          {...rest}
        />
        <DisplayError field={field} />
      </Form.Group>
    );
  },
  formikFieldMemo,
);
