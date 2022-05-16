import { IBaseModel } from 'hooks/api/interfaces';

export interface IProjectTaskModel extends IBaseModel {
  projectId: number;
  taskId: number;
  isCompleted: boolean;
  completedOn?: Date;
  name: string;
  description?: string;
  isOptional: boolean;
  isDisabled: boolean;
  sortOrder: number;
  statusId: number;
  statusCode?: string;
}
