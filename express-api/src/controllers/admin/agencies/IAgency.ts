import { UUID } from 'crypto';

export interface IAgency {
  createdOn?: string;
  updatedOn?: string;
  updatedByName?: string;
  updatedByEmail?: string;
  id?: UUID;
  name: string;
  isDisabled: boolean;
  isVisible: boolean;
  sortOrder: number;
  type: string;
  code: string;
  parentId: UUID;
  description: string;
}
