import React, { memo, useEffect } from 'react';
import { Form, FormControlProps } from 'react-bootstrap';
import { getIn, FormikProps } from 'formik';
import { DisplayError } from './DisplayError';
import { SelectOption } from './Select';
import { formikFieldMemo } from 'utils';
import classNames from 'classnames';

type RequiredAttributes = {
  /** The field name */
  field: string;
  /**  Array in the shape of [ { value: string or number, label: string } ] */
  options: SelectOption[];
  /** formik state used for context and memo calculations */
  formikProps: FormikProps<any>;
  /** Class name of the input wrapper */
  outerClassName?: string;
};

type OptionalAttributes = {
  /** The label used above the input element. */
  label?: string;
  /** The underlying HTML element to use when rendering the FormControl */
  as?: React.ElementType;
  /** Short hint that describes the expected value of an <input> element */
  placeholder?: string;
  /** A custom class to add to the input element of the <Select> component */
  className?: string;
  /** Makes the input element required. */
  required?: boolean;
  /** Specifies that the HTML element should be disabled */
  disabled?: boolean;
  /** Specifies that multiple options can be selected at once */
  multiple?: boolean;
  /** Use React-Bootstrap's custom form elements to replace the browser defaults */
  custom?: boolean;
};

// only "field" and "options" are required for <Select>, the rest are optional
export type FastSelectProps = FormControlProps & OptionalAttributes & RequiredAttributes;

/**
 * Formik-connected <Select> form control. Uses memo and cleanup inspired by
 * https://jaredpalmer.com/formik/docs/api/fastfield
 */
export const FastSelect: React.FC<FastSelectProps> = memo(
  ({
    field,
    label,
    as: is, // `as` is reserved in typescript
    placeholder,
    options,
    className,
    required,
    disabled,
    multiple,
    outerClassName,
    custom,
    formikProps: {
      values,
      errors,
      touched,
      handleChange,
      handleBlur,
      setFieldValue,
      registerField,
      unregisterField,
    },
    ...rest
  }) => {
    const error = getIn(errors, field);
    const touch = getIn(touched, field);
    const asElement: any = is || 'select';

    const handleMultipleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selected = e.target.selectedOptions;
      setFieldValue(
        field,
        [].slice.call(selected).map((option: HTMLOptionElement & number) => option.value),
      );
    };

    const Placeholder = () => {
      if (!placeholder) {
        return null;
      }
      return <option value="">{`${placeholder}${!label && required ? ' *' : ''}`}</option>;
    };

    const renderOptions = () => {
      return options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ));
    };

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
          onBlur={handleBlur}
          isValid={false}
          value={getIn(values, field)}
          multiple={multiple}
          onChange={multiple ? handleMultipleChange : handleChange}
          {...rest}
        >
          <Placeholder />
          {renderOptions()}
        </Form.Control>
        <DisplayError field={field} />
      </Form.Group>
    );
  },
  formikFieldMemo,
);
