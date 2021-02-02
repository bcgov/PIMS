import React, { CSSProperties, memo, useEffect } from 'react';
import { Col, Form, FormControlProps } from 'react-bootstrap';
import { getIn, FormikProps } from 'formik';
import { DisplayError } from './DisplayError';
import { formikFieldMemo } from 'utils';
import classNames from 'classnames';
import TooltipIcon from '../TooltipIcon';
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
  /** Whether the field is required. Makes the field border blue. */
  required?: boolean;
  /** Specifies that the HTML element should be disabled */
  disabled?: boolean;
  /** Use React-Bootstrap's custom form elements to replace the browser defaults */
  custom?: boolean;
  /** Class name of the input wrapper */
  outerClassName?: string;
  /** Run the following formatter on value during onBlur */
  onBlurFormatter?: Function;
  /** tooltip to display after label */
  tooltip?: string;
  /** Display errors in a tooltip instead of in a div */
  displayErrorTooltips?: boolean;
  /** Determine style of input if needed */
  style?: CSSProperties;
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
    type,
    onBlurFormatter,
    tooltip,
    displayErrorTooltips,
    style,
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
    const value = getIn(values, field);
    const errorTooltip = error && touch && displayErrorTooltips ? error : undefined;
    const asElement: any = is || 'input';
    useEffect(() => {
      registerField(field, { validate: undefined });
      return () => {
        unregisterField(field);
      };
    }, [field, registerField, unregisterField]);

    return (
      <Form.Group
        controlId={`input-${field}`}
        className={classNames(!!required ? 'required' : '', outerClassName)}
        as={Col}
      >
        {!!label && (
          <Form.Label>
            {label}
            {!!tooltip && <TooltipIcon toolTipId={`${field}-tooltip`} toolTip={tooltip} />}
          </Form.Label>
        )}
        {!!tooltip && !label && <TooltipIcon toolTipId={`${field}-tooltip`} toolTip={tooltip} />}

        <TooltipWrapper toolTipId={`${field}-error-tooltip}`} toolTip={errorTooltip}>
          <Form.Control
            as={asElement}
            name={field}
            className={className}
            style={style!}
            disabled={disabled}
            custom={custom}
            isInvalid={!!touch && !!error}
            isValid={!!touch && !error && value && !disabled}
            value={value}
            placeholder={placeholder}
            onBlur={(e: any) => {
              if (onBlurFormatter) {
                setFieldValue(field, onBlurFormatter(value));
              }
              handleBlur(e);
            }}
            onChange={handleChange}
            type={type}
            {...rest}
          />
        </TooltipWrapper>
        {!displayErrorTooltips && <DisplayError field={field} />}
      </Form.Group>
    );
  },
  formikFieldMemo,
);
