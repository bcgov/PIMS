import { UUID } from 'crypto';

export interface IAccessRequest {
  createdOn: string;
  updatedOn: string;
  updatedByName: string;
  updatedByEmail: string;
  rowVersion: string;
  id: number;
  status: string;
  note: string;
  user: {
    createdOn: string;
    updatedOn: string;
    updatedByName: string;
    updatedByEmail: string;
    rowVersion: string;
    id: UUID;
    displayName: string;
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    username: string;
    position: string;
  };
  agencies: {
    createdOn: string;
    updatedOn: string;
    updatedByName: string;
    updatedByEmail: string;
    rowVersion: string;
    id: number;
    name: string;
    isDisabled: true;
    isVisible: true;
    sortOrder: number;
    type: string;
    code: string;
    parentId: number;
    description: string;
  }[];
  roles: {
    createdOn: string;
    updatedOn: string;
    updatedByName: string;
    updatedByEmail: string;
    rowVersion: string;
    id: UUID;
    name: string;
    isDisabled: true;
    isVisible: true;
    sortOrder: number;
    type: string;
    description: string;
  }[];
}
