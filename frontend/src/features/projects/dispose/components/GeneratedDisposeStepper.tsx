import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import Stepper from 'components/common/Stepper';
import { useStepper } from '..';
import { IStatus } from '../../common';

interface GeneratedDisposeStepperProps {
  activeStep: number;
  basePath: string;
}

/**
 * Generate workflow steps from the workflow statuses
 * @param param0 GeneratedDisposeStepperProps
 */
const GeneratedDisposeStepper = ({ activeStep, basePath }: GeneratedDisposeStepperProps) => {
  const workflowStatuses = useSelector<RootState, IStatus[]>(state => state.projectWorkflow as any);
  const { projectStatusCompleted, canGoToStatus, project } = useStepper();
  const steps = workflowStatuses
    .filter(i => !i.isOptional)
    .map(wfs => ({
      title: wfs.name,
      route: `${basePath}${wfs.route}?projectNumber=${project.projectNumber}`,
      completed: projectStatusCompleted(wfs),
      canGoToStep: canGoToStatus(wfs),
    }));
  return (
    <Stepper
      activeStep={activeStep}
      steps={steps}
      activeStepMessage="Complete this form to apply to the Enhanced Referral Process or Request Exemption"
    ></Stepper>
  );
};

export default GeneratedDisposeStepper;
