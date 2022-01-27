import * as API from 'constants/API';
/** interface containing filterable project id for notifications */
export interface INotificationFilter extends API.IPaginateParams {
  projectId?: number;
}
