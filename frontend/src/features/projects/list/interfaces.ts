import { IProperty } from '../common';

/**
 * IProject interface represents the model used for searching projects.
 */
export interface IProject {
  id: number;
  projectNumber: string;
  name: string;
  statusId: number;
  statusCode: string;
  status: string;
  statusRoute: string;
  tierLevelId: number;
  tierLevel: string;
  description: string;
  note: string;
  agencyId: string;
  agency: string;
  subAgency: string;
  properties: IProperty[];
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
