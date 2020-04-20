export interface IAccessRequest {
  id: number;
  userId: string;
  user: IUser;
  agencies: any[];
  roles: any[];
  note?: string | null;
  isGranted: boolean;
  rowVersion?: string;
  createdOn?: string;
}

interface IUser {
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
