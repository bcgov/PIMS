import React, { useState, useEffect } from 'react';
import { Form, FormControlProps } from 'react-bootstrap';
import { useFormikContext, getIn } from 'formik';
import { DisplayError } from './DisplayError';
import classNames from 'classnames';
import TooltipIcon from '../TooltipIcon';
import TooltipWrapper from '../TooltipWrapper';
import { CSSProperties } from 'styled-components';

type RequiredAttributes = {
  /** The field name */
  field: string;
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
  /** Used for restricting user input */
  pattern?: RegExp;
  /** Use React-Bootstrap's custom form elements to replace the browser defaults */
  custom?: boolean;
  /** class to apply to entire form group */
  outerClassName?: string;
  /** formatter to apply during input onblur */
  onBlurFormatter?: Function;
  /** optional tooltip text to display after the label */
  tooltip?: string;
  /** Display errors in a tooltip instead of in a div */
  displayErrorTooltips?: boolean;
  /** add inline style to the input component */
  style?: CSSProperties;
};

// only "field" is required for <Input>, the rest are optional
export type InputProps = FormControlProps & OptionalAttributes & RequiredAttributes;

/**
 * Formik-connected <Input> form control
 */
export const Input: React.FC<InputProps> = ({
  field,
  label,
  as: is, // `as` is reserved in typescript
  placeholder,
  className,
  outerClassName,
  pattern,
  style,
  required,
  disabled,
  custom,
  onBlurFormatter,
  tooltip,
  displayErrorTooltips,
  ...rest
}) => {
  const { handleChange, handleBlur, errors, touched, values, setFieldValue } = useFormikContext<
    any
  >();
  const error = getIn(errors, field);
  const touch = getIn(touched, field);
  const value = getIn(values, field);
  const errorTooltip = error && touch && displayErrorTooltips ? error : undefined;
  const asElement: any = is || 'input';
  const [restricted, setRestricted] = useState(value);
  const handleRestrictedChange = (event: any) => {
    let val = event.target.value;
    pattern?.test(val) && setRestricted(val);
    handleChange(event);
  };
  // run the formatter logic when the input field is updated programmatically via formik values
  useEffect(() => {
    // to handle reset
    if (value === null || value === undefined || value === '') {
      setRestricted('');
      return;
    }

    if (onBlurFormatter && pattern && value !== restricted) {
      setRestricted(onBlurFormatter(value));
      setFieldValue(field, onBlurFormatter(value));
    }
  }, [field, onBlurFormatter, pattern, restricted, setFieldValue, value]);
  return (
    <Form.Group
      controlId={`input-${field}`}
      className={classNames(!!required ? 'required' : '', outerClassName)}
    >
      {!!label && <Form.Label>{label}</Form.Label>}
      {!!tooltip && !label && <TooltipIcon toolTipId={`${field}-tooltip`} toolTip={tooltip} />}

      <TooltipWrapper toolTipId={`${field}-error-tooltip}`} toolTip={errorTooltip}>
        <Form.Control
          className={className}
          as={asElement}
          name={field}
          style={style}
          disabled={disabled}
          custom={custom}
          isInvalid={!!touch && !!error}
          {...rest}
          isValid={false}
          value={pattern ? restricted : rest.value ?? value}
          placeholder={placeholder}
          onBlur={(e: any) => {
            if (onBlurFormatter) {
              pattern && setRestricted(onBlurFormatter(value));
              setFieldValue(field, onBlurFormatter(value));
            }
            handleBlur(e);
          }}
          onChange={pattern ? handleRestrictedChange : handleChange}
        />
      </TooltipWrapper>
      <DisplayError field={field} />
    </Form.Group>
  );
};
