import { IBaseModel } from '.';

export interface IBaseLookupModel<KeyType> extends IBaseModel {
  id: KeyType;
  code: string;
  name: string;
  description?: string;
  isDisabled: boolean;
  isPublic?: boolean;
  isVisible?: boolean;
  type: string;
  parentId?: number;
  sortOrder: number;
}
