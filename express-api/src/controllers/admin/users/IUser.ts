import { UUID } from 'crypto';

export interface IUser {
  createdOn: string;
  updatedOn: string;
  updatedByName: string;
  updatedByEmail: string;
  id: UUID;
  displayName: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  username: string;
  position: string;
}
