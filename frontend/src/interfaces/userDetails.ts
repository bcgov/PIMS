export interface IUserDetails {
  id?: string;
  username?: string;
  email?: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  position?: string | null;
  isDisabled?: boolean;
  agencies: any[];
  roles: any[];
  createdOn?: string;
  rowVersion?: string;
  note?: string;
  lastLogin?: string;
}
