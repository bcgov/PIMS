import { IAgency } from '../agencies/IAgency';
import { IRole } from '../roles/IRole';
import { IUser } from '../users/IUser';

export interface IAccessRequest {
  createdOn: string;
  updatedOn: string;
  updatedByName: string;
  updatedByEmail: string;
  rowVersion: string;
  id: number;
  status: string;
  note: string;
  user: IUser;
  agencies: IAgency[];
  roles: IRole[];
}
