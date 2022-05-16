import { IBaseLookupModel } from 'hooks/api';

export interface IAdministrativeAreaModel extends IBaseLookupModel<number> {
  abbreviation: string;
  boundaryType?: string;
  groupName?: string;
}
