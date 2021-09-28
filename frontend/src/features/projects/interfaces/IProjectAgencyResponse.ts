import { AgencyResponses } from '../constants';

export interface IProjectAgencyResponse {
  response: AgencyResponses;
  notificationId?: number;
  agencyId: number;
  agencyCode?: string;
  projectId: number;
  receivedOn?: string;
  note?: string;
  rowVersion?: string;
  offerAmount?: number;
}
