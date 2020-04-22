import React from 'react';
import { useFormikContext, getIn } from 'formik';
import { Input, InputProps } from './Input';

// only "field" is required for <Input>, the rest are optional
export type TextProps = InputProps;

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
  ...rest
}) => {
  const { values, handleChange, errors, touched } = useFormikContext();
  const error = getIn(errors, field);
  const touch = getIn(touched, field);

  return (
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
