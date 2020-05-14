import { AccessRequestStatus } from 'constants/accessStatus';

export interface IAccessRequestModel {
  id: number;
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  status: AccessRequestStatus;
  agency: string;
  role: string;
  note: string;
}
