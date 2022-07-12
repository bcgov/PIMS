import * as ActionTypes from 'constants/actionTypes';

import { clear, error, request, success } from './hooks';
import {
  clearRequest,
  initialNetworkState,
  networkSlice,
  storeError,
  storeRequest,
  storeSuccess,
} from './networkSlice';

describe('Network slice tests', () => {
  const reducer = networkSlice.reducer;

  it('Should return default state', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialNetworkState);
  });

  it('Should return request action result', () => {
    expect(reducer({ requests: {} }, storeRequest(request('request')))).toEqual({
      requests: {
        request: {
          isFetching: true,
          name: 'request',
          type: ActionTypes.REQUEST,
        },
      },
    });
  });

  it('Should return success action result', () => {
    expect(reducer({ requests: {} }, storeSuccess(success('success', 200, [])))).toEqual({
      requests: {
        success: {
          name: 'success',
          isFetching: false,
          status: 200,
          type: ActionTypes.SUCCESS,
          data: [],
        },
      },
    });
  });

  it('Should return error action result', () => {
    expect(reducer({ requests: {} }, storeError(error('error', 400, {})))).toEqual({
      requests: {
        error: {
          name: 'error',
          isFetching: false,
          status: 400,
          error: {},
          type: ActionTypes.ERROR,
        },
      },
    });
  });

  it('Should return a clear action result', () => {
    expect(reducer({ requests: {} }, clearRequest(clear('clear')))).toEqual({
      requests: {
        clear: {
          name: 'clear',
          isFetching: false,
          error: undefined,
          status: undefined,
          type: ActionTypes.CLEAR,
        },
      },
    });
  });
});
