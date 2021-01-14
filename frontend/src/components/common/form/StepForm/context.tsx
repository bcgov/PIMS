import * as React from 'react';
import { useFormikContext, getIn, setIn, yupToFormErrors } from 'formik';
import { noop } from 'lodash';
import { IStepperFormContextProps, IStepperFormProviderProps, ISteppedFormValues } from './types';
import _ from 'lodash';
import { useCallback } from 'react';
import useDeepCompareEffect from 'hooks/useDeepCompareEffect';

const StepperFormContext = React.createContext<IStepperFormContextProps>({
  current: 0,
  currentTab: 0,
  currentTabName: '',
  getTabCurrentStep: noop as any,
  gotoStep: noop as any,
  goBack: noop as any,
  gotoNext: noop as any,
  gotoTab: noop as any,
  validateCurrentStep: noop as any,
  isSubmit: noop as any,
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
  const { values, setFieldValue, setErrors, setTouched } = useFormikContext<ISteppedFormValues>();

  const activeTab = values.activeTab;

  /**
   * Get the list of completed steps for this tab.
   * @param tabIndex
   */
  const getCompletedTabSteps = useCallback(
    (tabIndex: number) => {
      return _.uniq(getIn(values, `tabs.${tabIndex}.completedSteps`) || []);
    },
    [values],
  );

  /**
   * Whenever the tab changes, update the list of steps that have been completed and that are navigable.
   */
  useDeepCompareEffect(() => {
    if (tabs.length > 1) {
      const completedSteps = getCompletedTabSteps(activeTab);
      steps.forEach((step, index) => {
        step.completed = completedSteps.includes(index);
        step.canGoToStep = step.canGoToStep || completedSteps.includes(index - 1);
      });
      if (steps.length) {
        steps[0].canGoToStep = true;
      }
    }
  }, [activeTab, tabs.length, getCompletedTabSteps, steps]);

  /**
   * Set the step at the given stepIndex to be completed.
   */
  const completeStep = (index: number) => {
    if (index >= 0 && index < steps.length) {
      const currentStep = steps[index];
      currentStep.completed = true;
      setFieldValue(
        `tabs.${values.activeTab}.completedSteps`,
        _.uniq([...getCompletedTabSteps(values.activeTab), index]),
      );
      if (index + 1 < steps.length) {
        steps[index + 1].canGoToStep = true;
      }
    }
  };

  /**
   * Validate the current step, setting errors if present or completing the step if the step is valid.
   * @param overrideNameSpace nameSpace to use instead of the original validation nameSpace provided for this step.
   */
  const validateCurrentStep = (overrideNameSpace?: string) => {
    const index = getIn(values, `tabs.${values.activeTab}.activeStep`);
    const currentStep = steps[index];
    if (currentStep.validation) {
      const nameSpace = overrideNameSpace || currentStep.validation.nameSpace(values.activeTab);
      const schema = currentStep.validation.schema;
      const validationValues = getIn(values, nameSpace);
      try {
        schema.validateSync(validationValues, { abortEarly: false });
        completeStep(index);
      } catch (e) {
        const errors = setIn({}, nameSpace, yupToFormErrors(e));
        setErrors(errors);
        setTouched(errors);
        return false;
      }
    } else {
      completeStep(index);
    }
    return true;
  };

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

  const gotoStep = (index: number, override: boolean = false) => {
    if (index >= 0 && index < steps.length) {
      const currentIndex = getIn(values, `tabs.${values.activeTab}.activeStep`);
      if (!validateCurrentStep() && index > currentIndex) {
        return false;
      }
      const nextStep = steps[index];
      if (override || nextStep.canGoToStep) {
        setFieldValue(`tabs.${values.activeTab}.activeStep`, index);
        return true;
      }
    }

    return false;
  };

  const gotoNext = () => {
    if (!validateCurrentStep()) {
      return false;
    }
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

  const isSubmit = (index: number) => {
    return index >= 0 && index === steps.length - 1;
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
        validateCurrentStep,
        isSubmit,
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
