import { AccessRequestStatus } from 'constants/accessStatus';

export interface IAccessRequest {
  id: number;
  userId: string;
  user: IUser;
  agencies: any[];
  roles: any[];
  note?: string | null;
  status: AccessRequestStatus;
  rowVersion?: string;
  createdOn?: string;
  position?: string;
}

interface IUser {
  id?: string;
  username?: string;
  email?: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  position?: string | null;
  isDisabled?: boolean;
  createdOn?: string;
  rowVersion?: string;
  note?: string;
}
