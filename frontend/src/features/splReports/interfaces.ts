import { TableSort } from 'components/Table/TableSort';
import { IProject } from './../projects/common/interfaces';
export interface IReport {
  id?: number;
  name: string;
  reportTypeId: number;
  isFinal: boolean;
  to: string;
  from?: string;
}

export interface ISnapshot {
  id?: number;
  projectId: number;
  project?: IProject;
  snapshotOn: string;
  netBook: number;
  market: number;
  assessed: number;
  salesCost: number;
  netProceeds: number;
  baselineIntegrity: number;
  programCost: number;
  gainLoss: number;
  ocgFinancialStatement: number;
  interestComponent: number;
  salesWithLeaseInPlace: boolean;
}

export interface ISnapshotFilter {
  projectNumber?: string;
  agency?: number | string;
  fiscalYear?: string;
  sortBy: TableSort<any>;
}
