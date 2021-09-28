import { ITask } from '.';

export interface IProjectTask extends ITask {
  projectNumber: number;
  taskId: number;
  taskType: number;
  isCompleted: boolean;
  name: string;
  description: string;
  isOptional: boolean;
  sortOrder: number;
  completedOn: Date;
  statusId: number;
  statusCode: string;
}
