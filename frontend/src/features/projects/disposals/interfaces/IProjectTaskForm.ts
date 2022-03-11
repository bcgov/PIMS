export interface IProjectTaskForm {
  taskId: number;
  isCompleted: boolean;
  completedOn: Date | '';
  name: string;
  description: string;
  isOptional: boolean;
  isDisabled: boolean;
  sortOrder: number;
  statusId: number;
  statusCode: string;
}
