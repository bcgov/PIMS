import { REQUEST, SUCCESS, ERROR } from '../constants/actionTypes';
import { IGenericNetworkAction } from 'actions/genericActions';

/**
 * @file networkReducer.js
 * Data is not associated with this reducer, only the network
 * request status.
 */

const initialState = {
  isFetching: false,
  isSuccessful: false,
  error: null,
  requestType: null,
};

const networkReducer = (state = initialState, action: IGenericNetworkAction) => {
  switch (action.type) {

    case REQUEST:
      return {
        ...state,
        isFetching: true,
        status: undefined,
        error: undefined,
        requestType: action.type,
      };
    case SUCCESS:
      return {
        ...state,
        isFetching: false,
        status: action.status,
        error: undefined,
        requestType: action.type,
      };
    case ERROR:
      return {
        ...state,
        isFetching: false,
        status: action.status,
        error: action.errorMessage,
        requestType: action.type,
      };
    default:
      return state;
  }
};

export default networkReducer;
