import { IProjectTask } from '.';

export interface IStatus {
  id: number;
  name: string;
  sortOrder: number;
  description: string;
  route: string;
  workflowCode: string;
  code: string;
  isMilestone: boolean;
  tasks: IProjectTask[];
  isOptional: boolean;
  toStatus?: IStatus[];
  isActive: boolean;
  parentId?: number;
}
