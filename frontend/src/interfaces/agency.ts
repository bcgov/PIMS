export interface IAgency {
  parentId?: any;
  code: string;
  id: number;
  name: string;
  description?: string;
  /** string value of parent not given by api but found by frontend */
  parent?: string;
}

/** for use in editing and viewing agency details */
export interface IAgencyDetail {
  parentId?: number;
  email: string;
  id: number;
  name: string;
  description?: string;
  isDisabled: boolean;
  sendEmail: boolean;
  addressTo: string;
  code: string;
  rowVersion: string;
  parent?: string;
}

/** for use in filtering agencies*/
export interface IAgencyFilter {
  name?: string;
  description?: string;
  id?: number | '';
}

/** for use in creating an agency */
export interface IAddAgency {
  name: string;
  code: string;
  email?: string;
  addressTo: string;
  isDisabled: boolean;
  sendEmail: boolean;
  parentId?: number;
  description?: string;
}

/** for use in agency tables */
export interface IAgencyRecord {
  name: string;
  id: number;
  code: string;
  description?: string;
  parentId?: number;
  parent?: string;
  email?: string;
  sendEmail?: boolean;
}
