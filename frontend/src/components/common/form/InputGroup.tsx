import './InputGroup.scss';

import React from 'react';
import { Form, FormControlProps, InputGroup as BootstrapInputGroup } from 'react-bootstrap';
import { Input } from './Input';
import { FastInput } from './FastInput';
import { FormikProps, getIn } from 'formik';
import classNames from 'classnames';
import TooltipWrapper from '../TooltipWrapper';

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
};

// only "field" is required for <Input>, the rest are optional
export type InputGroupProps = FormControlProps & OptionalAttributes & RequiredAttributes;

/**
 * Formik-connected <InputGroup> form control - allows for an input with pre or posttext.
 */
export const InputGroup: React.FC<InputGroupProps> = ({
  field,
  label,
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
  displayErrorTooltips,
  ...rest
}) => {
  const error = getIn(formikProps?.errors, field);
  const touch = getIn(formikProps?.touched, field);
  const errorTooltip = error && touch && displayErrorTooltips ? error : undefined;
  return (
    <div
      className={classNames(
        'input-group',
        !!required ? 'required' : '',
        outerClassName,
        disabled ? 'disabled' : '',
      )}
    >
      {!!label && <Form.Label>{label}</Form.Label>}

      {preText && (
        <BootstrapInputGroup.Prepend>
          <BootstrapInputGroup.Text>{preText}</BootstrapInputGroup.Text>
        </BootstrapInputGroup.Prepend>
      )}
      {PrependComponent && (
        <BootstrapInputGroup.Prepend>{PrependComponent}</BootstrapInputGroup.Prepend>
      )}
      <div className="input-group-content">
        <TooltipWrapper toolTipId={`${field}-error-tooltip}`} toolTip={errorTooltip}>
          {fast ? (
            <FastInput
              formikProps={formikProps}
              disabled={disabled}
              field={field}
              className={className}
              placeholder={placeholder}
              {...rest}
            />
          ) : (
            <Input
              disabled={disabled}
              field={field}
              className={className}
              placeholder={placeholder}
              {...rest}
            />
          )}
        </TooltipWrapper>
      </div>
      {postText && (
        <BootstrapInputGroup.Append>
          <BootstrapInputGroup.Text>{postText}</BootstrapInputGroup.Text>
        </BootstrapInputGroup.Append>
      )}
    </div>
  );
};
