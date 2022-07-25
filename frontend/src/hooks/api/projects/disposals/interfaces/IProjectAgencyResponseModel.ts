import { AgencyResponses } from 'features/projects/constants';
import { IBaseModel } from 'hooks/api/interfaces';

export interface IProjectAgencyResponseModel extends IBaseModel {
  projectId: number;
  agencyId: number;
  agencyCode?: string;
  notificationId?: number;
  response: AgencyResponses;
  receivedOn?: Date;
  note?: string;
  offerAmount: number;
}
