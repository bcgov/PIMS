import { NotificationStatus } from 'hooks/api/constants';
import { IPageFilter } from 'hooks/api/interfaces';

export interface IProjectNotificationFilter extends IPageFilter {
  projectNumber?: string;
  projectId?: number;
  agencyId?: number;
  tag?: string;
  status?: NotificationStatus[];
  to?: string;
  subject?: string;
}
