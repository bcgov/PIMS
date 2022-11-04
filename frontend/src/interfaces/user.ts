import { IAgency } from './agency';
import { IRole } from './role';

export interface IUser {
  id: string;
  keycloakUserId?: string;
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
