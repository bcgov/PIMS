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
