export enum AccountActive {
  YES = 'Yes',
  NO = 'No',
}

export interface IUserRecord {
  id: string;
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  active?: AccountActive;
  agency?: string;
  role?: string;
  position?: string;
}
