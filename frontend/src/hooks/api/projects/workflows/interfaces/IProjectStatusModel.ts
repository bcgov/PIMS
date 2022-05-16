import { IBaseLookupModel } from 'hooks/api/interfaces';

export interface IProjectStatusModel extends IBaseLookupModel<number> {
  groupName: string;
  route?: string | null;
  isMilestone: boolean;
  isOptional?: boolean;
  workflowCode: string;
  toStatus: IProjectStatusModel[];
}
