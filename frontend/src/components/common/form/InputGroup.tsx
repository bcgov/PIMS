import './InputGroup.scss';

import React, { CSSProperties } from 'react';
import { FormControlProps, InputGroup as BootstrapInputGroup } from 'react-bootstrap';
import { Input } from './Input';
import { FastInput } from './FastInput';
import { FormikProps } from 'formik';
import classNames from 'classnames';
import { Label } from '../Label';

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
  preText?: string;
  prepend?: React.ReactNode;
  postText?: string;
  fast?: boolean;
  outerClassName?: string;
  displayErrorTooltips?: boolean;
  /** style to pass down to the FastInput or Input */
  style?: CSSProperties;
  /** pass options for typeahead component */
  options?: string[];
  /** autocomplete flag to determine whether to use typeahed or not */
  autoComplete?: boolean;
};

// only "field" is required for <Input>, the rest are optional
export type InputGroupProps = FormControlProps & OptionalAttributes & RequiredAttributes;

/**
 * Formik-connected <InputGroup> form control - allows for an input with pre or posttext.
 */
export const InputGroup: React.FC<InputGroupProps> = ({
  field,
  label,
  style,
  as: is, // `as` is reserved in typescript
  placeholder,
  disabled,
  required,
  custom,
  preText,
  prepend: PrependComponent,
  postText,
  outerClassName,
  className,
  fast,
  formikProps,
  options,
  autoComplete,
  displayErrorTooltips,
  ...rest
}) => {
  return (
    <div
      className={classNames(
        'input-group',
        !!required ? 'required' : '',
        outerClassName,
        disabled ? 'disabled' : '',
      )}
    >
      {!!label && !required && <Label>{label}</Label>}
      {!!label && required && <Label required>{label}</Label>}

      {preText && (
        <BootstrapInputGroup.Prepend>
          <BootstrapInputGroup.Text>{preText}</BootstrapInputGroup.Text>
        </BootstrapInputGroup.Prepend>
      )}
      {PrependComponent && (
        <BootstrapInputGroup.Prepend>{PrependComponent}</BootstrapInputGroup.Prepend>
      )}
      <div className="input-group-content">
        {fast ? (
          <FastInput
            formikProps={formikProps}
            disabled={disabled}
            style={style}
            field={field}
            className={className}
            placeholder={placeholder}
            displayErrorTooltips={displayErrorTooltips}
            {...rest}
          />
        ) : (
          <Input
            disabled={disabled}
            field={field}
            className={className}
            style={style}
            placeholder={placeholder}
            displayErrorTooltips={displayErrorTooltips}
            {...rest}
          />
        )}
      </div>
      {postText && (
        <BootstrapInputGroup.Append>
          <BootstrapInputGroup.Text className={disabled ? 'append-disabled' : ''}>
            {postText}
          </BootstrapInputGroup.Text>
        </BootstrapInputGroup.Append>
      )}
    </div>
  );
};
