import './Form.scss';

import React from 'react';
import { Form as FormBase } from 'react-bootstrap';
import { useFormikContext } from 'formik';

type FormProps = {
  /** Adds a custom class to the <Form> component */
  className?: string;
  children?: React.ReactNode;
};

/**
 * Formik-connected form control that provides thin wrappers for React-Bootstrap form controls;
 * e.g. <Form.Row>, <Form.Group>, <Form.Control>, etc.
 */
const Form = ({ className, children, ...rest }: FormProps) => {
  const { handleSubmit } = useFormikContext();
  return (
    <FormBase noValidate className={className} onSubmit={handleSubmit} {...(rest as any)}>
      {children}
    </FormBase>
  );
};

Form.Row = FormBase.Row;
Form.Group = FormBase.Group;
Form.Control = FormBase.Control;
Form.Check = FormBase.Check;
Form.Label = FormBase.Label;
Form.Text = FormBase.Text;

export { Form };
