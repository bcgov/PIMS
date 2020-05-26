import * as actionTypes from 'constants/actionTypes';
import { IStoreUserDetail } from 'actions/adminActions';

export interface IUserDetailState {
  id: string;
  username: string;
  displayName: string;
  firstName: string;
  lastName: string;
  email: string;
  isDisabled: boolean;
  emailVerified: boolean;
  agencies: [];
  roles: [];
  createdOn: string;
  rowVersion: string;
}

const initialState: IUserDetailState = {
  id: '',
  username: '',
  displayName: '',
  firstName: '',
  lastName: '',
  email: '',
  isDisabled: false,
  emailVerified: false,
  agencies: [],
  roles: [],
  createdOn: '',
  rowVersion: '',
};

// dispatch the action which then sends it here
const userDetailReducer = (state = initialState, action: IStoreUserDetail) => {
  switch (action.type) {
    case actionTypes.STORE_USER_DETAILS:
      return action.userDetail;
    default:
      return state;
  }
};

export default userDetailReducer;
