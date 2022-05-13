import { IBaseLookupModel } from 'hooks/api/interfaces';

export interface IProjectStatusModel extends IBaseLookupModel<number> {
  route?: string | null;
  isMilestone: boolean;
  isTerminal: boolean;
  isOptional?: boolean;
}
