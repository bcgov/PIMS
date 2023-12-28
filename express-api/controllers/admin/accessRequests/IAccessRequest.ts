import { UUID } from 'crypto';
import { IAgency } from '../agencies/IAgency';
import { IRole } from '../roles/IRole';
import { IUser } from '../users/IUser';

export interface IAccessRequest {
  createdOn?: string;
  updatedOn?: string;
  updatedByName?: string;
  updatedByEmail?: string;
  id: UUID;
  status: string;
  note: string;
  user: IUser;
  agencies: IAgency[];
  roles: IRole[];
}
