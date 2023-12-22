export interface IAgency {
  createdOn: string;
  updatedOn: string;
  updatedByName: string;
  updatedByEmail: string;
  id: number;
  name: string;
  isDisabled: boolean;
  isVisible: boolean;
  sortOrder: number;
  type: string;
  code: string;
  parentId: number;
  description: string;
}
