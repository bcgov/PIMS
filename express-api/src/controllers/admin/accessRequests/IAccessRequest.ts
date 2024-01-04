import { UUID } from 'crypto';
import { IAgency } from '@/controllers/admin/agencies/IAgency';
import { IRole } from '@/controllers/admin/roles/IRole';
import { IUser } from '@/controllers/admin/users/IUser';
import { IBaseEntity } from '@/controllers/IBaseEntity';

export interface IAccessRequest extends IBaseEntity {
  id: UUID;
  status: string;
  note: string;
  user: IUser;
  agencies: IAgency[];
  roles: IRole[];
}
