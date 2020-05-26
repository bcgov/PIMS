import { REQUEST, SUCCESS, ERROR, CLEAR } from '../constants/actionTypes';
import { IGenericNetworkAction } from 'actions/genericActions';

/**
 * @file networkReducer.js
 * Data is not associated with this reducer, only the network
 * request status.
 */

const initialState = {};

const networkReducer = (state = initialState, action: IGenericNetworkAction) => {
  switch (action.type) {
    case REQUEST:
      return {
        ...state,
        [action.name]: {
          name: action.name,
          isFetching: true,
          status: undefined,
          error: undefined,
          type: action.type,
        },
      };
    case SUCCESS:
      return {
        ...state,
        [action.name]: {
          name: action.name,
          isFetching: false,
          status: action.status,
          error: undefined,
          type: action.type,
        },
      };
    case ERROR:
      return {
        ...state,
        [action.name]: {
          name: action.name,
          isFetching: false,
          status: action.status,
          error: action.error,
          type: action.type,
        },
      };
    case CLEAR:
      return {
        ...state,
        [action.name]: {
          name: action.name,
          isFetching: false,
          status: undefined,
          error: undefined,
          type: undefined,
        },
      };
    default:
      return state;
  }
};

export default networkReducer;
