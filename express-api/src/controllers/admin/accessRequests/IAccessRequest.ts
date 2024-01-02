import { UUID } from 'crypto';
import { IAgency } from '@/controllers/admin/agencies/IAgency';
import { IRole } from '@/controllers/admin/roles/IRole';
import { IUser } from '@/controllers/admin/users/IUser';

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
