import { IBaseModel } from 'hooks/api/interfaces';

import { IProjectPropertyModel } from '.';

export interface IProjectModel extends IBaseModel {
  id: number;
  projectNumber: string;
  name: string;
  description?: string | null;
  reportedFiscalYear: number;
  actualFiscalYear: number;
  workflowCode: string;
  statusId: number;
  statusCode: string;
  status: string;
  statusRoute?: string;
  tierLevelId: number;
  tierLevel: string;
  note?: string | null;
  agencyId: number;
  agency: string;
  agencyCode: string;
  subAgency: string;
  subAgencyCode: string;
  netBook?: number | null;
  market?: number | null;
  appraised?: number | null;
  assessed?: number | null;
  updatedBy: string;
  createdBy: string;
  properties: IProjectPropertyModel[];
}
