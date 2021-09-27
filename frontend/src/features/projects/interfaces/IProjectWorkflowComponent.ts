import { DisposeWorkflowStatus } from '../constants';

export interface IProjectWorkflowComponent {
  component: React.ComponentType<any>;
  workflowStatus: DisposeWorkflowStatus;
}
