import { ErrorMessage, getIn, useFormikContext } from 'formik';
import React from 'react';
import { Form } from 'react-bootstrap';

type DisplayErrorProps = {
  /** The form field to show errors for */
  field: string;
  /** Display error even if field hasn't been touched */
  errorPrompt?: boolean;
  /** css class name */
  className?: string;
};

/**
 * Formik-connected, thin wrapper around React-Bootstrap to display form validation errors
 */
export const DisplayError: React.FC<DisplayErrorProps> = ({ field, className }) => {
  const { errors, touched } = useFormikContext();
  const error = !!field ? getIn(errors, field) : null;
  const touch = !!field ? getIn(touched, field) : null;
  return !!error && typeof error === 'string' ? (
    <Form.Control.Feedback type="invalid" className={className}>
      {!!touch ? <ErrorMessage name={field}></ErrorMessage> : error}
    </Form.Control.Feedback>
  ) : null;
};
