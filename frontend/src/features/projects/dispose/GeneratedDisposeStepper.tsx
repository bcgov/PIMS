import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { ProjectStatus } from 'features/projects/dispose/ProjectWorkflowSlice';
import Stepper from 'components/common/Stepper';

interface GeneratedDisposeStepperProps {
  activeStep: number;
  basePath: string;
}

/**
 * Generate workflow steps from the workflow statuses
 * @param param0 GeneratedDisposeStepperProps
 */
const GeneratedDisposeStepper = ({ activeStep, basePath }: GeneratedDisposeStepperProps) => {
  const workflowStatuses = useSelector<RootState, ProjectStatus[]>(
    state => state.projectWorkflow as any,
  );
  const steps = workflowStatuses.map(wfs => ({
    title: wfs.name,
    route: `${basePath}${wfs.route}`,
  }));

  return <Stepper activeStep={activeStep} steps={steps}></Stepper>;
};

export default GeneratedDisposeStepper;
