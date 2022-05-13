import { IBaseLookupModel } from 'hooks/api';

export interface IAccessRequestAgencyModel extends IBaseLookupModel<number> {
  id: number;
  name: string;
  isDisabled: boolean;
  isVisible: boolean;
  sortOrder: number;
  type: string;
  code: string;
  description?: string;
  parentId?: number;
}
