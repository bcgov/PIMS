import { IRole } from './role';
import { IAgency } from './agency';

export interface IUser {
  id: string;
  displayName?: string;
  position?: string;
  note?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  roles?: IRole[];
  agencies?: IAgency[];
  isDisabled?: boolean;
  lastLogin?: string;
  createdOn?: string;
}
