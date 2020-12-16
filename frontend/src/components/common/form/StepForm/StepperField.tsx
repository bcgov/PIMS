import Stepper from 'components/common/Stepper';
import { useFormikContext, getIn } from 'formik';
import React from 'react';
import { IStepperFieldProps, useFormStepper } from '.';

/**
 * This is a stepper component wrapped with a formik field, to enable the stepper to controlled using formik actions
 * @component
 * @example ./StepperField.md
 */
export const StepperField: React.FC<IStepperFieldProps> = ({ name, steps }) => {
  const { values } = useFormikContext();
  const stepper = useFormStepper();
  return (
    <Stepper
      steps={steps}
      activeStep={getIn(values, name)}
      onChange={(step, index) => index !== undefined && stepper.gotoStep(index)}
    />
  );
};
