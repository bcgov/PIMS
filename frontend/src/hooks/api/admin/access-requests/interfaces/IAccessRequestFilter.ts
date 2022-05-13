import { AccessRequestStatus } from 'hooks/api';

export interface IAccessRequestFilter {
  page?: number;
  quantity?: number;
  sort?: string;
  searchText?: string;
  role?: string;
  agency?: string;
  status?: AccessRequestStatus;
}
