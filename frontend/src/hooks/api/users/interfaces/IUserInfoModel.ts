export interface IUserInfoModel {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified?: boolean;
  realmRoles: string[];
  clientRoles: string[];
  groups: string[];
  agencies: number[];
}
