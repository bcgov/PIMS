import { AccessRequestStatus } from 'hooks/api';

import { IUserModel } from '.';

export interface IAccessRequestModel {
  id: number;
  userId: string;
  user: IUserModel;
  agencies: any[];
  roles: any[];
  note?: string | null;
  status: AccessRequestStatus;
  rowVersion?: string;
  createdOn?: string;
  position?: string;
}
