import React from 'react';
import { useFormikContext, getIn } from 'formik';
import { Input, InputProps } from './Input';
import { FastInput } from '.';

// only "field" is required for <Input>, the rest are optional
export type TextProps = InputProps & {
  /** use FastInput instead of Input */
  fast?: boolean;
};

/**
 * Formik-connected <Input> form control
 */
export const TextArea: React.FC<TextProps> = ({
  field,
  label,
  placeholder,
  className,
  required,
  disabled,
  custom,
  fast,
  ...rest
}) => {
  const formikProps = useFormikContext();
  const { values, handleChange, errors, touched } = formikProps;
  const error = getIn(errors, field);
  const touch = getIn(touched, field);

  return fast ? (
    <FastInput
      formikProps={formikProps}
      label={label}
      as="textarea"
      field={field}
      className={className}
      required={required}
      disabled={disabled}
      custom={custom}
      isInvalid={!!touch && !!error}
      {...rest}
      value={getIn(values, field)}
      placeholder={placeholder}
      onChange={handleChange}
    />
  ) : (
    <Input
      label={label}
      as="textarea"
      field={field}
      className={className}
      required={required}
      disabled={disabled}
      custom={custom}
      isInvalid={!!touch && !!error}
      {...rest}
      value={getIn(values, field)}
      placeholder={placeholder}
      onChange={handleChange}
    />
  );
};
