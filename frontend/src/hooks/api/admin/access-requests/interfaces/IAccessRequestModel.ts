import { AccessRequestStatus, IBaseModel, IUserModel } from 'hooks/api';

import { IAccessRequestAgencyModel, IAccessRequestRoleModel } from '.';

export interface IAccessRequestModel extends IBaseModel {
  id: number;
  status: AccessRequestStatus;
  note?: string;
  user?: IUserModel;
  agencies?: IAccessRequestAgencyModel[];
  roles?: IAccessRequestRoleModel[];
}
