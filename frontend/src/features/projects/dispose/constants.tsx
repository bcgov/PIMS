import { DisposeWorkflowStatus, ProjectWorkflowComponent } from '.';
import React from 'react';

//TODO: map to real components
export const projectWorkflowComponents: ProjectWorkflowComponent[] = [
  { component: () => <p>Step 1</p>, workflowStatus: DisposeWorkflowStatus.Draft },
  { component: () => <p>Step 2</p>, workflowStatus: DisposeWorkflowStatus.SelectProperties },
  { component: () => <p>Step 3</p>, workflowStatus: DisposeWorkflowStatus.UpdateInformation },
  { component: () => <p>Step 4</p>, workflowStatus: DisposeWorkflowStatus.RequiredDocumentation },
  { component: () => <p>Step 5</p>, workflowStatus: DisposeWorkflowStatus.Approval },
  { component: () => <p>Step 6</p>, workflowStatus: DisposeWorkflowStatus.Submitted },
];
