import { DisposeWorkflowStatus, ProjectWorkflowComponent } from '.';
import React from 'react';
import SelectProjectPropertiesStep from './steps/SelectProjectPropertiesStep';
import ProjectDraftStep from './steps/ProjectDraftStep';
import UpdateInfoStep from './steps/UpdateInfoStep';
import DocumentationStep from './steps/DocumentationStep';
import ApprovalConfirmationStep from './steps/ApprovalConfirmationStep';
import ReviewProjectStep from './steps/ReviewProjectStep';

/**
 * TODO: re-evaluate this approach. It may be cleaner/simpler to just hardcode these components to their respective routes.
 * Would still get the benefit of dynamic re-ordering based on db-config.
 */
export const projectWorkflowComponents: ProjectWorkflowComponent[] = [
  {
    component: props => <ProjectDraftStep {...props} />,
    workflowStatus: DisposeWorkflowStatus.Draft,
  },
  {
    component: props => <SelectProjectPropertiesStep {...props} />,
    workflowStatus: DisposeWorkflowStatus.SelectProperties,
  },
  {
    component: props => <UpdateInfoStep {...props} />,
    workflowStatus: DisposeWorkflowStatus.UpdateInformation,
  },
  {
    component: props => <DocumentationStep {...props} />,
    workflowStatus: DisposeWorkflowStatus.RequiredDocumentation,
  },
  {
    component: props => <ApprovalConfirmationStep {...props} />,
    workflowStatus: DisposeWorkflowStatus.Approval,
  },
  {
    component: props => <ReviewProjectStep {...props} />,
    workflowStatus: DisposeWorkflowStatus.Submitted,
  },
];
