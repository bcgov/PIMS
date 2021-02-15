import React from 'react';
import { Form } from 'react-bootstrap';
import { useFormikContext, getIn } from 'formik';

type DisplayErrorProps = {
  /** The form field to show errors for */
  field?: string;
  /** Display error even if field hasn't been touched */
  errorPrompt?: boolean;
  /** css class name */
  className?: string;
};

/**
 * Formik-connected, thin wrapper around React-Bootstrap to display form validation errors
 */
export const DisplayError: React.FC<DisplayErrorProps> = ({ field, errorPrompt, className }) => {
  const { errors, touched } = useFormikContext();
  const error = !!field ? getIn(errors, field) : null;
  const touch = !!field ? getIn(touched, field) : null;
  return !!error && (!!touch || errorPrompt) && typeof error === 'string' ? (
    <Form.Control.Feedback type="invalid" className={className}>
      {error}
    </Form.Control.Feedback>
  ) : null;
};
