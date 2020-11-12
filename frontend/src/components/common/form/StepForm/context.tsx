import * as React from 'react';
import { useFormikContext, getIn } from 'formik';
import { noop } from 'lodash';
import { IStepperFormContextProps, IStepperFormProviderProps } from './types';

const StepperFormContext = React.createContext<IStepperFormContextProps>({
  current: 0,
  gotoStep: noop as any,
  goBack: noop as any,
  gotoNext: noop as any,
});

/**
 * This provider wraps the StepForm children to provide ability to control the state of the form stepper field
 * @param param0
 */
export const StepperFormProvider: React.FC<IStepperFormProviderProps> = ({ children, steps }) => {
  const { values, setFieldValue } = useFormikContext();

  const gotoStep = (index: number) => {
    if (index > 0 && index < steps.length) {
      const nextStep = steps[index];
      if (nextStep.canGoToStep) {
        setFieldValue('activeStep', index);
        return true;
      }
    }

    return false;
  };

  const gotoNext = () => {
    const index = getIn(values, 'activeStep') + 1;
    if (index > 0 && index < steps.length) {
      const nextStep = steps[index];
      if (nextStep.canGoToStep) {
        setFieldValue('activeStep', index);
        return true;
      }
    }

    return false;
  };

  const goBack = () => {
    const index = getIn(values, 'activeStep') - 1;
    if (index > -1 && index < steps.length) {
      const nextStep = steps[index];
      if (nextStep.canGoToStep) {
        setFieldValue('activeStep', index);
        return true;
      }
    }

    return false;
  };

  return (
    <StepperFormContext.Provider
      value={{
        current: getIn(values, 'activeStep'),
        gotoNext,
        goBack,
        gotoStep,
      }}
    >
      {children}
    </StepperFormContext.Provider>
  );
};

/**
 * Use this context hook to access and control the stepper
 */
export const useFormStepper = () => React.useContext(StepperFormContext);
