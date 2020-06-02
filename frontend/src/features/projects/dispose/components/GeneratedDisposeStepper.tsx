import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { IStatus } from 'features/projects/dispose/slices/projectWorkflowSlice';
import Stepper from 'components/common/Stepper';
import useStepper from '../hooks/useStepper';

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
  const { projectStatusCompleted, canGoToStatus, currentStatus, project } = useStepper();
  const steps = workflowStatuses.map(wfs => ({
    title: wfs.name,
    route: `${basePath}${wfs.route}?projectNumber=${project.projectNumber}`,
    completed: projectStatusCompleted(wfs),
    canGoToStep: canGoToStatus(wfs),
  }));
  return (
    <Stepper
      activeStep={activeStep}
      steps={steps}
      activeStepMessage={currentStatus?.description}
    ></Stepper>
  );
};

export default GeneratedDisposeStepper;
