import { Form, Formik, FormikConfig } from 'formik';
import * as React from 'react';
import { StepperFormProvider } from './context';
import { StepperField } from './StepperField';
import { ISteppedFormProps, ISteppedFormValues } from './types';

/**
 * A formik form with a stepper. Use the ```useFormStepper``` hook to access and control the stepper in the form children

 * @component
 * @example ./SteppedForm.md
 */
export const SteppedForm = function<T extends object = {}>({
  steps,
  children,
  initialValues,
  onSubmit,
  ...rest
}: ISteppedFormProps & FormikConfig<ISteppedFormValues<T>>) {
  return (
    <Formik<ISteppedFormValues<T>> initialValues={initialValues} onSubmit={onSubmit} {...rest}>
      {() => (
        <Form>
          <StepperField name="activeStep" steps={steps} />
          <StepperFormProvider steps={steps}>{children}</StepperFormProvider>
        </Form>
      )}
    </Formik>
  );
};

export default SteppedForm;
