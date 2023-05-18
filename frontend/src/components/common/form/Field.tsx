import classnames from 'classnames';
import React from 'react';
import { Form } from 'react-bootstrap';

import { DisplayError } from './DisplayError';

type FieldProps = {
  /** The field name (optional) */
  field: string;
  /** An optional label used above the input element */
  label?: string;
  /** An optional element to render next to the label  */
  afterLabel?: React.ReactNode;
  /** A custom class to add to the <Form.Group> element of the <Field> component */
  className?: string;
  /** Whether the field is required. Shows an asterisk after the label. */
  required?: boolean;
};

export const Field: React.FC<React.PropsWithChildren<FieldProps>> = ({
  field,
  label,
  afterLabel,
  className,
  required,
  children,
}) => {
  // dynamically add CSS class "required" to form group
  const cssClassNames = classnames({
    required: !!required,
    [className!]: className,
  });
  const controlId = !!field ? `input-${field}` : undefined;

  return (
    <Form.Group controlId={controlId} className={cssClassNames}>
      {!!label && (
        <Form.Label>
          {label}
          {afterLabel}
        </Form.Label>
      )}
      {children}
      <DisplayError field={field} />
    </Form.Group>
  );
};
