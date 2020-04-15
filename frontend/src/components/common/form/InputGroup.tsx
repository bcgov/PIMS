import React from 'react';
import { Form, FormControlProps, InputGroup } from 'react-bootstrap';
import { useFormikContext, getIn } from 'formik';
import { DisplayError } from './DisplayError';

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
  /** Whether the field is required. Shows an asterisk after the label. */
  required?: boolean;
  /** Specifies that the HTML element should be disabled */
  disabled?: boolean;
  /** Use React-Bootstrap's custom form elements to replace the browser defaults */
  custom?: boolean;
  preText?: string;
  postText?: string;
};

// only "field" is required for <Input>, the rest are optional
export type InputProps = FormControlProps & OptionalAttributes & RequiredAttributes;

/**
 * Formik-connected <Input> form control
 */
export const FormikInputGroup: React.FC<InputProps> = ({
  field,
  label,
  as: is, // `as` is reserved in typescript
  placeholder,
  className,
  required,
  disabled,
  custom,
  preText,
  postText,
  ...rest
}) => {
  const { values, handleChange, errors, touched, setFieldTouched } = useFormikContext();
  const error = getIn(errors, field);
  const touch = getIn(touched, field);
  const asElement: any = is || 'input';

  return (
    <Form.Group controlId={`input-${field}`} className={!!required ? 'required' : undefined}>
      {!!label && <Form.Label>{label}</Form.Label>}

      {preText && (
        <InputGroup.Prepend>
          <InputGroup.Text>{preText}</InputGroup.Text>
        </InputGroup.Prepend>
      )}
      <div className="input-group">
        <Form.Control
          as={asElement}
          name={field}
          className={className}
          required={required}
          disabled={disabled}
          custom={custom}
          isInvalid={!!touch && !!error}
          {...rest}
          value={getIn(values, field)}
          placeholder={placeholder}
          onBlur={() => setFieldTouched(field)}
          onChange={handleChange}
        />
        {postText && (
          <InputGroup.Append>
            <InputGroup.Text>{postText}</InputGroup.Text>
          </InputGroup.Append>
        )}
        <DisplayError field={field} />
      </div>
    </Form.Group>
  );
};
