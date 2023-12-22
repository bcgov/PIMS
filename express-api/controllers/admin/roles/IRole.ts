import { UUID } from 'crypto';

export interface IRole {
  createdOn: string;
  updatedOn: string;
  updatedByName: string;
  updatedByEmail: string;
  id: UUID;
  name: string;
  isDisabled: boolean;
  isVisible: boolean;
  sortOrder: number;
  type: string;
  description: string;
}
