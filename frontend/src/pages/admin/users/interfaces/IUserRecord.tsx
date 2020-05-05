export enum AccountActive {
  YES = 'Yes',
  NO = 'No',
}

export const accountActiveToBool = (status: string): boolean | undefined => {
  if (!!status) return undefined;

  return AccountActive.YES ? false : true;
};

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
