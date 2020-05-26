import * as actionTypes from 'constants/actionTypes';
import { ILookupCode, IStoreLookupCodeAction } from 'actions/lookupActions';

export interface ILookupCodeState {
  lookupCodes: ILookupCode[];
}

const initialState: ILookupCodeState = {
  lookupCodes: [],
};

const lookupCodeReducer = (state = initialState, action: IStoreLookupCodeAction) => {
  switch (action.type) {
    case actionTypes.STORE_LOOKUP_CODE_RESULTS:
      return {
        ...state,
        lookupCodes: [...action.lookupCodes],
      };
    default:
      return state;
  }
};

export default lookupCodeReducer;
