import * as React from 'react';
import { useFormikContext, getIn } from 'formik';
import { noop } from 'lodash';
import { IStepperFormContextProps, IStepperFormProviderProps, ISteppedFormValues } from './types';

const StepperFormContext = React.createContext<IStepperFormContextProps>({
  current: 0,
  currentTab: 0,
  currentTabName: '',
  getTabCurrentStep: noop as any,
  gotoStep: noop as any,
  goBack: noop as any,
  gotoNext: noop as any,
  gotoTab: noop as any,
});

/**
 * This provider wraps the StepForm children to provide ability to control the state of the form stepper field
 * @param param0
 */
export const StepperFormProvider: React.FC<IStepperFormProviderProps> = ({
  children,
  steps,
  tabs,
}) => {
  const { values, setFieldValue } = useFormikContext<ISteppedFormValues>();
  if (!values.tabs) {
    setFieldValue(
      'tabs',
      tabs.map(t => ({ activeStep: 0, name: t })),
    );
  }

  const getTabCurrentStep = (index: number) => {
    if (index >= 0 && values?.tabs && index < values.tabs.length) {
      return values.tabs[index].activeStep;
    }
    return undefined;
  };

  const gotoTab = (index: number) => {
    if (index >= 0 && index < tabs.length) {
      setFieldValue(`activeTab`, index);
      return true;
    }

    return false;
  };

  const gotoStep = (index: number) => {
    if (index > 0 && index < steps.length) {
      const nextStep = steps[index];
      if (nextStep.canGoToStep) {
        setFieldValue(`tabs.${values.activeTab}.activeStep`, index);
        return true;
      }
    }

    return false;
  };

  const gotoNext = () => {
    const index = getIn(values, `tabs.${values.activeTab}.activeStep`) + 1;
    if (index > 0 && index < steps.length) {
      const nextStep = steps[index];
      if (nextStep.canGoToStep) {
        setFieldValue(`tabs.${values.activeTab}.activeStep`, index);
        return true;
      }
    }

    return false;
  };

  const goBack = () => {
    const index = getIn(values, `tabs.${values.activeTab}.activeStep`) - 1;
    if (index > -1 && index < steps.length) {
      const nextStep = steps[index];
      if (nextStep.canGoToStep) {
        setFieldValue(`tabs.${values.activeTab}.activeStep`, index);
        return true;
      }
    }

    return false;
  };

  return (
    <StepperFormContext.Provider
      value={{
        current: getIn(values, `tabs.${values.activeTab}.activeStep`),
        currentTab: values.activeTab,
        currentTabName: getIn(values, `tabs.${values.activeTab}.name`),
        getTabCurrentStep,
        gotoNext,
        goBack,
        gotoStep,
        gotoTab,
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
