import * as actionTypes from 'constants/actionTypes';
import { IStoreAgencyDetail } from 'actions/adminActions';
import { IAgencyDetail } from 'interfaces';

const initialState: IAgencyDetail = {
  parentId: -1,
  code: '',
  id: -1,
  name: '',
  description: '',
  email: '',
  addressTo: '',
  isDisabled: false,
  sendEmail: false,
  rowVersion: '',
};

const agencyDetailReducer = (state = initialState, action: IStoreAgencyDetail) => {
  switch (action.type) {
    case actionTypes.STORE_AGENCY_DETAILS:
      return action.agencyDetail;
    default:
      return state;
  }
};

export default agencyDetailReducer;
