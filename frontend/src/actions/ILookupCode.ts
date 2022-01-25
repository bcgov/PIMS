export interface ILookupCode {
  code: string;
  name: string;
  id: string;
  isDisabled: boolean;
  isPublic?: boolean;
  isVisible?: boolean;
  type: string;
  parentId?: number;
  sortOrder?: number;
}
