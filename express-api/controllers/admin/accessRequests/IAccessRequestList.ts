import { IAccessRequest } from './IAccessRequest';

export interface IAccessRequestList {
  items: IAccessRequest[];
  page: number;
  quantity: number;
  total: number;
}
