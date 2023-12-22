export interface IAdministrativeArea {
  createdOn: string;
  updatedOn: string;
  updatedByName: string;
  updatedByEmail: string;
  id: number;
  name: string;
  isDisabled: boolean;
  isVisible: boolean;
  sortOrder: number;
  abbreviation: string;
  boundaryType: string;
  regionalDistrict: string;
}
