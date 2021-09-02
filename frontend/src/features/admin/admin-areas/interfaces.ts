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

/** interface containing filterable values for administrative areas */
export interface IAdminAreaFilter {
  name?: string;
  id?: number;
  page?: number;
  quantity?: number;
  sort?: string | string[];
}

/** interface used for sending payloads to the endpoints */
export interface IApiAdminArea {
  boundaryType?: string;
  abbreviation?: string;
  groupName?: string;
  code?: string;
  id?: number;
  isDisabled: boolean;
  name: string;
  rowVersion: string;
  type: string;
}

/** required interface for adding a new administrative area */
export interface IAddAdminArea {
  name: string;
}
