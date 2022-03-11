import {
  NotificationBodyType,
  NotificationEncoding,
  NotificationPriority,
  NotificationStatus,
} from 'hooks/api/constants';
import { IBaseModel } from 'hooks/api/interfaces';

export interface INotificationQueueModel extends IBaseModel {
  id: number;
  key: string;
  status: NotificationStatus;
  priority: NotificationPriority;
  encoding: NotificationEncoding;
  bodyType: NotificationBodyType;
  sendOn: Date;
  to: string;
  bcc?: string;
  cc?: string;
  subject: string;
  body: string;
  tag?: string;
  projectId?: number;
  toAgencyId?: number;
  chesMessageId?: string;
  chesTransactionId?: string;
}
