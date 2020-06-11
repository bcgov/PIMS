export interface IProjectProperty {
  id: number;
  propertyTypeId: number;
  classification: string;
  name: string;
  agencyId: number;
  agency: string;
  agencyCode: string;
  subAgency?: string;
  subAgencyCode?: string;
  municipality: string;
  address: string;
  city: string;
  estimated: number;
  netBook: number;
  assessed: number;
  landArea: number;
  parcelId: number;
  zoning: string;
  zoningPotential: string;
}

/**
 * IProject interface represents the model used for searching projects.
 */
export interface IProject {
  id: number;
  projectNumber: string;
  name: string;
  statusId: number;
  status: string;
  tierLevelId: number;
  tierLevel: string;
  description: string;
  note: string;
  agencyId: string;
  agency: string;
  subAgency: string;
  properties: IProjectProperty[];
  updatedOn: string;
  updatedById: string;
  updatedBy: string;
  createdOn: string;
  createdById: string;
  createdBy: string;
  netBook: number;
  estimated: number;
  zoning: string;
  zoningPotential: string;
}

/**
 * IProjectFilter interface, provides a model for querying the API for projects.
 */
export interface IProjectFilter {
  page: number;
  quantity: number;
  projectNumber?: string;
}
