export interface IUserInfo {
  sub: string;
  username: string;
  name: string;
  email: string;
  firstName: string;
  lastName: string;
  Groups: any[];
  agencies: number[];
  position?: string;
}
