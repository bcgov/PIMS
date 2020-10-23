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
  projectId: number;
  project?: IProject;
  snapshotOn: string;
  netBook: number;
  estimated: number;
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
