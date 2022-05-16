export interface IUserModel {
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
