import { DisposalWorkflows } from './constants';
import { IProject } from './interfaces';

/**
 * Determine if the specified 'project' has been in the SPL workflow.
 * @param project The project object.
 * @returns True if the project history shows SPL.
 */
export const wasInSpl = (project: IProject) => {
  return project?.statusHistory.some((s) => s.workflow === DisposalWorkflows.Spl) ?? false;
};

/**
 * Determine if the specified 'project' has been in the ERP workflow.
 * @param project The project object.
 * @returns True if the project history shows ERP.
 */
export const wasInErp = (project: IProject) => {
  return project?.statusHistory.some((s) => s.workflow === DisposalWorkflows.Erp) ?? false;
};
