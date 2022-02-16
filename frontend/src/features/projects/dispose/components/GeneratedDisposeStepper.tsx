import Stepper from 'components/common/Stepper';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from 'store';

import { useStepper } from '..';

interface GeneratedDisposeStepperProps {
  activeStep: number;
  basePath: string;
}

/**
 * Generate workflow steps from the workflow statuses
 * @param param0 GeneratedDisposeStepperProps
 */
const GeneratedDisposeStepper = ({ activeStep, basePath }: GeneratedDisposeStepperProps) => {
  const workflowStatuses = useAppSelector((store) => store.projectWorkflow);
  const { projectStatusCompleted, canGoToStatus, project } = useStepper();
  const navigate = useNavigate();
  const steps = workflowStatuses
    .filter((i) => !i.isOptional)
    .map((wfs) => ({
      title: wfs.name,
      route: `${basePath}${wfs.route}?projectNumber=${project.projectNumber}`,
      completed: projectStatusCompleted(wfs),
      canGoToStep: canGoToStatus(wfs),
    }));
  return (
    <Stepper
      onChange={(step) => navigate(step.route)}
      activeStep={activeStep}
      steps={steps}
      activeStepMessage="Complete this form to apply to the Enhanced Referral Process or Request Exemption"
    ></Stepper>
  );
};

export default GeneratedDisposeStepper;
