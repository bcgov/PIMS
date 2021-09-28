/** interface containing the structure of data found in administrative areas */
export interface IAdministrativeArea {
  name: string;
  boundaryType?: string;
  abbreviation?: string;
  groupName?: string;
  id: number;
  isDiabled?: boolean;
  rowVersion?: string;
  code: string;
  type?: string;
}
