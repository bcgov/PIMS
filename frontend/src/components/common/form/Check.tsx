import React from 'react';
import './Check.scss';
import { Form, FormCheckProps } from 'react-bootstrap';
import { useFormikContext, getIn } from 'formik';
import { DisplayError } from './DisplayError';
import classNames from 'classnames';

type RequiredAttributes = {
  /** The field name */
  field: string;
};

type OptionalAttributes = {
  /** The form component label to display before the checkbox */
  label?: string;
  /** The form component label to display after the checkbox */
  postLabel?: string;
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
  /** style to use for the formgroup wrapping the inner element */
  outerClassName?: string;
  /** override the display of the component, default is checkbox. Select radio to display this checkbox as two radio buttons. */
  type?: string;
  /** label of the first radio button */
  radioLabelOne?: string;
  /** label of the second radio button */
  radioLabelTwo?: string;
};

// only "field" is required for <Check>, the rest are optional
export type CheckProps = FormCheckProps & OptionalAttributes & RequiredAttributes;

/**
 * Formik-connected <Check> form control
 */
export const Check: React.FC<CheckProps> = ({
  field,
  label,
  postLabel,
  as: is, // `as` is reserved in typescript
  placeholder,
  className,
  outerClassName,
  required,
  disabled,
  type,
  custom,
  radioLabelOne,
  radioLabelTwo,
  ...rest
}) => {
  const { values, setFieldValue, errors, touched } = useFormikContext();
  const error = getIn(errors, field);
  const touch = getIn(touched, field);
  const checked = getIn(values, field);
  const asElement: any = is || 'input';
  return (
    <Form.Group
      controlId={`input-${field}`}
      className={classNames(outerClassName, !!required ? 'required' : '')}
    >
      <div className="check-field">
        {!!label && (
          <Form.Label>
            {label}
            {!!required && <span className="required">*</span>}
          </Form.Label>
        )}
        <>
          <Form.Check
            label={radioLabelOne}
            as={asElement}
            name={field}
            className={className}
            required={required}
            disabled={disabled}
            custom={custom}
            isInvalid={!!touch && !!error}
            type={type}
            {...rest}
            value={!!checked}
            placeholder={placeholder}
            checked={!!checked}
            onChange={() => setFieldValue(field, !checked)}
          />
          {type === 'radio' && (
            <Form.Check
              label={radioLabelTwo}
              as={asElement}
              name={field}
              className={className}
              required={required}
              disabled={disabled}
              custom={custom}
              isInvalid={!!touch && !!error}
              type={type}
              id={`input-${field}-2`}
              {...rest}
              value={!checked}
              placeholder={placeholder}
              checked={!checked}
              onChange={() => setFieldValue(field, !checked)}
            />
          )}
        </>
        {!!postLabel && !!required && (
          <>
            <span className="required">*</span>
            <Form.Label>{postLabel}</Form.Label>
          </>
        )}
        {!!postLabel && !required && <Form.Label>{postLabel}</Form.Label>}
      </div>
      <DisplayError field={field} />
    </Form.Group>
  );
};
