import { IBaseModel } from 'hooks/api/interfaces';

export interface IProjectStatusHistoryModel extends IBaseModel {
  id: number;
  workflowId: number;
  workflow: string;
  statusId: number;
  status: string;
}
