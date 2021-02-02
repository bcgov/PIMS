export enum AccountActive {
  YES = 'Yes',
  NO = 'No',
}

export const accountActiveToBool = (status: string): boolean | undefined => {
  if (!status) return undefined;

  return status === AccountActive.YES;
};

export interface IUserRecord {
  id: string;
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  isDisabled?: boolean;
  agency?: string;
  roles?: string;
  position?: string;
  lastLogin?: string;
  createdOn?: string;
}
