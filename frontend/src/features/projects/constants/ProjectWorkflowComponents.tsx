import { DisposeWorkflowStatus } from 'features/projects/constants';
import { IProjectWorkflowComponent } from 'features/projects/interfaces';
import React from 'react';

import {
  ApprovalConfirmationStep,
  DocumentationStep,
  ProjectDraftStep,
  ReviewProjectStep,
  SelectProjectPropertiesStep,
  UpdateInfoStep,
} from '../dispose';

/**
 * TODO: re-evaluate this approach. It may be cleaner/simpler to just hardcode these components to their respective routes.
 * Would still get the benefit of dynamic re-ordering based on db-config.
 */
export const projectWorkflowComponents: IProjectWorkflowComponent[] = [
  {
    component: (props) => <ProjectDraftStep {...props} />,
    workflowStatus: DisposeWorkflowStatus.Draft,
  },
  {
    component: (props) => <SelectProjectPropertiesStep {...props} />,
    workflowStatus: DisposeWorkflowStatus.SelectProperties,
  },
  {
    component: (props) => <UpdateInfoStep {...props} />,
    workflowStatus: DisposeWorkflowStatus.UpdateInformation,
  },
  {
    component: (props) => <DocumentationStep {...props} />,
    workflowStatus: DisposeWorkflowStatus.RequiredDocumentation,
  },
  {
    component: (props) => <ApprovalConfirmationStep {...props} />,
    workflowStatus: DisposeWorkflowStatus.Approval,
  },
  {
    component: (props) => <ReviewProjectStep {...props} />,
    workflowStatus: DisposeWorkflowStatus.Review,
  },
];
