import {
  ProjectDraftStep,
  SelectProjectPropertiesStep,
  UpdateInfoStep,
  DocumentationStep,
  ApprovalConfirmationStep,
  ReviewProjectStep,
} from '.';
import React from 'react';
import { ProjectWorkflowComponent, DisposeWorkflowStatus } from '../common';

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
    workflowStatus: DisposeWorkflowStatus.Review,
  },
];
