import { IAccessRequest } from '@/controllers/admin/accessRequests/IAccessRequest';

export interface IAccessRequestList {
  items: IAccessRequest[];
  page: number;
  quantity: number;
  total: number;
}
