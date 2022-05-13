import { IBaseLookupModel } from 'hooks/api/interfaces';

export interface ITaskModel extends IBaseLookupModel<number> {
  isOptional: boolean;
}
