import React from 'react';
import { Form } from 'react-bootstrap';
import { useFormikContext, getIn } from 'formik';

type DisplayErrorProps = {
  /** The form field to show errors for */
  field?: string;
};

/**
 * Formik-connected, thin wrapper around React-Bootstrap to display form validation errors
 */
export const DisplayError: React.FC<DisplayErrorProps> = ({ field }) => {
  const { errors } = useFormikContext();
  const error = !!field ? getIn(errors, field) : null;
  return !!error && typeof error === 'string' ? (
    <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
  ) : null;
};
