import { NotificationResponse } from 'hooks/api/constants';
import { IBaseModel } from 'hooks/api/interfaces';

export interface IProjectAgencyResponseModel extends IBaseModel {
  projectId: number;
  agencyId: number;
  agencyCode?: string;
  notificationId?: number;
  response: NotificationResponse;
  receivedOn?: Date;
  note?: string;
  offerAmount: number;
}
