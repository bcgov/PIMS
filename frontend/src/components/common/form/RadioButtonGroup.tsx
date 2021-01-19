import React from 'react';
import { Form, FormCheckProps } from 'react-bootstrap';
import { useFormikContext, getIn } from 'formik';
import { DisplayError } from './DisplayError';
import classNames from 'classnames';
import TooltipIcon from '../TooltipIcon';

interface IRadioOption {
  label: string;
  value: any;
}

type RequiredAttributes = {
  /** The field name */
  field: string;
};

type OptionalAttributes = {
  /** The form component label to display before the radio group */
  label?: string;
  /** Adds a custom class to the input element of the <ToggleButtonGroup> component */
  className?: string;
  /** Whether the field is required. Shows an asterisk after the label. */
  required?: boolean;
  /** Specifies that the HTML element should be disabled */
  disabled?: boolean;
  /** Use React-Bootstrap's custom form elements to replace the browser defaults */
  custom?: boolean;
  /** style to use for the formgroup wrapping the inner element */
  outerClassName?: string;
  /** Optional tool tip message to add to toggle */
  toolTip?: string;
  /** id for tooltip */
  toolTipId?: string;
  /** a list of options to display to the user. */
  options: IRadioOption[];
};

export type RadioGroupProps = FormCheckProps & OptionalAttributes & RequiredAttributes;

/**
 * Formik-connected <ToggleButtonGroup> form control
 */
export const RadioButtonGroup: React.FC<RadioGroupProps> = ({
  field,
  label,
  className,
  outerClassName,
  required,
  disabled,
  type,
  custom,
  toolTip,
  toolTipId,
  options,
  ...rest
}) => {
  const { values, setFieldValue, setFieldTouched, errors, touched } = useFormikContext();
  const error = getIn(errors, field);
  const touch = getIn(touched, field);
  const value = getIn(values, field);
  return (
    <Form.Group
      controlId={`input-${field}`}
      className={classNames(outerClassName, !!required ? 'required' : '')}
    >
      <div>
        {!!label && (
          <Form.Label>
            {label}
            {!!toolTip && <TooltipIcon toolTipId={toolTipId!} toolTip={toolTip} />}
          </Form.Label>
        )}
        <div className={touch && error ? 'is-invalid' : ''}>
          {options.map((option: IRadioOption) => (
            <Form.Check
              {...rest}
              id={`input-leasedLand.type.${option.value}`}
              key={option.value}
              type="radio"
              disabled={disabled}
              checked={value === option.value}
              value={option.value}
              label={option.label}
              arial-label={`radio ${option.value}`}
              onChange={() => {
                setFieldValue(field, option.value);
                setFieldTouched(field);
              }}
            ></Form.Check>
          ))}
        </div>
        <DisplayError field={field} />
      </div>
    </Form.Group>
  );
};
