import { NotificationResponse } from 'hooks/api/constants';

export interface IProjectAgencyResponseForm {
  agencyId: number;
  agencyCode: string;
  notificationId: number | '';
  response: NotificationResponse;
  receivedOn: Date | '';
  note: string;
  offerAmount: number;
}
