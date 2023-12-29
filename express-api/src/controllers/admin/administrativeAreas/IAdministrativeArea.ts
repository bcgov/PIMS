import { UUID } from 'crypto';

export interface IAdministrativeArea {
  createdOn?: string;
  updatedOn?: string;
  updatedByName?: string;
  updatedByEmail?: string;
  id?: UUID;
  name: string;
  isDisabled: boolean;
  isVisible: boolean;
  sortOrder: number;
  abbreviation: string;
  boundaryType: string;
  regionalDistrict: string;
}
